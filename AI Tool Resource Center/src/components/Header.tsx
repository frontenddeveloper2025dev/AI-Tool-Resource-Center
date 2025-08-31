import { Brain, Menu, Search, User, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Link } from 'react-router-dom'
import { useAuthStore } from '@/store/auth-store'
import { AuthModal } from './AuthModal'
import { useState } from 'react'

function Header() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleSignOut = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Brain className="w-8 h-8 ai-neural" />
              <div className="flex flex-col">
                <h1 className="text-xl font-bold text-gradient">AI Tool Tester</h1>
                <p className="text-xs text-muted-foreground hidden sm:block">Your Ultimate AI Tools Resource</p>
              </div>
            </div>
          </Link>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search AI tools, reviews, or trending innovations..." 
                className="pl-10 w-full"
              />
            </div>
          </div>

          {/* Navigation and Actions */}
          <div className="flex items-center gap-2">
            <Link to="/test">
              <Button variant="ghost" className="hidden lg:inline-flex">
                Test Tools
              </Button>
            </Link>
            <Link to="/reviews">
              <Button variant="ghost" className="hidden lg:inline-flex">
                Reviews
              </Button>
            </Link>
            <Link to="/trending">
              <Button variant="ghost" className="hidden lg:inline-flex">
                Trending
              </Button>
            </Link>
            
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground hidden sm:inline">
                  Welcome, {user?.name || user?.email?.split('@')[0]}
                </span>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button variant="outline" size="sm" className="hidden sm:inline-flex" onClick={() => setShowAuthModal(true)}>
                <User className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            )}
            
            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden mt-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search AI tools..." 
              className="pl-10 w-full"
            />
          </div>
        </div>
      </div>
      
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </header>
  )
}

export default Header