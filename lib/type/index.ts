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
