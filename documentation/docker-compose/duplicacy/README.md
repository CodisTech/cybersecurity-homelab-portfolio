# Duplicacy Backup Solution for Docker Volumes

This directory contains a complete solution for backing up your homelab Docker volumes using Duplicacy Web Edition.

## Overview

Duplicacy is a powerful backup tool with these key features:
- Deduplication at the file and block level
- Multiple storage backends (local, cloud, etc.)
- Encryption and compression
- Scheduled backups
- Web interface for management

This setup includes:
1. `docker-compose.yml` for deploying Duplicacy Web
2. Backup scripts for Docker volumes
3. Notification system for backup status

## Prerequisites

- Docker and docker-compose
- Access to Docker socket on host
- Docker volumes you want to back up
- Optional: Access to notification services (Email, Slack, Discord)

## Initial Setup

1. Create required directories:
   ```bash
   mkdir -p config cache
   ```

2. Update `docker-compose.yml`:
   - Change `PUID` and `PGID` to match your user
   - Update volume paths for your specific Docker volumes
   - Modify backup destination path
   - Update domain name for Traefik

3. Start Duplicacy:
   ```bash
   docker-compose up -d
   ```

4. Access the web interface at http://localhost:3875 or your configured domain

## Backup Configuration

### In Duplicacy Web UI

1. Create a new storage:
   - **Storage Type**: Choose your preferred backend (local, S3, B2, etc.)
   - **Storage URL**: Path to your backup destination
   - **Storage Name**: Give it a descriptive name
   - **Encryption**: Enable and set a strong password (recommended)

2. Create a backup schedule:
   - **Schedule**: Set frequency (e.g., daily at 2am)
   - **Retention Policy**: Configure how long to keep backups
   - **Options**: Enable email notifications if desired

### Manual Backup Scripts

The included scripts provide an alternative backup method:

1. Make scripts executable:
   ```bash
   chmod +x ../../duplicacy/scripts/*.sh
   ```

2. Configure script parameters in `docker-volume-backup.sh`:
   - Update `VOLUMES_TO_BACKUP` array with your volumes
   - Adjust `RETENTION_DAYS` as needed
   - Modify backup location if necessary

3. Configure notifications in `post-backup-notify.sh`:
   - Uncomment your preferred notification method
   - Add appropriate credentials (email, webhooks)

4. Run backup manually:
   ```bash
   sudo ../../duplicacy/scripts/docker-volume-backup.sh /path/to/backups
   ```

5. Set up cron job for automated backups:
   ```
   0 2 * * * /path/to/docker-volume-backup.sh /path/to/backups >/dev/null 2>&1
   ```

## Restore Process

### Using Duplicacy Web UI

1. Go to the Duplicacy web interface
2. Select the storage and snapshot to restore from
3. Choose files/directories to restore
4. Set destination path
5. Click "Restore"

### Manual Restore

To restore a volume from a tar backup:

1. Stop services using the volume:
   ```bash
   docker-compose down
   ```

2. Remove the current volume:
   ```bash
   docker volume rm volume_name
   ```

3. Create a new volume:
   ```bash
   docker volume create volume_name
   ```

4. Restore data to the volume:
   ```bash
   # Create a temporary container
   docker run -d --name restore_temp -v volume_name:/target alpine tail -f /dev/null
   
   # Extract backup to volume
   cat /path/to/backups/volume_name.tar.gz | docker exec -i restore_temp tar -xzf - -C /target
   
   # Remove temporary container
   docker rm -f restore_temp
   ```

5. Restart your services:
   ```bash
   docker-compose up -d
   ```

## Security Considerations

- **Encryption**: Always encrypt your backups
- **Passwords**: Store encryption passwords securely
- **Permissions**: Restrict access to backup files
- **Testing**: Regularly test restore procedures
- **Off-site**: Store backups in multiple locations

## Troubleshooting

- **Permission Issues**: Ensure correct UID/GID in docker-compose.yml
- **Failed Backups**: Check logs in Duplicacy web interface
- **Access Errors**: Verify Docker socket permissions
- **Network Problems**: Check connectivity to remote storage
- **Script Failures**: Review logs in backup directory

## Advanced Configuration

For more advanced configurations, refer to:

1. [Duplicacy Documentation](https://duplicacy.com/guide.html)
2. Full-system backup strategies in the Homelab documentation
3. Cloud storage provider-specific settings