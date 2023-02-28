import React from 'react';
import Image from './Image';


interface AvatarProps {
  src: string;
  size: number;
  mr?: number;
}

const Avatar = ({ src, size, mr }: AvatarProps) => {
  return (
    <Image
      src={src}
      referrerPolicy="no-referrer"
      style={{
        minWidth: size + 'rem',
        minHeight: size + 'rem',
        width: size + 'rem',
        height: size + 'rem',
        borderRadius: '50%',
        marginRight: mr ? mr + 'rem' : 0,
        objectFit: 'cover',
      }}
    />
  );
}

export default Avatar;
