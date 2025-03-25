import { cn } from "@/lib/utils";
import React, { useEffect, useRef } from "react";

interface CodeProps {
  code: string;
  language: string;
  className?: string;
}

const Code: React.FC<CodeProps> = ({ code, language, className }) => {
  const codeRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    // Load Prism.js dynamically
    const loadPrism = async () => {
      const Prism = await import("https://cdn.jsdelivr.net/npm/prismjs@1.29.0/prism.min.js");
      await import(`https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/prism-${language}.min.js`);
      
      // Add line numbers plugin
      await import("https://cdn.jsdelivr.net/npm/prismjs@1.29.0/plugins/line-numbers/prism-line-numbers.min.js");
      
      // Add copy button plugin
      await import("https://cdn.jsdelivr.net/npm/prismjs@1.29.0/plugins/copy-to-clipboard/prism-copy-to-clipboard.min.js");
      
      if (codeRef.current) {
        Prism.highlightElement(codeRef.current);
      }
    };

    loadPrism();
  }, [code, language]);

  return (
    <div className={cn("relative font-mono text-sm rounded-md overflow-hidden", className)}>
      <div className="flex items-center justify-between px-4 py-2 bg-[#1e242c]">
        <span className="text-white text-xs font-medium">{language}</span>
        <button 
          className="text-xs text-white px-2 py-1 bg-gray-800 rounded hover:bg-gray-700"
          onClick={() => {
            navigator.clipboard.writeText(code);
          }}
        >
          Copy
        </button>
      </div>
      <pre ref={codeRef} className="line-numbers p-4 rounded-b-md m-0 bg-[#1e242c] overflow-x-auto">
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  );
};

export { Code };
