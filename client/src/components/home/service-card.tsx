import { Link } from "wouter";
import { getStatusColor, getStatusDot } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Service } from "@shared/schema";

interface ServiceCardProps {
  service: Service;
}

const ServiceCard = ({ service }: ServiceCardProps) => {
  const {
    name,
    description,
    icon,
    status,
    version,
    ipAddress,
    platform,
    configLink,
    adminLink,
  } = service;

  const statusColorClass = getStatusColor(status);
  const statusDotClass = getStatusDot(status);

  return (
    <Card className="bg-surface rounded-lg shadow-lg overflow-hidden border border-gray-800 flex flex-col">
      <CardHeader className="p-4 bg-surface border-b border-gray-800 flex justify-between items-center">
        <div className="flex items-center">
          <i className={`fas fa-${icon} text-primary mr-2`}></i>
          <h3 className="text-lg font-medium text-text-primary">{name}</h3>
        </div>
        <Badge className={statusColorClass}>
          <span className={`h-2 w-2 mr-1 ${statusDotClass} rounded-full`}></span>
          {status}
        </Badge>
      </CardHeader>
      <CardContent className="p-4 flex-1">
        <p className="text-text-secondary text-sm mb-4">{description}</p>
        {version && (
          <div className="mb-2">
            <span className="text-xs font-medium text-gray-400">Version:</span>
            <span className="text-xs text-white ml-1">{version}</span>
          </div>
        )}
        {ipAddress && (
          <div className="mb-2">
            <span className="text-xs font-medium text-gray-400">IP Address:</span>
            <span className="text-xs text-white ml-1">{ipAddress}</span>
          </div>
        )}
        {platform && (
          <div className="mb-2">
            <span className="text-xs font-medium text-gray-400">Platform:</span>
            <span className="text-xs text-white ml-1">{platform}</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 bg-background flex justify-between">
        {configLink && (
          <Link href={configLink}>
            <a className="text-xs text-primary hover:underline">Configuration Guide</a>
          </Link>
        )}
        {adminLink && (
          <a
            href={adminLink}
            target="_blank"
            rel="noopener noreferrer" 
            className="inline-flex items-center text-xs px-2 py-1 border border-gray-700 rounded hover:bg-gray-700"
          >
            <i className="fas fa-external-link-alt mr-1"></i>
            Admin Panel
          </a>
        )}
      </CardFooter>
    </Card>
  );
};

export default ServiceCard;
