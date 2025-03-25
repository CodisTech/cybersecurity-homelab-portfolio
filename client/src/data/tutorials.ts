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
    id: 6,
    title: "Setting Up Authelia for Single Sign-On",
    content: "# Setting Up Authelia for Single Sign-On\n\n## Introduction\n\nAuthelia is an open-source authentication and authorization server providing single sign-on (SSO) and 2FA for your applications. This tutorial will guide you through setting up Authelia in your homelab to secure access to your services.\n\n## What You'll Learn\n\n- Installing Authelia using Docker\n- Configuring Authelia with basic authentication rules\n- Setting up 2FA (TOTP)\n- Integrating with a reverse proxy (Traefik)\n- Testing and troubleshooting\n\n## Prerequisites\n\n- Docker and Docker Compose installed\n- A reverse proxy (this tutorial uses Traefik, but the concepts apply to Nginx Proxy Manager and others)\n- HTTPS certificates (Let's Encrypt or self-signed)\n- Basic understanding of YAML configuration\n- A domain name (or local DNS setup)\n\n## Step 1: Create Directory Structure\n\nFirst, let's create the necessary directory structure for our Authelia installation:\n\n```bash\nmkdir -p ~/authelia/config\ncd ~/authelia\n```\n\n## Step 2: Create Authelia Configuration File\n\nCreate a file named `configuration.yml` in the config directory with the following content:\n\n```yaml\n# configuration.yml\n---\ntheme: dark\njwt_secret: a_very_long_random_string_change_me\ndefault_redirection_url: https://home.example.com\n\nserver:\n  host: 0.0.0.0\n  port: 9091\n  path: \"\"\n  read_buffer_size: 4096\n  write_buffer_size: 4096\n\nlog:\n  level: info\n  format: text\n  file_path: \"\"\n\ntotp:\n  issuer: homelab.local\n  period: 30\n  skew: 1\n\nauthentication_backend:\n  file:\n    path: /config/users_database.yml\n\nsession:\n  name: authelia_session\n  domain: example.com\n  secret: another_long_random_string_change_me\n  expiration: 3600  # 1 hour\n  inactivity: 300  # 5 minutes\n  remember_me_duration: 2592000  # 1 month\n\nregulation:\n  max_retries: 3\n  find_time: 120\n  ban_time: 300\n\nstorage:\n  local:\n    path: /config/db.sqlite3\n\nnotifier:\n  filesystem:\n    filename: /config/notification.txt\n```\n\nNow, create a users database file named `users_database.yml` in the config directory:\n\n```yaml\n# users_database.yml\n---\nusers:\n  admin:\n    displayname: \"Admin User\"\n    password: \"$argon2id$v=19$m=65536,t=3,p=4$xrkLyNAVb+J8JJ5fl6TjEw$P13Jg3eQpYOBjbPdFB7pugGYuCR4YnPVRO5/8Qh0LHo\"\n    email: admin@example.com\n    groups:\n      - admins\n      - users\n  user:\n    displayname: \"Regular User\"\n    password: \"$argon2id$v=19$m=65536,t=3,p=4$a9N+ZdBtKFnNGaF3x11FkA$dRsKGlkOeGJ8pDmKMhQwxwMI2nEHm/q3HDC26pjOV5I\"\n    email: user@example.com\n    groups:\n      - users\n```\n\nThis creates two users:\n- admin (password: `password1`)\n- user (password: `password2`)\n\n**Note:** In a production environment, you should generate proper password hashes using the `authelia hash-password` command.\n\n## Step 3: Create Docker Compose File\n\nCreate a `docker-compose.yml` file in the authelia directory:\n\n```yaml\nversion: '3.8'\n\nservices:\n  authelia:\n    image: authelia/authelia:latest\n    container_name: authelia\n    volumes:\n      - ./config:/config\n    ports:\n      - \"9091:9091\"\n    restart: unless-stopped\n    environment:\n      - TZ=Europe/London\n    networks:\n      - proxy\n    labels:\n      - \"traefik.enable=true\"\n      - \"traefik.http.routers.authelia.rule=Host(`auth.example.com`)\"\n      - \"traefik.http.routers.authelia.entrypoints=websecure\"\n      - \"traefik.http.routers.authelia.tls=true\"\n      - \"traefik.http.services.authelia.loadbalancer.server.port=9091\"\n\nnetworks:\n  proxy:\n    external: true  # Assumes your proxy network already exists\n```\n\n## Step 4: Configure Traefik Middleware\n\nTo integrate Authelia with Traefik, you need to create a middleware. Add the following labels to your Traefik container:\n\n```yaml\nlabels:\n  - \"traefik.http.middlewares.authelia.forwardauth.address=http://authelia:9091/api/verify?rd=https://auth.example.com\"\n  - \"traefik.http.middlewares.authelia.forwardauth.trustForwardHeader=true\"\n  - \"traefik.http.middlewares.authelia.forwardauth.authResponseHeaders=Remote-User,Remote-Groups,Remote-Name,Remote-Email\"\n```\n\n## Step 5: Secure Your Services\n\nNow you can secure any service by adding Authelia middleware to the service's labels. For example, to secure Grafana:\n\n```yaml\nlabels:\n  - \"traefik.enable=true\"\n  - \"traefik.http.routers.grafana.rule=Host(`grafana.example.com`)\"\n  - \"traefik.http.routers.grafana.entrypoints=websecure\"\n  - \"traefik.http.routers.grafana.tls=true\"\n  - \"traefik.http.routers.grafana.middlewares=authelia@docker\"\n```\n\n## Step 6: Start Authelia\n\nStart the Authelia container:\n\n```bash\ndocker-compose up -d\n```\n\n## Step 7: Access and Test\n\nAccess your Authelia instance at `https://auth.example.com`. You should see the login screen.\n\n1. Log in with the admin user\n2. You can set up TOTP 2FA by clicking on your username in the top-right corner\n3. Try accessing a protected service (like Grafana), and you should be redirected to authenticate through Authelia\n\n## Step 8: Access Control Rules\n\nTo create more advanced access control rules, add an `access_control` section to your `configuration.yml`:\n\n```yaml\naccess_control:\n  default_policy: deny\n  rules:\n    # Public endpoints\n    - domain: public.example.com\n      policy: bypass\n\n    # Admin services that require 2FA\n    - domain: \n        - admin.example.com\n        - grafana.example.com\n      policy: two_factor\n      subject:\n        - \"group:admins\"\n\n    # User services that require just password\n    - domain:\n        - \"*.example.com\"\n      policy: one_factor\n      subject:\n        - \"group:users\"\n```\n\n## Troubleshooting\n\n### Common Issues\n\n1. **Login Fails**\n   - Check the Authelia logs with `docker logs authelia`\n   - Verify the user database format and password hashes\n\n2. **Middleware Not Working**\n   - Verify that the Traefik labels are correct\n   - Check that the services are on the same Docker network\n   - Ensure the `rd=` parameter in the forwardauth URL points to your actual Authelia domain\n\n3. **Session Problems**\n   - Make sure the domain in the session configuration matches your actual domain\n   - Verify that cookies are being set correctly\n\n## Security Considerations\n\n1. **Use Strong Secrets**\n   - Replace all placeholder secrets with strong random strings\n   - Use a password manager to generate and store these secrets\n\n2. **Backup Configuration**\n   - Regularly backup your Authelia configuration including the users database\n   - Store backups securely\n\n3. **Updates**\n   - Keep Authelia updated to the latest version\n   - Check for security advisories\n\n## Next Steps\n\n1. Configure email notifications instead of filesystem notifier\n2. Set up LDAP authentication for centralized user management\n3. Implement U2F/WebAuthn for more secure 2FA\n4. Create more granular access control rules",
    summary: "Set up Authelia to provide single sign-on (SSO) and 2FA for your homelab services.",
    prerequisites: ["Docker and Docker Compose", "Reverse proxy (Traefik, Nginx, etc.)", "HTTPS certificates", "Domain name (or local DNS)"],
    codeSnippets: [{
      language: "yaml",
      code: "# Authelia docker-compose.yml\nversion: '3.8'\n\nservices:\n  authelia:\n    image: authelia/authelia:latest\n    container_name: authelia\n    volumes:\n      - ./config:/config\n    ports:\n      - \"9091:9091\"\n    restart: unless-stopped\n    environment:\n      - TZ=Europe/London\n    networks:\n      - proxy\n    labels:\n      - \"traefik.enable=true\"\n      - \"traefik.http.routers.authelia.rule=Host(`auth.example.com`)\"\n      - \"traefik.http.routers.authelia.entrypoints=websecure\"\n      - \"traefik.http.routers.authelia.tls=true\"\n      - \"traefik.http.services.authelia.loadbalancer.server.port=9091\"\n\nnetworks:\n  proxy:\n    external: true  # Assumes your proxy network already exists"
    },
    {
      language: "yaml",
      code: "# configuration.yml\n---\ntheme: dark\njwt_secret: a_very_long_random_string_change_me\ndefault_redirection_url: https://home.example.com\n\nserver:\n  host: 0.0.0.0\n  port: 9091\n\nauthentication_backend:\n  file:\n    path: /config/users_database.yml\n\nsession:\n  name: authelia_session\n  domain: example.com\n  secret: another_long_random_string_change_me\n  expiration: 3600  # 1 hour\n\naccess_control:\n  default_policy: deny\n  rules:\n    # Public endpoints\n    - domain: public.example.com\n      policy: bypass\n\n    # Admin services that require 2FA\n    - domain: \n        - admin.example.com\n        - grafana.example.com\n      policy: two_factor\n      subject:\n        - \"group:admins\"\n\n    # User services that require just password\n    - domain:\n        - \"*.example.com\"\n      policy: one_factor\n      subject:\n        - \"group:users\""
    }],
    tags: ["Security", "Docker", "Authentication", "Single Sign-On"],
    readTime: 25,
    featured: 0,
    slug: "authelia-single-sign-on",
    createdAt: new Date('2023-06-05')
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
