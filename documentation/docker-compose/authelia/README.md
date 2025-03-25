# Authelia SSO Implementation

This directory contains a complete Docker Compose setup for deploying Authelia as a Single Sign-On (SSO) solution for your homelab services.

## Overview

Authelia is an open-source authentication and authorization server that provides:

- Web portal for centralized authentication
- Two-factor authentication (TOTP and WebAuthn/security keys)
- Fine-grained access control based on user groups
- Integration with Traefik reverse proxy
- Session management and persistence

## Files in this Directory

- `docker-compose.yml`: Container configuration for Authelia and Redis
- `config/configuration.yml`: Main Authelia configuration
- `config/users_database.yml`: User definitions and access controls

## Prerequisites

Before deploying, you'll need:

- Docker and docker-compose installed
- Traefik reverse proxy configured
- DNS records for your Authelia domain (e.g., `auth.yourdomain.com`)
- SMTP server for password reset and notifications (optional)

## Installation

1. Clone this repository or download the files to your server

2. Create required directories:
   ```bash
   mkdir -p config redis
   ```

3. Modify configuration files:
   - Update domains in `config/configuration.yml`
   - Change default passwords in `config/users_database.yml`
   - Set secure passwords for JWT and session secrets in `docker-compose.yml`

4. Deploy the stack:
   ```bash
   docker-compose up -d
   ```

5. Access the portal at https://auth.yourdomain.com

## Default Credentials

> **Important:** Change these credentials before deploying to production!

- Admin User:
  - Username: `admin`
  - Password: `homelab`
  - Groups: `admins`, `users`

- Regular User:
  - Username: `user`
  - Password: `password`
  - Groups: `users`

## Security Configuration

### Generating Secure Passwords

For user passwords:
```bash
docker run --rm authelia/authelia:latest authelia crypto hash generate argon2 --password 'YourPassword'
```

For JWT and session secrets:
```bash
openssl rand -hex 64
```

### Redis Password

Change the Redis password in both:
- `docker-compose.yml` (redis command line)
- `config/configuration.yml` (redis section)

## Traefik Integration

Authelia integrates with Traefik using the ForwardAuth middleware, which is automatically configured in the `docker-compose.yml` file.

To protect a service with Authelia, add this label to your service:
```yaml
- "traefik.http.routers.your-service.middlewares=authelia@docker"
```

For more complex setups, refer to the [Authelia-Traefik Integration Guide](../../authelia/authelia-sso-integration-guide.md).

## Multi-factor Authentication

### TOTP Setup

Users can enable TOTP (app-based) authentication by:
1. Logging into Authelia
2. Going to the "2FA" section
3. Scanning the QR code with an authenticator app

### WebAuthn (Security Keys)

Users can register security keys (like YubiKey) by:
1. Logging into Authelia
2. Going to the "Security Keys" section
3. Following the prompts to register their security key

## Advanced Configuration

### External Database

For production deployments, consider using an external database instead of SQLite:

1. Uncomment and configure the MySQL section in `configuration.yml`
2. Create the database and user in MySQL/MariaDB

### LDAP Integration

For enterprise deployments, Authelia can integrate with existing LDAP directories:

1. Uncomment and configure the LDAP section in `configuration.yml`
2. Update the authentication backend to use LDAP instead of file

## Troubleshooting

Common issues and solutions:

1. **Authentication Loop**: 
   - Check cookie domain in configuration.yml
   - Ensure consistent domain names across configuration

2. **Redirect Issues**: 
   - Verify default_redirection_url is set correctly
   - Check for misconfigured Traefik labels

3. **Session Problems**: 
   - Verify Redis connectivity
   - Check session domain configuration
   - Ensure secure cookies are enabled for HTTPS

For more information, refer to the [official Authelia documentation](https://www.authelia.com/docs/).

## Maintenance

### Backing Up

Important files to back up:
- `config/configuration.yml`
- `config/users_database.yml`
- `config/db.sqlite3` (if using SQLite)

### Updating

To update Authelia:

1. Update the image version:
   ```bash
   docker-compose pull
   ```

2. Restart the containers:
   ```bash
   docker-compose up -d
   ```

Always check the [changelog](https://github.com/authelia/authelia/releases) before updating.