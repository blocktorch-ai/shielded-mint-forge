import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Lock, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";
import WalletConnect from "@/components/WalletConnect";
import CollateralDial from "@/components/CollateralDial";
import MintingInterface from "@/components/MintingInterface";
import ContractInteraction from "@/components/ContractInteraction";

const Vault = () => {
  const navigate = useNavigate();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [collateralAmount, setCollateralAmount] = useState(1.0);
  const [collateralRatio, setCollateralRatio] = useState(250);

  const isConnected = !!walletAddress;

  const handleWalletConnect = (address: string) => {
    setWalletAddress(address);
  };

  const handleCollateralChange = (amount: number) => {
    setCollateralAmount(amount);
    // Simulate ratio calculation (collateral worth $3000 per ETH, need 150%+ ratio)
    const newRatio = amount > 0 ? (amount * 3000) / (amount * 3000 * 0.67) * 100 : 0;
    setCollateralRatio(Math.min(newRatio, 300));
  };

  const handleMint = (amount: number) => {
    console.log(`Minting ${amount} FUSD with ${collateralAmount} ETH collateral`);
    // Here you would integrate with your FHE stablecoin protocol
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-gradient-vault shadow-vault">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/")}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
              <Logo size={32} />
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Secure Vault
                </h1>
                <p className="text-sm text-muted-foreground">
                  Mint stablecoins with encrypted collateral
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-gradient-encryption text-accent-foreground px-3 py-1">
                <Lock className="w-4 h-4 mr-2" />
                FHE Protected
              </Badge>
              <Badge variant="outline" className="border-primary text-primary px-3 py-1">
                <Zap className="w-4 h-4 mr-2" />
                Testnet
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Wallet Connection - Full Width */}
          <div className="lg:col-span-3">
            <WalletConnect onConnect={handleWalletConnect} />
          </div>

          {/* Collateral Dial */}
          <div className="lg:col-span-1">
            <CollateralDial
              collateralRatio={collateralRatio}
              onRatioChange={setCollateralRatio}
              isEncrypted={isConnected}
            />
          </div>

          {/* Minting Interface */}
          <div className="lg:col-span-2">
            <MintingInterface
              collateralAmount={collateralAmount}
              onCollateralChange={handleCollateralChange}
              onMint={handleMint}
              isConnected={isConnected}
            />
          </div>

          {/* Smart Contract Interaction */}
          {isConnected && (
            <div className="lg:col-span-3">
              <ContractInteraction 
                onTransactionSuccess={(txHash) => {
                  console.log('Transaction successful:', txHash);
                }}
              />
            </div>
          )}

          {/* Process Status */}
          {isConnected && (
            <div className="lg:col-span-3">
              <Card className="p-6 bg-gradient-vault border-border shadow-card-vault">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  FHE-Protected Minting Process
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-muted">
                    <div className="w-8 h-8 rounded-full bg-gradient-security flex items-center justify-center">
                      <span className="text-xs font-bold text-primary-foreground">1</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Wallet Connected</p>
                      <p className="text-xs text-muted-foreground">✓ Complete</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-muted">
                    <div className="w-8 h-8 rounded-full bg-gradient-security flex items-center justify-center">
                      <span className="text-xs font-bold text-primary-foreground">2</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">FHE Encryption</p>
                      <p className="text-xs text-muted-foreground">✓ Active</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-muted">
                    <div className="w-8 h-8 rounded-full bg-gradient-encryption flex items-center justify-center">
                      <span className="text-xs font-bold text-accent-foreground">3</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Smart Contract</p>
                      <p className="text-xs text-muted-foreground">✓ Deployed</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-muted">
                    <div className="w-8 h-8 rounded-full bg-gradient-metal flex items-center justify-center">
                      <span className="text-xs font-bold text-primary">4</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Private Minting</p>
                      <p className="text-xs text-muted-foreground">Ready</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Vault;