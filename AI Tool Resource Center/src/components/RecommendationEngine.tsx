import React, { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, Heart, Clock, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { table } from '@devvai/devv-code-backend';
import { useAuthStore } from '@/store/auth-store';

interface RecommendedTool {
  tool_id: string;
  tool_name: string;
  category: string;
  description: string;
  avg_rating: number;
  tests_count: number;
  trending_score: number;
  pricing_model: string;
  recommendation_reason: string;
  confidence_score: number;
}

interface RecommendationEngineProps {
  limit?: number;
  showHeader?: boolean;
}

export default function RecommendationEngine({ limit = 6, showHeader = true }: RecommendationEngineProps) {
  const [recommendations, setRecommendations] = useState<RecommendedTool[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    generateRecommendations();
  }, [user]);

  const generateRecommendations = async () => {
    try {
      setLoading(true);
      
      // Get all tools for recommendation engine using the trending_score_idx index
      const toolsResponse = await table.getItems('evxj3vkz0idc', {
        limit: 50,
        query: { _tid: 'evxj3vkz0idc' }, // Use the table ID for the _tid_id_idx or trending_score_idx
      });

      if (toolsResponse.items.length === 0) {
        setRecommendations([]);
        return;
      }

      // Sort tools by trending score in memory
      const sortedTools = toolsResponse.items.sort((a: any, b: any) => 
        (b.trending_score || 0) - (a.trending_score || 0)
      );

      let userInteractions: any[] = [];
      if (user) {
        // Get user interactions for personalized recommendations
        try {
          const interactionsResponse = await table.getItems('evxj49dhtwqo', {
            query: { _uid: user.uid },
            limit: 100
          });
          userInteractions = interactionsResponse.items;
        } catch (error) {
          console.log('No user interactions found, using general recommendations');
        }
      }

      // Generate recommendations based on user behavior or trending data
      const recommendedTools = await generatePersonalizedRecommendations(
        sortedTools,
        userInteractions
      );

      setRecommendations(recommendedTools.slice(0, limit));
    } catch (error) {
      console.error('Failed to generate recommendations:', error);
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  const generatePersonalizedRecommendations = async (
    allTools: any[],
    userInteractions: any[]
  ): Promise<RecommendedTool[]> => {
    const recommendations: RecommendedTool[] = [];

    // If user has interactions, use collaborative filtering approach
    if (userInteractions.length > 0) {
      const userCategories = userInteractions.reduce((acc, interaction) => {
        if (interaction.user_category_preference) {
          acc[interaction.user_category_preference] = (acc[interaction.user_category_preference] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);

      const preferredCategories = Object.entries(userCategories)
        .sort(([,a], [,b]) => (b as number) - (a as number))
        .map(([category]) => category);

      // Recommend tools from preferred categories
      preferredCategories.forEach(category => {
        const categoryTools = allTools
          .filter(tool => tool.category === category)
          .sort((a, b) => b.trending_score - a.trending_score)
          .slice(0, 2);

        categoryTools.forEach(tool => {
          recommendations.push({
            ...tool,
            recommendation_reason: `Based on your interest in ${category}`,
            confidence_score: 0.9
          });
        });
      });

      // Add some trending tools from other categories for discovery
      const otherCategoryTools = allTools
        .filter(tool => !preferredCategories.includes(tool.category))
        .sort((a, b) => b.trending_score - a.trending_score)
        .slice(0, 2);

      otherCategoryTools.forEach(tool => {
        recommendations.push({
          ...tool,
          recommendation_reason: 'Trending in the community',
          confidence_score: 0.7
        });
      });
    } else {
      // For new users, recommend top trending tools across categories
      const categories = [...new Set(allTools.map(tool => tool.category))];
      
      categories.slice(0, 3).forEach(category => {
        const topTool = allTools
          .filter(tool => tool.category === category)
          .sort((a, b) => b.trending_score - a.trending_score)[0];
        
        if (topTool) {
          recommendations.push({
            ...topTool,
            recommendation_reason: `Popular in ${category}`,
            confidence_score: 0.8
          });
        }
      });

      // Add overall top trending tools
      const topTrending = allTools
        .sort((a, b) => b.trending_score - a.trending_score)
        .slice(0, 3);

      topTrending.forEach(tool => {
        if (!recommendations.find(r => r.tool_id === tool.tool_id)) {
          recommendations.push({
            ...tool,
            recommendation_reason: 'Top trending tool',
            confidence_score: 0.85
          });
        }
      });
    }

    return recommendations.slice(0, limit);
  };

  const getReasonIcon = (reason: string) => {
    if (reason.includes('interest')) return <Heart className="h-3 w-3 text-red-500" />;
    if (reason.includes('Trending') || reason.includes('trending')) return <TrendingUp className="h-3 w-3 text-green-500" />;
    if (reason.includes('Popular')) return <Star className="h-3 w-3 text-yellow-500" />;
    return <Sparkles className="h-3 w-3 text-blue-500" />;
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

  if (loading) {
    return (
      <div className="space-y-4">
        {showHeader && (
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="h-6 w-6 text-primary animate-pulse" />
            <h2 className="text-2xl font-bold">Recommended for You</h2>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(limit)].map((_, i) => (
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
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="text-center py-12">
        <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Recommendations Yet</h3>
        <p className="text-muted-foreground mb-4">
          Start exploring AI tools to get personalized recommendations!
        </p>
        <Button asChild>
          <Link to="/trending">Browse Trending Tools</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showHeader && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Recommended for You</h2>
          </div>
          {user && (
            <Button variant="outline" size="sm" asChild>
              <Link to="/trending">View All</Link>
            </Button>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendations.map((tool) => (
          <Card key={tool.tool_id} className="group hover:shadow-lg transition-all duration-300 border-0 bg-background/60 backdrop-blur-sm hover:bg-background/80">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{tool.tool_name}</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {tool.category}
                </Badge>
                <Badge variant="outline" className={`text-xs ${getPricingColor(tool.pricing_model)}`}>
                  {tool.pricing_model}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {tool.description}
              </p>
              
              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-current text-yellow-500" />
                  {tool.avg_rating.toFixed(1)}
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  {tool.trending_score.toFixed(0)}
                </div>
              </div>

              <div className="flex items-center gap-2 mb-4 p-2 bg-muted/50 rounded-lg">
                {getReasonIcon(tool.recommendation_reason)}
                <span className="text-xs text-muted-foreground">
                  {tool.recommendation_reason}
                </span>
                <div className="ml-auto">
                  <div className="flex gap-1">
                    {[...Array(Math.ceil(tool.confidence_score * 5))].map((_, i) => (
                      <div key={i} className="w-1 h-3 bg-primary rounded-full"></div>
                    ))}
                    {[...Array(5 - Math.ceil(tool.confidence_score * 5))].map((_, i) => (
                      <div key={i} className="w-1 h-3 bg-muted rounded-full"></div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button asChild variant="outline" size="sm" className="flex-1">
                  <Link to={`/test?tool=${tool.tool_id}`}>
                    Test Now
                  </Link>
                </Button>
                <Button asChild size="sm" className="flex-1">
                  <Link to={`/reviews?tool=${tool.tool_id}`}>
                    Reviews
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}