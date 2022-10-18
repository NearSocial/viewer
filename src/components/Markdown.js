import gfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import React from "react";

export const Markdown = (props) => (
  <ReactMarkdown
    {...props}
    plugins={[gfm]}
    components={{
      img: ({ node, ...props }) => <img className="img-fluid" {...props} />,
      blockquote: ({ node, ...props }) => (
        <blockquote className="blockquote" {...props} />
      ),
      table: ({ node, ...props }) => (
        <table className="table table-striped" {...props} />
      ),
      code({ node, inline, className, children, ...props }) {
        const match = /language-(\w+)/.exec(className || "");
        return !inline && match ? (
          <SyntaxHighlighter
            children={String(children).replace(/\n$/, "")}
            style={tomorrow}
            language={match[1]}
            PreTag="div"
            {...props}
          />
        ) : (
          <code className={className} {...props}>
            {children}
          </code>
        );
      },
    }}
  >
    {props.text}
  </ReactMarkdown>
);
