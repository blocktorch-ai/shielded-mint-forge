# Shielded Mint Forge

A secure FHE (Fully Homomorphic Encryption) stablecoin vault platform built with modern web3 technologies.

## Features

- **FHE-Protected Transactions**: All sensitive data is encrypted using fully homomorphic encryption
- **Multi-Wallet Support**: Connect with RainbowKit, MetaMask, WalletConnect, and more
- **Secure Vault Management**: Manage your encrypted stablecoin vaults with privacy
- **Real-time Analytics**: Monitor your vault performance with encrypted metrics
- **Cross-Chain Support**: Built for Sepolia testnet with easy expansion

## Technologies

- **Frontend**: React 18, TypeScript, Vite
- **UI**: shadcn/ui, Tailwind CSS, Lucide React
- **Web3**: RainbowKit, Wagmi, Viem
- **Encryption**: FHE (Fully Homomorphic Encryption)
- **Networks**: Ethereum Sepolia Testnet

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/blocktorch-ai/shielded-mint-forge.git

# Navigate to the project directory
cd shielded-mint-forge

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
VITE_RPC_URL=https://1rpc.io/sepolia
VITE_WALLET_CONNECT_PROJECT_ID=your_project_id
```

## Usage

1. **Connect Wallet**: Use the wallet connection interface to connect your preferred wallet
2. **Create Vault**: Set up a new FHE-protected stablecoin vault
3. **Manage Assets**: Deposit, withdraw, and manage your encrypted assets
4. **Monitor Performance**: View real-time analytics of your vault performance

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment

```bash
# Build the project
npm run build

# Deploy the dist folder to your hosting provider
```

## Security

This application implements FHE (Fully Homomorphic Encryption) to ensure that all sensitive financial data remains encrypted even during computation. All vault operations are performed on encrypted data without exposing sensitive information.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions, please open an issue in the GitHub repository.
