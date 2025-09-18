import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Lock, Zap, Users, TrendingUp, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Lock,
      title: "Private Collateral",
      description: "Your collateral ratios remain encrypted and hidden from public view using FHE technology"
    },
    {
      icon: Eye,
      title: "MEV Protection", 
      description: "Front-running protection through encrypted transaction data prevents sandwich attacks"
    },
    {
      icon: TrendingUp,
      title: "Secure Computation",
      description: "All liquidation calculations happen on encrypted data without revealing sensitive information"
    }
  ];

  const stats = [
    { label: "Total Value Locked", value: "$12.5M", encrypted: true },
    { label: "Active Vaults", value: "2,847", encrypted: false },
    { label: "Minted FUSD", value: "8.2M", encrypted: true },
    { label: "Avg. Collateral Ratio", value: "***%", encrypted: true }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-gradient-vault shadow-vault">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <Logo size={48} />
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="bg-gradient-encryption text-accent-foreground">
                <Lock className="w-3 h-3 mr-1" />
                FHE Protected
              </Badge>
              <Button 
                onClick={() => navigate("/vault")}
                className="bg-gradient-security hover:shadow-glow-primary transition-all duration-300"
              >
                Launch Vault
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Collateral Secured by{" "}
            <span className="bg-gradient-security bg-clip-text text-transparent">
              FHE
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Mint stablecoins with complete privacy. Your collateral ratios, liquidation thresholds, 
            and trading strategies remain encrypted using Fully Homomorphic Encryption.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => navigate("/vault")}
              className="bg-gradient-security hover:shadow-glow-primary transition-all duration-300"
            >
              Start Minting
              <Zap className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              <Users className="w-5 h-5 mr-2" />
              View Documentation
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6 bg-gradient-vault border-border shadow-card-vault text-center">
              <div className="flex items-center justify-center mb-2">
                {stat.encrypted && <Lock className="w-4 h-4 text-accent mr-2" />}
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              </div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Why Choose FHE Vault?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience the next generation of DeFi with mathematical privacy guarantees
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="p-8 bg-gradient-vault border-border shadow-card-vault hover:shadow-glow-subtle transition-all duration-300">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-security flex items-center justify-center shadow-glow-primary">
                  <feature.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-16">
        <Card className="p-12 bg-gradient-vault border-border shadow-vault text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold text-foreground">
              Ready to Mint with Privacy?
            </h2>
            <p className="text-lg text-muted-foreground">
              Join the future of private DeFi. Your financial strategy remains yours alone.
            </p>
            <Button 
              size="lg"
              onClick={() => navigate("/vault")}
              className="bg-gradient-security hover:shadow-glow-primary transition-all duration-300"
            >
              Launch FHE Vault
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-gradient-vault">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <Logo size={32} />
            <div className="flex items-center gap-6 mt-4 md:mt-0">
              <span className="text-sm text-muted-foreground">
                Powered by Fully Homomorphic Encryption
              </span>
              <Badge variant="outline" className="border-accent text-accent">
                <Zap className="w-3 h-3 mr-1" />
                Live on Testnet
              </Badge>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-border text-center">
            <p className="text-xs text-muted-foreground">
              Your financial privacy is mathematically guaranteed. All computations on encrypted data.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;