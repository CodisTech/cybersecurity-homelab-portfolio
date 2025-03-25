import { Service } from "@shared/schema";

export const defaultServices: Service[] = [
  {
    id: 1,
    name: "Firewall (pfSense)",
    description: "Network security solution for managing traffic, VPNs, and network segmentation.",
    icon: "shield-alt",
    status: "Online",
    version: "2.7.0",
    ipAddress: "192.168.1.1",
    platform: "VM on Proxmox",
    configLink: "/documentation#pfsense-configuration",
    adminLink: "https://192.168.1.1"
  },
  {
    id: 2,
    name: "Grafana",
    description: "Visualization and analytics platform for monitoring system performance and metrics.",
    icon: "tachometer-alt",
    status: "Online",
    version: "9.5.2",
    ipAddress: "192.168.1.10",
    platform: "Docker",
    configLink: "/documentation#grafana-dashboards",
    adminLink: "https://192.168.1.10:3000"
  },
  {
    id: 3,
    name: "Wireguard VPN",
    description: "Modern, secure VPN solution for remote access to the homelab network.",
    icon: "lock",
    status: "Online",
    version: "1.0.20210914",
    ipAddress: "192.168.1.5",
    platform: "Container on pfSense",
    configLink: "/documentation#vpn-setup",
    adminLink: "https://192.168.1.1/wireguard"
  }
];
