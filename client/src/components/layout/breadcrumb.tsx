import { Link } from "wouter";

interface BreadcrumbItem {
  label: string;
  href: string;
  active?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb = ({ items }: BreadcrumbProps) => {
  return (
    <nav className="flex mb-8" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <Link href="/">
            <a className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-white">
              <i className="fas fa-home mr-2"></i>
              Home
            </a>
          </Link>
        </li>
        
        {items.map((item, index) => (
          <li key={index}>
            <div className="flex items-center">
              <i className="fas fa-chevron-right text-gray-500 mx-2 text-xs"></i>
              {item.active ? (
                <span className="text-sm font-medium text-primary">{item.label}</span>
              ) : (
                <Link href={item.href}>
                  <a className="text-sm font-medium text-gray-400 hover:text-white">
                    {item.label}
                  </a>
                </Link>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
