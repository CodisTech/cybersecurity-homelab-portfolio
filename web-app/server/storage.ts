import { 
  users, type User, type InsertUser,
  services, type Service, type InsertService,
  documents, type Document, type InsertDocument,
  tutorials, type Tutorial, type InsertTutorial
} from "@shared/schema";

export interface IStorage {
  // User CRUD operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Service CRUD operations
  getServices(): Promise<Service[]>;
  getService(id: number): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: number, service: Partial<InsertService>): Promise<Service | undefined>;
  deleteService(id: number): Promise<boolean>;
  
  // Document CRUD operations
  getDocuments(): Promise<Document[]>;
  getDocumentsByCategory(category: string): Promise<Document[]>;
  getDocument(id: number): Promise<Document | undefined>;
  getDocumentBySlug(slug: string): Promise<Document | undefined>;
  createDocument(document: InsertDocument): Promise<Document>;
  updateDocument(id: number, document: Partial<InsertDocument>): Promise<Document | undefined>;
  deleteDocument(id: number): Promise<boolean>;
  
  // Tutorial CRUD operations
  getTutorials(): Promise<Tutorial[]>;
  getFeaturedTutorials(): Promise<Tutorial[]>;
  getTutorial(id: number): Promise<Tutorial | undefined>;
  getTutorialBySlug(slug: string): Promise<Tutorial | undefined>;
  createTutorial(tutorial: InsertTutorial): Promise<Tutorial>;
  updateTutorial(id: number, tutorial: Partial<InsertTutorial>): Promise<Tutorial | undefined>;
  deleteTutorial(id: number): Promise<boolean>;
  searchContent(query: string): Promise<{
    services: Service[];
    documents: Document[];
    tutorials: Tutorial[];
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private services: Map<number, Service>;
  private documents: Map<number, Document>;
  private tutorials: Map<number, Tutorial>;
  
  private currentUserId: number;
  private currentServiceId: number;
  private currentDocumentId: number;
  private currentTutorialId: number;

  constructor() {
    this.users = new Map();
    this.services = new Map();
    this.documents = new Map();
    this.tutorials = new Map();
    
    this.currentUserId = 1;
    this.currentServiceId = 1;
    this.currentDocumentId = 1;
    this.currentTutorialId = 1;
    
    // Initialize with sample data
    this.initializeData();
  }

  private initializeData() {
    // Add sample services
    const sampleServices: InsertService[] = [
      {
        name: "Firewall (pfSense)",
        description: "Network security solution for managing traffic, VPNs, and network segmentation.",
        icon: "shield-alt",
        status: "Online",
        version: "2.7.0",
        ipAddress: "192.168.1.1",
        platform: "VM on Proxmox",
        configLink: "/documentation/security/pfsense-configuration",
        adminLink: "https://192.168.1.1"
      },
      {
        name: "Grafana",
        description: "Visualization and analytics platform for monitoring system performance and metrics.",
        icon: "tachometer-alt",
        status: "Online",
        version: "9.5.2",
        ipAddress: "192.168.1.10",
        platform: "Docker",
        configLink: "/documentation/monitoring/grafana-dashboards",
        adminLink: "https://192.168.1.10:3000"
      },
      {
        name: "Wireguard VPN",
        description: "Modern, secure VPN solution for remote access to the homelab network.",
        icon: "lock",
        status: "Online",
        version: "1.0.20210914",
        ipAddress: "192.168.1.5",
        platform: "Container on pfSense",
        configLink: "/documentation/security/vpn-setup",
        adminLink: "https://192.168.1.1/wireguard"
      }
    ];
    
    sampleServices.forEach(service => {
      this.createService(service);
    });
    
    // Add sample documents
    const sampleDocuments: InsertDocument[] = [
      {
        title: "Hardware Components",
        content: "# Hardware Components\n\nDetailed documentation about the hardware components used in the homelab setup...",
        category: "Server Setup",
        icon: "server",
        slug: "hardware-components"
      },
      {
        title: "Proxmox Installation",
        content: "# Proxmox Installation\n\nStep-by-step guide for installing Proxmox virtualization environment...",
        category: "Server Setup",
        icon: "server",
        slug: "proxmox-installation"
      },
      {
        title: "Network Configuration",
        content: "# Network Configuration\n\nComprehensive documentation for setting up the network infrastructure...",
        category: "Server Setup",
        icon: "server",
        slug: "network-configuration"
      },
      {
        title: "pfSense Configuration",
        content: "# pfSense Configuration\n\nDetailed guide for setting up and configuring pfSense firewall...",
        category: "Security",
        icon: "shield-alt",
        slug: "pfsense-configuration"
      },
      {
        title: "VPN Setup",
        content: "# VPN Setup\n\nStep-by-step guide for setting up a secure VPN connection...",
        category: "Security",
        icon: "shield-alt",
        slug: "vpn-setup"
      },
      {
        title: "Intrusion Detection",
        content: "# Intrusion Detection\n\nImplementation guide for setting up intrusion detection systems...",
        category: "Security",
        icon: "shield-alt",
        slug: "intrusion-detection"
      },
      {
        title: "Docker Installation",
        content: "# Docker Installation\n\nComplete guide for installing Docker and basic container management...",
        category: "Docker Containers",
        icon: "layer-group",
        slug: "docker-installation"
      },
      {
        title: "Container Orchestration",
        content: "# Container Orchestration\n\nAdvanced guide for orchestrating containers in a homelab environment...",
        category: "Docker Containers",
        icon: "layer-group",
        slug: "container-orchestration"
      },
      {
        title: "Compose Files",
        content: "# Docker Compose Files\n\nReference documentation for Docker Compose configuration files...",
        category: "Docker Containers",
        icon: "layer-group",
        slug: "compose-files"
      },
      {
        title: "Prometheus Setup",
        content: "# Prometheus Setup\n\nDetailed guide for setting up Prometheus monitoring...",
        category: "Monitoring",
        icon: "tachometer-alt",
        slug: "prometheus-setup"
      },
      {
        title: "Grafana Dashboards",
        content: "# Grafana Dashboards\n\nCreating and configuring Grafana dashboards for homelab monitoring...",
        category: "Monitoring",
        icon: "tachometer-alt",
        slug: "grafana-dashboards"
      },
      {
        title: "Alert Configuration",
        content: "# Alert Configuration\n\nSetting up alerting rules and notifications for system monitoring...",
        category: "Monitoring",
        icon: "tachometer-alt",
        slug: "alert-configuration"
      }
    ];
    
    sampleDocuments.forEach(document => {
      this.createDocument(document);
    });
    
    // Add sample tutorials
    const sampleTutorials: InsertTutorial[] = [
      {
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
        slug: "secure-docker-environment"
      },
      {
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
        slug: "wireguard-vpn-setup"
      },
      {
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
        slug: "automating-backups-restic"
      },
      {
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
        slug: "network-segmentation-vlans"
      },
      {
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
        slug: "prometheus-grafana-monitoring"
      }
    ];
    
    sampleTutorials.forEach(tutorial => {
      this.createTutorial(tutorial);
    });
  }

  // User CRUD operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Service CRUD operations
  async getServices(): Promise<Service[]> {
    return Array.from(this.services.values());
  }
  
  async getService(id: number): Promise<Service | undefined> {
    return this.services.get(id);
  }
  
  async createService(service: InsertService): Promise<Service> {
    const id = this.currentServiceId++;
    const newService: Service = { ...service, id };
    this.services.set(id, newService);
    return newService;
  }
  
  async updateService(id: number, service: Partial<InsertService>): Promise<Service | undefined> {
    const existingService = this.services.get(id);
    if (!existingService) return undefined;
    
    const updatedService = { ...existingService, ...service };
    this.services.set(id, updatedService);
    return updatedService;
  }
  
  async deleteService(id: number): Promise<boolean> {
    return this.services.delete(id);
  }
  
  // Document CRUD operations
  async getDocuments(): Promise<Document[]> {
    return Array.from(this.documents.values());
  }
  
  async getDocumentsByCategory(category: string): Promise<Document[]> {
    return Array.from(this.documents.values()).filter(
      (document) => document.category === category
    );
  }
  
  async getDocument(id: number): Promise<Document | undefined> {
    return this.documents.get(id);
  }
  
  async getDocumentBySlug(slug: string): Promise<Document | undefined> {
    return Array.from(this.documents.values()).find(
      (document) => document.slug === slug
    );
  }
  
  async createDocument(document: InsertDocument): Promise<Document> {
    const id = this.currentDocumentId++;
    const newDocument: Document = { ...document, id };
    this.documents.set(id, newDocument);
    return newDocument;
  }
  
  async updateDocument(id: number, document: Partial<InsertDocument>): Promise<Document | undefined> {
    const existingDocument = this.documents.get(id);
    if (!existingDocument) return undefined;
    
    const updatedDocument = { ...existingDocument, ...document };
    this.documents.set(id, updatedDocument);
    return updatedDocument;
  }
  
  async deleteDocument(id: number): Promise<boolean> {
    return this.documents.delete(id);
  }
  
  // Tutorial CRUD operations
  async getTutorials(): Promise<Tutorial[]> {
    return Array.from(this.tutorials.values());
  }
  
  async getFeaturedTutorials(): Promise<Tutorial[]> {
    return Array.from(this.tutorials.values()).filter(
      (tutorial) => tutorial.featured === 1
    );
  }
  
  async getTutorial(id: number): Promise<Tutorial | undefined> {
    return this.tutorials.get(id);
  }
  
  async getTutorialBySlug(slug: string): Promise<Tutorial | undefined> {
    return Array.from(this.tutorials.values()).find(
      (tutorial) => tutorial.slug === slug
    );
  }
  
  async createTutorial(tutorial: InsertTutorial): Promise<Tutorial> {
    const id = this.currentTutorialId++;
    const newTutorial: Tutorial = { 
      ...tutorial, 
      id, 
      createdAt: new Date() 
    };
    this.tutorials.set(id, newTutorial);
    return newTutorial;
  }
  
  async updateTutorial(id: number, tutorial: Partial<InsertTutorial>): Promise<Tutorial | undefined> {
    const existingTutorial = this.tutorials.get(id);
    if (!existingTutorial) return undefined;
    
    const updatedTutorial = { ...existingTutorial, ...tutorial };
    this.tutorials.set(id, updatedTutorial);
    return updatedTutorial;
  }
  
  async deleteTutorial(id: number): Promise<boolean> {
    return this.tutorials.delete(id);
  }
  
  async searchContent(query: string): Promise<{
    services: Service[];
    documents: Document[];
    tutorials: Tutorial[];
  }> {
    const q = query.toLowerCase();
    
    const services = Array.from(this.services.values()).filter(
      (service) => 
        service.name.toLowerCase().includes(q) ||
        service.description.toLowerCase().includes(q)
    );
    
    const documents = Array.from(this.documents.values()).filter(
      (document) => 
        document.title.toLowerCase().includes(q) ||
        document.content.toLowerCase().includes(q) ||
        document.category.toLowerCase().includes(q)
    );
    
    const tutorials = Array.from(this.tutorials.values()).filter(
      (tutorial) => 
        tutorial.title.toLowerCase().includes(q) ||
        tutorial.summary.toLowerCase().includes(q) ||
        tutorial.content.toLowerCase().includes(q) ||
        (tutorial.tags && tutorial.tags.some(tag => tag.toLowerCase().includes(q)))
    );
    
    return {
      services,
      documents,
      tutorials
    };
  }
}

export const storage = new MemStorage();
