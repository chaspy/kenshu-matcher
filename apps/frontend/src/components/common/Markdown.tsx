import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownProps {
  readonly text: string;
}

const Markdown = ({ text }: MarkdownProps): JSX.Element => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        a: (props) => (
          <a {...props} target="_blank" rel="noreferrer" />
        )
      }}
    >
      {text}
    </ReactMarkdown>
  );
};

export default Markdown;

