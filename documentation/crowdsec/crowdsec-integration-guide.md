# CrowdSec Integration Guide for Homelab Security

This comprehensive guide explains how to implement CrowdSec in your homelab environment to detect and respond to security threats.

## Table of Contents

- [Introduction](#introduction)
- [Architecture Overview](#architecture-overview)
- [Installation](#installation)
- [Configuration](#configuration)
- [Integration with Services](#integration-with-services)
- [Custom Detection Scenarios](#custom-detection-scenarios)
- [Visualization and Monitoring](#visualization-and-monitoring)
- [Sharing Threat Intelligence](#sharing-threat-intelligence)
- [Advanced Configuration](#advanced-configuration)
- [Troubleshooting](#troubleshooting)

## Introduction

CrowdSec is an open-source and collaborative security engine that detects and responds to attacks. It works by analyzing logs in real-time, detecting suspicious behavior, and taking appropriate actions such as blocking malicious IP addresses.

### Key Features

- Real-time log analysis and threat detection
- Automatic IP blocking with multiple bouncer options
- Community-shared threat intelligence
- Custom detection scenarios
- Multiple integration options
- Dashboard for visualization

### Components

A typical CrowdSec setup includes:

1. **CrowdSec Engine**: Core component that analyzes logs and makes decisions
2. **Bouncers**: Enforcement points that block malicious IPs (e.g., Traefik, Nginx, iptables)
3. **Collections**: Sets of scenarios, parsers, and postoverflows for detecting specific threats
4. **Console**: Web interface for monitoring and management
5. **CSCLI**: Command-line tool for managing CrowdSec

## Architecture Overview

In a homelab environment, CrowdSec typically operates with this architecture:

```
┌──────────────┐    ┌─────────────┐    ┌──────────────┐
│ Source Logs  │───▶│ CrowdSec    │───▶│ Local DB     │
│ (Services)   │    │ Engine      │    │ (SQLite/MySQL│
└──────────────┘    └─────────────┘    └──────────────┘
                          │
                          ▼
┌──────────────┐    ┌─────────────┐    ┌──────────────┐
│ Traefik      │◀───│ Bouncer     │    │ CrowdSec API │
│ (Reverse     │    │ (Enforcement│◀───│ (Threat      │
│  Proxy)      │    │  Point)     │    │  Intelligence)│
└──────────────┘    └─────────────┘    └──────────────┘
```

## Installation

### Using Docker Compose

The most straightforward way to deploy CrowdSec in a homelab is using Docker Compose. Follow these steps:

1. Create a directory for CrowdSec:
   ```bash
   mkdir -p /opt/crowdsec/{config,data}
   ```

2. Download the docker-compose.yml file:
   ```bash
   cd /opt/crowdsec
   wget -O docker-compose.yml https://raw.githubusercontent.com/username/cybersecurity-homelab/main/documentation/docker-compose/crowdsec/docker-compose.yml
   wget -O acquis.yaml https://raw.githubusercontent.com/username/cybersecurity-homelab/main/documentation/docker-compose/crowdsec/acquis.yaml
   ```

3. Start CrowdSec:
   ```bash
   docker-compose up -d
   ```

4. Generate an API key for the bouncer:
   ```bash
   docker exec -it crowdsec cscli bouncers add traefik-bouncer
   ```

5. Update the bouncer API key in your environment:
   ```bash
   echo "BOUNCER_API_KEY=your_generated_key" > .env
   docker-compose down && docker-compose up -d
   ```

### Direct Installation (Non-Docker)

For direct installation on the host:

```bash
curl -s https://packagecloud.io/install/repositories/crowdsec/crowdsec/script.deb.sh | sudo bash
sudo apt-get install crowdsec
sudo apt-get install crowdsec-firewall-bouncer
```

## Configuration

### Log Sources Configuration

The `acquis.yaml` file defines which logs CrowdSec should analyze. Common log sources include:

```yaml
filenames:
  - /var/log/auth.log
  - /var/log/syslog
  - /var/log/nginx/access.log
  - /var/log/traefik/access.log
labels:
  type: syslog
---
filenames:
  - /var/log/nginx/error.log
labels:
  type: nginx_error
---
filenames:
  - /var/log/traefik/access.log
labels:
  type: traefik
```

When using Docker, you'll need to mount these logs into the CrowdSec container or use a log collector like Promtail/Loki.

### Collections

Collections are sets of scenarios, parsers, and postoverflows. Install relevant collections:

```bash
docker exec -it crowdsec cscli collections install crowdsecurity/nginx
docker exec -it crowdsec cscli collections install crowdsecurity/traefik
docker exec -it crowdsec cscli collections install crowdsecurity/linux
docker exec -it crowdsec cscli collections install crowdsecurity/ssh-bf
```

### Local API Configuration

The local API serves as the communication point for bouncers:

```yaml
api:
  server:
    listen_uri: 0.0.0.0:8080
    profiles: ["default"]
  client:
    credentials_path: /etc/crowdsec/local_api_credentials.yaml
```

## Integration with Services

### Traefik Integration

The most common integration in a homelab is with Traefik reverse proxy:

1. Ensure the traefik-bouncer is running (part of the docker-compose setup)

2. Configure Traefik to use the CrowdSec middleware:

```yaml
# In your Traefik dynamic configuration
http:
  middlewares:
    crowdsec-bouncer:
      forwardAuth:
        address: "http://crowdsec-traefik-bouncer:8080/api/v1/forwardAuth"
        trustForwardHeader: true
```

3. Add the middleware to your services:

```yaml
labels:
  - "traefik.http.routers.myservice.middlewares=crowdsec-bouncer@docker"
```

### Nginx Integration

For Nginx, install the Nginx bouncer:

```bash
sudo apt install crowdsec-nginx-bouncer
```

Configure the bouncer:

```bash
sudo vim /etc/crowdsec/bouncers/crowdsec-nginx-bouncer.conf
```

Update your Nginx configuration:

```nginx
http {
    include /etc/nginx/crowdsec_nginx.conf;
    
    server {
        # ...
        location / {
            # ...
            include /etc/nginx/crowdsec_nginx.conf;
        }
    }
}
```

### Firewall Integration

The firewall bouncer works with iptables or nftables:

```bash
sudo apt install crowdsec-firewall-bouncer
```

Configure the bouncer:

```bash
sudo vim /etc/crowdsec/bouncers/crowdsec-firewall-bouncer.conf
```

## Custom Detection Scenarios

Create custom scenarios to detect specific threats relevant to your environment:

1. Create a scenarios directory:
   ```bash
   mkdir -p /opt/crowdsec/config/scenarios
   ```

2. Create a custom scenario for detecting WordPress login attempts:

```yaml
# /opt/crowdsec/config/scenarios/wordpress-bf.yaml
type: leaky
name: wordpress-bf
description: "Detect WordPress login bruteforce"
filter: "evt.Meta.log_type == 'http' && evt.Meta.http_path contains '/wp-login.php'"
groupby: "evt.Meta.source_ip"
capacity: 5
leakspeed: "10s"
blackhole: 5m
labels:
  service: wordpress
  type: bruteforce
  remediation: true
```

3. Reload CrowdSec:
   ```bash
   docker exec -it crowdsec cscli scenarios reload
   ```

## Visualization and Monitoring

### Metabase Dashboard

The included docker-compose setup includes Metabase for visualization:

1. Access Metabase at https://crowdsec.yourdomain.com
2. Set up an initial admin account
3. Configure the database connection:
   - Host: crowdsec
   - Port: 8080
   - Database: crowdsec
   - User: crowdsec
   - Password: (empty)

### Custom Prometheus Metrics

CrowdSec exposes Prometheus metrics that can be integrated with your Grafana dashboard:

```yaml
# In your prometheus.yml
scrape_configs:
  - job_name: 'crowdsec'
    static_configs:
      - targets: ['crowdsec:6060']
```

Create a Grafana dashboard to visualize:
- Active decisions
- Ban/Allow counts
- Alert types
- Top attacked services

## Sharing Threat Intelligence

CrowdSec has a collaborative security approach, allowing you to share and receive threat intelligence:

1. Register with the CrowdSec community:
   ```bash
   docker exec -it crowdsec cscli capi register
   ```

2. Enable the community blocklist:
   ```bash
   docker exec -it crowdsec cscli collections install crowdsecurity/blocklist
   ```

3. Configure which alerts to share:
   ```yaml
   # In your config.yaml
   capi:
     enable: true
     url: https://api.crowdsec.net/
     share_successful_authentications: true
     share_custom_scenarios: true
   ```

## Advanced Configuration

### High Availability Setup

For critical environments, consider a high-availability setup:

1. Use a shared database backend:
   ```yaml
   db_config:
     type: mysql
     host: mysql.yourdomain.com
     port: 3306
     user: crowdsec
     password: <password>
     dbname: crowdsec
   ```

2. Deploy multiple CrowdSec instances with load balancing

3. Implement database redundancy

### Notification Channels

Configure notifications for alerts:

```yaml
notifications:
  - name: slack_security
    type: slack
    format: json
    url: https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX
    
  - name: email_alerts
    type: email
    format: text
    host: smtp.example.com
    port: 587
    username: alerts@example.com
    password: <password>
    sender: crowdsec@example.com
    recipient: security@example.com
```

### Log Management Integration

Integrate CrowdSec with your existing log management solution:

1. **Loki Integration**:
   - Configure Promtail to forward logs to Loki
   - Configure CrowdSec to read from Loki API

2. **ELK Stack Integration**:
   - Forward CrowdSec alerts to Elasticsearch
   - Create Kibana dashboards for visualization

## Troubleshooting

### Common Issues

1. **CrowdSec Not Detecting Attacks**:
   - Check that logs are properly configured in acquis.yaml
   - Verify log file permissions
   - Check that relevant collections are installed
   - Increase log verbosity for debugging

2. **Bouncer Not Blocking**:
   - Verify API key is correctly configured
   - Check connectivity between bouncer and CrowdSec
   - Check for errors in bouncer logs
   - Test bouncer manually with a known-blocked IP

3. **False Positives**:
   - Create allowlists for trusted IPs:
     ```bash
     docker exec -it crowdsec cscli decisions add --ip 192.168.1.10 --type allow
     ```
   - Adjust scenario thresholds in custom_scenarios.yaml

### Debugging Commands

```bash
# Check CrowdSec status
docker exec -it crowdsec cscli status

# List active decisions (IP blocks)
docker exec -it crowdsec cscli decisions list

# View recent alerts
docker exec -it crowdsec cscli alerts list

# Test log parsing
docker exec -it crowdsec cscli parse-live --file /var/log/auth.log

# Increase log verbosity
docker exec -it crowdsec cscli config set --level DEBUG

# Check metrics
curl http://localhost:6060/metrics
```

### Log Analysis

When troubleshooting, examine the CrowdSec logs:

```bash
docker logs -f crowdsec
```

Look for:
- Parser errors
- API connection issues
- Decision application failures
- Bouncer authentication problems

### Testing CrowdSec Effectiveness

To test if CrowdSec is working:

1. Simulate an SSH brute force attack:
   ```bash
   # From another machine
   for i in {1..10}; do ssh user@your-server -p 22; sleep 1; done
   ```

2. Check if CrowdSec detected the attack:
   ```bash
   docker exec -it crowdsec cscli alerts list
   ```

3. Verify that the IP was blocked:
   ```bash
   docker exec -it crowdsec cscli decisions list
   ```