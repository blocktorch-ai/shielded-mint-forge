// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";
import { euint32, externalEuint32, euint8, ebool, FHE } from "@fhevm/solidity/lib/FHE.sol";

contract ShieldedMintForge is SepoliaConfig {
    using FHE for *;
    
    struct Vault {
        euint32 vaultId;
        euint32 collateralAmount;
        euint32 mintedAmount;
        euint32 collateralRatio;
        bool isActive;
        bool isVerified;
        address owner;
        uint256 createdAt;
        uint256 lastUpdated;
    }
    
    struct MintingRequest {
        euint32 requestId;
        euint32 requestedAmount;
        euint32 collateralAmount;
        address requester;
        uint256 timestamp;
        bool isProcessed;
    }
    
    struct CollateralAsset {
        euint32 assetId;
        euint32 price;
        euint32 volatility;
        bool isAccepted;
        string symbol;
        address tokenAddress;
    }
    
    mapping(uint256 => Vault) public vaults;
    mapping(uint256 => MintingRequest) public mintingRequests;
    mapping(uint256 => CollateralAsset) public collateralAssets;
    mapping(address => euint32) public userReputation;
    mapping(address => euint32) public vaultPerformance;
    
    uint256 public vaultCounter;
    uint256 public requestCounter;
    uint256 public assetCounter;
    
    address public owner;
    address public verifier;
    address public priceOracle;
    
    event VaultCreated(uint256 indexed vaultId, address indexed owner);
    event MintingRequested(uint256 indexed requestId, address indexed requester, uint32 amount);
    event CollateralAdded(uint256 indexed vaultId, uint32 amount);
    event StablecoinMinted(uint256 indexed vaultId, uint32 amount);
    event VaultLiquidated(uint256 indexed vaultId, address indexed liquidator);
    event ReputationUpdated(address indexed user, uint32 reputation);
    
    constructor(address _verifier, address _priceOracle) {
        owner = msg.sender;
        verifier = _verifier;
        priceOracle = _priceOracle;
    }
    
    function createVault(
        externalEuint32 initialCollateral,
        bytes calldata inputProof
    ) public payable returns (uint256) {
        require(msg.value > 0, "Initial collateral required");
        
        uint256 vaultId = vaultCounter++;
        
        // Convert externalEuint32 to euint32 using FHE.fromExternal
        euint32 internalCollateral = FHE.fromExternal(initialCollateral, inputProof);
        
        vaults[vaultId] = Vault({
            vaultId: FHE.asEuint32(0), // Will be set properly later
            collateralAmount: internalCollateral,
            mintedAmount: FHE.asEuint32(0),
            collateralRatio: FHE.asEuint32(10000), // 100% initially
            isActive: true,
            isVerified: false,
            owner: msg.sender,
            createdAt: block.timestamp,
            lastUpdated: block.timestamp
        });
        
        emit VaultCreated(vaultId, msg.sender);
        return vaultId;
    }
    
    function requestMinting(
        uint256 vaultId,
        externalEuint32 requestedAmount,
        bytes calldata inputProof
    ) public returns (uint256) {
        require(vaults[vaultId].owner == msg.sender, "Only vault owner can request minting");
        require(vaults[vaultId].isActive, "Vault must be active");
        require(vaults[vaultId].isVerified, "Vault must be verified");
        
        uint256 requestId = requestCounter++;
        
        // Convert externalEuint32 to euint32 using FHE.fromExternal
        euint32 internalAmount = FHE.fromExternal(requestedAmount, inputProof);
        
        mintingRequests[requestId] = MintingRequest({
            requestId: FHE.asEuint32(0), // Will be set properly later
            requestedAmount: internalAmount,
            collateralAmount: vaults[vaultId].collateralAmount,
            requester: msg.sender,
            timestamp: block.timestamp,
            isProcessed: false
        });
        
        emit MintingRequested(requestId, msg.sender, 0); // Amount will be decrypted off-chain
        return requestId;
    }
    
    function addCollateral(
        uint256 vaultId,
        externalEuint32 additionalCollateral,
        bytes calldata inputProof
    ) public payable {
        require(vaults[vaultId].owner == msg.sender, "Only vault owner can add collateral");
        require(vaults[vaultId].isActive, "Vault must be active");
        require(msg.value > 0, "Collateral amount required");
        
        // Convert externalEuint32 to euint32 using FHE.fromExternal
        euint32 internalAmount = FHE.fromExternal(additionalCollateral, inputProof);
        
        // Update vault collateral
        vaults[vaultId].collateralAmount = FHE.add(vaults[vaultId].collateralAmount, internalAmount);
        vaults[vaultId].lastUpdated = block.timestamp;
        
        emit CollateralAdded(vaultId, 0); // Amount will be decrypted off-chain
    }
    
    function processMintingRequest(
        uint256 requestId,
        bool approved
    ) public {
        require(msg.sender == verifier, "Only verifier can process requests");
        require(!mintingRequests[requestId].isProcessed, "Request already processed");
        
        if (approved) {
            uint256 vaultId = getVaultIdByRequest(requestId);
            euint32 mintedAmount = mintingRequests[requestId].requestedAmount;
            
            // Update vault with minted amount
            vaults[vaultId].mintedAmount = FHE.add(vaults[vaultId].mintedAmount, mintedAmount);
            vaults[vaultId].lastUpdated = block.timestamp;
            
            // Update collateral ratio
            vaults[vaultId].collateralRatio = FHE.div(
                FHE.mul(vaults[vaultId].collateralAmount, 10000),
                vaults[vaultId].mintedAmount
            );
            
            emit StablecoinMinted(vaultId, 0); // Amount will be decrypted off-chain
        }
        
        mintingRequests[requestId].isProcessed = true;
    }
    
    function liquidateVault(uint256 vaultId) public {
        require(vaults[vaultId].isActive, "Vault must be active");
        require(vaults[vaultId].owner != address(0), "Vault does not exist");
        
        // Check if vault is undercollateralized (this would be done off-chain with FHE)
        // For now, we'll implement a simple liquidation mechanism
        
        vaults[vaultId].isActive = false;
        vaults[vaultId].lastUpdated = block.timestamp;
        
        emit VaultLiquidated(vaultId, msg.sender);
    }
    
    function verifyVault(uint256 vaultId, bool isVerified) public {
        require(msg.sender == verifier, "Only verifier can verify vaults");
        require(vaults[vaultId].owner != address(0), "Vault does not exist");
        
        vaults[vaultId].isVerified = isVerified;
    }
    
    function updateReputation(address user, euint32 reputation) public {
        require(msg.sender == verifier, "Only verifier can update reputation");
        require(user != address(0), "Invalid user address");
        
        userReputation[user] = reputation;
        emit ReputationUpdated(user, 0); // FHE.decrypt(reputation) - will be decrypted off-chain
    }
    
    function addCollateralAsset(
        string memory symbol,
        address tokenAddress,
        externalEuint32 price,
        externalEuint32 volatility,
        bytes calldata inputProof
    ) public {
        require(msg.sender == owner, "Only owner can add collateral assets");
        
        uint256 assetId = assetCounter++;
        
        // Convert externalEuint32 to euint32 using FHE.fromExternal
        euint32 internalPrice = FHE.fromExternal(price, inputProof);
        euint32 internalVolatility = FHE.fromExternal(volatility, inputProof);
        
        collateralAssets[assetId] = CollateralAsset({
            assetId: FHE.asEuint32(0), // Will be set properly later
            price: internalPrice,
            volatility: internalVolatility,
            isAccepted: true,
            symbol: symbol,
            tokenAddress: tokenAddress
        });
    }
    
    function getVaultInfo(uint256 vaultId) public view returns (
        uint8 collateralAmount,
        uint8 mintedAmount,
        uint8 collateralRatio,
        bool isActive,
        bool isVerified,
        address owner,
        uint256 createdAt,
        uint256 lastUpdated
    ) {
        Vault storage vault = vaults[vaultId];
        return (
            0, // FHE.decrypt(vault.collateralAmount) - will be decrypted off-chain
            0, // FHE.decrypt(vault.mintedAmount) - will be decrypted off-chain
            0, // FHE.decrypt(vault.collateralRatio) - will be decrypted off-chain
            vault.isActive,
            vault.isVerified,
            vault.owner,
            vault.createdAt,
            vault.lastUpdated
        );
    }
    
    function getMintingRequestInfo(uint256 requestId) public view returns (
        uint8 requestedAmount,
        uint8 collateralAmount,
        address requester,
        uint256 timestamp,
        bool isProcessed
    ) {
        MintingRequest storage request = mintingRequests[requestId];
        return (
            0, // FHE.decrypt(request.requestedAmount) - will be decrypted off-chain
            0, // FHE.decrypt(request.collateralAmount) - will be decrypted off-chain
            request.requester,
            request.timestamp,
            request.isProcessed
        );
    }
    
    function getUserReputation(address user) public view returns (uint8) {
        return 0; // FHE.decrypt(userReputation[user]) - will be decrypted off-chain
    }
    
    function getVaultPerformance(address user) public view returns (uint8) {
        return 0; // FHE.decrypt(vaultPerformance[user]) - will be decrypted off-chain
    }
    
    function getVaultIdByRequest(uint256 requestId) internal view returns (uint256) {
        // This is a simplified implementation
        // In a real scenario, you'd need to track the relationship between requests and vaults
        return requestId; // This would need proper implementation
    }
    
    function withdrawFunds(uint256 vaultId) public {
        require(vaults[vaultId].owner == msg.sender, "Only vault owner can withdraw");
        require(vaults[vaultId].isVerified, "Vault must be verified");
        require(vaults[vaultId].isActive, "Vault must be active");
        
        // Transfer funds to owner
        // Note: In a real implementation, funds would be transferred based on decrypted amount
        vaults[vaultId].isActive = false;
        vaults[vaultId].lastUpdated = block.timestamp;
        
        // For now, we'll transfer a placeholder amount
        // payable(msg.sender).transfer(amount);
    }
}
