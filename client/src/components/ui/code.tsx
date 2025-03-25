import { cn } from "@/lib/utils";
import React, { useEffect, useRef } from "react";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-yaml";
import "prismjs/components/prism-json";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-css";
import "prismjs/plugins/line-numbers/prism-line-numbers";
import "prismjs/plugins/line-numbers/prism-line-numbers.css";

interface CodeProps {
  code: string;
  language: string;
  className?: string;
}

const Code: React.FC<CodeProps> = ({ code, language, className }) => {
  const codeRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
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
