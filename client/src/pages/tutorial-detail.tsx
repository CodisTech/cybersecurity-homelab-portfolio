import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useRoute, Link } from "wouter";
import { formatDate } from "@/lib/utils";
import { Code } from "@/components/ui/code";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Breadcrumb from "@/components/layout/breadcrumb";

const TutorialDetail = () => {
  const [match, params] = useRoute<{ slug: string }>("/tutorials/:slug");
  
  const { data: tutorial, isLoading, error } = useQuery({
    queryKey: [`/api/tutorials/slug/${params?.slug}`],
    enabled: !!params?.slug,
  });
  
  useEffect(() => {
    // Load FontAwesome
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
    document.head.appendChild(link);
    
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-6 bg-surface rounded w-1/4"></div>
        <div className="h-10 bg-surface rounded w-3/4"></div>
        <div className="h-4 bg-surface rounded w-full"></div>
        <div className="h-4 bg-surface rounded w-full"></div>
        <div className="h-4 bg-surface rounded w-3/4"></div>
        <div className="h-64 bg-surface rounded w-full"></div>
      </div>
    );
  }

  if (error || !tutorial) {
    return (
      <Card className="bg-surface p-6">
        <CardContent>
          <div className="text-center py-8">
            <i className="fas fa-exclamation-triangle text-4xl text-red-500 mb-4"></i>
            <h2 className="text-2xl font-bold mb-2">Tutorial Not Found</h2>
            <p className="text-text-secondary mb-4">
              Sorry, the tutorial you're looking for doesn't exist or has been moved.
            </p>
            <Link href="/tutorials">
              <a className="text-primary hover:underline">Return to Tutorials</a>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Breadcrumb 
        items={[
          { label: "Tutorials", href: "/tutorials" },
          { label: tutorial.title, href: `/tutorials/${tutorial.slug}`, active: true }
        ]} 
      />

      <article className="prose prose-invert max-w-none">
        <header className="mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {tutorial.featured === 1 && (
              <Badge className="bg-primary bg-opacity-20 text-primary">Featured</Badge>
            )}
            {tutorial.tags?.map((tag, index) => (
              <Badge key={index} variant="outline">{tag}</Badge>
            ))}
          </div>
          
          <h1 className="text-3xl font-bold text-text-primary mb-4">{tutorial.title}</h1>
          
          <div className="flex flex-wrap items-center text-text-secondary text-sm gap-4 mb-4">
            <div className="flex items-center">
              <i className="fas fa-calendar-alt mr-1"></i>
              <span>{formatDate(tutorial.createdAt)}</span>
            </div>
            {tutorial.readTime && (
              <div className="flex items-center">
                <i className="fas fa-clock mr-1"></i>
                <span>{tutorial.readTime} min read</span>
              </div>
            )}
          </div>
          
          <p className="text-lg text-text-secondary">{tutorial.summary}</p>
        </header>
        
        {tutorial.prerequisites && tutorial.prerequisites.length > 0 && (
          <section className="mb-8">
            <Card className="bg-background border border-gray-800">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Prerequisites</h2>
                <ul className="list-disc pl-5 space-y-2">
                  {tutorial.prerequisites.map((prerequisite, index) => (
                    <li key={index}>{prerequisite}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </section>
        )}
        
        <section className="tutorial-content mb-8">
          {/* This is a simplified markdown rendering */}
          {tutorial.content.split('\n').map((line, index) => {
            if (line.startsWith('# ')) {
              return <h1 key={index} className="text-3xl font-bold mt-8 mb-4">{line.substring(2)}</h1>;
            } else if (line.startsWith('## ')) {
              return <h2 key={index} className="text-2xl font-bold mt-6 mb-3">{line.substring(3)}</h2>;
            } else if (line.startsWith('### ')) {
              return <h3 key={index} className="text-xl font-bold mt-5 mb-2">{line.substring(4)}</h3>;
            } else {
              return <p key={index} className="my-4">{line}</p>;
            }
          })}
        </section>
        
        {tutorial.codeSnippets && tutorial.codeSnippets.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Code Examples</h2>
            {tutorial.codeSnippets.map((snippet, index) => (
              <div key={index} className="mb-6">
                <Code language={snippet.language} code={snippet.code} />
              </div>
            ))}
          </section>
        )}
        
        <footer className="mt-12 pt-6 border-t border-gray-800">
          <div className="flex flex-wrap justify-between items-center">
            <div className="text-text-secondary">
              <h3 className="text-lg font-medium mb-2">Related Topics</h3>
              <div className="flex flex-wrap gap-2">
                {tutorial.tags?.map((tag, index) => (
                  <Badge key={index} variant="outline" className="cursor-pointer">{tag}</Badge>
                ))}
              </div>
            </div>
            
            <Link href="/tutorials">
              <a className="text-primary hover:underline mt-4 md:mt-0">
                <i className="fas fa-arrow-left mr-1"></i> Back to Tutorials
              </a>
            </Link>
          </div>
        </footer>
      </article>
    </>
  );
};

export default TutorialDetail;
