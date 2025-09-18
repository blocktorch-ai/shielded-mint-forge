import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Coins, ArrowRight, Shield, Lock } from "lucide-react";

interface MintingInterfaceProps {
  collateralAmount: number;
  onCollateralChange: (amount: number) => void;
  onMint: (amount: number) => void;
  isConnected: boolean;
}

const MintingInterface = ({ 
  collateralAmount, 
  onCollateralChange, 
  onMint, 
  isConnected 
}: MintingInterfaceProps) => {
  const [stablecoinAmount, setStablecoinAmount] = useState(0);
  const [isMinting, setIsMinting] = useState(false);

  const maxMintable = (collateralAmount * 0.67); // 67% of collateral value
  const currentRatio = collateralAmount > 0 ? (collateralAmount / stablecoinAmount) * 100 : 0;

  const handleMint = async () => {
    if (!isConnected || stablecoinAmount <= 0) return;
    
    setIsMinting(true);
    await new Promise(resolve => setTimeout(resolve, 3000));
    onMint(stablecoinAmount);
    setIsMinting(false);
  };

  const handleCollateralInput = (value: string) => {
    const amount = parseFloat(value) || 0;
    onCollateralChange(amount);
  };

  const handleStablecoinInput = (value: string) => {
    const amount = parseFloat(value) || 0;
    setStablecoinAmount(amount);
  };

  return (
    <Card className="p-6 bg-gradient-vault border-border shadow-card-vault">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-gradient-security shadow-glow-primary">
          <Coins className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Mint Stablecoins</h3>
          <p className="text-sm text-muted-foreground">Secure minting with FHE privacy</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Collateral Input */}
        <div className="space-y-2">
          <Label htmlFor="collateral" className="text-sm font-medium text-foreground">
            Collateral Amount (ETH)
          </Label>
          <div className="relative">
            <Input
              id="collateral"
              type="number"
              placeholder="0.00"
              value={collateralAmount || ""}
              onChange={(e) => handleCollateralInput(e.target.value)}
              className="pr-16 bg-input border-border text-foreground"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              ETH
            </span>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <ArrowRight className="w-5 h-5 text-muted-foreground" />
        </div>

        {/* Stablecoin Output */}
        <div className="space-y-2">
          <Label htmlFor="stablecoin" className="text-sm font-medium text-foreground">
            Mint Amount (FUSD)
          </Label>
          <div className="relative">
            <Input
              id="stablecoin"
              type="number"
              placeholder="0.00"
              value={stablecoinAmount || ""}
              onChange={(e) => handleStablecoinInput(e.target.value)}
              className="pr-16 bg-input border-border text-foreground"
              max={maxMintable}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              FUSD
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Maximum mintable: {maxMintable.toFixed(2)} FUSD
          </p>
        </div>

        <Separator className="bg-border" />

        {/* Transaction Details */}
        <div className="space-y-3 rounded-lg bg-muted p-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Current Ratio</span>
            <span className="text-sm font-mono text-foreground">
              {currentRatio.toFixed(1)}%
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Liquidation Risk</span>
            <Badge 
              variant={currentRatio >= 200 ? "secondary" : currentRatio >= 150 ? "default" : "destructive"}
              className={currentRatio >= 200 ? "bg-gradient-encryption" : ""}
            >
              {currentRatio >= 200 ? "Low" : currentRatio >= 150 ? "Medium" : "High"}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Privacy Status</span>
            <div className="flex items-center gap-1 text-xs">
              <Lock className="w-3 h-3 text-accent" />
              <span className="text-accent">FHE Protected</span>
            </div>
          </div>
        </div>

        {/* Mint Button */}
        <Button
          onClick={handleMint}
          disabled={!isConnected || stablecoinAmount <= 0 || stablecoinAmount > maxMintable || isMinting}
          className="w-full bg-gradient-security hover:shadow-glow-primary transition-all duration-300"
          size="lg"
        >
          {isMinting ? (
            <>
              <Shield className="w-4 h-4 mr-2 animate-spin" />
              Minting Securely...
            </>
          ) : (
            <>
              <Coins className="w-4 h-4 mr-2" />
              Mint {stablecoinAmount.toFixed(2)} FUSD
            </>
          )}
        </Button>

        {!isConnected && (
          <p className="text-center text-sm text-muted-foreground">
            Connect your wallet to start minting
          </p>
        )}
      </div>
    </Card>
  );
};

export default MintingInterface;