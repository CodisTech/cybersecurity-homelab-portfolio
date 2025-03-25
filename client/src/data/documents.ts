import { Document } from "@shared/schema";

export const defaultDocuments: Document[] = [
  {
    id: 1,
    title: "Hardware Components",
    content: "# Hardware Components\n\n## Server Specifications\n\nThe homelab is built around the following key hardware components:\n\n### Primary Server\n- **CPU**: AMD Ryzen 9 5900X (12 cores, 24 threads)\n- **Motherboard**: ASUS ROG Strix X570-E Gaming\n- **RAM**: 64GB (4x16GB) Corsair Vengeance RGB Pro DDR4-3600\n- **Storage**:\n  - 2x Samsung 980 Pro 1TB NVMe SSD (OS and VM storage)\n  - 4x WD Red Plus 4TB in RAID10 (NAS storage)\n- **Case**: Fractal Design Define 7 XL\n- **Power Supply**: Corsair RM850x 850W 80+ Gold\n- **Network**: 10Gbe SFP+ Intel X520-DA2\n\n### Network Equipment\n- **Router**: pfSense on Protectli Vault (4 core, 8GB RAM)\n- **Switch**: Ubiquiti UniFi 24 PoE Pro\n- **Access Points**: 2x Ubiquiti UniFi 6 Lite\n\n## System Performance\n\nThe current configuration provides excellent performance for virtualization tasks with sufficient headroom for expansion. The multiple storage tiers allow for flexibility in deploying different workloads based on performance requirements.",
    category: "Server Setup",
    icon: "server",
    slug: "hardware-components"
  },
  {
    id: 2,
    title: "Proxmox Installation",
    content: "# Proxmox Installation\n\nStep-by-step guide for installing Proxmox virtualization environment...",
    category: "Server Setup",
    icon: "server",
    slug: "proxmox-installation"
  },
  {
    id: 3,
    title: "Network Configuration",
    content: "# Network Configuration\n\nComprehensive documentation for setting up the network infrastructure...",
    category: "Server Setup",
    icon: "server",
    slug: "network-configuration"
  },
  {
    id: 4,
    title: "pfSense Configuration",
    content: "# pfSense Configuration Guide\n\n## Introduction\n\nThis guide covers the installation and configuration of pfSense, a powerful open-source firewall and router based on FreeBSD. pfSense serves as the network gateway and security boundary for the homelab environment.\n\n## Hardware Requirements\n\n- **CPU:** 64-bit dual-core processor (Intel or AMD)\n- **RAM:** 2GB minimum (4GB+ recommended)\n- **Storage:** 16GB minimum (SSD recommended)\n- **Network:** Minimum 2 network interfaces (WAN and LAN)\n\n## Installation\n\n### 1. Download pfSense\n\nDownload the latest stable version of pfSense from the [official website](https://www.pfsense.org/download/).\n\n### 2. Create Bootable USB\n\nUse tools like Rufus (Windows) or dd (Linux/Mac) to create a bootable USB drive.\n\n```bash\n# Linux/Mac example\ndd if=pfSense-CE-2.6.0-RELEASE-amd64.iso of=/dev/sdX bs=4M\n```\n\n### 3. Initial Setup\n\n1. Boot from the USB drive\n2. Select \"Install pfSense\"\n3. Follow the on-screen instructions for installation\n4. Assign network interfaces (identify which is WAN and which is LAN)\n5. Complete installation and reboot\n\n## Initial Configuration\n\n### 1. Access the Web Interface\n\n- Connect to the LAN port\n- Navigate to https://192.168.1.1 in your browser\n- Log in with default credentials:\n  - Username: admin\n  - Password: pfsense\n\n### 2. Run the Setup Wizard\n\n1. Set hostname and domain\n2. Configure time server settings\n3. Configure WAN interface (settings provided by your ISP)\n4. Configure LAN interface (default is usually fine)\n5. Set admin password\n\n## Advanced Configurations\n\n### Setting Up VLANs\n\n1. Navigate to Interfaces > VLANs\n2. Click \"Add\"\n3. Select parent interface (usually LAN)\n4. Enter VLAN tag (e.g., 10 for IoT devices)\n5. Add description\n6. Save\n\n### Creating Additional Interfaces\n\n1. Navigate to Interfaces > Assignments\n2. Select VLAN from dropdown\n3. Click \"Add\"\n4. Configure the new interface with appropriate IP range\n\n### Configure Firewall Rules\n\n#### WAN Rules\n\n1. Navigate to Firewall > Rules > WAN\n2. Default: Block all incoming traffic\n3. Add rules for specific services to be accessible from WAN\n\n#### LAN Rules\n\n1. Navigate to Firewall > Rules > LAN\n2. Default: Allow all outgoing traffic\n3. Add rules to restrict access between VLANs\n\n### Setting Up DNS Resolver\n\n1. Navigate to Services > DNS Resolver\n2. Enable DNS Resolver\n3. Check \"Enable DNSSEC Support\"\n4. Add custom DNS forwarding for specific domains\n\n## Security Recommendations\n\n### 1. Enable Suricata IDS/IPS\n\n1. Navigate to System > Package Manager\n2. Install the Suricata package\n3. Configure under Services > Suricata\n\n### 2. Set Up pfBlockerNG\n\n1. Install pfBlockerNG package\n2. Configure IP and DNS blocking lists\n3. Enable GeoIP blocking for suspicious countries\n\n### 3. Regular Updates\n\n1. Navigate to System > Update\n2. Check for updates regularly\n3. Apply updates during maintenance windows\n\n## Monitoring and Maintenance\n\n### Dashboard Widgets\n\n1. Navigate to Status > Dashboard\n2. Add widgets for:\n   - System Information\n   - Interface Statistics\n   - Traffic Graphs\n   - Firewall Logs\n\n### Backup Configuration\n\n1. Navigate to Diagnostics > Backup & Restore\n2. Create regular backups\n3. Store backups offsite\n\n## Troubleshooting\n\n### Common Issues\n\n1. **No Internet Connectivity**\n   - Check WAN interface status\n   - Verify DNS settings\n   - Check firewall rules\n\n2. **Performance Issues**\n   - Check hardware utilization\n   - Disable unnecessary services\n   - Consider hardware upgrade if needed\n\n3. **VPN Connectivity Problems**\n   - Verify certificates\n   - Check firewall rules\n   - Review VPN client configuration",
    category: "Security",
    icon: "shield-alt",
    slug: "pfsense-configuration"
  },
  {
    id: 5,
    title: "VPN Setup",
    content: "# VPN Setup\n\nStep-by-step guide for setting up a secure VPN connection...",
    category: "Security",
    icon: "shield-alt",
    slug: "vpn-setup"
  },
  {
    id: 6,
    title: "Intrusion Detection",
    content: "# Intrusion Detection\n\nImplementation guide for setting up intrusion detection systems...",
    category: "Security",
    icon: "shield-alt",
    slug: "intrusion-detection"
  },
  {
    id: 7,
    title: "Docker Installation",
    content: "# Docker Installation\n\n## Prerequisites\n\n- A Linux-based system (this guide uses Ubuntu 22.04 LTS)\n- Root or sudo access\n- Internet connectivity\n\n## Installation Steps\n\n### 1. Update System Packages\n\n```bash\nsudo apt update\nsudo apt upgrade -y\n```\n\n### 2. Install Required Dependencies\n\n```bash\nsudo apt install -y apt-transport-https ca-certificates curl software-properties-common gnupg\n```\n\n### 3. Add Docker's Official GPG Key\n\n```bash\ncurl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg\n```\n\n### 4. Add Docker Repository\n\n```bash\necho \"deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable\" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null\n```\n\n### 5. Install Docker Engine\n\n```bash\nsudo apt update\nsudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin\n```\n\n### 6. Verify Installation\n\n```bash\nsudo docker run hello-world\n```\n\n### 7. Enable Non-Root User Access (Optional but Recommended)\n\n```bash\nsudo usermod -aG docker $USER\nnewgrp docker\n```\n\n## Basic Docker Commands\n\n### Pull an Image\n```bash\ndocker pull nginx:latest\n```\n\n### Run a Container\n```bash\ndocker run -d -p 80:80 --name my-nginx nginx:latest\n```\n\n### List Running Containers\n```bash\ndocker ps\n```\n\n### Stop a Container\n```bash\ndocker stop my-nginx\n```\n\n### Remove a Container\n```bash\ndocker rm my-nginx\n```\n\n## Docker Compose\n\nDocker Compose allows you to define and run multi-container Docker applications.\n\n### Create docker-compose.yml\n\n```yaml\nversion: '3'\nservices:\n  web:\n    image: nginx:latest\n    ports:\n      - \"80:80\"\n  db:\n    image: mysql:8.0\n    environment:\n      MYSQL_ROOT_PASSWORD: example\n      MYSQL_DATABASE: mydb\n    volumes:\n      - db_data:/var/lib/mysql\n\nvolumes:\n  db_data:\n```\n\n### Run with Docker Compose\n\n```bash\ndocker-compose up -d\n```\n\n## Maintenance\n\n### Update Docker\n```bash\nsudo apt update\nsudo apt upgrade docker-ce docker-ce-cli containerd.io docker-compose-plugin\n```\n\n### Clean Up Unused Resources\n```bash\ndocker system prune -a\n```",
    category: "Docker Containers",
    icon: "layer-group",
    slug: "docker-installation"
  },
  {
    id: 8,
    title: "Container Orchestration",
    content: "# Container Orchestration\n\nAdvanced guide for orchestrating containers in a homelab environment...",
    category: "Docker Containers",
    icon: "layer-group",
    slug: "container-orchestration"
  },
  {
    id: 9,
    title: "Compose Files",
    content: "# Docker Compose Files\n\nReference documentation for Docker Compose configuration files...",
    category: "Docker Containers",
    icon: "layer-group",
    slug: "compose-files"
  },
  {
    id: 10,
    title: "Prometheus Setup",
    content: "# Prometheus Setup\n\nDetailed guide for setting up Prometheus monitoring...",
    category: "Monitoring",
    icon: "tachometer-alt",
    slug: "prometheus-setup"
  },
  {
    id: 11,
    title: "Grafana Dashboards",
    content: "# Grafana Dashboards\n\nCreating and configuring Grafana dashboards for homelab monitoring...",
    category: "Monitoring",
    icon: "tachometer-alt",
    slug: "grafana-dashboards"
  },
  {
    id: 12,
    title: "Alert Configuration",
    content: "# Alert Configuration\n\nSetting up alerting rules and notifications for system monitoring...",
    category: "Monitoring",
    icon: "tachometer-alt",
    slug: "alert-configuration"
  }
];
