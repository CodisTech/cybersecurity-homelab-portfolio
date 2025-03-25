# Cybersecurity Homelab Portfolio - Web Application

This is the web application for the cybersecurity homelab portfolio. It provides a dynamic, interactive platform for viewing documentation, tutorials, and managing services for your cybersecurity homelab.

> **Note**: This is the `web-application` branch which contains a full-featured React+Express web application for the cybersecurity homelab. The `main` branch contains the original documentation in markdown format.

## Features

- Comprehensive documentation for cybersecurity lab configuration
- Interactive tutorials with step-by-step guides
- Service status monitoring and management
- Responsive design for all devices
- Search functionality across all content

## Tech Stack

- **Frontend**: React.js with TypeScript
- **Backend**: Express.js with TypeScript
- **Styling**: TailwindCSS with ShadcnUI components
- **State Management**: React Query
- **Routing**: Wouter

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository and checkout the web-application branch
   ```bash
   git clone https://github.com/CodisTech/cybersecurity-homelab.git
   cd cybersecurity-homelab
   git checkout web-application
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
   npm run dev
   ```

## Project Structure

```
├── client/            # Frontend React application
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── contexts/   # React context providers
│   │   ├── data/       # Static data files
│   │   ├── hooks/      # Custom React hooks
│   │   ├── lib/        # Utility functions and configurations
│   │   ├── pages/      # Page components
│   │   └── App.tsx     # Main application component
├── server/            # Backend Express server
│   ├── index.ts       # Server entry point
│   ├── routes.ts      # API route definitions
│   ├── storage.ts     # Data storage layer
│   └── vite.ts        # Vite configuration
└── shared/            # Shared code between frontend and backend
    └── schema.ts      # Data schemas and types
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Based on the [CodisTech/cybersecurity-homelab](https://github.com/CodisTech/cybersecurity-homelab) repository
- Built with React, Express, and TypeScript