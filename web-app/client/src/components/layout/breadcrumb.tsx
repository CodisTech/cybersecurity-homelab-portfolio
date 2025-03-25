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
            <div className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-white cursor-pointer">
              <i className="fas fa-home mr-2"></i>
              Home
            </div>
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
                  <div className="text-sm font-medium text-gray-400 hover:text-white cursor-pointer">
                    {item.label}
                  </div>
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
