# CrowdSec Security Setup

This directory contains the configuration files to deploy CrowdSec with Traefik integration for enhanced security monitoring and protection.

## Overview

CrowdSec is a free, modern, and collaborative security engine that detects and responds to attacks. This setup includes:

1. CrowdSec - Security detection engine
2. Traefik Bouncer - Integration with Traefik for IP blocking
3. Metabase Dashboard - Visualize security events
4. Optional CAPI registration - Share and receive threat intelligence

## Prerequisites

- Docker and docker-compose installed
- Traefik reverse proxy (for bouncer integration)
- Access to host log files
- Properly configured firewall

## Configuration

Before deploying, update the following:

1. In `docker-compose.yml`:
   - Update UID/GID to match your host user
   - Replace `yourdomain.com` with your actual domain
   - Set a secure bouncer API key via environment variable or .env file
   - Adjust collections based on your infrastructure
   - Remove/comment Authelia middleware if not using it

2. In `acquis.yaml`:
   - Adjust log file paths to match your system
   - Add or remove sources based on your services
   - Uncomment sections as needed

## Initial Setup

```bash
# Create necessary directories
mkdir -p config data metabase-data

# Generate bouncer API key (after first run)
docker exec -it crowdsec cscli bouncers add traefik-bouncer

# Start the stack
docker-compose up -d
```

## Bouncer Configuration

After starting CrowdSec for the first time, you need to generate an API key for the bouncer:

1. Run: `docker exec -it crowdsec cscli bouncers add traefik-bouncer`
2. Copy the generated API key
3. Create or update your .env file:
   ```
   BOUNCER_API_KEY=your_generated_key
   ```
4. Restart the stack: `docker-compose down && docker-compose up -d`

## Integration with Traefik

The bouncer automatically integrates with Traefik, but you need to update your Traefik configuration to use the Forward Auth middleware:

```yaml
# Example Traefik configuration
http:
  middlewares:
    crowdsec-bouncer:
      forwardAuth:
        address: "http://crowdsec-traefik-bouncer:8080/api/v1/forwardAuth"
        
  routers:
    your-service:
      rule: "Host(`service.yourdomain.com`)"
      middlewares:
        - crowdsec-bouncer
```

## Custom Scenarios

To add custom detection scenarios:

1. Create a scenarios directory:
   ```bash
   mkdir -p config/scenarios
   ```

2. Add your custom scenario files:
   ```bash
   cat > config/scenarios/ssh-bf.yaml << EOF
   type: leaky
   name: ssh-bf
   description: "SSH bruteforce detection"
   filter: "evt.Meta.log_type == 'sshd' && evt.Meta.sshd_auth_attempt == 'yes'"
   groupby: "evt.Meta.source_ip"
   capacity: 5
   leakspeed: "10s"
   blackhole: 5m
   labels:
     service: ssh
     type: bruteforce
   EOF
   ```

3. Restart CrowdSec: `docker-compose restart crowdsec`

## Accessing the Dashboard

- Dashboard URL: https://crowdsec.yourdomain.com
- Default login: First-time setup required

During first access, you'll need to:
1. Configure the dashboard connection to CrowdSec
2. Set database connection to: `crowdsec@crowdsec:8080`

## Security Considerations

- Protect the API keys with proper permissions
- Keep CrowdSec updated for latest security rules
- Consider implementing the [security hardening guides](../../security/)
- Regularly review logs and notifications
- Set up proper notification channels for alerts

## Advanced Configuration

### Custom Notification Channels

CrowdSec supports various notification methods. To enable them:

1. Edit `config/profiles.yaml` to include notification configurations:
   ```yaml
   notifications:
     - slack_default
     - email_default
   ```

2. Configure the notification methods in `config/notifications.yaml`:
   ```yaml
   slack_default:
     type: slack
     webhook_url: https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK
   
   email_default:
     type: email
     host: smtp.example.com
     port: 587
     username: user@example.com
     password: password
     sender: crowdsec@example.com
     recipient: security@example.com
   ```

## Troubleshooting

If you encounter issues:

1. Check logs with `docker-compose logs -f crowdsec`
2. Verify log file paths in acquis.yaml exist and are accessible
3. Ensure bouncer API key is correctly set
4. Check dashboard connectivity to CrowdSec
5. Review firewall rules to ensure proper network communication

For more detailed troubleshooting, refer to the [CrowdSec documentation](https://docs.crowdsec.net/docs/troubleshooting/)