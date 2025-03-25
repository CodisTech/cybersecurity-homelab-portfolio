import { Link } from "wouter";

const Footer = () => {
  return (
    <footer className="bg-surface border-t border-gray-800 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex items-center">
            <i className="fas fa-server text-primary text-xl mr-2"></i>
            <div className="text-lg font-semibold text-text-primary">Homelab GitHub</div>
          </div>
          <div className="mt-8 md:mt-0">
            <div className="flex space-x-6">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <i className="fab fa-github text-xl"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <i className="fab fa-twitter text-xl"></i>
              </a>
              <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <i className="fab fa-discord text-xl"></i>
              </a>
              <a href="https://reddit.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <i className="fab fa-reddit text-xl"></i>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-800 pt-8 md:flex md:items-center md:justify-between">
          <div className="text-base text-text-secondary">
            &copy; {new Date().getFullYear()} Homelab GitHub. All rights reserved.
          </div>
          <div className="mt-4 md:mt-0">
            <Link href="/privacy">
              <div className="text-sm text-text-secondary hover:text-white mr-4 inline-block cursor-pointer">Privacy Policy</div>
            </Link>
            <Link href="/terms">
              <div className="text-sm text-text-secondary hover:text-white inline-block cursor-pointer">Terms of Use</div>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
