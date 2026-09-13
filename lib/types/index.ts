export interface Service {
  icon: any;
  title: string;
  description: string;
}

export interface Project {
  title: string;
  category: string;
  description: string;
  technologies: string[];
  image: string;
}

export interface Technology {
  icon: any;
  title: string;
  text: string;
}

export interface ProcessStep {
  number: string;
  icon: any;
  title: string;
  description: string;
}