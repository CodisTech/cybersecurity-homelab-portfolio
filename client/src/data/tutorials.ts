import { Tutorial } from "@shared/schema";

export const defaultTutorials: Tutorial[] = [
  {
    id: 1,
    title: "Setting Up a Secure Docker Environment",
    content: "# Setting Up a Secure Docker Environment\n\nThis tutorial covers how to set up a secure Docker environment with proper network isolation, volume management, and container security best practices.",
    summary: "Learn how to set up a secure Docker environment with proper network isolation, volume management, and container security best practices.",
    prerequisites: ["Linux server (Ubuntu 20.04 LTS or newer recommended)", "Root or sudo access", "Basic understanding of networking concepts", "Familiarity with command line operations"],
    codeSnippets: [{
      language: "bash",
      code: "# Create a dedicated Docker network\ndocker network create --driver=bridge --subnet=172.18.0.0/16 --gateway=172.18.0.1 secure_network\n\n# Run a container with security options\ndocker run -d \\\n  --name secure_webapp \\\n  --network secure_network \\\n  --ip 172.18.0.10 \\\n  --cap-drop=ALL \\\n  --cap-add=NET_BIND_SERVICE \\\n  --security-opt=\"no-new-privileges:true\" \\\n  -p 8443:443 \\\n  -v webapp_data:/data \\\n  -e PUID=1000 -e PGID=1000 \\\n  mywebapp:latest"
    }],
    tags: ["Docker", "Security", "Containers"],
    readTime: 20,
    featured: 1,
    slug: "secure-docker-environment",
    createdAt: new Date('2023-05-20')
  },
  {
    id: 2,
    title: "Setting Up Wireguard VPN",
    content: "# Setting Up Wireguard VPN\n\nThis tutorial provides a step-by-step guide to setting up Wireguard VPN for secure remote access to your homelab.",
    summary: "A step-by-step guide to setting up Wireguard VPN for secure remote access to your homelab.",
    prerequisites: ["pfSense or dedicated Linux server", "Public IP address or Dynamic DNS", "Access to router for port forwarding"],
    codeSnippets: [{
      language: "bash",
      code: "# Install Wireguard\napt update && apt install -y wireguard\n\n# Generate private and public keys\nwg genkey | tee /etc/wireguard/private.key | wg pubkey > /etc/wireguard/public.key\n\n# Create configuration file\ncat > /etc/wireguard/wg0.conf << EOF\n[Interface]\nAddress = 10.0.0.1/24\nListenPort = 51820\nPrivateKey = $(cat /etc/wireguard/private.key)\n\n# Example peer configuration\n[Peer]\nPublicKey = peer_public_key_here\nAllowedIPs = 10.0.0.2/32\nEOF\n\n# Enable and start Wireguard\nsystemctl enable wg-quick@wg0\nsystemctl start wg-quick@wg0"
    }],
    tags: ["VPN", "Security", "Networking"],
    readTime: 15,
    featured: 0,
    slug: "wireguard-vpn-setup",
    createdAt: new Date('2023-05-15')
  },
  {
    id: 3,
    title: "Automating Backups with Restic",
    content: "# Automating Backups with Restic\n\nThis tutorial explains how to implement an automated backup strategy using Restic and cloud storage providers.",
    summary: "Learn how to implement an automated backup strategy using Restic and cloud storage providers.",
    prerequisites: ["Linux server", "Storage account (S3, B2, etc.)", "Basic knowledge of CRON"],
    codeSnippets: [{
      language: "bash",
      code: "# Install Restic\napt install -y restic\n\n# Initialize repository\nrestic -r s3:https://s3.amazonaws.com/my-bucket init\n\n# Create backup script\ncat > /usr/local/bin/backup.sh << EOF\n#!/bin/bash\nexport AWS_ACCESS_KEY_ID=your_access_key\nexport AWS_SECRET_ACCESS_KEY=your_secret_key\nrestic -r s3:https://s3.amazonaws.com/my-bucket backup /path/to/data\nrestic -r s3:https://s3.amazonaws.com/my-bucket forget --keep-daily 7 --keep-weekly 4 --keep-monthly 6\nEOF\n\nchmod +x /usr/local/bin/backup.sh\n\n# Add to crontab\necho \"0 3 * * * /usr/local/bin/backup.sh\" | crontab -"
    }],
    tags: ["Backup", "Automation", "Cloud Storage"],
    readTime: 18,
    featured: 0,
    slug: "automating-backups-restic",
    createdAt: new Date('2023-04-22')
  },
  {
    id: 4,
    title: "Network Segmentation with VLANs",
    content: "# Network Segmentation with VLANs\n\nThis tutorial explains how to implement network segmentation using VLANs to improve security and manage traffic.",
    summary: "How to implement network segmentation using VLANs to improve security and manage traffic.",
    prerequisites: ["Managed switch with VLAN support", "pfSense or similar router/firewall", "Basic networking knowledge"],
    codeSnippets: [{
      language: "bash",
      code: "# Sample switch configuration for Cisco-like CLI\nconfig t\nvlan 10\nname IoT_Devices\nexit\nvlan 20\nname Media_Servers\nexit\nvlan 30\nname Management\nexit\n\ninterface GigabitEthernet0/1\nswitchport mode trunk\nswitchport trunk allowed vlan 1,10,20,30\nexit\n\ninterface GigabitEthernet0/2\nswitchport mode access\nswitchport access vlan 10\nexit\n\nwrite memory"
    }],
    tags: ["Networking", "Security", "VLANs"],
    readTime: 25,
    featured: 0,
    slug: "network-segmentation-vlans",
    createdAt: new Date('2023-04-10')
  },
  {
    id: 5,
    title: "Monitoring with Prometheus & Grafana",
    content: "# Monitoring with Prometheus & Grafana\n\nThis tutorial shows you how to set up a comprehensive monitoring solution with Prometheus and Grafana dashboards.",
    summary: "Set up a comprehensive monitoring solution with Prometheus and Grafana dashboards.",
    prerequisites: ["Docker & Docker Compose", "Basic understanding of metrics and monitoring", "Server with at least 2GB RAM"],
    codeSnippets: [{
      language: "yaml",
      code: "version: '3'\n\nservices:\n  prometheus:\n    image: prom/prometheus:latest\n    container_name: prometheus\n    volumes:\n      - ./prometheus.yml:/etc/prometheus/prometheus.yml\n      - prometheus_data:/prometheus\n    command:\n      - '--config.file=/etc/prometheus/prometheus.yml'\n      - '--storage.tsdb.path=/prometheus'\n      - '--web.console.libraries=/etc/prometheus/console_libraries'\n      - '--web.console.templates=/etc/prometheus/consoles'\n    ports:\n      - \"9090:9090\"\n    restart: unless-stopped\n\n  grafana:\n    image: grafana/grafana:latest\n    container_name: grafana\n    volumes:\n      - grafana_data:/var/lib/grafana\n    environment:\n      - GF_SECURITY_ADMIN_USER=admin\n      - GF_SECURITY_ADMIN_PASSWORD=secure_password\n    ports:\n      - \"3000:3000\"\n    restart: unless-stopped\n    depends_on:\n      - prometheus\n\nvolumes:\n  prometheus_data:\n  grafana_data:"
    }],
    tags: ["Monitoring", "Prometheus", "Grafana"],
    readTime: 30,
    featured: 0,
    slug: "prometheus-grafana-monitoring",
    createdAt: new Date('2023-03-28')
  }
];
