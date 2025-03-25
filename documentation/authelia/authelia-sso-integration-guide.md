# Authelia Single Sign-On Integration Guide

This guide provides detailed instructions for implementing Authelia as a Single Sign-On (SSO) solution in your homelab environment with Traefik reverse proxy integration.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Deployment](#deployment)
- [Traefik Integration](#traefik-integration)
- [User Management](#user-management)
- [Service Integration Examples](#service-integration-examples)
- [Multi-factor Authentication](#multi-factor-authentication)
- [Security Considerations](#security-considerations)
- [Troubleshooting](#troubleshooting)

## Overview

Authelia is an open-source authentication and authorization server that provides:

- Single Sign-On portal for web applications
- Two-factor authentication
- Fine-grained access control
- Integration with various reverse proxies
- Multiple storage backends for user information

This guide focuses on integrating Authelia with Traefik in a Docker-based homelab.

## Architecture

The architecture consists of:

1. **Traefik**: Reverse proxy handling TLS termination and routing
2. **Authelia**: Authentication server providing SSO capabilities
3. **Redis**: Session storage (optional but recommended)
4. **Database**: User information storage (SQLite or PostgreSQL)
5. **Protected Services**: Web applications secured by Authelia

The authentication flow works as follows:

1. User requests access to a protected service
2. Traefik forwards the request to Authelia for authentication
3. Authelia verifies the user's credentials
4. If authenticated, Authelia sets a cookie and redirects back to the service
5. Traefik allows access to the service based on Authelia's response

## Prerequisites

- Docker and docker-compose installed
- Traefik reverse proxy configured with HTTPS
- Domain name with DNS records for Authelia and services
- Basic understanding of YAML configuration

## Deployment

### 1. Directory Structure

Create the following directory structure:

```
authelia/
├── config/
│   ├── configuration.yml
│   └── users_database.yml
└── docker-compose.yml
```

### 2. Configuration Files

#### docker-compose.yml

The docker-compose file in this repository contains a production-ready Authelia setup with Redis for session storage. Key components:

- Authelia container with mounted configuration
- Redis for session storage
- Network integration with Traefik
- Volume mappings for persistent data

#### configuration.yml

The configuration.yml file contains all Authelia settings. Key sections include:

1. **Server settings**: Host, port, and path configurations
2. **JWT settings**: Secret key for token signing
3. **Storage settings**: Database connection parameters
4. **Session settings**: Redis configuration
5. **Authentication settings**: Password policy and 2FA settings
6. **Access control**: Rules for different services and domains
7. **Notification settings**: Email server configuration

### 3. User Database

The `users_database.yml` file contains user information in YAML format. Users are defined with:

- Username
- Password hash (generated with Argon2id)
- Email address
- Display name
- Groups membership

Example:

```yaml
users:
  john:
    displayname: "John Doe"
    password: "$argon2id$v=19$m=65536,t=3,p=4$..." # Hash, not plaintext
    email: john@yourdomain.com
    groups:
      - admins
      - users
```

To generate password hashes:

```bash
docker run --rm authelia/authelia:latest authelia crypto hash generate argon2 --password 'YourPassword'
```

## Traefik Integration

### 1. Middleware Configuration

Authelia is integrated with Traefik using Forward Auth middleware. The docker-compose labels automatically create this middleware, but you can also define it manually:

```yaml
# In Traefik dynamic configuration
http:
  middlewares:
    authelia:
      forwardAuth:
        address: "http://authelia:9091/api/verify?rd=https://auth.yourdomain.com"
        trustForwardHeader: true
        authResponseHeaders:
          - "Remote-User"
          - "Remote-Groups"
          - "Remote-Name"
          - "Remote-Email"
```

### 2. Service Protection

To protect a service with Authelia, add the middleware to the service's router:

```yaml
labels:
  - "traefik.http.routers.myservice.middlewares=authelia@docker"
```

### 3. Bypass Authentication for Specific Routes

For public endpoints that don't require authentication:

```yaml
# In Traefik dynamic configuration
http:
  middlewares:
    authelia-bypass:
      forwardAuth:
        address: "http://authelia:9091/api/verify?rd=https://auth.yourdomain.com"
        trustForwardHeader: true
        authResponseHeaders:
          - "Remote-User"
          - "Remote-Groups"
          - "Remote-Name"
          - "Remote-Email"
```

Then in your service's docker-compose:

```yaml
labels:
  - "traefik.http.routers.myservice-public.rule=Host(`service.yourdomain.com`) && Path(`/public`, `/api/public`)"
  - "traefik.http.routers.myservice-public.middlewares=authelia-bypass@docker"
  - "traefik.http.routers.myservice-protected.rule=Host(`service.yourdomain.com`)"
  - "traefik.http.routers.myservice-protected.middlewares=authelia@docker"
```

## User Management

### Adding Users

1. Generate a password hash:
   ```bash
   docker run --rm authelia/authelia:latest authelia crypto hash generate argon2 --password 'YourPassword'
   ```

2. Add the user to `users_database.yml`:
   ```yaml
   users:
     newuser:
       displayname: "New User"
       password: "$argon2id$v=19$m=65536,t=3,p=4$..." # Generated hash
       email: newuser@yourdomain.com
       groups:
         - users
   ```

3. Restart Authelia:
   ```bash
   docker-compose restart authelia
   ```

### Changing Passwords

1. Generate a new password hash
2. Update the user's password hash in `users_database.yml`
3. Restart Authelia

### User Groups and Access Control

Define access control rules in `configuration.yml`:

```yaml
access_control:
  default_policy: deny
  rules:
    - domain: public.yourdomain.com
      policy: bypass
      
    - domain: admin.yourdomain.com
      policy: two_factor
      subject:
        - "group:admins"
        
    - domain: "*.yourdomain.com"
      policy: one_factor
      subject:
        - "group:users"
```

## Service Integration Examples

### Grafana Integration

```yaml
# In Grafana's docker-compose.yml
services:
  grafana:
    # ... other configuration
    environment:
      - GF_AUTH_PROXY_ENABLED=true
      - GF_AUTH_PROXY_HEADER_NAME=Remote-User
      - GF_AUTH_PROXY_HEADER_PROPERTY=username
      - GF_AUTH_PROXY_AUTO_SIGN_UP=true
      - GF_SERVER_ROOT_URL=https://grafana.yourdomain.com
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.grafana.rule=Host(`grafana.yourdomain.com`)"
      - "traefik.http.routers.grafana.middlewares=authelia@docker"
```

### Nextcloud Integration

```yaml
# In Nextcloud's docker-compose.yml
services:
  nextcloud:
    # ... other configuration
    environment:
      - OVERWRITEPROTOCOL=https
      - TRUSTED_PROXIES=traefik
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.nextcloud.rule=Host(`nextcloud.yourdomain.com`)"
      - "traefik.http.routers.nextcloud.middlewares=authelia@docker"
```

## Multi-factor Authentication

Authelia supports multiple second-factor authentication methods:

### TOTP (Time-based One-Time Password)

Enable in `configuration.yml`:

```yaml
authentication_backend:
  # ... other settings
  password_reset:
    disable: false
    
totp:
  issuer: YourHomelab
  period: 30
  skew: 1
```

Users can enroll in TOTP by:
1. Logging into Authelia
2. Going to the "2FA" section
3. Scanning the QR code with an authenticator app

### WebAuthn (Security Keys)

Enable in `configuration.yml`:

```yaml
webauthn:
  disable: false
  display_name: YourHomelab
  attestation_conveyance_preference: indirect
  user_verification: preferred
  timeout: 60s
```

Users can register security keys by:
1. Logging into Authelia
2. Going to the "Security Keys" section
3. Following the prompts to register their device

## Security Considerations

1. **Secrets Management**:
   - Never store secrets in plain text
   - Use environment variables or Docker secrets
   - Rotate JWT and session secrets periodically

2. **Network Security**:
   - Place Authelia in an internal network
   - Limit access to the Authelia container
   - Use separate Redis instance for sessions

3. **Backup Strategy**:
   - Regularly backup user database
   - Document recovery procedures
   - Test restores periodically

4. **High Availability**:
   - Consider redundant Authelia instances
   - Use clustered Redis for session storage
   - Implement database replication

## Troubleshooting

### Common Issues

1. **Authentication Loop**:
   - Check Traefik logs for middleware configuration issues
   - Verify cookie domain settings in Authelia configuration
   - Ensure consistent domain names across configuration

2. **Session Expiration**:
   - Check Redis connectivity
   - Verify session configuration in Authelia
   - Check for time drift between containers

3. **TOTP Synchronization Issues**:
   - Adjust the TOTP skew parameter
   - Verify time synchronization on server and device
   - Reset TOTP configuration for affected users

### Logging

Increase log verbosity in `configuration.yml`:

```yaml
log:
  level: debug # Options: trace, debug, info, warn, error
```

### Diagnostic Tools

1. Check Authelia container logs:
   ```bash
   docker-compose logs -f authelia
   ```

2. Verify Redis connection:
   ```bash
   docker exec -it authelia_redis redis-cli ping
   ```

3. Test Authelia verification endpoint:
   ```bash
   curl -v -H "X-Forwarded-Host: service.yourdomain.com" http://localhost:9091/api/verify
   ```