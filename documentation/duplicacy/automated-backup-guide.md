# Automated Docker Volume Backup Guide

This comprehensive guide explains how to set up automated backups for Docker volumes in your homelab using Duplicacy and custom scripts.

## Table of Contents

- [Overview](#overview)
- [Why Backup Docker Volumes](#why-backup-docker-volumes)
- [Backup Strategy](#backup-strategy)
- [Solution 1: Duplicacy Web](#solution-1-duplicacy-web)
- [Solution 2: Custom Backup Scripts](#solution-2-custom-backup-scripts)
- [Notification Setup](#notification-setup)
- [Recovery Procedures](#recovery-procedures)
- [Best Practices](#best-practices)
- [FAQ](#faq)

## Overview

Docker volumes contain valuable data that needs protection. This guide provides two complementary approaches:

1. **Duplicacy Web**: A GUI-based solution with built-in scheduling and multiple storage backends
2. **Custom Backup Scripts**: Shell scripts for direct Docker volume backups with notification capabilities

Both solutions can be used separately or together as part of a robust backup strategy.

## Why Backup Docker Volumes

Docker volumes store persistent data outside of containers, including:

- Database files
- Configuration settings
- User-generated content
- Application state
- Logs and metrics

When containers are recreated or updated, the data in volumes persists. However, volumes can be accidentally deleted, corrupted, or lost due to hardware failure.

## Backup Strategy

A robust backup strategy for Docker volumes should follow the 3-2-1 principle:

- **3 copies** of your data
- Stored on **2 different** types of media
- With **1 copy** stored off-site

This guide helps you implement this strategy for Docker volumes.

## Solution 1: Duplicacy Web

### Installation

1. Create the necessary directories:
   ```bash
   mkdir -p /opt/duplicacy/{config,cache}
   ```

2. Deploy using docker-compose:
   ```bash
   cd /opt/duplicacy
   wget -O docker-compose.yml https://raw.githubusercontent.com/username/cybersecurity-homelab/main/documentation/docker-compose/duplicacy/docker-compose.yml
   docker-compose up -d
   ```

3. Access the web interface at http://localhost:3875 or your configured domain

### Initial Configuration

1. Create a new storage:
   - Click "Add Storage"
   - Select storage type (Local Disk, S3, B2, GCS, etc.)
   - Configure connection details
   - Enable encryption (recommended)
   - Set encryption password

2. Configure backup sources:
   - Add each Docker volume as a backup source
   - Set filters to include/exclude specific files if needed

3. Create backup schedules:
   - Daily incremental backups
   - Weekly full backups
   - Configure retention policy

### Storage Options

Duplicacy supports many storage backends, including:

- **Local storage**: Fast but vulnerable to local disasters
- **S3-compatible storage**: AWS S3, MinIO, Wasabi
- **Backblaze B2**: Cost-effective cloud storage
- **Google Cloud Storage**: Enterprise-grade storage
- **SFTP**: Backup to another server via SSH
- **WebDAV**: Compatible with NextCloud and other WebDAV servers

### Encryption

Duplicacy provides strong encryption options:

1. **AES-256** encryption for all files
2. **Secured credentials** for storage access
3. **Encrypted metadata** to protect filenames and structure

Always keep your encryption password in a secure location!

## Solution 2: Custom Backup Scripts

For more control or in environments where Duplicacy isn't suitable, use the provided shell scripts.

### Setup

1. Download the scripts:
   ```bash
   mkdir -p /opt/backup-scripts
   wget -O /opt/backup-scripts/docker-volume-backup.sh https://raw.githubusercontent.com/username/cybersecurity-homelab/main/documentation/duplicacy/scripts/docker-volume-backup.sh
   wget -O /opt/backup-scripts/post-backup-notify.sh https://raw.githubusercontent.com/username/cybersecurity-homelab/main/documentation/duplicacy/scripts/post-backup-notify.sh
   chmod +x /opt/backup-scripts/*.sh
   ```

2. Edit the scripts to match your environment:
   ```bash
   nano /opt/backup-scripts/docker-volume-backup.sh
   
   # Update the following:
   BACKUP_DIR="/path/to/backups"
   VOLUMES_TO_BACKUP=("volume1" "volume2" "volume3")
   RETENTION_DAYS=30
   ```

3. Configure the notification script:
   ```bash
   nano /opt/backup-scripts/post-backup-notify.sh
   
   # Uncomment and configure your preferred notification method:
   EMAIL_RECIPIENT="admin@example.com"
   SLACK_WEBHOOK_URL="https://hooks.slack.com/services/XXX/YYY/ZZZ"
   DISCORD_WEBHOOK_URL="https://discord.com/api/webhooks/XXX/YYY"
   ```

### Automation with Cron

1. Edit the crontab:
   ```bash
   sudo crontab -e
   ```

2. Add a schedule (e.g., daily at 2 AM):
   ```
   0 2 * * * /opt/backup-scripts/docker-volume-backup.sh /path/to/backups >/dev/null 2>&1
   ```

### How the Script Works

The `docker-volume-backup.sh` script:

1. Creates a timestamp-based directory for backups
2. Lists all Docker volumes to back up
3. For each volume:
   - Creates a temporary container with access to the volume
   - Uses tar to archive the volume contents
   - Removes the temporary container
4. Creates a backup summary
5. Cleans up old backups based on retention policy
6. Calls the notification script

## Notification Setup

Notifications are essential for monitoring backup status. The `post-backup-notify.sh` script supports:

### Email Notifications

```bash
# Configure in post-backup-notify.sh
EMAIL_RECIPIENT="admin@example.com"
```

Requirements:
- Mail command must be installed and configured on the host
- Proper SMTP setup in the mail configuration

### Slack Notifications

```bash
# Configure in post-backup-notify.sh
SLACK_WEBHOOK_URL="https://hooks.slack.com/services/XXX/YYY/ZZZ"
```

To set up Slack notifications:
1. Create a Slack app at https://api.slack.com/apps
2. Add Incoming Webhooks feature
3. Create a webhook for your workspace
4. Copy the webhook URL to the script

### Discord Notifications

```bash
# Configure in post-backup-notify.sh
DISCORD_WEBHOOK_URL="https://discord.com/api/webhooks/XXX/YYY"
```

To set up Discord notifications:
1. In your Discord server, go to Server Settings
2. Select Integrations → Webhooks
3. Create a new webhook
4. Copy the webhook URL to the script

## Recovery Procedures

### Restoring from Duplicacy

1. Access Duplicacy Web UI
2. Go to the Restore tab
3. Select storage, snapshot, and files to restore
4. Set destination path
5. Click Restore

### Restoring from Script Backups

To restore a volume from a tar backup:

```bash
# 1. Stop services using the volume
docker-compose -f your-docker-compose.yml down

# 2. Remove the volume
docker volume rm volume_name

# 3. Create a new volume
docker volume create volume_name

# 4. Restore data
# Create a temporary container
docker run -d --name restore_temp -v volume_name:/target alpine tail -f /dev/null

# Extract backup to volume
cat /path/to/backups/docker_volumes_TIMESTAMP/volume_name.tar.gz | docker exec -i restore_temp tar -xzf - -C /target

# Remove temporary container
docker rm -f restore_temp

# 5. Restart services
docker-compose -f your-docker-compose.yml up -d
```

### Recovery Testing

Regularly test your backups by restoring to a temporary volume:

```bash
# Create a test volume
docker volume create test_restore

# Restore backup to test volume
docker run -d --name test_restore -v test_restore:/target alpine tail -f /dev/null
cat /path/to/backup.tar.gz | docker exec -i test_restore tar -xzf - -C /target

# Verify contents
docker exec -it test_restore ls -la /target

# Clean up
docker rm -f test_restore
docker volume rm test_restore
```

## Best Practices

1. **Regular Backups**: Schedule frequent backups
2. **Multiple Destinations**: Use at least two storage locations
3. **Encryption**: Always encrypt sensitive data
4. **Verification**: Test backups regularly
5. **Monitoring**: Set up notifications for backup status
6. **Documentation**: Keep restoration procedures documented
7. **Automation**: Automate the entire backup process
8. **Retention Policy**: Define how long to keep backups
9. **Incremental Backups**: Use incremental backups for efficiency
10. **Off-site Storage**: Keep at least one copy in a different location

## FAQ

**Q: How much space do I need for backups?**
A: Plan for 2-3x the size of your volumes, allowing for growth and retention of multiple snapshots.

**Q: How frequently should I back up?**
A: Critical data should be backed up daily. Consider more frequent backups for rapidly changing data.

**Q: Is encryption necessary?**
A: Yes, encryption is strongly recommended, especially for off-site backups.

**Q: What about database volumes?**
A: For databases, consider using database-specific backup tools in addition to volume backups.

**Q: How do I know if backups are working?**
A: Set up notifications and regularly test restore procedures.

**Q: Can I back up volumes while containers are running?**
A: Yes, but be aware that data might be in an inconsistent state. For databases, use database backup tools.

**Q: What if my backup drive is full?**
A: The scripts include retention policies to remove old backups. Monitor disk space usage.