/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import './icon.css';
import iconPack from '../../icons.json'
import { useEffect, useState } from 'react';

interface Props {
    icon: keyof typeof iconPack;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
    onClick?: (...args: any) => void;
}

const Icon = (props: Props) => {
  const { icon, className, onClick, size } = props;
  const [imgSrc, setImgSrc] = useState<string>('');

  useEffect(() => {
    const cont = document.getElementById('icon-cont');
    if (!cont) return;
    const color = window.getComputedStyle(cont).color;
    setImgSrc(`data:image/svg+xml;utf8,${encodeURIComponent(iconPack[icon].replaceAll('currentColor', color))}`)
  }, [icon]);

  return (
    <div id='icon-cont' onClick={onClick} className={`icon-wrapper ${className}`}>
      <img className={`img-${size}`} src={imgSrc} />
    </div>
  )
}

export default Icon

Icon.defaultProps = {
  className: '',
  size: 'md',
  onClick: () => {},
}