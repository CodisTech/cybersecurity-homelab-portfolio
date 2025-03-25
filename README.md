# Cybersecurity Homelab Portfolio Website

A dynamic web application to showcase my cybersecurity homelab, providing interactive documentation and tutorials for cybersecurity enthusiasts and professionals. This portfolio website serves as the frontend to my [cybersecurity-homelab](https://github.com/CodisTech/cybersecurity-homelab) project.

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

1. Clone the repository
   ```bash
   git clone https://github.com/CodisTech/cybersecurity-homelab-portfolio.git
   cd cybersecurity-homelab-portfolio
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