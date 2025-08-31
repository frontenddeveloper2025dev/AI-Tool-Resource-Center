import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  Zap, 
  TrendingUp, 
  Copy, 
  ExternalLink,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TestResult {
  id: string;
  toolType: string;
  prompt: string;
  response: string;
  duration: number;
  timestamp: number;
  quality: number;
}

interface TestResultCardProps {
  result: TestResult;
  onRate?: (id: string, rating: 'up' | 'down') => void;
}

export default function TestResultCard({ result, onRate }: TestResultCardProps) {
  const { toast } = useToast();

  const getQualityColor = (quality: number) => {
    if (quality >= 90) return 'bg-green-500 text-white';
    if (quality >= 75) return 'bg-blue-500 text-white';
    if (quality >= 60) return 'bg-yellow-500 text-black';
    return 'bg-red-500 text-white';
  };

  const getPerformanceLevel = (quality: number) => {
    if (quality >= 90) return 'Excellent';
    if (quality >= 75) return 'Good';
    if (quality >= 60) return 'Average';
    return 'Poor';
  };

  const copyResponse = () => {
    navigator.clipboard.writeText(result.response);
    toast({
      title: "Copied to clipboard",
      description: "Test result has been copied to your clipboard.",
    });
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  return (
    <Card className="bg-neural-800/50 border-neural-600 hover:border-neural-500 transition-all">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-xs capitalize">
              {result.toolType.replace('-', ' ')}
            </Badge>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${getQualityColor(result.quality)}`}>
              {result.quality}% • {getPerformanceLevel(result.quality)}
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-neural-400">
            <Clock className="h-3 w-3" />
            {formatDuration(result.duration)}
          </div>
        </div>

        {/* Prompt */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-neural-200 mb-2">Test Prompt</h4>
          <p className="text-sm text-neural-300 bg-neural-700/50 p-3 rounded-lg border border-neural-600">
            {result.prompt}
          </p>
        </div>

        {/* Response */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-neural-200 mb-2">AI Response</h4>
          <div className="bg-neural-700/30 p-4 rounded-lg border border-neural-600">
            <p className="text-sm text-neural-100 whitespace-pre-wrap leading-relaxed">
              {result.response}
            </p>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-neural-700/30 rounded-lg border border-neural-600">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Zap className="h-4 w-4 text-accent-400" />
            </div>
            <div className="text-xs text-neural-300">Speed</div>
            <div className="text-sm font-medium text-white">
              {result.duration < 2000 ? 'Fast' : result.duration < 5000 ? 'Medium' : 'Slow'}
            </div>
          </div>
          
          <div className="text-center border-x border-neural-600">
            <div className="flex items-center justify-center mb-1">
              <TrendingUp className="h-4 w-4 text-accent-400" />
            </div>
            <div className="text-xs text-neural-300">Quality</div>
            <div className="text-sm font-medium text-white">{result.quality}%</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <ExternalLink className="h-4 w-4 text-accent-400" />
            </div>
            <div className="text-xs text-neural-300">Length</div>
            <div className="text-sm font-medium text-white">
              {result.response.length} chars
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {onRate && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onRate(result.id, 'up')}
                  className="text-xs border-neural-600 hover:bg-green-500/10 hover:border-green-500"
                >
                  <ThumbsUp className="h-3 w-3 mr-1" />
                  Good
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onRate(result.id, 'down')}
                  className="text-xs border-neural-600 hover:bg-red-500/10 hover:border-red-500"
                >
                  <ThumbsDown className="h-3 w-3 mr-1" />
                  Poor
                </Button>
              </>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={copyResponse}
              className="text-xs text-neural-400 hover:text-white"
            >
              <Copy className="h-3 w-3 mr-1" />
              Copy
            </Button>
            <div className="text-xs text-neural-400">
              {new Date(result.timestamp).toLocaleString()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}