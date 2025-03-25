import { Link } from "wouter";
import { formatDate } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tutorial } from "@shared/schema";
import { ReactNode } from "react";

// Define the expected types for prerequisites and codeSnippets
type CodeSnippet = {
  language: string;
  code: string;
};

interface TutorialCardProps {
  tutorial: Tutorial;
  featured?: boolean;
}

const TutorialCard = ({ tutorial, featured = false }: TutorialCardProps) => {
  const {
    title,
    summary,
    slug,
    tags,
    readTime,
    createdAt,
    prerequisites,
    codeSnippets
  } = tutorial;

  // Helper function to safely render prerequisites
  const renderPrerequisites = (): ReactNode => {
    if (!prerequisites || !Array.isArray(prerequisites) || prerequisites.length === 0) {
      return null;
    }

    return (
      <div className="bg-background rounded p-4 mb-4">
        <h4 className="text-md font-medium text-text-primary mb-2">Prerequisites</h4>
        <ul className="list-disc pl-5 text-sm text-text-secondary space-y-1">
          {(prerequisites as string[]).map((prerequisite: string, index: number) => (
            <li key={index}>{prerequisite}</li>
          ))}
        </ul>
      </div>
    );
  };

  // Helper function to safely render code snippets
  const renderCodeSnippet = (): ReactNode => {
    if (!codeSnippets || !Array.isArray(codeSnippets) || codeSnippets.length === 0) {
      return null;
    }

    const snippet = codeSnippets[0] as CodeSnippet;
    return (
      <>
        <h4 className="text-md font-medium text-text-primary mb-2">Code Snippet Example:</h4>
        <div className="code-block mb-4 font-mono text-sm bg-[#1e242c] rounded-md p-4 overflow-x-auto">
          <pre><code className={`language-${snippet.language}`}>{snippet.code}</code></pre>
        </div>
      </>
    );
  };

  if (featured) {
    return (
      <Card className="bg-surface rounded-lg shadow-lg overflow-hidden border border-gray-800 mb-6">
        <CardContent className="p-6">
          <div className="flex items-center mb-4">
            <Badge className="bg-primary bg-opacity-20 text-primary mr-2">Featured</Badge>
            <h3 className="text-xl font-semibold text-text-primary">{title}</h3>
          </div>
          
          <p className="text-text-secondary mb-4">{summary}</p>
          
          {renderPrerequisites()}
          {renderCodeSnippet()}
          
          <div className="flex justify-between items-center">
            <div className="flex items-center text-sm text-text-secondary">
              <i className="fas fa-clock mr-1"></i> {readTime} min read
              <span className="mx-2">•</span>
              <i className="fas fa-tag mr-1"></i> {tags?.join(', ')}
            </div>
            
            <Link href={`/tutorials/${slug}`}>
              <div className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary cursor-pointer">
                Read Tutorial <i className="fas fa-arrow-right ml-1"></i>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-surface rounded-lg shadow-lg p-4 border border-gray-800">
      <h4 className="text-lg font-medium text-text-primary mb-2">{title}</h4>
      <p className="text-sm text-text-secondary mb-3">{summary}</p>
      <div className="flex justify-between items-center">
        <div className="text-xs text-text-secondary">
          <i className="fas fa-calendar-alt mr-1"></i> {formatDate(createdAt)}
        </div>
        <Link href={`/tutorials/${slug}`}>
          <div className="text-xs text-primary hover:underline cursor-pointer">
            Read more <i className="fas fa-arrow-right ml-1"></i>
          </div>
        </Link>
      </div>
    </Card>
  );
};

export default TutorialCard;
