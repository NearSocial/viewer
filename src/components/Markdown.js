import gfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import React from "react";
import { mentions, mentionRegex } from "./remark/mentions";
import { isString } from "../data/utils";

export const Markdown = (props) => {
  const { onLinkClick, text, onMention, ...rest } = props;
  return (
    <ReactMarkdown
      {...rest}
      plugins={[gfm, mentions]}
      components={{
        strong({ node, children, ...props }) {
          if (onMention && children.length === 1 && isString(children[0])) {
            mentionRegex.lastIndex = 0;
            const match = mentionRegex.exec(children[0]);
            const accountId = match?.[1];
            if (accountId && accountId.length >= 2 && accountId.length <= 64) {
              return onMention(accountId);
            }
          }
          return <strong {...props}>{children}</strong>;
        },
        a: ({ node, ...props }) =>
          onLinkClick ? (
            <a onClick={onLinkClick} {...props} />
          ) : (
            <a target="_blank" {...props} />
          ),
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
      {text}
    </ReactMarkdown>
  );
};
