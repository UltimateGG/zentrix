import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';


const FormattedMessageContent = ({ content } : { content: string }) => {
  return (
    <ReactMarkdown
      linkTarget="_blank"
      remarkPlugins={[
        [remarkGfm, { singleTilde: false }],
      ]}
      rehypePlugins={[
        [rehypeHighlight, { ignoreMissing: true }]
      ]}
      components={{
        
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

export default FormattedMessageContent;
