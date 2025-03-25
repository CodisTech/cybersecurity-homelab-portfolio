# Pi-hole DNS and Ad Blocking Setup

This directory contains configuration files for deploying Pi-hole as a network-wide ad blocker and DNS server in your homelab.

## Overview

Pi-hole is a DNS sinkhole that blocks unwanted content, primarily advertisements, by preventing DNS resolution to known ad-serving domains. It provides:

- Network-wide ad blocking
- Local DNS resolution
- Optional DHCP server
- Detailed statistics and monitoring
- Customizable blocklists

## Configuration Files

- `docker-compose.yml`: Container configuration for Pi-hole
- `etc-pihole`: Will be created automatically for Pi-hole configuration
- `etc-dnsmasq.d`: Will be created automatically for DNS configuration

## Prerequisites

Before deploying Pi-hole, you'll need:

- Docker and docker-compose installed
- A dedicated IP address for your Pi-hole server
- Router access to change DHCP settings (optional)
- Traefik reverse proxy (optional, for web interface access)

## Installation

1. Create required directories:
   ```bash
   mkdir -p etc-pihole etc-dnsmasq.d
   ```

2. Modify the `docker-compose.yml` file:
   - Update the timezone to your local timezone
   - Set a secure admin password
   - Configure your server's IP address
   - Uncomment and adjust DHCP settings if using Pi-hole as a DHCP server
   - Customize upstream DNS servers if needed

3. Deploy Pi-hole:
   ```bash
   docker-compose up -d
   ```

4. Access the web interface at http://your-server-ip:8080/admin or https://pihole.yourdomain.com

## Network Configuration

### Using Pi-hole as DNS Server

To utilize Pi-hole throughout your network, you have two options:

1. **Configure Your Router (Recommended)**:
   - Access your router's admin interface
   - Set Pi-hole as the primary DNS server
   - All devices on your network will automatically use Pi-hole

2. **Configure Individual Devices**:
   - Manually set each device's DNS server to the Pi-hole IP address
   - Use DHCP reservations for important devices

### Using Pi-hole as DHCP Server

If you want Pi-hole to function as your network's DHCP server:

1. Disable the DHCP server on your router
2. Enable DHCP in Pi-hole by uncommenting the DHCP settings in `docker-compose.yml`
3. Configure DHCP range, lease time, and router IP
4. Restart Pi-hole: `docker-compose restart`

## Customizing Blocklists

Pi-hole comes with default blocklists, but you can add more:

1. Access the Pi-hole web interface
2. Go to Group Management > Adlists
3. Add additional blocklist URLs
4. Update Gravity: Tools > Update Gravity

Recommended blocklists:

- AdGuard DNS Filter: `https://adguardteam.github.io/AdGuardSDNSFilter/Filters/filter.txt`
- OISD Basic: `https://dbl.oisd.nl/basic/`
- StevenBlack's Unified Hosts: `https://raw.githubusercontent.com/StevenBlack/hosts/master/hosts`

## Security Considerations

1. **Admin Password**:
   - Use a strong, unique password for the web interface
   - Consider using Authelia for additional authentication (configured in docker-compose.yml)

2. **Network Exposure**:
   - Only expose the web interface port (8080) to your internal network
   - Use a reverse proxy with SSL for external access

3. **Backup Configuration**:
   - Regularly backup the `etc-pihole` and `etc-dnsmasq.d` directories
   - Document custom configurations and blocklists

## Advanced Configuration

### Custom DNS Records

To add local DNS records:

1. Create a new file in the `etc-dnsmasq.d` directory:
   ```bash
   echo 'address=/myserver.local/192.168.1.100' > etc-dnsmasq.d/02-custom.conf
   ```

2. Restart Pi-hole:
   ```bash
   docker-compose restart
   ```

### DNS over HTTPS/TLS

For encrypted DNS queries:

1. Deploy Unbound or cloudflared in a separate container
2. Configure Pi-hole to use this local resolver as its upstream DNS
3. Update the `DNS1` and `DNS2` environment variables

### Conditional Forwarding

For proper local domain resolution:

1. Access the Pi-hole web interface
2. Go to Settings > DNS
3. Under "Conditional Forwarding":
   - Enter your network information
   - Enable conditional forwarding

## Monitoring and Maintenance

### Viewing Statistics

Access detailed blocking statistics in the Pi-hole dashboard, including:

- Total queries
- Queries blocked
- Top domains
- Top clients
- Query types

### Regular Maintenance

1. **Update Blocklists**:
   - Web interface: Tools > Update Gravity
   - Or automatically via cron: `docker exec pihole pihole updateGravity`

2. **Update Pi-hole**:
   ```bash
   docker-compose pull
   docker-compose up -d
   ```

3. **Check Logs**:
   ```bash
   docker logs -f pihole
   ```

## Troubleshooting

### Common Issues

1. **DNS Not Working**:
   - Check that ports 53 TCP/UDP are not in use by another service
   - Verify network settings and firewall rules
   - Ensure your router is properly configured to use Pi-hole

2. **Web Interface Inaccessible**:
   - Check that the container is running: `docker ps`
   - Verify port mapping: `docker-compose ps`
   - Check the logs: `docker logs pihole`

3. **Specific Sites Blocked Incorrectly**:
   - Add the domain to the whitelist in the Pi-hole admin interface
   - Check Query Log to identify which blocklist is affecting the site

### Reset Admin Password

If you forget the admin password:

```bash
docker exec -it pihole pihole -a -p newpassword
```

## Additional Resources

- [Pi-hole Documentation](https://docs.pi-hole.net/)
- [Pi-hole Discourse](https://discourse.pi-hole.net/)
- [Pi-hole GitHub](https://github.com/pi-hole/pi-hole)