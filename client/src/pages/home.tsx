import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import Breadcrumb from "@/components/layout/breadcrumb";
import NetworkDiagram from "@/components/home/network-diagram";
import ServiceCard from "@/components/home/service-card";
import StatCard from "@/components/home/stat-card";
import TutorialCard from "@/components/tutorials/tutorial-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Service, Tutorial } from "@shared/schema";

const Home = () => {
  const { data: services, isLoading: isLoadingServices } = useQuery({
    queryKey: ['/api/services'],
  });

  const { data: featuredTutorials, isLoading: isLoadingTutorials } = useQuery({
    queryKey: ['/api/tutorials/featured'],
  });

  return (
    <>
      <Breadcrumb 
        items={[
          { label: "Overview", href: "/", active: true }
        ]} 
      />

      <section id="overview" className="mb-12">
        <h1 className="text-3xl font-bold text-text-primary mb-6">Homelab Overview</h1>
        
        <Card className="bg-surface rounded-lg shadow-lg mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row">
              <div className="lg:w-2/3 pr-0 lg:pr-8">
                <p className="text-text-primary mb-4">
                  Welcome to my homelab documentation and resource repository. This site contains detailed information about my homelab setup, including network configurations, services, and step-by-step tutorials for various implementations.
                </p>
                <p className="text-text-secondary mb-4">
                  A homelab is a personal laboratory at home that typically consists of servers, networking equipment, and storage devices used for experimenting, learning, and hosting services. This repository aims to document my setup, share knowledge, and serve as a reference for future modifications.
                </p>
                <div className="flex flex-wrap gap-2 mt-6">
                  <Link href="/documentation">
                    <Button className="inline-flex items-center">
                      <i className="fas fa-book mr-2"></i> Documentation
                    </Button>
                  </Link>
                  <Link href="/services">
                    <Button variant="outline" className="inline-flex items-center">
                      <i className="fas fa-layer-group mr-2"></i> Services
                    </Button>
                  </Link>
                  <Link href="/#network">
                    <Button variant="outline" className="inline-flex items-center">
                      <i className="fas fa-network-wired mr-2"></i> Network
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="lg:w-1/3 mt-6 lg:mt-0">
                <div className="bg-background p-4 rounded-lg border border-gray-800">
                  <h3 className="text-lg font-medium text-text-primary mb-3">System Status</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-text-secondary">Services</span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <span className="h-2 w-2 mr-1 bg-green-400 rounded-full"></span>
                        18/20 Online
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-text-secondary">Security</span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <span className="h-2 w-2 mr-1 bg-green-400 rounded-full"></span>
                        Secured
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-text-secondary">Network</span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <span className="h-2 w-2 mr-1 bg-green-400 rounded-full"></span>
                        Connected
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-text-secondary">System Load</span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <span className="h-2 w-2 mr-1 bg-yellow-400 rounded-full"></span>
                        65%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="bg-surface rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-text-primary mb-4">Network Diagram</h2>
          <NetworkDiagram />
          <div className="mt-4 text-sm text-text-secondary">
            <p>Click on network elements to see detailed information and configuration. The diagram is interactive and can be zoomed and panned.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="Active Servers" 
            value="4" 
            icon="server" 
            color="primary" 
            borderColor="primary" 
          />
          <StatCard 
            title="Docker Containers" 
            value="24" 
            icon="docker" 
            color="secondary" 
            borderColor="secondary" 
          />
          <StatCard 
            title="Security Services" 
            value="5" 
            icon="shield-alt" 
            color="accent" 
            borderColor="accent" 
          />
          <StatCard 
            title="Storage" 
            value="16 TB" 
            icon="database" 
            color="gray" 
            borderColor="gray-500" 
          />
        </div>
      </section>

      <section id="services" className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-6">Services Catalog</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoadingServices ? (
            <>
              <Card className="bg-surface rounded-lg shadow-lg overflow-hidden border border-gray-800 h-64 animate-pulse" />
              <Card className="bg-surface rounded-lg shadow-lg overflow-hidden border border-gray-800 h-64 animate-pulse" />
              <Card className="bg-surface rounded-lg shadow-lg overflow-hidden border border-gray-800 h-64 animate-pulse" />
            </>
          ) : (
            Array.isArray(services) && services.length > 0 ? (
              services.map((service: Service) => (
                <ServiceCard key={service.id} service={service} />
              ))
            ) : (
              <Card className="bg-surface rounded-lg shadow-lg overflow-hidden border border-gray-800 p-4">
                <p className="text-center text-gray-400">No services available</p>
              </Card>
            )
          )}
        </div>

        <div className="mt-6 text-center">
          <Link href="/services">
            <Button variant="outline" className="px-4 py-2">
              View All Services ({isLoadingServices ? '...' : Array.isArray(services) ? services.length : 0})
            </Button>
          </Link>
        </div>
      </section>

      <section id="featured-tutorial" className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-6">Featured Tutorial</h2>
        
        {isLoadingTutorials ? (
          <Card className="bg-surface rounded-lg shadow-lg overflow-hidden border border-gray-800 h-96 animate-pulse" />
        ) : (
          Array.isArray(featuredTutorials) && featuredTutorials.length > 0 ? (
            featuredTutorials.map((tutorial: Tutorial) => (
              <div key={tutorial.id}>
                <TutorialCard tutorial={tutorial} featured={true} />
              </div>
            ))
          ) : (
            <Card className="bg-surface rounded-lg shadow-lg overflow-hidden border border-gray-800 p-4">
              <p className="text-center text-gray-400">No featured tutorials available</p>
            </Card>
          )
        )}
      </section>
    </>
  );
};

export default Home;
