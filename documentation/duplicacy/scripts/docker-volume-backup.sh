#!/bin/bash
#
# Docker Volume Backup Script for Homelab
# This script performs backups of important Docker volumes
#
# Usage: ./docker-volume-backup.sh [destination]
# If no destination is provided, backups will be stored in /backups

set -e

# Configuration
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
BACKUP_DIR=${1:-"/backups"}
LOG_FILE="${BACKUP_DIR}/backup_${TIMESTAMP}.log"
VOLUMES_TO_BACKUP=(
  "traefik_data"
  "grafana_data"
  "prometheus_data"
  "authelia_data"
  "pihole_etc"
  # Add more volumes as needed
)
RETENTION_DAYS=30  # Number of days to keep backups

# Ensure backup directory exists
mkdir -p "$BACKUP_DIR"
touch "$LOG_FILE"

echo "Starting Docker volume backup at $(date)" | tee -a "$LOG_FILE"
echo "Backup destination: $BACKUP_DIR" | tee -a "$LOG_FILE"

# Check if running as root (required for Docker volume access)
if [ "$EUID" -ne 0 ]; then
  echo "Warning: This script should be run as root to access all Docker volumes" | tee -a "$LOG_FILE"
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
  echo "Error: Docker is not running or not accessible" | tee -a "$LOG_FILE"
  exit 1
fi

# Create backup directory for this run
BACKUP_SUBDIR="${BACKUP_DIR}/docker_volumes_${TIMESTAMP}"
mkdir -p "$BACKUP_SUBDIR"
echo "Created backup directory: $BACKUP_SUBDIR" | tee -a "$LOG_FILE"

# Function to backup a specific volume
backup_volume() {
  local volume_name=$1
  local backup_file="${BACKUP_SUBDIR}/${volume_name}.tar.gz"
  
  echo "Backing up volume: $volume_name" | tee -a "$LOG_FILE"
  
  # Check if volume exists
  if ! docker volume inspect "$volume_name" > /dev/null 2>&1; then
    echo "Warning: Volume $volume_name does not exist, skipping" | tee -a "$LOG_FILE"
    return 1
  fi
  
  # Create temporary container to access volume
  echo "Creating temporary container for $volume_name" | tee -a "$LOG_FILE"
  container_id=$(docker run -d -v "${volume_name}:/source" --name "backup_${volume_name}" alpine sh -c "tail -f /dev/null")
  
  # Backup volume data
  echo "Archiving data from $volume_name" | tee -a "$LOG_FILE"
  docker exec "backup_${volume_name}" tar -czf - -C /source . > "$backup_file"
  
  # Cleanup temporary container
  echo "Removing temporary container" | tee -a "$LOG_FILE"
  docker rm -f "$container_id" > /dev/null
  
  # Verify backup file was created and has content
  if [ -s "$backup_file" ]; then
    echo "Successfully backed up $volume_name ($(du -h "$backup_file" | cut -f1))" | tee -a "$LOG_FILE"
    return 0
  else
    echo "Error: Backup file for $volume_name is empty or not created" | tee -a "$LOG_FILE"
    return 1
  fi
}

# Backup each volume
success_count=0
for volume in "${VOLUMES_TO_BACKUP[@]}"; do
  if backup_volume "$volume"; then
    ((success_count++))
  fi
done

# Create a summary file
echo "Total volumes: ${#VOLUMES_TO_BACKUP[@]}" > "${BACKUP_SUBDIR}/backup_summary.txt"
echo "Successfully backed up: $success_count" >> "${BACKUP_SUBDIR}/backup_summary.txt"
echo "Timestamp: $(date)" >> "${BACKUP_SUBDIR}/backup_summary.txt"
echo "Backup location: $BACKUP_SUBDIR" >> "${BACKUP_SUBDIR}/backup_summary.txt"

# Clean up old backups
echo "Cleaning up backups older than $RETENTION_DAYS days" | tee -a "$LOG_FILE"
find "$BACKUP_DIR" -maxdepth 1 -name "docker_volumes_*" -type d -mtime +$RETENTION_DAYS -exec rm -rf {} \; 2>/dev/null || true

echo "Backup completed at $(date)" | tee -a "$LOG_FILE"
echo "Total volumes processed: ${#VOLUMES_TO_BACKUP[@]}, Successfully backed up: $success_count" | tee -a "$LOG_FILE"

# Run post-backup notification if it exists
if [ -f "$(dirname "$0")/post-backup-notify.sh" ]; then
  echo "Running post-backup notification script" | tee -a "$LOG_FILE"
  "$(dirname "$0")/post-backup-notify.sh" "$LOG_FILE" $success_count ${#VOLUMES_TO_BACKUP[@]}
fi

exit 0