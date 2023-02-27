import { Plugin } from 'unified';
import { visit } from 'unist-util-visit';
import { Node, Parent } from 'unist';


const mentionRegex = /<@(\w+)>/g;
interface MentionNode extends Node {
  type: 'text';
  value: string;
}

interface MentionPlugin {
  getDisplayName: (id: string) => string;
}

const mentionPlugin: Plugin = ({ getDisplayName }: MentionPlugin) => {
  return (tree) => {
    visit(tree, 'text', (node: MentionNode, index, parent: Parent) => {
      let match;

      while ((match = mentionRegex.exec(node.value))) {
        const id = match[1];
        const start = match.index;
        const end = start + match[0].length;

        // Create the mention link node
        const mentionNode = {
          type: 'paragraph',
          data: {
            hProperties: {
              className: 'mention',
            },
          },
          children: [
            {
              type: 'text',
              value: '@' + getDisplayName(id),
            },
          ],
        };

        const endTextNode = {
          type: 'text',
          value: node.value.slice(end),
        };

        node.value = node.value.slice(0, start);
        parent.children.push(mentionNode);
        parent.children.push(endTextNode);
      }
    });
  };
};

export default mentionPlugin;
