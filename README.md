# Cybersecurity Homelab Portfolio

A dynamic cybersecurity homelab portfolio and learning platform that provides interactive, user-friendly documentation and tutorials for cybersecurity enthusiasts and professionals.

![Cybersecurity Homelab](generated-icon.png)

## Features

- **Interactive Documentation**: Comprehensive guides for setting up and configuring various security tools and services.
- **Service Directory**: Quick access to all services running in the homelab environment.
- **Tutorial System**: Step-by-step tutorials for learning cybersecurity concepts and implementations.
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices.
- **Search Functionality**: Find specific documentation, tutorials, or services quickly.

## Tech Stack

- **Frontend**: React.js with Vite
- **UI Framework**: Tailwind CSS with Shadcn components
- **State Management**: React Context API and TanStack Query
- **Routing**: Wouter
- **Backend**: Express.js
- **Deployment**: GitHub Pages

## Live Demo

Visit the live version of this portfolio at [https://username.github.io/cybersecurity-homelab-portfolio](https://username.github.io/cybersecurity-homelab-portfolio) (replace 'username' with your GitHub username).

## Getting Started

### Prerequisites

- Node.js (v20 or later)
- npm (v9 or later)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/CodisTech/cybersecurity-homelab-portfolio.git
   cd cybersecurity-homelab-portfolio
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5000`

### Deployment

This project is configured to deploy automatically to GitHub Pages using GitHub Actions.

1. Fork or push this repository to your GitHub account.

2. Go to your repository's Settings > Pages.

3. Under "Build and deployment", select "GitHub Actions" as the source.

4. The site will be deployed automatically when you push to the `main` branch or when you manually trigger the workflow from the Actions tab.

5. If you want to use a custom domain:
   - Add your domain to the `client/public/CNAME` file
   - Configure your DNS settings to point to GitHub Pages
   - Enable the custom domain in your repository's Settings > Pages

## Project Structure

- `client/` - Frontend React application
  - `src/components/` - Reusable UI components
  - `src/pages/` - Page components
  - `src/contexts/` - React context providers
  - `src/hooks/` - Custom React hooks
  - `src/data/` - Static data and mock data
  - `src/lib/` - Utility functions and API client
- `server/` - Backend Express server
  - `routes.ts` - API route definitions
  - `storage.ts` - Data storage interface
- `shared/` - Shared types and schemas

## Documentation

The project includes documentation for various cybersecurity tools and services, including:

- Network Infrastructure Setup
- Firewall Configuration (pfSense)
- VLAN Segmentation
- Docker Environment Setup
- Reverse Proxy Configuration
- Authentication Services
- Monitoring and Logging
- Backup Solutions

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by [CodisTech/cybersecurity-homelab](https://github.com/CodisTech/cybersecurity-homelab)
- Built with [Shadcn UI](https://ui.shadcn.com/)
- Icons from [Lucide React](https://lucide.dev/)