# Grafana Monitoring Stack

This directory contains configuration files for deploying a complete monitoring stack based on Grafana, Prometheus, and Loki in your homelab.

## Overview

This monitoring solution provides:

- **Grafana**: Visualization and dashboards
- **Prometheus**: Metrics collection and storage
- **Node Exporter**: System metrics collection
- **cAdvisor**: Container metrics collection
- **Loki**: Log aggregation system
- **Promtail**: Log collection agent

## Architecture

The architecture follows a standard monitoring pattern:

1. **Data Collection**: Node Exporter, cAdvisor, and Promtail collect metrics and logs
2. **Data Storage**: Prometheus and Loki store metrics and logs
3. **Visualization**: Grafana provides dashboards and alerting

## Prerequisites

Before deploying, you'll need:

- Docker and docker-compose installed
- Traefik reverse proxy configured with SSL
- DNS records for Grafana and Prometheus
- Authelia for authentication (optional but recommended)

## Installation

1. Create the required directory structure:
   ```bash
   mkdir -p prometheus promtail/config provisioning/{datasources,dashboards}
   ```

2. Copy the Prometheus configuration:
   ```bash
   cp prometheus.yml prometheus/
   ```

3. Create the Grafana datasource configuration:
   ```bash
   cat > provisioning/datasources/datasources.yaml << EOF
   apiVersion: 1
   datasources:
     - name: Prometheus
       type: prometheus
       access: proxy
       url: http://prometheus:9090
       isDefault: true
     - name: Loki
       type: loki
       access: proxy
       url: http://loki:3100
   EOF
   ```

4. Create a basic Promtail configuration:
   ```bash
   cat > promtail/config.yml << EOF
   server:
     http_listen_port: 9080
     grpc_listen_port: 0
   positions:
     filename: /tmp/positions.yaml
   clients:
     - url: http://loki:3100/loki/api/v1/push
   scrape_configs:
     - job_name: system
       static_configs:
       - targets:
           - localhost
         labels:
           job: varlogs
           __path__: /var/log/*log
   EOF
   ```

5. Modify the docker-compose.yml:
   - Update Grafana admin password
   - Set your domain names
   - Configure any other environment variables

6. Deploy the stack:
   ```bash
   docker-compose up -d
   ```

7. Access Grafana at https://grafana.yourdomain.com

## Configuration

### Prometheus Configuration

The `prometheus.yml` file includes scrape targets for:

- Prometheus itself
- Node Exporter (system metrics)
- cAdvisor (container metrics)
- Traefik (proxy metrics)
- Pi-hole (DNS and ad-blocking metrics)
- CrowdSec (security metrics)

Additional targets are commented out and can be enabled as needed.

### Grafana Dashboards

The stack does not include pre-configured dashboards, but you can import these recommended dashboards:

1. Node Exporter Full: ID 1860
2. Docker and System Monitoring: ID 893
3. Traefik: ID 4475
4. Pi-hole: ID 10176
5. CrowdSec: ID 16361

To import a dashboard:
1. In Grafana, go to "Dashboards" > "Import"
2. Enter the dashboard ID
3. Select the appropriate data source
4. Click "Import"

### Persistent Storage

The configuration uses Docker volumes for data persistence:

- `grafana_data`: Grafana settings and dashboards
- `prometheus_data`: Prometheus time-series database
- `loki_data`: Loki log storage

## Security Considerations

1. **Authentication**:
   - Change the default Grafana admin password in the docker-compose.yml file
   - Use Authelia for additional protection (already configured in the labels)

2. **Authorization**:
   - Configure Grafana users with appropriate permissions
   - Consider setting up organizations for multi-team setups

3. **Network Security**:
   - Only Grafana and Prometheus are exposed via Traefik
   - Other components are only accessible within the internal network

4. **Data Retention**:
   - Configure appropriate retention periods in Prometheus and Loki
   - Currently set to 30 days for Prometheus

## Advanced Configuration

### Adding Alert Rules

For Prometheus alerting:

1. Create an alert rules file:
   ```bash
   mkdir -p prometheus/rules
   ```

2. Define your alert rules:
   ```yaml
   # prometheus/rules/node_alerts.yml
   groups:
   - name: node
     rules:
     - alert: HighCPULoad
       expr: 100 - (avg by(instance) (irate(node_cpu_seconds_total{mode="idle"}[5m])) * 100) > 80
       for: 5m
       labels:
         severity: warning
       annotations:
         summary: High CPU load
         description: CPU load is > 80% for 5 minutes
   ```

3. Update the Prometheus configuration to include the rules:
   ```yaml
   # In prometheus.yml
   rule_files:
     - "rules/node_alerts.yml"
   ```

### Setting Up Alertmanager

For alert notifications:

1. Add Alertmanager to the docker-compose.yml file:
   ```yaml
   alertmanager:
     image: prom/alertmanager:latest
     container_name: alertmanager
     volumes:
       - ./alertmanager:/etc/alertmanager
     command:
       - '--config.file=/etc/alertmanager/config.yml'
     networks:
       - monitoring
     restart: unless-stopped
   ```

2. Configure the Alertmanager:
   ```yaml
   # alertmanager/config.yml
   global:
     smtp_smarthost: 'smtp.example.com:587'
     smtp_from: 'alertmanager@example.com'
     smtp_auth_username: 'username'
     smtp_auth_password: 'password'
   
   route:
     group_by: ['alertname', 'instance']
     group_wait: 30s
     group_interval: 5m
     repeat_interval: 4h
     receiver: 'email'
   
   receivers:
   - name: 'email'
     email_configs:
     - to: 'admin@example.com'
   ```

3. Update the Prometheus configuration:
   ```yaml
   # In prometheus.yml
   alerting:
     alertmanagers:
       - static_configs:
           - targets:
             - alertmanager:9093
   ```

## Troubleshooting

### Common Issues

1. **Prometheus Can't Scrape Targets**:
   - Check network connectivity between containers
   - Verify the target services are running and exposing metrics
   - Check the Prometheus logs: `docker-compose logs prometheus`

2. **Grafana Can't Connect to Data Sources**:
   - Verify the data source configuration
   - Check network connectivity between containers
   - Check Grafana logs: `docker-compose logs grafana`

3. **Missing System Metrics**:
   - Verify Node Exporter is running: `docker-compose ps`
   - Check if metrics are available: `curl node-exporter:9100/metrics`
   - Check permissions on system directories

### Viewing Logs

```bash
# View logs for the entire stack
docker-compose logs

# View logs for a specific service
docker-compose logs grafana
docker-compose logs prometheus
```

## Maintenance

### Backup Strategy

Regularly backup the following directories:

- `prometheus/`: Configuration files
- `provisioning/`: Grafana provisioning files
- Docker volumes (using the backup scripts in the repo)

### Updating the Stack

To update to newer versions:

```bash
docker-compose pull
docker-compose up -d
```

### Scaling Considerations

For larger environments:

1. Consider using remote storage solutions for Prometheus
2. Implement Prometheus federation for larger metric collections
3. Use Grafana Enterprise features for larger teams

## Additional Resources

- [Grafana Documentation](https://grafana.com/docs/)
- [Prometheus Documentation](https://prometheus.io/docs/introduction/overview/)
- [Loki Documentation](https://grafana.com/docs/loki/latest/)
- [Prometheus Exporters](https://prometheus.io/docs/instrumenting/exporters/)