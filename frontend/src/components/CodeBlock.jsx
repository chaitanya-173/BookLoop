import { useEffect, useRef } from "react";
import Prism from "prismjs";

import "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-css";

// Import theme
import "prismjs/themes/prism-tomorrow.css";

// Initialize Prism
Prism.manual = true;

const CodeBlock = ({ code, language = "javascript" }) => {
  const codeRef = useRef(null);

  useEffect(() => {
    if (codeRef.current) {
      try {
        // Force Prism to highlight the element
        Prism.highlightElement(codeRef.current, false, () => {
          console.log(`Highlighted ${language} code`);
        });
      } catch (error) {
        console.error(
          `Error highlighting code for language ${language}:`,
          error
        );
        // Fallback to plaintext if language loading fails
        codeRef.current.className = "language-plaintext";
        Prism.highlightElement(codeRef.current);
      }
    }
  }, [code, language]);

  return (
    <pre className="!bg-transparent !m-0 !p-0">
      <code ref={codeRef} className={`language-${language}`}>
        {code}
      </code>
    </pre>
  );
};

export default CodeBlock;
