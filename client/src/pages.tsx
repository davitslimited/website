import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/ui";
import { Card, CardContent } from "@/ui";
import { Input } from "@/ui";
import { Textarea } from "@/ui";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/ui";
import { useToast } from "@/utils";
import { apiRequest } from "@/utils";
import { insertContactInquirySchema, type InsertContactInquiry } from "./types";
import { 
  Phone, ArrowDown, HardHat, Eye, Bell, Shield, Clock, Users, Check, 
  Award, Handshake, Cog, Mail, MapPin, Send, AlertCircle 
} from "lucide-react";
import logoPath from "@assets/logo.png";

// Home Page
export function Home() {
  const services = [
    {
      icon: HardHat,
      title: "Construction Site Security",
      description: "24/7 professional security monitoring for construction sites, protecting equipment, materials, and ensuring site safety compliance.",
      features: ["Equipment Protection", "Access Control", "Incident Reporting"]
    },
    {
      icon: Eye,
      title: "Surveillance Systems", 
      description: "Advanced CCTV monitoring and surveillance solutions with real-time alerts and comprehensive coverage.",
      features: ["HD Camera Systems", "Remote Monitoring", "Motion Detection"]
    },
    {
      icon: Bell,
      title: "Concierge Services",
      description: "Professional concierge and reception services for commercial properties and corporate buildings.",
      features: ["Visitor Management", "Reception Services", "Administrative Support"]
    }
  ];

  const scrollToServices = () => {
    document.getElementById('services')?.scrollIntoView({ behavior: 'auto' });
  };

  return (
    <>
      {/* Hero Section */}
      <section 
        id="home" 
        className="relative min-h-screen py-24 md:py-32 flex items-center justify-center"
        data-testid="section-hero"
      >
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')" }}
        />
        <div className="absolute inset-0 hero-gradient" />
        
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-white mb-6 leading-tight mt-0" data-testid="text-hero-title">
            <span className="text-primary">Professional</span><br />
            Security Solutions
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed" data-testid="text-hero-description">
            Protecting your assets with unmatched reliability and expertise.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/contact">
              <Button 
                size="lg" 
                className="bg-primary text-primary-foreground hover:bg-accent px-8 py-4 text-lg font-semibold shadow-xl"
                data-testid="button-contact-hero"
              >
                <Phone className="mr-2 h-5 w-5" />
                Contact Us
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="lg"
              onClick={scrollToServices}
              className="border-2 border-white text-white hover:bg-white hover:text-secondary bg-transparent px-8 py-4 text-lg font-semibold"
              data-testid="button-explore-services"
            >
              <ArrowDown className="mr-2 h-5 w-5" />
              Explore Services
            </Button>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section id="services" className="py-20 bg-muted" data-testid="section-services-preview">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6" data-testid="text-services-title">
              Our Services
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="text-services-description">
              Comprehensive security and concierge solutions tailored for construction sites and commercial properties.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                className="service-card bg-card border border-border shadow-lg hover:shadow-xl rounded-lg overflow-hidden"
                data-testid={`card-service-${index}`}
                initial={{ 
                  opacity: 0, 
                  x: index % 2 === 0 ? -100 : 100 
                }}
                whileInView={{ 
                  opacity: 1, 
                  x: 0 
                }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.2,
                  ease: "easeOut"
                }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <div className="p-8">
                  <motion.div 
                    className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mb-6"
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
                    viewport={{ once: true }}
                  >
                    <service.icon className="h-8 w-8 text-primary-foreground" />
                  </motion.div>
                  <h3 className="font-serif text-2xl font-semibold text-foreground mb-4" data-testid={`text-service-title-${index}`}>
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed" data-testid={`text-service-description-${index}`}>
                    {service.description}
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {service.features.map((feature, featureIndex) => (
                      <motion.li 
                        key={featureIndex} 
                        className="flex items-center" 
                        data-testid={`text-feature-${index}-${featureIndex}`}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ 
                          duration: 0.3, 
                          delay: index * 0.2 + 0.5 + featureIndex * 0.1 
                        }}
                        viewport={{ once: true }}
                      >
                        <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center mr-3">
                          <div className="w-1.5 h-1.5 bg-primary-foreground rounded-full" />
                        </div>
                        {feature}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-16">
            <Link href="/services">
              <Button 
                size="lg" 
                className="bg-primary text-primary-foreground hover:bg-accent px-8 py-4 text-lg font-semibold shadow-lg"
                data-testid="button-view-all-services"
              >
                View All Services
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

// Services Page
export function Services() {
  const services = [
    {
      icon: HardHat,
      title: "Construction Site Security",
      description: "24/7 professional security monitoring for construction sites, protecting equipment, materials, and ensuring site safety compliance.",
      features: ["Equipment Protection", "Access Control", "Incident Reporting", "Site Perimeter Security", "Worker Safety Monitoring"],
      image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      icon: Eye,
      title: "Surveillance Systems", 
      description: "Advanced CCTV monitoring and surveillance solutions with real-time alerts and comprehensive coverage.",
      features: ["HD Camera Systems", "Remote Monitoring", "Motion Detection", "Night Vision Capabilities", "Cloud Storage"],
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      icon: Bell,
      title: "Concierge Services",
      description: "Professional concierge and reception services for commercial properties and corporate buildings.",
      features: ["Visitor Management", "Reception Services", "Administrative Support", "Package Handling", "Customer Service"],
      image: "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      icon: Shield,
      title: "Security Consulting",
      description: "Expert security assessments and customized protection strategies for your specific needs and requirements.",
      features: ["Risk Assessment", "Security Planning", "Compliance Support", "Threat Analysis", "Policy Development"],
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      icon: Clock,
      title: "Emergency Response",
      description: "Rapid emergency response services with trained professionals ready to handle any security situation.",
      features: ["24/7 Response", "Incident Management", "Coordination with Authorities", "Crisis Communication", "Emergency Planning"],
      image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      icon: Users,
      title: "Security Personnel",
      description: "Highly trained and licensed security professionals providing on-site protection and peace of mind.",
      features: ["Licensed Guards", "Uniform Presence", "Regular Patrols", "Threat Assessment", "Professional Training"],
      image: "https://images.unsplash.com/photo-1556157382-97eda2d62296?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    }
  ];

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-foreground mb-6" data-testid="text-services-hero-title">
            Professional Security Services
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed" data-testid="text-services-hero-description">
            Comprehensive security and concierge solutions designed to protect your construction sites, 
            commercial properties, and business operations with industry-leading expertise.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="service-card bg-card border border-border shadow-lg hover:shadow-xl" data-testid={`card-service-detail-${index}`}>
                <div className="aspect-video overflow-hidden rounded-t-xl">
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="w-full h-full object-cover"
                    data-testid={`img-service-${index}`}
                  />
                </div>
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mb-6">
                    <service.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h3 className="font-serif text-2xl font-semibold text-foreground mb-4" data-testid={`text-service-detail-title-${index}`}>
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed" data-testid={`text-service-detail-description-${index}`}>
                    {service.description}
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center" data-testid={`text-service-feature-${index}-${featureIndex}`}>
                        <Check className="w-4 h-4 text-primary mr-3" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-16">
            <Link href="/contact">
              <Button 
                size="lg" 
                className="bg-primary text-primary-foreground hover:bg-accent px-8 py-4 text-lg font-semibold shadow-lg"
                data-testid="button-get-custom-quote"
              >
                Get Custom Quote
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

// About Page
export function About() {
  const values = [
    {
      icon: Award,
      title: "Excellence",
      description: "Commitment to the highest standards in all our services."
    },
    {
      icon: Handshake,
      title: "Trust", 
      description: "Building lasting relationships through reliability and integrity."
    },
    {
      icon: Cog,
      title: "Innovation",
      description: "Embracing technology to enhance security effectiveness."
    },
    {
      icon: Clock,
      title: "Availability",
      description: "24/7 service commitment for complete peace of mind."
    }
  ];

  

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-foreground mb-6" data-testid="text-about-hero-title">
            About Davit's Limited
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed" data-testid="text-about-hero-description">
            Since 2018, we've been setting the standard for professional security and concierge services 
            in the construction and commercial property sectors.
          </p>
        </div>
      </section>

      {/* Main About Content */}
      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-8" data-testid="text-about-main-title">
                Our Story
              </h2>
              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                <p data-testid="text-about-paragraph-1">
                  Since 2018, Davit's Limited has been a trusted name in professional security and concierge services. 
                  Founded with a commitment to excellence, we have established ourselves as industry leaders in 
                  construction site security and commercial property protection.
                </p>
                <p data-testid="text-about-paragraph-2">
                  Our team of highly trained security professionals brings years of experience and unwavering 
                  dedication to every project. We understand that security is not just about protection—it's about 
                  providing peace of mind and enabling our clients to focus on what they do best.
                </p>
                <p data-testid="text-about-paragraph-3">
                  With a comprehensive approach to security solutions, we combine traditional security methods 
                  with cutting-edge technology to deliver unmatched protection for construction sites, 
                  commercial properties, and corporate facilities.
                </p>
              </div>
              
              {/* Company Values */}
              <div className="mt-12 grid md:grid-cols-2 gap-6">
                {values.map((value, index) => (
                  <div key={index} className="flex items-start space-x-4" data-testid={`value-${index}`}>
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                      <value.icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2" data-testid={`text-value-title-${index}`}>
                        {value.title}
                      </h3>
                      <p className="text-muted-foreground text-sm" data-testid={`text-value-description-${index}`}>
                        {value.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-8">
              {/* Professional Image */}
              <div className="rounded-xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                  alt="Professional security team" 
                  className="w-full h-80 object-cover"
                  data-testid="img-about-team"
                />
              </div>
              
              
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Contact Page
export function Contact() {
  const { toast } = useToast();
  
  const form = useForm<InsertContactInquiry>({
    resolver: zodResolver(insertContactInquirySchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      serviceType: "",
      message: "",
    },
  });

  const contactMutation = useMutation({
    mutationFn: async (data: InsertContactInquiry) => {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_API_KEY || "",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.message || "Failed to send message");
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Message Sent!",
        description: "Thank you for your inquiry. We'll respond within 2 hours.",
      });
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertContactInquiry) => {
    contactMutation.mutate(data);
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      details: "+44 7850021822",
      subtitle: "24/7 Emergency Line"
    },
    {
      icon: Mail,
      title: "Email",
      details: "info@davitslimited.com",
      subtitle: "Response within 2 hours"
    },
    {
      icon: MapPin,
      title: "Address",
      details: "11 Cross Road, \nFlat 12, \nYardmaster House \nCR0 6FB",
      subtitle: ""
    },
    {
      icon: Clock,
      title: "Hours",
      details: "24/7 Security Services",
      subtitle: "Office: Mon-Fri 8AM-6PM"
    }
  ];

  const serviceAreas = [
    "Metropolitan Area",
    "Surrounding Counties", 
    "Industrial Districts",
    "Commercial Zones"
  ];

  const serviceOptions = [
    { value: "construction", label: "Construction Site Security" },
    { value: "surveillance", label: "Surveillance Systems" },
    { value: "concierge", label: "Concierge Services" },
    { value: "consulting", label: "Security Consulting" },
    { value: "emergency", label: "Emergency Response" },
    { value: "personnel", label: "Security Personnel" }
  ];

  const countryCodes = [
    { code: "+1", country: "US/CA", flag: "🇺🇸" },
    { code: "+44", country: "UK", flag: "🇬🇧" },
    { code: "+33", country: "France", flag: "🇫🇷" },
    { code: "+49", country: "Germany", flag: "🇩🇪" },
    { code: "+39", country: "Italy", flag: "🇮🇹" },
    { code: "+34", country: "Spain", flag: "🇪🇸" },
    { code: "+31", country: "Netherlands", flag: "🇳🇱" },
    { code: "+32", country: "Belgium", flag: "🇧🇪" },
    { code: "+41", country: "Switzerland", flag: "🇨🇭" },
    { code: "+43", country: "Austria", flag: "🇦🇹" },
    { code: "+45", country: "Denmark", flag: "🇩🇰" },
    { code: "+46", country: "Sweden", flag: "🇸🇪" },
    { code: "+47", country: "Norway", flag: "🇳🇴" },
    { code: "+358", country: "Finland", flag: "🇫🇮" },
    { code: "+351", country: "Portugal", flag: "🇵🇹" },
    { code: "+353", country: "Ireland", flag: "🇮🇪" },
    { code: "+61", country: "Australia", flag: "🇦🇺" },
    { code: "+64", country: "New Zealand", flag: "🇳🇿" },
    { code: "+81", country: "Japan", flag: "🇯🇵" },
    { code: "+82", country: "South Korea", flag: "🇰🇷" },
    { code: "+86", country: "China", flag: "🇨🇳" },
    { code: "+91", country: "India", flag: "🇮🇳" },
    { code: "+7", country: "Russia", flag: "🇷🇺" },
    { code: "+55", country: "Brazil", flag: "🇧🇷" },
    { code: "+52", country: "Mexico", flag: "🇲🇽" },
    { code: "+54", country: "Argentina", flag: "🇦🇷" },
    { code: "+56", country: "Chile", flag: "🇨🇱" },
    { code: "+57", country: "Colombia", flag: "🇨🇴" },
    { code: "+58", country: "Venezuela", flag: "🇻🇪" },
    { code: "+51", country: "Peru", flag: "🇵🇪" },
    { code: "+593", country: "Ecuador", flag: "🇪🇨" },
    { code: "+595", country: "Paraguay", flag: "🇵🇾" },
    { code: "+598", country: "Uruguay", flag: "🇺🇾" },
    { code: "+591", country: "Bolivia", flag: "🇧🇴" },
    { code: "+592", country: "Guyana", flag: "🇬🇾" },
    { code: "+594", country: "French Guiana", flag: "🇬🇫" },
    { code: "+597", country: "Suriname", flag: "🇸🇷" },
    { code: "+20", country: "Egypt", flag: "🇪🇬" },
    { code: "+27", country: "South Africa", flag: "🇿🇦" },
    { code: "+234", country: "Nigeria", flag: "🇳🇬" },
    { code: "+254", country: "Kenya", flag: "🇰🇪" },
    { code: "+256", country: "Uganda", flag: "🇺🇬" },
    { code: "+255", country: "Tanzania", flag: "🇹🇿" },
    { code: "+233", country: "Ghana", flag: "🇬🇭" },
    { code: "+212", country: "Morocco", flag: "🇲🇦" },
    { code: "+213", country: "Algeria", flag: "🇩🇿" },
    { code: "+216", country: "Tunisia", flag: "🇹🇳" },
    { code: "+218", country: "Libya", flag: "🇱🇾" },
    { code: "+90", country: "Turkey", flag: "🇹🇷" },
    { code: "+966", country: "Saudi Arabia", flag: "🇸🇦" },
    { code: "+971", country: "UAE", flag: "🇦🇪" },
    { code: "+974", country: "Qatar", flag: "🇶🇦" },
    { code: "+965", country: "Kuwait", flag: "🇰🇼" },
    { code: "+973", country: "Bahrain", flag: "🇧🇭" },
    { code: "+968", country: "Oman", flag: "🇴🇲" },
    { code: "+962", country: "Jordan", flag: "🇯🇴" },
    { code: "+961", country: "Lebanon", flag: "🇱🇧" },
    { code: "+963", country: "Syria", flag: "🇸🇾" },
    { code: "+964", country: "Iraq", flag: "🇮🇶" },
    { code: "+98", country: "Iran", flag: "🇮🇷" },
    { code: "+93", country: "Afghanistan", flag: "🇦🇫" },
    { code: "+92", country: "Pakistan", flag: "🇵🇰" },
    { code: "+880", country: "Bangladesh", flag: "🇧🇩" },
    { code: "+94", country: "Sri Lanka", flag: "🇱🇰" },
    { code: "+977", country: "Nepal", flag: "🇳🇵" },
    { code: "+975", country: "Bhutan", flag: "🇧🇹" },
    { code: "+960", country: "Maldives", flag: "🇲🇻" },
    { code: "+66", country: "Thailand", flag: "🇹🇭" },
    { code: "+65", country: "Singapore", flag: "🇸🇬" },
    { code: "+60", country: "Malaysia", flag: "🇲🇾" },
    { code: "+62", country: "Indonesia", flag: "🇮🇩" },
    { code: "+63", country: "Philippines", flag: "🇵🇭" },
    { code: "+84", country: "Vietnam", flag: "🇻🇳" },
    { code: "+856", country: "Laos", flag: "🇱🇦" },
    { code: "+855", country: "Cambodia", flag: "🇰🇭" },
    { code: "+95", country: "Myanmar", flag: "🇲🇲" },
    { code: "+852", country: "Hong Kong", flag: "🇭🇰" },
    { code: "+853", country: "Macau", flag: "🇲🇴" },
    { code: "+886", country: "Taiwan", flag: "🇹🇼" }
  ];

  const [selectedCountryCode, setSelectedCountryCode] = useState("+1");

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-foreground mb-6" data-testid="text-contact-hero-title">
            Contact Us
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed" data-testid="text-contact-hero-description">
            Ready to secure your property? Get in touch with our security experts for a customized solution.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h3 className="font-serif text-2xl font-semibold text-foreground mb-6" data-testid="text-contact-info-title">
                  Get In Touch
                </h3>
                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex items-start space-x-4" data-testid={`contact-info-${index}`}>
                      <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                        <info.icon className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-1" data-testid={`text-contact-title-${index}`}>
                          {info.title}
                        </h4>
                        <p className="text-muted-foreground whitespace-pre-line" data-testid={`text-contact-details-${index}`}>
                          {info.details}
                        </p>
                        {info.subtitle && (
                          <p className="text-muted-foreground text-sm" data-testid={`text-contact-subtitle-${index}`}>
                            {info.subtitle}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Service Areas */}
              <Card className="bg-card border border-border">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-4" data-testid="text-service-areas-title">
                    Service Areas
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                    {serviceAreas.map((area, index) => (
                      <div key={index} className="flex items-center" data-testid={`service-area-${index}`}>
                        <Check className="h-4 w-4 text-primary mr-2" />
                        {area}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Contact Form */}
            <Card className="bg-card border border-border shadow-lg">
              <CardContent className="p-8">
                <h3 className="font-serif text-2xl font-semibold text-foreground mb-6" data-testid="text-contact-form-title">
                  Request a Quote
                </h3>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="" 
                                {...field} 
                                data-testid="input-first-name"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="" 
                                {...field} 
                                data-testid="input-last-name"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input 
                              type="email"
                              placeholder="example@example.com" 
                              {...field} 
                              data-testid="input-email"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <div className="flex gap-2">
                              <Select 
                                value={selectedCountryCode} 
                                onValueChange={setSelectedCountryCode}
                              >
                                <SelectTrigger className="w-32" data-testid="select-country-code">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="max-h-60">
                                  {countryCodes.map((country) => (
                                    <SelectItem 
                                      key={country.code} 
                                      value={country.code}
                                      data-testid={`select-country-${country.code.replace('+', '')}`}
                                    >
                                      <span className="flex items-center gap-2">
                                        <span>{country.flag}</span>
                                        <span>{country.code}</span>
                                        <span className="text-muted-foreground text-xs">{country.country}</span>
                                      </span>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Input 
                                type="tel"
                                placeholder="123456789"
                                value={field.value ? field.value.replace(/^\+\d+\s*/, '') : ''}
                                onChange={(e) => {
                                  const numbers = e.target.value.replace(/\D/g, '');
                                  field.onChange(`${selectedCountryCode} ${numbers}`);
                                }}
                                onInput={(e) => {
                                  e.currentTarget.value = e.currentTarget.value.replace(/\D/g, '');
                                }}
                                className="flex-1"
                                data-testid="input-phone"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="serviceType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Service Type</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-service-type">
                                <SelectValue placeholder="Select a service..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {serviceOptions.map((option) => (
                                <SelectItem 
                                  key={option.value} 
                                  value={option.value}
                                  data-testid={`select-option-${option.value}`}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Tell us about your security needs..."
                              className="resize-none"
                              rows={5}
                              {...field}
                              data-testid="textarea-message"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      disabled={contactMutation.isPending}
                      className="w-full bg-primary text-primary-foreground hover:bg-accent py-4 px-6 text-lg font-semibold shadow-lg"
                      data-testid="button-submit-contact"
                    >
                      {contactMutation.isPending ? (
                        "Sending..."
                      ) : (
                        <>
                          <Send className="mr-2 h-5 w-5" />
                          Send Request
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}

// NotFound Page
export function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-900">404 Page Not Found</h1>
          </div>

          <p className="mt-4 text-sm text-gray-600">
            Did you forget to add the page to the router?
          </p>
        </CardContent>
      </Card>
    </div>
  );
}