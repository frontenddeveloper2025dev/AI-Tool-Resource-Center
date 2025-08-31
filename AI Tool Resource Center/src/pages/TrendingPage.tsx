import React, { useState, useEffect } from 'react';
import { TrendingUp, Star, Users, TestTube, Eye, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { table } from '@devvai/devv-code-backend';
import { useToast } from '@/hooks/use-toast';
import AdvancedSearch from '@/components/AdvancedSearch';
import TrendingAnalytics from '@/components/TrendingAnalytics';

interface TrendingTool {
  _id: string;
  _uid: string;
  tool_id: string;
  tool_name: string;
  category: string;
  subcategory?: string;
  views_count: number;
  tests_count: number;
  avg_rating: number;
  review_count: number;
  trending_score: number;
  last_updated: string;
  description: string;
  website_url?: string;
  pricing_model: string;
  tags?: string;
}

export default function TrendingPage() {
  const [searchResults, setSearchResults] = useState<TrendingTool[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('trending');
  const { toast } = useToast();

  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = async () => {
    try {
      setLoading(true);
      
      // Check if sample data exists
      const response = await table.getItems('evxj3vkz0idc', {
        limit: 1
      });

      // If no data exists, create sample data
      if (response.items.length === 0) {
        await createSampleTrendingData();
      }
    } catch (error) {
      console.error('Failed to initialize data:', error);
      toast({
        title: 'Error',
        description: 'Failed to initialize trending data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearchResults = (results: TrendingTool[]) => {
    setSearchResults(results);
  };

  const createSampleTrendingData = async () => {
    const sampleTools = [
      {
        tool_id: 'chatgpt-4',
        tool_name: 'ChatGPT-4',
        category: 'Text Generation',
        subcategory: 'Conversational AI',
        views_count: 15420,
        tests_count: 3240,
        avg_rating: 4.8,
        review_count: 892,
        trending_score: 98.5,
        last_updated: new Date().toISOString(),
        description: 'Advanced conversational AI for text generation, analysis, and creative writing.',
        website_url: 'https://openai.com/chatgpt',
        pricing_model: 'Freemium',
        tags: 'conversation,writing,analysis,creative'
      },
      {
        tool_id: 'midjourney',
        tool_name: 'Midjourney',
        category: 'Image Creation',
        subcategory: 'AI Art Generation',
        views_count: 12800,
        tests_count: 2890,
        avg_rating: 4.7,
        review_count: 654,
        trending_score: 95.2,
        last_updated: new Date().toISOString(),
        description: 'Create stunning AI-generated artwork and images from text prompts.',
        website_url: 'https://midjourney.com',
        pricing_model: 'Paid',
        tags: 'art,images,creative,design'
      },
      {
        tool_id: 'github-copilot',
        tool_name: 'GitHub Copilot',
        category: 'Code Assistant',
        subcategory: 'Code Generation',
        views_count: 9850,
        tests_count: 2156,
        avg_rating: 4.6,
        review_count: 432,
        trending_score: 92.8,
        last_updated: new Date().toISOString(),
        description: 'AI-powered code completion and programming assistant.',
        website_url: 'https://github.com/features/copilot',
        pricing_model: 'Paid',
        tags: 'coding,development,programming,github'
      },
      {
        tool_id: 'claude-3',
        tool_name: 'Claude 3',
        category: 'Text Generation',
        subcategory: 'AI Assistant',
        views_count: 8560,
        tests_count: 1890,
        avg_rating: 4.7,
        review_count: 298,
        trending_score: 89.4,
        last_updated: new Date().toISOString(),
        description: 'Anthropic\'s advanced AI assistant for complex reasoning and analysis.',
        website_url: 'https://claude.ai',
        pricing_model: 'Freemium',
        tags: 'assistant,reasoning,analysis,anthropic'
      },
      {
        tool_id: 'stable-diffusion',
        tool_name: 'Stable Diffusion',
        category: 'Image Creation',
        subcategory: 'Open Source AI',
        views_count: 7320,
        tests_count: 1654,
        avg_rating: 4.4,
        review_count: 387,
        trending_score: 85.7,
        last_updated: new Date().toISOString(),
        description: 'Open-source AI model for generating images from text descriptions.',
        website_url: 'https://stability.ai',
        pricing_model: 'Free',
        tags: 'opensource,images,generation,stable'
      },
      {
        tool_id: 'cursor-ai',
        tool_name: 'Cursor',
        category: 'Code Assistant',
        subcategory: 'IDE Integration',
        views_count: 6890,
        tests_count: 1423,
        avg_rating: 4.5,
        review_count: 234,
        trending_score: 82.3,
        last_updated: new Date().toISOString(),
        description: 'AI-powered code editor with intelligent autocomplete and refactoring.',
        website_url: 'https://cursor.sh',
        pricing_model: 'Freemium',
        tags: 'editor,IDE,coding,autocomplete'
      }
    ];

    for (const tool of sampleTools) {
      try {
        await table.addItem('evxj3vkz0idc', tool);
      } catch (error) {
        console.error('Error adding sample tool:', error);
      }
    }
  };

  const sortedTools = () => {
    if (searchResults.length === 0) return [];
    
    switch (activeTab) {
      case 'trending':
        return [...searchResults].sort((a, b) => b.trending_score - a.trending_score);
      case 'popular':
        return [...searchResults].sort((a, b) => b.views_count - a.views_count);
      case 'rated':
        return [...searchResults].sort((a, b) => b.avg_rating - a.avg_rating);
      case 'recent':
        return [...searchResults].sort((a, b) => new Date(b.last_updated).getTime() - new Date(a.last_updated).getTime());
      default:
        return searchResults;
    }
  };

  const getPricingColor = (pricing: string) => {
    switch (pricing) {
      case 'Free': return 'bg-green-100 text-green-800 border-green-200';
      case 'Freemium': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Paid': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Enterprise': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <TrendingUp className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Trending AI Tools
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover the most popular and trending AI tools. Find what's hot in the AI community.
          </p>
        </div>

        {/* Advanced Search */}
        <div className="mb-8 bg-background/80 backdrop-blur-sm border rounded-lg p-6">
          <AdvancedSearch onResultsChange={handleSearchResults} />
        </div>

        {/* Tabs for different sorting */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="trending">🔥 Trending</TabsTrigger>
            <TabsTrigger value="popular">👁️ Most Viewed</TabsTrigger>
            <TabsTrigger value="rated">⭐ Top Rated</TabsTrigger>
            <TabsTrigger value="recent">🆕 Recently Updated</TabsTrigger>
            <TabsTrigger value="analytics">📊 Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="mt-6">
            <TrendingAnalytics />
          </TabsContent>
          
          <TabsContent value={activeTab} className="mt-6">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="h-3 bg-muted rounded"></div>
                        <div className="h-3 bg-muted rounded w-5/6"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedTools().map((tool, index) => (
                  <Card key={tool._id} className="group hover:shadow-lg transition-all duration-300 border-0 bg-background/60 backdrop-blur-sm hover:bg-background/80">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg flex items-center gap-2">
                            {activeTab === 'trending' && index < 3 && (
                              <span className="text-xl">
                                {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                              </span>
                            )}
                            {tool.tool_name}
                            {tool.website_url && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                asChild
                              >
                                <a href={tool.website_url} target="_blank" rel="noopener noreferrer">
                                  <ArrowUpRight className="h-3 w-3" />
                                </a>
                              </Button>
                            )}
                          </CardTitle>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="secondary" className="text-xs">
                              {tool.category}
                            </Badge>
                            <Badge variant="outline" className={`text-xs ${getPricingColor(tool.pricing_model)}`}>
                              {tool.pricing_model}
                            </Badge>
                          </div>
                        </div>
                        {activeTab === 'trending' && (
                          <div className="text-right">
                            <div className="text-sm font-medium text-primary">
                              {tool.trending_score.toFixed(1)}
                            </div>
                            <div className="text-xs text-muted-foreground">Score</div>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {tool.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {formatNumber(tool.views_count)}
                        </div>
                        <div className="flex items-center gap-1">
                          <TestTube className="h-3 w-3" />
                          {formatNumber(tool.tests_count)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-current text-yellow-500" />
                          {tool.avg_rating.toFixed(1)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {formatNumber(tool.review_count)}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button asChild variant="outline" size="sm" className="flex-1">
                          <Link to={`/test?tool=${tool.tool_id}`}>
                            Test Tool
                          </Link>
                        </Button>
                        <Button asChild size="sm" className="flex-1">
                          <Link to={`/reviews?tool=${tool.tool_id}`}>
                            View Reviews
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            
            {!loading && sortedTools().length === 0 && searchResults.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Start searching to discover AI tools!</p>
              </div>
            )}
            
            {!loading && searchResults.length > 0 && sortedTools().length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No tools found matching your criteria.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}