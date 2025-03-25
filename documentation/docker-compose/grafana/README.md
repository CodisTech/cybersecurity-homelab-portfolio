# Grafana and Prometheus Monitoring Setup

This directory contains the configuration files to deploy Grafana with Prometheus for monitoring your homelab infrastructure.

## Overview

This setup includes:

1. Grafana - Visualization and dashboards
2. Prometheus - Time-series database for metrics
3. Node Exporter - System metrics collection
4. cAdvisor - Container metrics collection
5. Integration with Traefik reverse proxy (optional)
6. Optional Authelia authentication

## Prerequisites

- Docker and docker-compose installed
- Traefik reverse proxy (optional, for HTTPS and authentication)
- At least 2GB of RAM available for the monitoring stack

## Configuration

Before deploying, update the following:

1. In `docker-compose.yml`:
   - Replace `yourdomain.com` with your actual domain
   - Set a secure Grafana admin password
   - Adjust resource limits if needed
   - Remove/comment Authelia middleware if not using it

2. In `prometheus/prometheus.yml`:
   - Add or remove targets based on your homelab services
   - Update scrape intervals if needed
   - Uncomment alerting configuration if setting up alerts

## Directory Structure

Create the following directory structure for provisioning dashboards and data sources:

```
grafana/
├── provisioning/
│   ├── dashboards/
│   │   ├── dashboard.yml
│   │   └── homelab-overview.json
│   └── datasources/
│       └── datasource.yml
```

## Sample Provisioning Files

### Create Data Source Configuration

```bash
mkdir -p ./provisioning/datasources
cat > ./provisioning/datasources/datasource.yml << EOF
apiVersion: 1

datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://prometheus:9090
    isDefault: true
EOF
```

### Create Dashboard Provisioning

```bash
mkdir -p ./provisioning/dashboards
cat > ./provisioning/dashboards/dashboard.yml << EOF
apiVersion: 1

providers:
  - name: 'Default'
    folder: 'Homelab'
    type: file
    disableDeletion: false
    updateIntervalSeconds: 30
    allowUiUpdates: true
    options:
      path: /etc/grafana/provisioning/dashboards
      foldersFromFilesStructure: true
EOF
```

## Deployment

```bash
# Create necessary directories if not created yet
mkdir -p prometheus provisioning/dashboards provisioning/datasources

# Start the monitoring stack
docker-compose up -d
```

## Accessing Grafana

- Web interface: https://grafana.yourdomain.com
- Default login: admin / changeme (as set in docker-compose.yml)

## Dashboards

After logging in to Grafana, you can import pre-made dashboards:

1. Node Exporter Dashboard: ID 1860
2. Docker/cAdvisor Dashboard: ID 893
3. Traefik Dashboard: ID 4475
4. Pi-hole Dashboard: ID 10176 (if you have Pi-hole)

To import a dashboard:
1. Click on "+" icon in the sidebar
2. Select "Import"
3. Enter the dashboard ID
4. Select the Prometheus data source

## Security Considerations

- Change default passwords
- Use Authelia or another form of authentication
- Limit network access to Prometheus (it doesn't have authentication)
- Regularly update all components
- Consider implementing the [security hardening guides](../../security/)

## Troubleshooting

If you encounter issues:

1. Check logs with:
   ```bash
   docker-compose logs -f grafana
   docker-compose logs -f prometheus
   ```

2. Verify Prometheus targets:
   - Access Prometheus directly (http://prometheus.yourdomain.com)
   - Go to Status > Targets
   - Check if targets are "UP"

3. Test data source in Grafana:
   - Go to Configuration > Data Sources
   - Click on the Prometheus data source
   - Click "Test" to verify the connection

## Advanced Configuration

### Alerting

To enable alerting, set up Alertmanager and configure alert rules in Prometheus.

1. Add Alertmanager service to docker-compose.yml
2. Configure alert rules in prometheus/alert.rules.yml
3. Update prometheus.yml to include the rules file

### Custom Retention

To adjust data retention (default is 15d), modify the Prometheus command in docker-compose.yml:
```yaml
command:
  - '--storage.tsdb.retention.time=30d'  # Example: 30 days
```