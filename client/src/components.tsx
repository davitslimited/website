import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/ui";
import { Sheet, SheetContent, SheetTrigger } from "@/ui";
import { Menu, Facebook, Linkedin, Twitter } from "lucide-react";
import logoPath from "@assets/logo.png";

// Navigation Component
export function Navigation() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo Section */}
          <Link href="/" className="flex items-center space-x-3" data-testid="link-home-logo">
            <div className="w-16 h-16 overflow-hidden">
              <img 
                src={logoPath} 
                alt="Davit's Limited Logo" 
                className="w-full h-full object-contain"
                data-testid="img-company-logo"
              />
            </div>
            <div>
              <h1 className="font-serif font-bold text-xl text-primary" data-testid="text-company-name">
                DAVIT'S LIMITED
              </h1>
              <p className={`text-xs font-medium tracking-wide ${location === '/' ? 'text-white' : 'text-secondary'}`} data-testid="text-company-tagline">
                SECURITY & CONCIERGE SERVICE
              </p>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link 
                key={item.href}
                href={item.href}
                className={`font-medium transition-colors hover:text-primary ${
                  location === item.href 
                    ? 'text-primary' 
                    : location === '/' 
                      ? 'text-white' 
                      : 'text-foreground'
                }`}
                data-testid={`link-nav-${item.label.toLowerCase()}`}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/contact">
              <Button 
                className={`${
                  location === '/' 
                    ? 'bg-primary text-white hover:bg-accent' 
                    : 'bg-primary text-primary-foreground hover:bg-accent'
                }`}
                data-testid="button-get-quote"
              >
                Get Quote
              </Button>
            </Link>
          </div>
          
          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Menu className={`h-6 w-6 ${location === '/' ? 'text-white' : ''}`} />
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col space-y-4 mt-8">
                {navItems.map((item) => (
                  <Link 
                    key={item.href}
                    href={item.href}
                    className={`text-lg font-medium transition-colors hover:text-primary ${
                      location === item.href ? 'text-primary' : 'text-foreground'
                    }`}
                    onClick={() => setIsOpen(false)}
                    data-testid={`link-mobile-${item.label.toLowerCase()}`}
                  >
                    {item.label}
                  </Link>
                ))}
                <Link href="/contact" onClick={() => setIsOpen(false)}>
                  <Button 
                    className="w-full bg-primary text-primary-foreground hover:bg-accent mt-4"
                    data-testid="button-mobile-quote"
                  >
                    Get Quote
                  </Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}

// Footer Component
export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-16 h-16 overflow-hidden">
                <img 
                  src={logoPath} 
                  alt="Davit's Limited Logo" 
                  className="w-full h-full object-contain"
                  data-testid="img-footer-logo"
                />
              </div>
              <div>
                <h3 className="font-serif font-bold text-xl text-primary" data-testid="text-footer-company-name">
                  DAVIT'S LIMITED
                </h3>
                <p className="text-sm text-white opacity-80" data-testid="text-footer-tagline">
                  SECURITY & CONCIERGE SERVICE
                </p>
              </div>
            </div>
            <p className="text-secondary-foreground/80 mb-6 max-w-md leading-relaxed" data-testid="text-footer-description">
              Professional security and concierge services since 2018. Protecting your assets with 
              unmatched reliability, expertise, and 24/7 commitment to excellence.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center hover:bg-accent transition-colors"
                data-testid="link-social-facebook"
              >
                <Facebook className="w-5 h-5 text-primary-foreground" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center hover:bg-accent transition-colors"
                data-testid="link-social-linkedin"
              >
                <Linkedin className="w-5 h-5 text-primary-foreground" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center hover:bg-accent transition-colors"
                data-testid="link-social-twitter"
              >
                <Twitter className="w-5 h-5 text-primary-foreground" />
              </a>
            </div>
          </div>
          
          {/* Services */}
          <div>
            <h4 className="font-semibold text-lg mb-6" data-testid="text-footer-services-title">Services</h4>
            <ul className="space-y-3 text-secondary-foreground/80">
              <li>
                <Link href="/services" className="hover:text-primary transition-colors" data-testid="link-footer-construction">
                  Construction Security
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-primary transition-colors" data-testid="link-footer-surveillance">
                  Surveillance Systems
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-primary transition-colors" data-testid="link-footer-concierge">
                  Concierge Services
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-primary transition-colors" data-testid="link-footer-consulting">
                  Security Consulting
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-primary transition-colors" data-testid="link-footer-emergency">
                  Emergency Response
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-6" data-testid="text-footer-links-title">Quick Links</h4>
            <ul className="space-y-3 text-secondary-foreground/80">
              <li>
                <Link href="/" className="hover:text-primary transition-colors" data-testid="link-footer-home">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary transition-colors" data-testid="link-footer-about">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors" data-testid="link-footer-contact">
                  Contact
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors" data-testid="link-footer-privacy">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-secondary-foreground/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-secondary-foreground/60 text-sm" data-testid="text-footer-copyright">
              © 2025 Davit's Limited. All rights reserved. Since 2018.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <span className="text-secondary-foreground/60 text-sm" data-testid="text-footer-licensed">
                Licensed & Insured
              </span>
              <span className="text-secondary-foreground/60 text-sm">•</span>
              <span className="text-secondary-foreground/60 text-sm" data-testid="text-footer-availability">
                24/7 Available
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}