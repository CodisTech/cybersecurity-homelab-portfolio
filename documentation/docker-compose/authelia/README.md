# Authelia Single Sign-On Setup

This directory contains the necessary configuration files to deploy Authelia SSO with Redis for session management.

## Prerequisites

- Docker and docker-compose installed
- A reverse proxy (like Traefik, Nginx, or Caddy) for HTTPS termination
- Domain name with proper DNS configuration

## Configuration

Before deploying, update the following files:

1. In `config/configuration.yml`:
   - Replace `yourdomain.com` with your actual domain
   - Adjust access control rules to match your services
   - For production, configure a proper notification method (SMTP recommended)

2. In `config/users_database.yml`:
   - Change the default passwords
   - Add your users
   - Generate secure password hashes using:
     ```
     docker run authelia/authelia:latest authelia crypto hash generate argon2 --password 'yourpassword'
     ```

3. In `docker-compose.yml`:
   - Replace `auth.yourdomain.com` with your Authelia subdomain
   - Set a secure Redis password using environment variables or .env file

## Deployment

```bash
# Create empty data directories
mkdir -p data redis

# Set Redis password
export REDIS_PASSWORD="your-secure-password"

# Deploy
docker-compose up -d
```

## Integration with Reverse Proxy

### For Traefik

Authelia is already configured to work with Traefik in the docker-compose.yml file.

For protected services, add the following labels:

```yaml
labels:
  - "traefik.http.middlewares.authelia.forwardAuth.address=http://authelia:9091/api/verify?rd=https://auth.yourdomain.com"
  - "traefik.http.middlewares.authelia.forwardAuth.trustForwardHeader=true"
  - "traefik.http.middlewares.authelia.forwardAuth.authResponseHeaders=Remote-User,Remote-Groups,Remote-Name,Remote-Email"
  - "traefik.http.routers.yourservice.middlewares=authelia@docker"
```

### For Nginx Proxy Manager

Create a forward auth entry:
- Name: Authelia
- Forward Hostname/IP: authelia
- Port: 9091
- Forward Path: /api/verify?rd=https://auth.yourdomain.com

Then enable forward authentication in proxy hosts advanced settings.

## Security Considerations

- Keep your user database secure
- Use strong passwords for Redis and user accounts
- Enable HTTPS for all services
- Consider setting up email notifications for login attempts
- Review the [security hardening guides](../../security/) for additional measures

## Troubleshooting

If you encounter issues:

1. Check logs with `docker-compose logs -f authelia`
2. Verify that Redis is running properly
3. Check that your reverse proxy is correctly configured
4. Ensure DNS records are set up correctly for your domain