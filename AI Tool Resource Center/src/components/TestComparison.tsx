import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  Zap, 
  Clock, 
  Target, 
  TrendingUp,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

interface TestResult {
  id: string;
  toolType: string;
  prompt: string;
  response: string;
  duration: number;
  timestamp: number;
  quality: number;
}

interface TestComparisonProps {
  results: TestResult[];
  selectedResults?: string[];
  onSelectResult?: (id: string) => void;
}

export default function TestComparison({ results, selectedResults = [], onSelectResult }: TestComparisonProps) {
  const [compareView, setCompareView] = useState<'side-by-side' | 'metrics'>('side-by-side');

  const selectedTestResults = results.filter(result => selectedResults.includes(result.id));
  const canCompare = selectedTestResults.length >= 2;

  const calculateAverageMetrics = (results: TestResult[]) => {
    if (results.length === 0) return { avgQuality: 0, avgDuration: 0, totalTests: 0 };
    
    const avgQuality = results.reduce((sum, r) => sum + r.quality, 0) / results.length;
    const avgDuration = results.reduce((sum, r) => sum + r.duration, 0) / results.length;
    
    return {
      avgQuality: Math.round(avgQuality),
      avgDuration: Math.round(avgDuration),
      totalTests: results.length
    };
  };

  const getQualityColor = (quality: number) => {
    if (quality >= 90) return 'text-green-400';
    if (quality >= 75) return 'text-blue-400';
    if (quality >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getBestPerformer = () => {
    if (selectedTestResults.length === 0) return null;
    return selectedTestResults.reduce((best, current) => 
      current.quality > best.quality ? current : best
    );
  };

  const getFastestResponse = () => {
    if (selectedTestResults.length === 0) return null;
    return selectedTestResults.reduce((fastest, current) => 
      current.duration < fastest.duration ? current : fastest
    );
  };

  return (
    <div className="space-y-6">
      {/* Comparison Controls */}
      <Card className="bg-neural-800/50 border-neural-600">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-accent-400" />
            Test Comparison
            {selectedTestResults.length > 0 && (
              <Badge variant="outline" className="ml-2">
                {selectedTestResults.length} selected
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <p className="text-sm text-neural-300">
              Select test results to compare performance metrics and responses
            </p>
            
            {canCompare && (
              <Tabs value={compareView} onValueChange={(value) => setCompareView(value as any)}>
                <TabsList className="bg-neural-700 border-neural-600">
                  <TabsTrigger value="side-by-side">Side by Side</TabsTrigger>
                  <TabsTrigger value="metrics">Metrics</TabsTrigger>
                </TabsList>
              </Tabs>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Test Selection */}
      <Card className="bg-neural-800/50 border-neural-600">
        <CardHeader>
          <CardTitle className="text-lg">Available Test Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {results.length === 0 ? (
              <div className="text-center py-8">
                <Target className="h-12 w-12 text-neural-500 mx-auto mb-4" />
                <p className="text-neural-400">No test results available</p>
                <p className="text-sm text-neural-500 mt-2">
                  Run some AI tool tests to enable comparison features
                </p>
              </div>
            ) : (
              results.map((result) => (
                <div
                  key={result.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedResults.includes(result.id)
                      ? 'border-accent-400 bg-accent-400/10'
                      : 'border-neural-600 bg-neural-700/30 hover:border-neural-500'
                  }`}
                  onClick={() => onSelectResult?.(result.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {result.toolType.replace('-', ' ')}
                        </Badge>
                        <span className={`text-sm font-medium ${getQualityColor(result.quality)}`}>
                          {result.quality}%
                        </span>
                      </div>
                      <p className="text-sm text-neural-300 line-clamp-2">
                        {result.prompt}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-neural-400">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {(result.duration / 1000).toFixed(1)}s
                        </span>
                        <span>{new Date(result.timestamp).toLocaleTimeString()}</span>
                      </div>
                    </div>
                    
                    {selectedResults.includes(result.id) && (
                      <CheckCircle2 className="h-5 w-5 text-accent-400 ml-3" />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Comparison Results */}
      {canCompare && (
        <Card className="bg-neural-800/50 border-neural-600">
          <CardContent className="p-6">
            <Tabs value={compareView} onValueChange={(value) => setCompareView(value as any)}>
              <TabsContent value="side-by-side" className="space-y-6">
                <div className="grid gap-6">
                  {selectedTestResults.map((result, index) => (
                    <div key={result.id} className="relative">
                      {index > 0 && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <ArrowRight className="h-4 w-4 text-neural-400 rotate-90" />
                        </div>
                      )}
                      
                      <Card className="bg-neural-700/50 border-neural-600">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <Badge variant="outline">
                              Test {index + 1} • {result.toolType.replace('-', ' ')}
                            </Badge>
                            <div className="flex items-center gap-4 text-sm">
                              <span className={`font-medium ${getQualityColor(result.quality)}`}>
                                {result.quality}% Quality
                              </span>
                              <span className="text-neural-400">
                                {(result.duration / 1000).toFixed(1)}s
                              </span>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div>
                              <h4 className="text-sm font-medium text-neutral-200 mb-2">Prompt</h4>
                              <p className="text-sm text-neural-300 bg-neural-800/50 p-3 rounded-lg">
                                {result.prompt}
                              </p>
                            </div>
                            
                            <div>
                              <h4 className="text-sm font-medium text-neutral-200 mb-2">Response</h4>
                              <p className="text-sm text-neural-100 bg-neural-800/50 p-3 rounded-lg max-h-[200px] overflow-y-auto">
                                {result.response}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="metrics" className="space-y-6">
                {/* Performance Summary */}
                <div className="grid md:grid-cols-3 gap-4">
                  <Card className="bg-neural-700/30 border-neural-600">
                    <CardContent className="p-4 text-center">
                      <TrendingUp className="h-8 w-8 text-green-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">
                        {getBestPerformer()?.quality}%
                      </div>
                      <div className="text-sm text-neural-300">Best Quality</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-neural-700/30 border-neural-600">
                    <CardContent className="p-4 text-center">
                      <Zap className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">
                        {getFastestResponse() ? (getFastestResponse()!.duration / 1000).toFixed(1) : 0}s
                      </div>
                      <div className="text-sm text-neural-300">Fastest Response</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-neural-700/30 border-neural-600">
                    <CardContent className="p-4 text-center">
                      <Target className="h-8 w-8 text-accent-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">
                        {calculateAverageMetrics(selectedTestResults).avgQuality}%
                      </div>
                      <div className="text-sm text-neural-300">Avg Quality</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Detailed Metrics Table */}
                <Card className="bg-neural-700/30 border-neural-600">
                  <CardHeader>
                    <CardTitle className="text-lg">Detailed Comparison</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-neural-600">
                            <th className="text-left py-3 text-neural-300">Test</th>
                            <th className="text-center py-3 text-neural-300">Quality</th>
                            <th className="text-center py-3 text-neural-300">Duration</th>
                            <th className="text-center py-3 text-neural-300">Response Length</th>
                            <th className="text-center py-3 text-neural-300">Category</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedTestResults.map((result, index) => (
                            <tr key={result.id} className="border-b border-neural-700">
                              <td className="py-3 text-white">Test {index + 1}</td>
                              <td className={`text-center py-3 font-medium ${getQualityColor(result.quality)}`}>
                                {result.quality}%
                              </td>
                              <td className="text-center py-3 text-neural-300">
                                {(result.duration / 1000).toFixed(1)}s
                              </td>
                              <td className="text-center py-3 text-neural-300">
                                {result.response.length} chars
                              </td>
                              <td className="text-center py-3">
                                <Badge variant="outline" className="text-xs">
                                  {result.toolType.replace('-', ' ')}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}