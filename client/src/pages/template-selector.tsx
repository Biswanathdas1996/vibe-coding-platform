import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { Code, Globe, ShoppingBag, User, FileText, Gamepad2, Briefcase, Heart, ArrowRight } from "lucide-react";

interface Template {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  category: string;
  features: string[];
  preview: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
}

const templates: Template[] = [
  {
    id: "landing-page",
    name: "Landing Page",
    description: "Modern landing page with hero section, features, and contact form",
    icon: Globe,
    category: "Marketing",
    features: ["Responsive Design", "Contact Form", "SEO Optimized"],
    preview: "/templates/landing-page.jpg",
    difficulty: "Beginner"
  },
  {
    id: "portfolio",
    name: "Portfolio Website",
    description: "Professional portfolio showcase with project gallery",
    icon: User,
    category: "Personal",
    features: ["Project Gallery", "About Section", "Skills Display"],
    preview: "/templates/portfolio.jpg",
    difficulty: "Beginner"
  },
  {
    id: "e-commerce",
    name: "E-commerce Store",
    description: "Complete online store with product catalog and shopping cart",
    icon: ShoppingBag,
    category: "Business",
    features: ["Product Catalog", "Shopping Cart", "Checkout Flow"],
    preview: "/templates/ecommerce.jpg",
    difficulty: "Advanced"
  },
  {
    id: "blog",
    name: "Blog Platform",
    description: "Content-focused blog with article listings and reader engagement",
    icon: FileText,
    category: "Content",
    features: ["Article Management", "Comments", "Categories"],
    preview: "/templates/blog.jpg",
    difficulty: "Intermediate"
  },
  {
    id: "dashboard",
    name: "Admin Dashboard",
    description: "Data visualization dashboard with charts and analytics",
    icon: Briefcase,
    category: "Business",
    features: ["Data Charts", "User Management", "Analytics"],
    preview: "/templates/dashboard.jpg",
    difficulty: "Advanced"
  },
  {
    id: "game",
    name: "Web Game",
    description: "Interactive browser game with scoring and animations",
    icon: Gamepad2,
    category: "Entertainment",
    features: ["Game Logic", "Animations", "Score Tracking"],
    preview: "/templates/game.jpg",
    difficulty: "Intermediate"
  },
  {
    id: "wedding",
    name: "Wedding Website",
    description: "Beautiful wedding invitation site with RSVP functionality",
    icon: Heart,
    category: "Personal",
    features: ["RSVP Form", "Photo Gallery", "Event Details"],
    preview: "/templates/wedding.jpg",
    difficulty: "Beginner"
  },
  {
    id: "blank",
    name: "Start from Scratch",
    description: "Empty project to build whatever you imagine",
    icon: Code,
    category: "Custom",
    features: ["Complete Freedom", "No Constraints", "Your Vision"],
    preview: "/templates/blank.jpg",
    difficulty: "Beginner"
  }
];

const categories = ["All", "Marketing", "Personal", "Business", "Content", "Entertainment", "Custom"];
const difficulties = ["All", "Beginner", "Intermediate", "Advanced"];

export default function TemplateSelector() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [, setLocation] = useLocation();

  const filteredTemplates = templates.filter(template => {
    const categoryMatch = selectedCategory === "All" || template.category === selectedCategory;
    const difficultyMatch = selectedDifficulty === "All" || template.difficulty === selectedDifficulty;
    return categoryMatch && difficultyMatch;
  });

  const handleTemplateSelect = async (template: Template) => {
    // Store selected template in localStorage
    localStorage.setItem('selectedTemplate', JSON.stringify(template));
    
    // Generate project ID and save to database
    try {
      const response = await fetch('/api/projects/init-template', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ templateId: template.id }),
      });
      
      if (response.ok) {
        const data = await response.json();
        // Store project ID for dev chat
        localStorage.setItem('projectId', data.projectId);
        console.log('Project created with ID:', data.projectId);
      } else {
        console.error('Failed to create project');
      }
    } catch (error) {
      console.error('Error creating project:', error);
    }
    
    // Navigate to development interface
    setLocation('/dev');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-500";
      case "Intermediate": return "bg-yellow-500";
      case "Advanced": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header */}
      <div className="container mx-auto px-6 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-purple-600 rounded-xl flex items-center justify-center">
              <Code className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Vibe Coding
            </h1>
          </div>
          <h2 className="text-2xl font-semibold mb-4">Choose Your Starting Template</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Select a pre-built template to jumpstart your project, or start from scratch to build exactly what you envision.
            Each template comes with modern design and functionality ready to customize.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-gray-400 self-center mr-2">Category:</span>
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={`${
                  selectedCategory === category 
                    ? "bg-primary text-white" 
                    : "bg-transparent border-gray-600 text-gray-300 hover:bg-gray-800"
                }`}
              >
                {category}
              </Button>
            ))}
          </div>
          
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-gray-400 self-center mr-2">Difficulty:</span>
            {difficulties.map(difficulty => (
              <Button
                key={difficulty}
                variant={selectedDifficulty === difficulty ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedDifficulty(difficulty)}
                className={`${
                  selectedDifficulty === difficulty 
                    ? "bg-primary text-white" 
                    : "bg-transparent border-gray-600 text-gray-300 hover:bg-gray-800"
                }`}
              >
                {difficulty}
              </Button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {filteredTemplates.map(template => (
            <Card 
              key={template.id} 
              className="bg-slate-800/50 border-slate-700 hover:border-primary/50 transition-all duration-300 hover:scale-105 cursor-pointer group"
              onClick={() => handleTemplateSelect(template)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-purple-600 rounded-lg flex items-center justify-center">
                    <template.icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex gap-1">
                    <Badge variant="secondary" className="text-xs">
                      {template.category}
                    </Badge>
                    <Badge className={`text-xs text-white ${getDifficultyColor(template.difficulty)}`}>
                      {template.difficulty}
                    </Badge>
                  </div>
                </div>
                <CardTitle className="text-lg text-white group-hover:text-primary transition-colors">
                  {template.name}
                </CardTitle>
                <CardDescription className="text-gray-400 text-sm">
                  {template.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-1">
                    {template.features.map(feature => (
                      <Badge 
                        key={feature} 
                        variant="outline" 
                        className="text-xs bg-slate-700/50 border-slate-600 text-gray-300"
                      >
                        {feature}
                      </Badge>
                    ))}
                  </div>
                  
                  <Button 
                    className="w-full bg-primary hover:bg-blue-700 text-white font-medium group-hover:bg-blue-600 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTemplateSelect(template);
                    }}
                  >
                    Select Template
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Code className="h-16 w-16 mx-auto opacity-50" />
            </div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No templates found</h3>
            <p className="text-gray-400">Try adjusting your filters to see more options.</p>
          </div>
        )}
      </div>
    </div>
  );
}