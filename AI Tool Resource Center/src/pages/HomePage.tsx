import { ArrowRight, Brain, Cpu, FlaskConical, Star, TrendingUp, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Link } from 'react-router-dom'
import Header from '@/components/Header'
import RecommendationEngine from '@/components/RecommendationEngine'

function HomePage() {
  const featuredTools = [
    {
      name: "GPT-4 Vision",
      category: "Computer Vision",
      description: "Advanced multimodal AI for image analysis and understanding",
      rating: 4.8,
      tests: 1247,
      trending: true
    },
    {
      name: "Claude 3 Opus",
      category: "Language Model",
      description: "Powerful conversational AI with advanced reasoning capabilities",
      rating: 4.9,
      tests: 892,
      trending: true
    },
    {
      name: "Midjourney v6",
      category: "Image Generation",
      description: "State-of-the-art AI art generation with photorealistic quality",
      rating: 4.7,
      tests: 2156,
      trending: false
    }
  ]

  const categories = [
    { name: "Language Models", icon: Brain, count: 47, color: "ai-neural" },
    { name: "Image Generation", icon: Zap, count: 23, color: "ai-success" },
    { name: "Computer Vision", icon: Cpu, count: 19, color: "text-orange-500" },
    { name: "Audio/Speech", icon: FlaskConical, count: 15, color: "text-purple-500" }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="text-gradient">AI Tool Tester</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-4">
              Your Ultimate AI Tools Resource
            </p>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Testing, Reviewing, and Trending AI Innovations. Discover the best AI tools, 
              test them in real-time, and make informed decisions for your projects.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to="/test">
                <Button size="lg" className="ai-gradient text-white hover:opacity-90">
                  <FlaskConical className="w-5 h-5 mr-2" />
                  Start Testing Tools
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to="/reviews">
                <Button size="lg" variant="outline">
                  <Star className="w-5 h-5 mr-2" />
                  Browse Reviews
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold ai-neural">104</div>
                <div className="text-sm text-muted-foreground">AI Tools</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold ai-success">4,523</div>
                <div className="text-sm text-muted-foreground">Tests Run</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-500">1,892</div>
                <div className="text-sm text-muted-foreground">Reviews</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-500">24/7</div>
                <div className="text-sm text-muted-foreground">Live Testing</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Explore AI Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => {
              const IconComponent = category.icon
              return (
                <Card key={category.name} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <IconComponent className={`w-12 h-12 mx-auto mb-4 ${category.color}`} />
                    <h3 className="font-semibold mb-2">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">{category.count} tools</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured Tools Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold">Featured AI Tools</h2>
            <Button variant="ghost" asChild>
              <Link to="/trending">
                View All Tools
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTools.map((tool) => (
              <Card key={tool.name} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {tool.name}
                        {tool.trending && (
                          <Badge variant="secondary" className="bg-ai-success/10 text-ai-success border-ai-success/20">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            Trending
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription>{tool.category}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{tool.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{tool.rating}</span>
                      <span className="text-sm text-muted-foreground">({tool.tests} tests)</span>
                    </div>
                    <Button size="sm" variant="outline">
                      Test Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Recommendations Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <RecommendationEngine limit={3} />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose AI Tool Tester?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 ai-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                <FlaskConical className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-Time Testing</h3>
              <p className="text-muted-foreground">
                Test AI tools instantly in your browser with live results and performance metrics
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 ai-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Reviews</h3>
              <p className="text-muted-foreground">
                Get detailed reviews and ratings from AI experts and community members
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 ai-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Trending Insights</h3>
              <p className="text-muted-foreground">
                Stay ahead with the latest AI innovations and trending tools in the market
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Ready to Explore AI Tools?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of developers, researchers, and AI enthusiasts who trust 
              AI Tool Tester for their AI tool discovery and testing needs.
            </p>
            <Button size="lg" className="ai-gradient text-white hover:opacity-90" asChild>
              <Link to="/trending">
                <Brain className="w-5 h-5 mr-2" />
                Start Testing Today
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage 