import { useQuery } from "@tanstack/react-query";
import { Tutorial } from "@shared/schema";
import Breadcrumb from "@/components/layout/breadcrumb";
import TutorialCard from "@/components/tutorials/tutorial-card";

const Tutorials = () => {
  const { data: tutorials, isLoading } = useQuery({
    queryKey: ['/api/tutorials'],
  });
  
  const { data: featuredTutorials, isLoading: isLoadingFeatured } = useQuery({
    queryKey: ['/api/tutorials/featured'],
  });

  return (
    <>
      <Breadcrumb 
        items={[
          { label: "Tutorials", href: "/tutorials", active: true }
        ]} 
      />

      <section id="tutorials" className="mb-12">
        <h1 className="text-3xl font-bold text-text-primary mb-6">Tutorials</h1>
        
        <p className="text-text-secondary mb-6">
          This section contains step-by-step tutorials for setting up various services and configurations in a homelab environment. 
          Each tutorial includes prerequisites, code examples, and detailed instructions.
        </p>
        
        {/* Featured Tutorial */}
        {isLoadingFeatured ? (
          <div className="bg-surface rounded-lg shadow-lg overflow-hidden border border-gray-800 h-96 animate-pulse mb-8" />
        ) : (
          featuredTutorials?.map((tutorial: Tutorial) => (
            <TutorialCard key={tutorial.id} tutorial={tutorial} featured={true} />
          ))
        )}
        
        {/* Recent Tutorials */}
        <h2 className="text-xl font-semibold text-text-primary mb-4">All Tutorials</h2>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-surface rounded-lg shadow-lg p-4 border border-gray-800 h-36 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {tutorials?.filter((t: Tutorial) => t.featured !== 1).map((tutorial: Tutorial) => (
              <TutorialCard key={tutorial.id} tutorial={tutorial} />
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default Tutorials;
