import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';


// TODO links
const FormattedMessageContent = ({ content } : { content: string }) => {
  return (
    <ReactMarkdown
      linkTarget="_blank"
      remarkPlugins={[
        [remarkGfm, { singleTilde: false }],
      ]}
      rehypePlugins={[
        rehypeHighlight
      ]}
      components={{
        
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

export default FormattedMessageContent;
