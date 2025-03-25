import { useQuery } from "@tanstack/react-query";
import { Service } from "@shared/schema";
import Breadcrumb from "@/components/layout/breadcrumb";
import ServiceCard from "@/components/home/service-card";

const Services = () => {
  const { data: services, isLoading } = useQuery({
    queryKey: ['/api/services'],
  });

  return (
    <>
      <Breadcrumb 
        items={[
          { label: "Services", href: "/services", active: true }
        ]} 
      />

      <section id="services" className="mb-12">
        <h1 className="text-3xl font-bold text-text-primary mb-6">Services Catalog</h1>
        
        <p className="text-text-secondary mb-6">
          This page lists all the services running in the homelab environment. Each service card provides basic information, status, and links to documentation and administration interfaces.
        </p>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-surface rounded-lg shadow-lg overflow-hidden border border-gray-800 h-64 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services?.map((service: Service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default Services;
