export interface Theme {
  fontFamily: string;
  rounded: string;
  roundedFull: string;
  fontSize: string;
  colors: {
    primary: string[];
    text: string[];
    background: string[];
    danger: string[];
    success: string[];
    warning: string[];
  },
  breakpoints: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
  },
  custom?: any;
}

export enum Shade { LIGHTER, DARKER };

const hex2 = (c: number) => {
  c = Math.round(c);
  if (c < 0) c = 0;
  if (c > 255) c = 255;

  let s = c.toString(16);
  if (s.length < 2) s = '0' + s;

  return s;
}

export const shiftColor = (col: string, light: Shade) => {
  let r = parseInt(col.substr(1, 2), 16);
  let g = parseInt(col.substr(3, 2), 16);
  let b = parseInt(col.substr(5, 2), 16);

  if (light >= 0) {
    r = r * (1 - light);
    g = g * (1 - light);
    b = b * (1 - light);
  } else {
    r = (1 + light) * r - light * 255;
    g = (1 + light) * g - light * 255;
    b = (1 + light) * b - light * 255;
  }

  return "#" + hex2(r) + hex2(g) + hex2(b);
}

export const generateColorsArray = (hex: string, amt: number, shade: Shade, inc: number = 0.07): string[] => {
  let colors = [ hex ];
  
  let val = inc;
  for (let i = 0; i < amt; i++) {
    colors.push(shiftColor(hex, shade === Shade.DARKER ? val : -val));
    val += inc;
  }

  return colors;
}

export const theme: Theme = {
  fontFamily: '\'Rubik\', Arial, sans-serif',
  rounded: '8px',
  roundedFull: '3rem',
  fontSize: '1rem',
  colors: {
    primary: generateColorsArray('#FF5722', 9, Shade.DARKER),
    text: generateColorsArray('#FAFAFA', 9, Shade.DARKER, 0.04),
    background: generateColorsArray('#0a0c0f', 9, Shade.LIGHTER, 0.04),
    danger: generateColorsArray('#d12929', 9, Shade.DARKER),
    success: generateColorsArray('#1dad35', 9, Shade.DARKER),
    warning: generateColorsArray('#efcb00', 9, Shade.DARKER),
  },
  breakpoints: {
    xs: '0',
    sm: '576px',
    md: '768px',
    lg: '992px',
  },
}

export const hexToRgb = (hex: string): { r: number, g: number, b: number } => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
   } : {r: 0, g: 0, b: 0};
}

const decTohex = (n: number): string => {
  const hex = n.toString(16);
  if (hex.length < 2)
      return '0' + hex;
  return hex;
}

export const rgbToHex = (rgb: {r: number, g: number, b: number}): string => {
  return '#' + decTohex(rgb.r) + decTohex(rgb.g) + decTohex(rgb.b);
}

const luminance = (r: number, g: number, b: number) => {
  const a = [r, g, b].map(v => {
      v /= 255;
      return v <= 0.03928
          ? v / 12.92
          : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

export const contrast = (hex1: string, hex2: string) => {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  const lum1 = luminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = luminance(rgb2.r, rgb2.g, rgb2.b);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

const clamp = (n: number) => {
  if (n < 0) return 0;
  if (n > 255) return 255;
  return Math.floor(n);
}

const rgb2yuv = (rgb: {r: number, g: number, b: number}): { y:  number, u: number, v: number } => {
  const y = clamp(rgb.r *  0.29900 + rgb.g *  0.587   + rgb.b * 0.114);
  const u = clamp(rgb.r * -0.16874 + rgb.g * -0.33126 + rgb.b * 0.50000 + 128);
  const v = clamp(rgb.r *  0.50000 + rgb.g * -0.41869 + rgb.b * -0.08131 + 128);
  return { y, u, v };
}

const yuv2rgb = (yuv: { y: number, u: number, v: number }): { r: number, g: number, b: number } => {
  const y = yuv.y;
  const u = yuv.u;
  const v = yuv.v;
  const r = clamp(y + (v - 128) *  1.40200);
  const g = clamp(y + (u - 128) * -0.34414 + (v - 128) * -0.71414);
  const b = clamp(y + (u - 128) *  1.77200);
  return {r: r,g: g,b: b};
}

const invert = (rgb: {r: number, g: number, b: number}, factor: number) => {
  const yuv = rgb2yuv(rgb);
  const threshold = 100;
  yuv.y = clamp(yuv.y + (yuv.y > threshold ? -factor : factor));
  return yuv2rgb(yuv);
}

export const invertColor = (hex: string, factor: number = 130) => {
  const rgb = invert(hexToRgb(hex), factor);
  return rgbToHex(rgb);
}
