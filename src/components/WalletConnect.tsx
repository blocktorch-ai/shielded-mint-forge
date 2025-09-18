import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet, Shield } from "lucide-react";
import { useAccount } from 'wagmi';

interface WalletConnectProps {
  onConnect: (address: string) => void;
}

const WalletConnect = ({ onConnect }: WalletConnectProps) => {
  const { address, isConnected } = useAccount();

  if (isConnected && address) {
    onConnect(address);
    return (
      <Card className="p-6 bg-gradient-vault border-border shadow-card-vault">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-security shadow-glow-primary">
              <Wallet className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Connected Wallet</p>
              <p className="font-mono font-medium text-foreground">
                {address.slice(0, 6)}...{address.slice(-4)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-gradient-encryption text-accent-foreground">
              <Shield className="w-3 h-3 mr-1" />
              FHE Protected
            </Badge>
            <ConnectButton />
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-8 bg-gradient-vault border-border shadow-card-vault text-center">
      <div className="space-y-4">
        <div className="mx-auto w-16 h-16 rounded-full bg-gradient-metal flex items-center justify-center shadow-glow">
          <Wallet className="w-8 h-8 text-primary animate-pulse-glow" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Connect Your Wallet</h3>
          <p className="text-muted-foreground mb-4">
            Secure access to the FHE stablecoin vault with encrypted transactions
          </p>
        </div>
        <ConnectButton />
      </div>
    </Card>
  );
};

export default WalletConnect;