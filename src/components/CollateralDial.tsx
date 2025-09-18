import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Shield, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CollateralDialProps {
  collateralRatio: number;
  onRatioChange: (ratio: number) => void;
  isEncrypted: boolean;
}

const CollateralDial = ({ collateralRatio, onRatioChange, isEncrypted }: CollateralDialProps) => {
  const [displayRatio, setDisplayRatio] = useState(collateralRatio);
  const [isPrivate, setIsPrivate] = useState(true);

  useEffect(() => {
    if (isEncrypted && isPrivate) {
      // Simulate encrypted display - show scrambled values
      const interval = setInterval(() => {
        setDisplayRatio(Math.random() * 300 + 100);
      }, 200);
      return () => clearInterval(interval);
    } else {
      setDisplayRatio(collateralRatio);
    }
  }, [collateralRatio, isEncrypted, isPrivate]);

  const getSafetyLevel = (ratio: number) => {
    if (ratio >= 200) return { level: "Secure", color: "text-accent", bg: "bg-gradient-encryption" };
    if (ratio >= 150) return { level: "Safe", color: "text-primary", bg: "bg-gradient-security" };
    return { level: "Risk", color: "text-destructive", bg: "bg-destructive" };
  };

  const safety = getSafetyLevel(collateralRatio);
  const circumference = 2 * Math.PI * 45;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (collateralRatio / 300) * circumference;

  return (
    <Card className="p-6 bg-gradient-vault border-border shadow-card-vault">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Collateral Ratio</h3>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className={safety.bg}>
            <Shield className="w-3 h-3 mr-1" />
            {safety.level}
          </Badge>
          {isEncrypted && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsPrivate(!isPrivate)}
              className="text-muted-foreground hover:text-foreground"
            >
              {isPrivate ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          )}
        </div>
      </div>

      <div className="relative flex items-center justify-center mb-6">
        <svg
          width="140"
          height="140"
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx="70"
            cy="70"
            r="45"
            stroke="hsl(var(--border))"
            strokeWidth="8"
            fill="none"
            className="opacity-30"
          />
          {/* Progress circle */}
          <circle
            cx="70"
            cy="70"
            r="45"
            stroke="hsl(var(--primary))"
            strokeWidth="8"
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-500 shadow-glow-primary"
            style={{
              filter: 'drop-shadow(0 0 8px hsl(var(--primary)))'
            }}
          />
        </svg>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {isEncrypted && isPrivate ? (
            <>
              <Lock className="w-6 h-6 text-primary mb-1" />
              <span className="text-xs text-muted-foreground">Encrypted</span>
              <span className="text-lg font-mono font-bold text-primary animate-pulse">
                {displayRatio.toFixed(0)}%
              </span>
            </>
          ) : (
            <>
              <span className="text-2xl font-mono font-bold text-foreground">
                {displayRatio.toFixed(1)}%
              </span>
              <span className="text-xs text-muted-foreground">Ratio</span>
            </>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Minimum: 150%</span>
          <span className="text-muted-foreground">Optimal: 200%+</span>
        </div>
        
        <Progress 
          value={(collateralRatio / 300) * 100} 
          className="h-2 bg-muted"
        />
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Shield className="w-3 h-3" />
          <span>FHE encryption protects your collateral strategy</span>
        </div>
      </div>
    </Card>
  );
};

export default CollateralDial;