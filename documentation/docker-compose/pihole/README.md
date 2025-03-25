# Pi-hole DNS Filtering Setup

This directory contains the configuration files to deploy Pi-hole with optional Unbound as a recursive DNS resolver.

## Overview

Pi-hole provides network-wide ad blocking and DNS filtering for your homelab. This setup includes:

1. Pi-hole DNS server and web admin interface
2. Optional Unbound recursive DNS resolver for enhanced privacy
3. Integration with Traefik reverse proxy
4. Optional Authelia authentication

## Prerequisites

- Docker and docker-compose installed
- A designated static IP on your network for Pi-hole
- Properly configured firewall to allow DNS traffic
- Optional: Traefik reverse proxy for web interface access

## Configuration

Before deploying, update the following in `docker-compose.yml`:

1. Replace `yourdomain.com` with your actual domain name
2. Set a secure `WEBPASSWORD` (or use environment variables)
3. Update `FTLCONF_LOCAL_IPV4` and `ServerIP` with your Pi-hole's IP address
4. Change time zone to match your location
5. Adjust DNS1 and DNS2 to your preferred upstream DNS providers
6. If using Unbound, uncomment the relevant DNS settings

## Custom Configuration Files

You may want to create the following additional configuration files:

1. For custom DNS entries:
   ```bash
   mkdir -p etc-dnsmasq.d
   cat > etc-dnsmasq.d/02-custom.conf << EOF
   # Custom DNS entries
   address=/internal.yourdomain.com/192.168.1.100
   EOF
   ```

2. For adlists:
   ```bash
   mkdir -p etc-pihole
   cat > etc-pihole/adlists.list << EOF
   https://raw.githubusercontent.com/StevenBlack/hosts/master/hosts
   https://s3.amazonaws.com/lists.disconnect.me/simple_tracking.txt
   https://s3.amazonaws.com/lists.disconnect.me/simple_ad.txt
   EOF
   ```

## Deployment

```bash
# Create required directories
mkdir -p etc-pihole etc-dnsmasq.d unbound

# Deploy
docker-compose up -d
```

## Accessing Pi-hole

- Web interface: https://pihole.yourdomain.com (or http://your-pihole-ip:8080)
- Default login: Set in the WEBPASSWORD environment variable
- API token: Generated in the web interface (Settings > API)

## Using Pi-hole in Your Network

### As Primary DNS

Configure your router's DHCP to use Pi-hole as the primary DNS server:
- DNS Server: 192.168.1.10 (your Pi-hole IP)

### Manual Configuration

For selective devices, manually set DNS:
- DNS Server: 192.168.1.10 (your Pi-hole IP)
- Gateway: Your router's IP (typically 192.168.1.1)

## Security Considerations

- Change the default web interface password
- Use Authelia or another form of authentication for the web interface
- Regularly update blocklists and Pi-hole itself
- Consider implementing the [security hardening guides](../../security/)
- If exposing Pi-hole publicly, use a VPN or strong authentication

## Troubleshooting

If you encounter issues:

1. Check logs with `docker-compose logs -f pihole`
2. Ensure ports 53 (DNS) and 8080 (web) are not blocked
3. Verify your router is not blocking DNS requests
4. Test DNS resolution with `nslookup google.com 192.168.1.10`
5. Firewall may need to be configured to allow TCP/UDP port 53

## Advanced Configuration

### DHCP Setup

To use Pi-hole as your DHCP server:

1. Ensure your router's DHCP server is disabled
2. In Pi-hole web interface, go to Settings > DHCP and enable DHCP server
3. Configure IP range, gateway, and lease time

### Block Page

To customize the block page:
```bash
cat > etc-pihole/custom_blocked.html << EOF
<html>
<head><title>Website Blocked</title></head>
<body>
<h1>Website Blocked</h1>
<p>This website has been blocked by Pi-hole in accordance with network policy.</p>
</body>
</html>
EOF
```