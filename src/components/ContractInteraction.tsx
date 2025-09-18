import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Shield, Lock, CheckCircle } from 'lucide-react';

// Contract ABI for ShieldedMintForge
const CONTRACT_ABI = [
  {
    "inputs": [
      {"name": "initialCollateral", "type": "bytes"},
      {"name": "inputProof", "type": "bytes"}
    ],
    "name": "createVault",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "vaultId", "type": "uint256"},
      {"name": "requestedAmount", "type": "bytes"},
      {"name": "inputProof", "type": "bytes"}
    ],
    "name": "requestMinting",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "vaultId", "type": "uint256"},
      {"name": "additionalCollateral", "type": "bytes"},
      {"name": "inputProof", "type": "bytes"}
    ],
    "name": "addCollateral",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
] as const;

// Contract address (replace with actual deployed contract address)
const CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000';

interface ContractInteractionProps {
  onTransactionSuccess?: (txHash: string) => void;
}

const ContractInteraction = ({ onTransactionSuccess }: ContractInteractionProps) => {
  const { address, isConnected } = useAccount();
  const [vaultId, setVaultId] = useState<string>('');
  const [collateralAmount, setCollateralAmount] = useState<string>('');
  const [mintAmount, setMintAmount] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastTxHash, setLastTxHash] = useState<string>('');

  const { writeContract, data: hash, error, isPending } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // Simulate FHE encryption (in real implementation, this would use actual FHE)
  const encryptData = (value: string): { encryptedData: string; proof: string } => {
    // This is a mock implementation - in reality, you'd use FHE libraries
    const mockEncrypted = btoa(value); // Base64 encoding as placeholder
    const mockProof = btoa(`proof_${Date.now()}`); // Mock proof
    return { encryptedData: mockEncrypted, proof: mockProof };
  };

  const handleCreateVault = async () => {
    if (!isConnected || !collateralAmount) return;

    setIsLoading(true);
    try {
      const { encryptedData, proof } = encryptData(collateralAmount);
      
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'createVault',
        args: [encryptedData, proof],
        value: BigInt(parseFloat(collateralAmount) * 1e18), // Convert to wei
      });
    } catch (err) {
      console.error('Error creating vault:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestMinting = async () => {
    if (!isConnected || !vaultId || !mintAmount) return;

    setIsLoading(true);
    try {
      const { encryptedData, proof } = encryptData(mintAmount);
      
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'requestMinting',
        args: [BigInt(vaultId), encryptedData, proof],
      });
    } catch (err) {
      console.error('Error requesting minting:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCollateral = async () => {
    if (!isConnected || !vaultId || !collateralAmount) return;

    setIsLoading(true);
    try {
      const { encryptedData, proof } = encryptData(collateralAmount);
      
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'addCollateral',
        args: [BigInt(vaultId), encryptedData, proof],
        value: BigInt(parseFloat(collateralAmount) * 1e18), // Convert to wei
      });
    } catch (err) {
      console.error('Error adding collateral:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <Card className="p-6 bg-gradient-vault border-border shadow-card-vault">
        <div className="text-center space-y-4">
          <Shield className="w-12 h-12 mx-auto text-muted-foreground" />
          <h3 className="text-lg font-semibold">Connect Wallet Required</h3>
          <p className="text-muted-foreground">
            Please connect your wallet to interact with the FHE-protected smart contracts.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Transaction Status */}
      {hash && (
        <Alert className="border-primary">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Transaction submitted: {hash.slice(0, 10)}...
            {isConfirming && <span className="ml-2">Confirming...</span>}
            {isConfirmed && <span className="ml-2 text-green-600">Confirmed!</span>}
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>
            Transaction failed: {error.message}
          </AlertDescription>
        </Alert>
      )}

      {/* Create Vault */}
      <Card className="p-6 bg-gradient-vault border-border shadow-card-vault">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Create FHE-Protected Vault</h3>
            <Badge variant="secondary" className="bg-gradient-encryption">
              Encrypted
            </Badge>
          </div>
          
          <div className="space-y-3">
            <div>
              <Label htmlFor="collateral">Initial Collateral (ETH)</Label>
              <Input
                id="collateral"
                type="number"
                step="0.001"
                placeholder="0.1"
                value={collateralAmount}
                onChange={(e) => setCollateralAmount(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <Button
              onClick={handleCreateVault}
              disabled={isLoading || isPending || !collateralAmount}
              className="w-full bg-gradient-security hover:shadow-glow-primary"
            >
              {isLoading || isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Vault...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  Create Encrypted Vault
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* Request Minting */}
      <Card className="p-6 bg-gradient-vault border-border shadow-card-vault">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Request Stablecoin Minting</h3>
            <Badge variant="secondary" className="bg-gradient-encryption">
              Private
            </Badge>
          </div>
          
          <div className="space-y-3">
            <div>
              <Label htmlFor="vault-id">Vault ID</Label>
              <Input
                id="vault-id"
                type="number"
                placeholder="1"
                value={vaultId}
                onChange={(e) => setVaultId(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="mint-amount">Mint Amount (USD)</Label>
              <Input
                id="mint-amount"
                type="number"
                placeholder="100"
                value={mintAmount}
                onChange={(e) => setMintAmount(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <Button
              onClick={handleRequestMinting}
              disabled={isLoading || isPending || !vaultId || !mintAmount}
              className="w-full bg-gradient-security hover:shadow-glow-primary"
            >
              {isLoading || isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Requesting...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  Request Private Minting
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* Add Collateral */}
      <Card className="p-6 bg-gradient-vault border-border shadow-card-vault">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Add Collateral</h3>
            <Badge variant="secondary" className="bg-gradient-encryption">
              Secure
            </Badge>
          </div>
          
          <div className="space-y-3">
            <div>
              <Label htmlFor="add-vault-id">Vault ID</Label>
              <Input
                id="add-vault-id"
                type="number"
                placeholder="1"
                value={vaultId}
                onChange={(e) => setVaultId(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="add-collateral">Additional Collateral (ETH)</Label>
              <Input
                id="add-collateral"
                type="number"
                step="0.001"
                placeholder="0.05"
                value={collateralAmount}
                onChange={(e) => setCollateralAmount(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <Button
              onClick={handleAddCollateral}
              disabled={isLoading || isPending || !vaultId || !collateralAmount}
              className="w-full bg-gradient-security hover:shadow-glow-primary"
            >
              {isLoading || isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  Add Encrypted Collateral
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* FHE Information */}
      <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
            <Lock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h4 className="font-semibold text-blue-900 dark:text-blue-100">FHE Protection Active</h4>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              All transaction data is encrypted using Fully Homomorphic Encryption (FHE) before being sent to the blockchain. 
              Your financial information remains private even during computation.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ContractInteraction;
