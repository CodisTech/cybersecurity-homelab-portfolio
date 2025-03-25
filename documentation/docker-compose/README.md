# Docker Compose Configurations

This directory contains Docker Compose configurations for various services used in the cybersecurity homelab. Each subdirectory contains:

1. A `docker-compose.yml` file for the service
2. Configuration files and examples 
3. A README with setup instructions

## Services Included

- **Authelia**: Single Sign-On and 2FA solution
- **CrowdSec**: Collaborative security detection and remediation
- **Duplicacy**: Automated backup solution
- **Full-Stack**: A complete homelab setup with multiple integrated services
- **Grafana**: Monitoring visualization with Prometheus
- **Pi-hole**: Network-wide DNS filtering and ad blocking

## Usage Instructions

To deploy any of these services:

1. Navigate to the service directory
2. Review the README.md for specific configuration requirements
3. Modify configuration files as needed for your environment
4. Deploy with:
   ```bash
   docker-compose up -d
   ```

## Security Considerations

These configurations include basic security settings, but you should:

1. Change all default passwords
2. Review and adjust network settings to match your environment
3. Consider implementing the recommendations in the [security hardening guides](../security/)

## Integration with Reverse Proxy

Most services are configured to work with Traefik as a reverse proxy. If you're using a different reverse proxy (like Nginx), you'll need to adjust the configurations accordingly.