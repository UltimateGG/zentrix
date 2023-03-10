import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import useDataCache from '../../../contexts/DataCacheContext';
import { Checkbox } from '../../../Jet';
import mentionPlugin from './mentionParser';


const FormattedMessageContent = ({ content } : { content: string }) => {
  const { users } = useDataCache();


  return (
    <ReactMarkdown
      linkTarget="_blank"
      remarkPlugins={[
        [remarkGfm, { singleTilde: false }],
        [mentionPlugin, { getDisplayName: (id: string) => users.find(u => u._id === id)?.displayName || id }]
      ]}
      rehypePlugins={[
        [rehypeHighlight, { ignoreMissing: true }]
      ]}
      disallowedElements={[
        'script',
        'img',
        'iframe',
        'object',
        'embed',
        'video',
        'audio',
        'canvas',
        'map',
        'svg',
        'math',
        'style',
        'link',
        'meta',
        'noscript',
        'applet',
      ]}
      components={{
        li: ({ node, ...props }) => {
          const className = node.properties?.className;
          if (className && (className as string[]).includes('task-list-item')) {
            return (
              <Checkbox
                label={node.children.map((child: any) => child.tagName === 'a' ? child.properties?.href || '' : child.value).join('')}
                checked={node.children.some((child: any) => child.properties?.checked)}
                disabled
              />
            );
          }

          return (
            <li {...props} />
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

export default FormattedMessageContent;
