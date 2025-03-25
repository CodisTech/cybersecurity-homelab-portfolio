import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Document } from "@shared/schema";
import Breadcrumb from "@/components/layout/breadcrumb";
import DocumentCard from "@/components/docs/document-card";
import { Card, CardContent } from "@/components/ui/card";
import { Code } from "@/components/ui/code";

const Documentation = () => {
  const { data: documents, isLoading } = useQuery({
    queryKey: ['/api/documents'],
  });

  const [activeDocument, setActiveDocument] = useState<Document | null>(null);
  const [categories, setCategories] = useState<{[key: string]: Document[]}>({});

  useEffect(() => {
    if (documents) {
      // Group documents by category
      const grouped = documents.reduce((acc: {[key: string]: Document[]}, doc: Document) => {
        if (!acc[doc.category]) {
          acc[doc.category] = [];
        }
        acc[doc.category].push(doc);
        return acc;
      }, {});
      
      setCategories(grouped);
      
      // Check URL hash for specific document
      const checkHash = () => {
        const hash = window.location.hash.substring(1);
        if (hash) {
          const doc = documents.find((d: Document) => d.slug === hash);
          if (doc) {
            setActiveDocument(doc);
            // Scroll to the document section
            setTimeout(() => {
              const element = document.getElementById(hash);
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }, 100);
          }
        } else {
          setActiveDocument(null);
        }
      };
      
      // Check hash on load
      checkHash();
      
      // Add event listener for hash changes
      window.addEventListener('hashchange', checkHash);
      
      // Clean up event listener
      return () => {
        window.removeEventListener('hashchange', checkHash);
      };
    }
  }, [documents]);

  // Get icon for each category
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Server Setup':
        return 'server';
      case 'Security':
        return 'shield-alt';
      case 'Docker Containers':
        return 'layer-group';
      case 'Monitoring':
        return 'tachometer-alt';
      default:
        return 'file-alt';
    }
  };

  return (
    <>
      <Breadcrumb 
        items={[
          { label: "Documentation", href: "/documentation", active: true }
        ]} 
      />

      <section id="documentation" className="mb-12">
        <h1 className="text-3xl font-bold text-text-primary mb-6">Documentation</h1>
        
        <Card className="bg-surface rounded-lg shadow-lg overflow-hidden mb-8">
          <CardContent className="p-6">
            <p className="text-text-secondary mb-6">
              This section contains detailed documentation for all aspects of the homelab. Click on a category below to explore the available documentation.
            </p>
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-800 rounded-lg p-4 h-48 animate-pulse" />
                <div className="border border-gray-800 rounded-lg p-4 h-48 animate-pulse" />
                <div className="border border-gray-800 rounded-lg p-4 h-48 animate-pulse" />
                <div className="border border-gray-800 rounded-lg p-4 h-48 animate-pulse" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(categories).map(([category, docs]) => (
                  <DocumentCard 
                    key={category}
                    category={category}
                    icon={getCategoryIcon(category)}
                    documents={docs}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {activeDocument && (
          <div id={activeDocument.slug} className="bg-surface rounded-lg shadow-lg p-6">
            <div className="prose prose-invert max-w-none">
              <h2 className="text-2xl font-bold text-text-primary mb-4">{activeDocument.title}</h2>
              <div className="markdown-content">
                {activeDocument.content.split('\n').map((line, index) => {
                  if (line.startsWith('# ')) {
                    return <h1 key={index} className="text-2xl font-bold mt-6 mb-4">{line.substring(2)}</h1>;
                  } else if (line.startsWith('## ')) {
                    return <h2 key={index} className="text-xl font-bold mt-5 mb-3">{line.substring(3)}</h2>;
                  } else if (line.startsWith('### ')) {
                    return <h3 key={index} className="text-lg font-bold mt-4 mb-2">{line.substring(4)}</h3>;
                  } else if (line.startsWith('```')) {
                    // Code block handling would be more complex in real implementation
                    return <Code key={index} language="bash" code="# Sample code block" />;
                  } else {
                    return <p key={index} className="my-2">{line}</p>;
                  }
                })}
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default Documentation;
