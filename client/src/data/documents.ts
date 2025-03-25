import { Document } from "@shared/schema";

export const defaultDocuments: Document[] = [
  {
    id: 1,
    title: "Hardware Components",
    content: "# Hardware Components\n\nDetailed documentation about the hardware components used in the homelab setup...",
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
    content: "# pfSense Configuration\n\nDetailed guide for setting up and configuring pfSense firewall...",
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
    content: "# Docker Installation\n\nComplete guide for installing Docker and basic container management...",
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
