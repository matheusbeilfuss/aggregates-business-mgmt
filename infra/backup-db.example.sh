#!/bin/sh
# Daily database backup script for production server.
# Copy this file to ~/backup-db.sh on the server, make it executable (chmod +x),
# and schedule it with cron:
#   crontab -e
#   0 3 * * * /home/YOUR_USER/backup-db.sh >> /home/YOUR_USER/backups/backup.log 2>&1
#
# Prerequisites:
#   - rclone configured with a remote named "gdrive" (see: rclone config)
#   - Docker Compose running the database container

set -e

export PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"

PROJECT_DIR="$HOME/aggregates-business-mgmt"
BACKUP_DIR="$HOME/backups"
TIMESTAMP=$(date +%Y-%m-%d_%H-%M)
KEEP_LOCAL_DAYS=7
KEEP_REMOTE_DAYS=30
FILENAME="abm_$TIMESTAMP.dump"

mkdir -p "$BACKUP_DIR"

# Dump the database from the running container
docker compose -f "$PROJECT_DIR/docker-compose.yml" exec -T db \
  pg_dump -U abm -d abm --format=custom > "$BACKUP_DIR/$FILENAME"

# Upload to Google Drive
rclone copy "$BACKUP_DIR/$FILENAME" gdrive:backups-abm/

# Remove old local backups (keep 7 days)
find "$BACKUP_DIR" -name "abm_*.dump" -mtime +$KEEP_LOCAL_DAYS -delete

# Remove old remote backups (keep 30 days)
rclone delete gdrive:backups-abm/ --min-age ${KEEP_REMOTE_DAYS}d

echo "Backup completed and uploaded: $FILENAME"