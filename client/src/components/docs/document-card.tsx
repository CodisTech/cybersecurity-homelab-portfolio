import { Link } from "wouter";
import { Document } from "@shared/schema";

interface DocumentCardProps {
  category: string;
  icon: string;
  documents: Document[];
}

const DocumentCard = ({ category, icon, documents }: DocumentCardProps) => {
  return (
    <div className="border border-gray-800 rounded-lg p-4 hover:bg-gray-800 transition-colors duration-200">
      <div className="flex items-start">
        <div className="flex-shrink-0 mt-1">
          <i className={`fas fa-${icon} text-primary`}></i>
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-medium text-text-primary">{category}</h3>
          <p className="mt-1 text-sm text-text-secondary">
            {documents.length > 0 ? (
              `Complete guides for ${category.toLowerCase()} configuration and management.`
            ) : (
              `No documentation available for ${category.toLowerCase()} yet.`
            )}
          </p>
          <ul className="mt-3 text-sm text-text-secondary space-y-1">
            {documents.map((doc) => (
              <li key={doc.id} className="flex items-center">
                <i className="fas fa-file-alt text-xs mr-2 text-gray-500"></i>
                <Link href={`/documentation#${doc.slug}`}>
                  <a className="text-primary hover:underline">{doc.title}</a>
                </Link>
              </li>
            ))}
            {documents.length === 0 && (
              <li className="flex items-center">
                <i className="fas fa-info-circle text-xs mr-2 text-gray-500"></i>
                <span className="text-gray-400">Coming soon</span>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;
