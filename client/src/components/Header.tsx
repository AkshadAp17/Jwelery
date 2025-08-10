import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Menu, MapPin, Clock, Phone, Mail, User, Settings, LogOut } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import LanguageSelector from "./LanguageSelector";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

export default function Header() {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const { t } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();

  // Complete collections from authentic Mamdej Jewellers catalog
  const collections = [
    {
      name: "Patta Poth Collection",
      items: [
        { name: "Long Poth 22K", path: "/category/patta-poth/long", count: "2 Designs" },
        { name: "Short Poth 22K", path: "/category/patta-poth/short", count: "1 Design" }
      ]
    },
    {
      name: "Necklace Collection", 
      items: [
        { name: "Fancy 20K Gold", path: "/category/necklace/fancy-20k", count: "2 Designs" },
        { name: "Temple 22K Gold", path: "/category/necklace/temple-22k", count: "1 Design" },
        { name: "Fancy 22K Gold", path: "/category/necklace/fancy-22k", count: "1 Design" },
        { name: "Classic 20K Gold", path: "/category/necklace/classic-20k", count: "1 Design" },
        { name: "Classic 22K Gold", path: "/category/necklace/classic-22k", count: "1 Design" },
        { name: "Arbi 20K Gold", path: "/category/necklace/arbi-20k", count: "1 Design" }
      ]
    },
    {
      name: "Fancy Poth Collection",
      items: [
        { name: "With Pendant", path: "/category/fancy-poth/with-pendant", count: "1 Design" },
        { name: "Cartier Style", path: "/category/fancy-poth/cartier", count: "1 Design" },
        { name: "Nano Poth", path: "/category/fancy-poth/nano", count: "1 Design" },
        { name: "Short Poth", path: "/category/fancy-poth/short", count: "1 Design" },
        { name: "Long Poth", path: "/category/fancy-poth/long", count: "1 Design" }
      ]
    },
    {
      name: "Choker Collection",
      items: [
        { name: "Temple Choker 22K", path: "/category/choker/temple", count: "1 Design" },
        { name: "Yellow Choker", path: "/category/choker/yellow", count: "1 Design" }
      ]
    }
  ];

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Top bar with contact info */}
        <div className="border-b border-gray-200 py-2">
          <div className="flex justify-between items-center text-sm">
            <div className="hidden md:flex space-x-4">
              <span className="flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-2 text-gold" />
                123 Market Street, Mumbai, Maharashtra 400001
              </span>
              <span className="flex items-center text-gray-600">
                <Clock className="w-4 h-4 mr-2 text-gold" />
                Mon-Sat: 10AM-8PM
              </span>
            </div>
            <div className="flex space-x-4">
              <a 
                href="tel:+919876543210" 
                className="flex items-center text-gold hover:text-yellow-600 transition-colors"
              >
                <Phone className="w-4 h-4 mr-2" />
                +91 98765 43210
              </a>
              <a 
                href="mailto:info@shreejewellers.com" 
                className="hidden sm:flex items-center text-gold hover:text-yellow-600 transition-colors"
              >
                <Mail className="w-4 h-4 mr-2" />
                info@shreejewellers.com
              </a>
            </div>
          </div>
        </div>

        {/* Main navigation */}
        <nav className="py-4">
          <div className="flex justify-between items-center">
            <Link href="/">
              <div className="flex items-center">
                <h1 className="font-playfair text-3xl font-bold text-navy">
                  <i className="fas fa-gem text-gold mr-2"></i>
                  {t('company.name')}
                </h1>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              <Link href="/">
                <Button 
                  variant="ghost" 
                  className={`text-navy hover:text-gold transition-colors font-medium ${
                    location === "/" ? "text-gold" : ""
                  }`}
                >
                  {t('nav.home')}
                </Button>
              </Link>
              
              <div className="relative group">
                <Button variant="ghost" className="text-navy hover:text-gold transition-colors font-medium">
                  {t('nav.collections')} <i className="fas fa-chevron-down ml-1"></i>
                </Button>
                <div className="absolute top-full left-0 mt-2 w-48 bg-white shadow-xl rounded-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  {categories.map((category) => (
                    <Link key={category.path} href={category.path}>
                      <button 
                        className={`block w-full text-left px-4 py-2 text-gray-700 hover:bg-gold hover:text-white transition-colors ${
                          location === category.path ? "bg-gold text-white" : ""
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {category.name}
                      </button>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Search and Mobile Menu */}
            <div className="flex items-center space-x-4">
              <div className="relative hidden sm:block">
                <Input
                  type="text"
                  placeholder={t('search.placeholder')}
                  className="border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:border-gold"
                />
                <Search className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              
              <LanguageSelector />

              {/* Authentication */}
              {isAuthenticated ? (
                <div className="flex items-center space-x-2">
                  <span className="hidden sm:inline text-sm text-navy">
                    Welcome, {user?.firstName || user?.email}
                  </span>
                  <div className="relative group">
                    <Button variant="ghost" size="icon" className="text-navy">
                      <User className="w-5 h-5" />
                    </Button>
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white shadow-xl rounded-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      {user?.role === 'admin' && (
                        <Link href="/admin">
                          <button className="flex items-center w-full text-left px-4 py-2 text-gray-700 hover:bg-gold hover:text-white transition-colors">
                            <Settings className="w-4 h-4 mr-2" />
                            Admin Panel
                          </button>
                        </Link>
                      )}
                      <button 
                        onClick={logout}
                        className="flex items-center w-full text-left px-4 py-2 text-gray-700 hover:bg-gold hover:text-white transition-colors"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Dialog open={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="text-navy border-navy hover:bg-navy hover:text-white">
                      <User className="w-4 h-4 mr-2" />
                      Login
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>
                        {authMode === 'login' ? 'Login to Your Account' : 'Create Account'}
                      </DialogTitle>
                    </DialogHeader>
                    {authMode === 'login' ? (
                      <LoginForm 
                        onSuccess={() => setIsAuthDialogOpen(false)}
                        onToggleMode={() => setAuthMode('signup')}
                      />
                    ) : (
                      <SignupForm 
                        onSuccess={() => setIsAuthDialogOpen(false)}
                        onToggleMode={() => setAuthMode('login')}
                      />
                    )}
                  </DialogContent>
                </Dialog>
              )}
              
              {/* Mobile Menu */}
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden text-navy">
                    <Menu className="w-6 h-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <div className="flex flex-col space-y-4 mt-8">
                    <Link href="/">
                      <Button 
                        variant="ghost" 
                        className="justify-start w-full"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Home
                      </Button>
                    </Link>
                    
                    <div className="space-y-2">
                      <h3 className="font-semibold text-navy mb-3">Collections</h3>
                      {categories.map((category) => (
                        <Link key={category.path} href={category.path}>
                          <Button 
                            variant="ghost" 
                            className="justify-start w-full pl-4"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {category.name}
                          </Button>
                        </Link>
                      ))}
                    </div>
                    
                    <div className="pt-4">
                      <Input
                        type="text"
                        placeholder="Search products..."
                        className="w-full"
                      />
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
