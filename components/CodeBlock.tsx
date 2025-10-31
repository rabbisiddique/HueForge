// components/CodeBlock.tsx
"use client";

import { Highlight, themes } from "prism-react-renderer";
import React from "react";

interface CodeBlockProps {
  code: string;
  language: string; // e.g., "tsx", "javascript", "css"
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
  return (
    <Highlight
      theme={themes.shadesOfPurple}
      code={code || ""} // fallback to empty string
      language={language || "jsx"}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className={`${className} rounded-xl whitespace-pre-wrap break-words text-sm`}
          style={{
            ...style,
            padding: "1rem",
            backgroundColor: "#1e1e2f", // black / dark bg
            // maxHeight: "500px", // optional, keeps container limited
          }}
        >
          {tokens.map((line, i) => (
            <div {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
};

export default CodeBlock;
