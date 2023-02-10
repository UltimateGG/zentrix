import React from 'react';
import useDataCache from '../../contexts/DataCacheContext';


const Mention = ({ text }: { text: string }) => {
  return (
    <span style={{ color: 'blue' }}>{text}</span>
  );
}
// TODO https://github.com/remarkjs/react-markdown#when-should-i-use-this
// and links
const FormattedMessageContent = ({ content } : { content: string }) => {
  const { loading } = useDataCache();

  if (loading) return <div>{content}</div>;

  return (<>{content}</>);
}

export default FormattedMessageContent;
