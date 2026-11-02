export interface SkillDef {
    canonical: string;
    domain: string;
    aliases: string[];
  }
  
  export const SKILL_TAXONOMY: SkillDef[] = [
    // Competitive Coding
    { canonical: "C++", domain: "Competitive Coding", aliases: ["cpp", "c++", "c plus plus"] },
    { canonical: "Java", domain: "Competitive Coding", aliases: ["java"] },
    { canonical: "Python", domain: "Competitive Coding", aliases: ["python", "py"] },
    { canonical: "DSA", domain: "Competitive Coding", aliases: ["dsa", "data structures", "algorithms"] },
    
    // Full Stack
    { canonical: "JavaScript", domain: "Full Stack", aliases: ["javascript", "js"] },
    { canonical: "TypeScript", domain: "Full Stack", aliases: ["typescript", "ts"] },
    { canonical: "React", domain: "Full Stack", aliases: ["react", "reactjs", "react.js"] },
    { canonical: "Node.js", domain: "Full Stack", aliases: ["node", "nodejs", "node.js"] },
    { canonical: "HTML/CSS", domain: "Full Stack", aliases: ["html", "css"] },
    
    // DBMS
    { canonical: "SQL", domain: "DBMS", aliases: ["sql"] },
    { canonical: "MySQL", domain: "DBMS", aliases: ["mysql"] },
    { canonical: "PostgreSQL", domain: "DBMS", aliases: ["postgresql", "postgres"] },
    { canonical: "MongoDB", domain: "DBMS", aliases: ["mongodb", "mongo"] },
    
    // Data Science / AI / ML
    { canonical: "Machine Learning", domain: "AI/ML", aliases: ["machine learning", "ml"] },
    { canonical: "Deep Learning", domain: "AI/ML", aliases: ["deep learning", "dl"] },
    { canonical: "Data Science", domain: "Data Science", aliases: ["data science", "data analysis"] },
    { canonical: "Pandas", domain: "Data Science", aliases: ["pandas"] },
    { canonical: "TensorFlow", domain: "AI/ML", aliases: ["tensorflow", "tf"] },
  ];