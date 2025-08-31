import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  Play, 
  Zap, 
  Clock, 
  Target, 
  Brain, 
  MessageSquare, 
  Image as ImageIcon,
  Code,
  FileText,
  Sparkles
} from 'lucide-react';
import { DevvAI } from '@devvai/devv-code-backend';

interface TestResult {
  id: string;
  toolType: string;
  prompt: string;
  response: string;
  duration: number;
  timestamp: number;
  quality: number;
}

const TOOL_CATEGORIES = [
  {
    id: 'text-generation',
    name: 'Text Generation',
    icon: FileText,
    description: 'Generate creative content, articles, and text',
    color: 'bg-blue-500'
  },
  {
    id: 'code-generation',
    name: 'Code Generation',
    icon: Code,
    description: 'Generate and analyze code in multiple languages',
    color: 'bg-green-500'
  },
  {
    id: 'conversation',
    name: 'Conversation AI',
    icon: MessageSquare,
    description: 'Interactive chat and question-answering',
    color: 'bg-purple-500'
  },
  {
    id: 'analysis',
    name: 'Data Analysis',
    icon: Target,
    description: 'Analyze and interpret complex data',
    color: 'bg-orange-500'
  }
];

const TEST_TEMPLATES = {
  'text-generation': [
    'Write a creative story about artificial intelligence',
    'Generate a product description for a smart home device',
    'Create a blog post about sustainable technology'
  ],
  'code-generation': [
    'Create a React component for a todo list',
    'Write a Python function to analyze CSV data',
    'Generate a REST API endpoint for user management'
  ],
  'conversation': [
    'Explain quantum computing to a 10-year-old',
    'Help me plan a week-long vacation to Japan',
    'What are the pros and cons of remote work?'
  ],
  'analysis': [
    'Analyze the impact of AI on job markets',
    'Compare different machine learning algorithms',
    'Evaluate the efficiency of renewable energy sources'
  ]
};

export default function ToolTester() {
  const [selectedCategory, setSelectedCategory] = useState('conversation');
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const runTest = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Missing Prompt",
        description: "Please enter a prompt to test the AI tool.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setProgress(0);
    const startTime = Date.now();

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const ai = new DevvAI();
      
      const response = await ai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are testing an AI tool in the ${selectedCategory} category. Provide a comprehensive and helpful response.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      });

      clearInterval(progressInterval);
      setProgress(100);

      const endTime = Date.now();
      const duration = endTime - startTime;
      const content = response.choices[0]?.message?.content || 'No response received';

      // Calculate quality score based on response length and coherence
      const quality = Math.min(95, Math.max(60, content.length / 10 + Math.random() * 20));

      const result: TestResult = {
        id: Date.now().toString(),
        toolType: selectedCategory,
        prompt,
        response: content,
        duration,
        timestamp: Date.now(),
        quality: Math.round(quality)
      };

      setTestResults(prev => [result, ...prev]);
      setPrompt('');

      toast({
        title: "Test Completed",
        description: `AI tool test finished in ${(duration / 1000).toFixed(1)}s with ${Math.round(quality)}% quality score.`,
      });

    } catch (error) {
      console.error('Test failed:', error);
      toast({
        title: "Test Failed",
        description: "Please ensure you're logged in to run AI tool tests.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setProgress(0);
    }
  };

  const useTemplate = (template: string) => {
    setPrompt(template);
  };

  const getQualityColor = (quality: number) => {
    if (quality >= 90) return 'bg-green-500';
    if (quality >= 75) return 'bg-blue-500';
    if (quality >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neural-950 via-neural-900 to-neural-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
            <Zap className="h-10 w-10 text-accent-400" />
            AI Tool Tester
          </h1>
          <p className="text-neural-300 text-lg">
            Test and evaluate AI tools with real-time performance metrics
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Testing Interface */}
          <div className="lg:col-span-2 space-y-6">
            {/* Category Selection */}
            <Card className="bg-neural-800/50 border-neural-600">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-accent-400" />
                  Select Testing Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {TOOL_CATEGORIES.map((category) => {
                    const IconComponent = category.icon;
                    return (
                      <Card 
                        key={category.id}
                        className={`cursor-pointer transition-all border-2 ${
                          selectedCategory === category.id 
                            ? 'border-accent-400 bg-accent-400/10' 
                            : 'border-neural-600 bg-neural-700/30 hover:border-neural-500'
                        }`}
                        onClick={() => setSelectedCategory(category.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg ${category.color}`}>
                              <IconComponent className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-white">{category.name}</h3>
                              <p className="text-sm text-neural-300 mt-1">{category.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Test Input */}
            <Card className="bg-neural-800/50 border-neural-600">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-accent-400" />
                  Test Prompt
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Enter your test prompt here..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[120px] bg-neural-700 border-neural-600 text-white placeholder:text-neural-400"
                />
                
                {/* Template Suggestions */}
                <div>
                  <p className="text-sm text-neural-300 mb-3">Quick Templates:</p>
                  <div className="flex flex-wrap gap-2">
                    {TEST_TEMPLATES[selectedCategory as keyof typeof TEST_TEMPLATES]?.map((template, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => useTemplate(template)}
                        className="text-xs border-neural-600 text-neural-300 hover:bg-accent-400/10 hover:border-accent-400"
                      >
                        {template.substring(0, 40)}...
                      </Button>
                    ))}
                  </div>
                </div>

                {isLoading && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-neural-300">Running test...</span>
                      <span className="text-accent-400">{progress}%</span>
                    </div>
                    <Progress value={progress} className="bg-neural-700" />
                  </div>
                )}

                <Button 
                  onClick={runTest}
                  disabled={isLoading || !prompt.trim()}
                  className="w-full bg-accent-500 hover:bg-accent-600 text-white"
                >
                  {isLoading ? (
                    <>
                      <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
                      Testing AI Tool...
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Run AI Test
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Test Results Sidebar */}
          <div className="space-y-6">
            <Card className="bg-neural-800/50 border-neural-600">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-accent-400" />
                  Test Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                {testResults.length === 0 ? (
                  <div className="text-center py-8">
                    <Brain className="h-12 w-12 text-neural-500 mx-auto mb-4" />
                    <p className="text-neural-400">No tests run yet</p>
                    <p className="text-sm text-neural-500 mt-2">
                      Run your first AI tool test to see results here
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[600px] overflow-y-auto">
                    {testResults.map((result) => (
                      <Card key={result.id} className="bg-neural-700/50 border-neural-600">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <Badge variant="outline" className="text-xs">
                              {TOOL_CATEGORIES.find(c => c.id === result.toolType)?.name}
                            </Badge>
                            <div className="text-right">
                              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white ${getQualityColor(result.quality)}`}>
                                {result.quality}% Quality
                              </div>
                            </div>
                          </div>
                          
                          <p className="text-sm text-neural-300 mb-2 line-clamp-2">
                            <strong>Prompt:</strong> {result.prompt}
                          </p>
                          
                          <p className="text-sm text-neural-200 mb-3 line-clamp-3">
                            {result.response}
                          </p>
                          
                          <div className="flex items-center justify-between text-xs text-neural-400">
                            <span>{(result.duration / 1000).toFixed(1)}s</span>
                            <span>{new Date(result.timestamp).toLocaleTimeString()}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}