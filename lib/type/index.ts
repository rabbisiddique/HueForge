export interface GeneratedComponent {
  id: string;
  componentName: string;
  category: string;
  description: string;
  code: string[];
  prompt: string;
  previewCode: React.ReactNode;
  techStack: string[];
  filename: string;
  language: string;
  createdAt: string;
  codeFiles: {
    filename: string;
    content: string;
    language: string;
  }[];
}

export interface PaletteData {
  id: string;
  name: string;
  colors: { name: string; hex: string; rgb: string }[];
  createdAt: string;
}
export interface TypographyData {
  id: string;
  fontFamily: string;
  levels: string;
  name: string;
  prompt: string;
  createdAt: string;
  userId: string;
}

export interface TypographyLevel {
  level: string;
  size: string;
  weight: number;
  sample: string;
  fontFamily: string;
}
