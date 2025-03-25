import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

const Sidebar = () => {
  const [location] = useLocation();

  const isLinkActive = (href: string) => {
    return location === href;
  };

  const getLinkClass = (href: string) => {
    return cn(
      "flex items-center px-3 py-2 text-sm font-medium rounded-md",
      isLinkActive(href)
        ? "bg-gray-900 text-white"
        : "text-gray-300 hover:bg-gray-700 hover:text-white"
    );
  };

  return (
    <aside className="w-full md:w-64 md:flex-shrink-0 border-r border-gray-800 bg-surface md:h-screen md:sticky md:top-16">
      <div className="p-4">
        <nav className="space-y-1">
          <div className="py-2">
            <h3 className="font-medium text-sm text-text-secondary uppercase tracking-wider">Main</h3>
            <div className="mt-2 space-y-1">
              <Link href="/">
                <a className={getLinkClass("/")}>
                  <i className="fas fa-home w-5 h-5 mr-2"></i>
                  Overview
                </a>
              </Link>
              <Link href="/documentation">
                <a className={getLinkClass("/documentation")}>
                  <i className="fas fa-book w-5 h-5 mr-2"></i>
                  Documentation
                </a>
              </Link>
              <Link href="/services">
                <a className={getLinkClass("/services")}>
                  <i className="fas fa-layer-group w-5 h-5 mr-2"></i>
                  Services
                </a>
              </Link>
              <Link href="/tutorials">
                <a className={getLinkClass("/tutorials")}>
                  <i className="fas fa-graduation-cap w-5 h-5 mr-2"></i>
                  Tutorials
                </a>
              </Link>
            </div>
          </div>
          
          <div className="py-2">
            <h3 className="font-medium text-sm text-text-secondary uppercase tracking-wider">Infrastructure</h3>
            <div className="mt-2 space-y-1">
              <a href="#network" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white">
                <i className="fas fa-network-wired w-5 h-5 mr-2"></i>
                Network
              </a>
              <a href="#hardware" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white">
                <i className="fas fa-microchip w-5 h-5 mr-2"></i>
                Hardware
              </a>
              <a href="#virtualization" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white">
                <i className="fas fa-cubes w-5 h-5 mr-2"></i>
                Virtualization
              </a>
            </div>
          </div>
          
          <div className="py-2">
            <h3 className="font-medium text-sm text-text-secondary uppercase tracking-wider">Security</h3>
            <div className="mt-2 space-y-1">
              <a href="#firewalls" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white">
                <i className="fas fa-shield-alt w-5 h-5 mr-2"></i>
                Firewalls
              </a>
              <a href="#vpn" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white">
                <i className="fas fa-lock w-5 h-5 mr-2"></i>
                VPN
              </a>
              <a href="#monitoring" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white">
                <i className="fas fa-chart-line w-5 h-5 mr-2"></i>
                Monitoring
              </a>
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
