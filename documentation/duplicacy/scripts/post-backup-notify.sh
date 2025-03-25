#!/bin/bash
#
# Post-backup notification script
# This script sends notifications about backup results
#
# Usage: ./post-backup-notify.sh [log_file] [success_count] [total_count]

# Check parameters
if [ $# -lt 3 ]; then
  echo "Usage: $0 <log_file> <success_count> <total_count>"
  exit 1
fi

LOG_FILE=$1
SUCCESS_COUNT=$2
TOTAL_COUNT=$3
HOSTNAME=$(hostname)
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
SUBJECT="Docker Volume Backup Report - $HOSTNAME - $TIMESTAMP"

# Calculate success percentage
SUCCESS_PERCENT=$(( SUCCESS_COUNT * 100 / TOTAL_COUNT ))

# Determine status
if [ $SUCCESS_COUNT -eq $TOTAL_COUNT ]; then
  STATUS="✅ SUCCESS"
elif [ $SUCCESS_COUNT -eq 0 ]; then
  STATUS="❌ FAILED"
else
  STATUS="⚠️ PARTIAL"
fi

# Create message
MESSAGE="
Backup Status: $STATUS
Host: $HOSTNAME
Time: $TIMESTAMP
Volumes Backed Up: $SUCCESS_COUNT/$TOTAL_COUNT ($SUCCESS_PERCENT%)

"

# Add last 10 lines of log
if [ -f "$LOG_FILE" ]; then
  MESSAGE+="
Log Excerpt:
$(tail -10 "$LOG_FILE")
"
fi

# Function to send email (if mail command is available)
send_email() {
  if command -v mail > /dev/null; then
    echo "$MESSAGE" | mail -s "$SUBJECT" "$EMAIL_RECIPIENT"
    echo "Email notification sent to $EMAIL_RECIPIENT"
  else
    echo "mail command not available, email notification skipped"
  fi
}

# Function to send Slack notification (if curl is available)
send_slack() {
  if [ -n "$SLACK_WEBHOOK_URL" ] && command -v curl > /dev/null; then
    # Format message for Slack
    COLOR="good"
    if [ "$STATUS" = "❌ FAILED" ]; then
      COLOR="danger"
    elif [ "$STATUS" = "⚠️ PARTIAL" ]; then
      COLOR="warning"
    fi
    
    # Escape JSON special characters
    MESSAGE_ESCAPED=$(echo "$MESSAGE" | sed 's/"/\\"/g' | sed 's/$/\\n/g' | tr -d '\n')
    
    # Send to Slack
    curl -s -X POST -H 'Content-type: application/json' \
      --data "{\"attachments\":[{\"color\":\"$COLOR\",\"title\":\"$SUBJECT\",\"text\":\"$MESSAGE_ESCAPED\"}]}" \
      "$SLACK_WEBHOOK_URL"
    echo "Slack notification sent"
  else
    echo "Slack webhook URL not set or curl not available, Slack notification skipped"
  fi
}

# Function to send Discord notification (if curl is available)
send_discord() {
  if [ -n "$DISCORD_WEBHOOK_URL" ] && command -v curl > /dev/null; then
    # Format message for Discord
    COLOR=65280  # Green
    if [ "$STATUS" = "❌ FAILED" ]; then
      COLOR=16711680  # Red
    elif [ "$STATUS" = "⚠️ PARTIAL" ]; then
      COLOR=16776960  # Yellow
    fi
    
    # Escape JSON special characters
    MESSAGE_ESCAPED=$(echo "$MESSAGE" | sed 's/"/\\"/g' | sed 's/$/\\n/g' | tr -d '\n')
    
    # Send to Discord
    curl -s -X POST -H 'Content-type: application/json' \
      --data "{\"embeds\":[{\"title\":\"$SUBJECT\",\"description\":\"$MESSAGE_ESCAPED\",\"color\":$COLOR}]}" \
      "$DISCORD_WEBHOOK_URL"
    echo "Discord notification sent"
  else
    echo "Discord webhook URL not set or curl not available, Discord notification skipped"
  fi
}

# Configure your notification channels here
# Uncomment and set the ones you want to use

# Email configuration
#EMAIL_RECIPIENT="admin@example.com"
#send_email

# Slack configuration
#SLACK_WEBHOOK_URL="https://hooks.slack.com/services/TXXXXXXXX/BXXXXXXXX/XXXXXXXXXXXXXXXXXXXXXXXX"
#send_slack

# Discord configuration
#DISCORD_WEBHOOK_URL="https://discord.com/api/webhooks/XXXXXXXXXXX/XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
#send_discord

# Log to console
echo "$MESSAGE"

exit 0