import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, BarChart3, Eye, TestTube, Star, Users, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { table } from '@devvai/devv-code-backend';

interface TrendingStats {
  totalTools: number;
  totalViews: number;
  totalTests: number;
  totalReviews: number;
  avgRating: number;
  topCategory: string;
  growthRate: number;
}

interface CategoryStats {
  category: string;
  toolCount: number;
  avgRating: number;
  totalViews: number;
  growthTrend: 'up' | 'down' | 'stable';
}

export default function TrendingAnalytics() {
  const [stats, setStats] = useState<TrendingStats | null>(null);
  const [categoryStats, setCategoryStats] = useState<CategoryStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      
      // Get all trending tools
      const toolsResponse = await table.getItems('evxj3vkz0idc', {
        limit: 100
      });

      if (toolsResponse.items.length === 0) {
        setStats({
          totalTools: 0,
          totalViews: 0,
          totalTests: 0,
          totalReviews: 0,
          avgRating: 0,
          topCategory: 'N/A',
          growthRate: 0
        });
        setCategoryStats([]);
        return;
      }

      const tools = toolsResponse.items;

      // Calculate overall stats
      const totalViews = tools.reduce((sum, tool) => sum + (tool.views_count || 0), 0);
      const totalTests = tools.reduce((sum, tool) => sum + (tool.tests_count || 0), 0);
      const totalReviews = tools.reduce((sum, tool) => sum + (tool.review_count || 0), 0);
      const avgRating = tools.reduce((sum, tool) => sum + (tool.avg_rating || 0), 0) / tools.length;

      // Find top category
      const categoryGroups = tools.reduce((acc, tool) => {
        const category = tool.category || 'Unknown';
        if (!acc[category]) acc[category] = [];
        acc[category].push(tool);
        return acc;
      }, {} as Record<string, any[]>);

      const topCategory = Object.entries(categoryGroups)
        .sort(([,a], [,b]) => b.length - a.length)[0]?.[0] || 'N/A';

      // Calculate growth rate (simulated based on trending scores)
      const highTrendingCount = tools.filter(tool => (tool.trending_score || 0) > 80).length;
      const growthRate = (highTrendingCount / tools.length) * 100;

      setStats({
        totalTools: tools.length,
        totalViews,
        totalTests,
        totalReviews,
        avgRating,
        topCategory,
        growthRate
      });

      // Calculate category stats
      const categoryStatsData: CategoryStats[] = Object.entries(categoryGroups).map(([category, categoryTools]) => {
        const avgRating = categoryTools.reduce((sum, tool) => sum + (tool.avg_rating || 0), 0) / categoryTools.length;
        const totalViews = categoryTools.reduce((sum, tool) => sum + (tool.views_count || 0), 0);
        const avgTrendingScore = categoryTools.reduce((sum, tool) => sum + (tool.trending_score || 0), 0) / categoryTools.length;
        
        // Determine trend based on average trending score
        let growthTrend: 'up' | 'down' | 'stable' = 'stable';
        if (avgTrendingScore > 85) growthTrend = 'up';
        else if (avgTrendingScore < 70) growthTrend = 'down';

        return {
          category,
          toolCount: categoryTools.length,
          avgRating,
          totalViews,
          growthTrend
        };
      }).sort((a, b) => b.totalViews - a.totalViews);

      setCategoryStats(categoryStatsData);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <BarChart3 className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return 'text-green-600 bg-green-50 border-green-200';
      case 'down': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-3/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-6 bg-muted rounded w-1/3"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-muted rounded"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Analytics Data</h3>
        <p className="text-muted-foreground">Analytics will appear once tool data is available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 bg-gradient-to-br from-blue-50 to-blue-100/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Total Tools
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{formatNumber(stats.totalTools)}</div>
            <div className="flex items-center gap-1 mt-1">
              <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                {stats.topCategory} leading
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-green-50 to-green-100/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-700 flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Total Views
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{formatNumber(stats.totalViews)}</div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-green-600" />
              <span className="text-xs text-green-600">+{stats.growthRate.toFixed(1)}%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-purple-50 to-purple-100/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 flex items-center gap-2">
              <TestTube className="h-4 w-4" />
              Tests Run
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">{formatNumber(stats.totalTests)}</div>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-xs text-purple-600">
                {(stats.totalTests / stats.totalTools).toFixed(1)} avg per tool
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-yellow-50 to-yellow-100/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-700 flex items-center gap-2">
              <Star className="h-4 w-4" />
              Avg Rating
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-900">{stats.avgRating.toFixed(1)}</div>
            <div className="flex items-center gap-1 mt-1">
              <Users className="h-3 w-3 text-yellow-600" />
              <span className="text-xs text-yellow-600">{formatNumber(stats.totalReviews)} reviews</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Category Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categoryStats.map((category) => (
              <div key={category.category} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-medium">{category.category}</h4>
                    <Badge variant="outline" className={getTrendColor(category.growthTrend)}>
                      {getTrendIcon(category.growthTrend)}
                      <span className="ml-1 capitalize">{category.growthTrend}</span>
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
                    <div>
                      <span className="font-medium text-foreground">{category.toolCount}</span> tools
                    </div>
                    <div>
                      <span className="font-medium text-foreground">{formatNumber(category.totalViews)}</span> views
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-current text-yellow-500" />
                      <span className="font-medium text-foreground">{category.avgRating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
                <div className="ml-4">
                  <Progress 
                    value={(category.totalViews / Math.max(...categoryStats.map(c => c.totalViews))) * 100} 
                    className="w-20"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Insights */}
      <Card className="border-0 bg-gradient-to-r from-primary/5 via-background to-secondary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Key Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">🏆 Top Performing Category</h4>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-primary">{stats.topCategory}</span> leads with the most tools and highest engagement
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-sm">📈 Growth Trend</h4>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-green-600">{stats.growthRate.toFixed(1)}%</span> of tools are trending upward
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-sm">🎯 Testing Activity</h4>
              <p className="text-sm text-muted-foreground">
                Average <span className="font-medium text-purple-600">{(stats.totalTests / stats.totalTools).toFixed(1)}</span> tests per tool
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-sm">⭐ Community Rating</h4>
              <p className="text-sm text-muted-foreground">
                Overall satisfaction: <span className="font-medium text-yellow-600">{stats.avgRating.toFixed(1)}/5.0</span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}