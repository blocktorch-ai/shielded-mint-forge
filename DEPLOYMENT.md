# Vercel Deployment Guide for Shielded Mint Forge

This guide provides step-by-step instructions for deploying the Shielded Mint Forge application to Vercel.

## Prerequisites

- GitHub account with access to the `blocktorch-ai/shielded-mint-forge` repository
- Vercel account (free tier available)
- Node.js 18+ installed locally (for testing)

## Step-by-Step Deployment

### 1. Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in with your GitHub account
3. Click "New Project" on the dashboard

### 2. Import GitHub Repository

1. In the "Import Git Repository" section, search for `blocktorch-ai/shielded-mint-forge`
2. Click "Import" next to the repository
3. Vercel will automatically detect it as a Vite project

### 3. Configure Project Settings

#### Build Settings
- **Framework Preset**: Vite
- **Root Directory**: `./` (default)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

#### Environment Variables
Add the following environment variables in the Vercel dashboard:

```
VITE_RPC_URL=https://1rpc.io/sepolia
VITE_WALLET_CONNECT_PROJECT_ID=2ec9743d0d0cd7fb94dee1a7e6d33475
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/b18fb7e6ca7045ac83c41157ab93f990
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=2ec9743d0d0cd7fb94dee1a7e6d33475
NEXT_PUBLIC_INFURA_API_KEY=b18fb7e6ca7045ac83c41157ab93f990
```

### 4. Deploy

1. Click "Deploy" to start the deployment process
2. Wait for the build to complete (usually 2-3 minutes)
3. Once deployed, you'll receive a production URL (e.g., `https://shielded-mint-forge.vercel.app`)

### 5. Configure Custom Domain (Optional)

1. Go to your project settings in Vercel
2. Navigate to "Domains" tab
3. Add your custom domain
4. Configure DNS records as instructed by Vercel

## Post-Deployment Configuration

### 1. Verify Environment Variables

Ensure all environment variables are properly set:
- Check the Vercel dashboard under "Settings" > "Environment Variables"
- Verify that all variables are available in both Preview and Production environments

### 2. Test Wallet Connection

1. Visit your deployed application
2. Test wallet connection with different providers (MetaMask, WalletConnect, etc.)
3. Verify that the Sepolia testnet is properly configured

### 3. Monitor Performance

- Check Vercel Analytics for performance metrics
- Monitor build logs for any issues
- Set up error tracking if needed

## Troubleshooting

### Common Issues

#### Build Failures
- **Issue**: Build fails due to missing dependencies
- **Solution**: Ensure `package-lock.json` is committed and up-to-date

#### Environment Variables Not Working
- **Issue**: Environment variables not accessible in the application
- **Solution**: Ensure variables are prefixed with `VITE_` and redeploy

#### Wallet Connection Issues
- **Issue**: Wallet connection fails
- **Solution**: Verify WalletConnect Project ID and RPC URL configuration

### Debugging Steps

1. **Check Build Logs**: Review the build output in Vercel dashboard
2. **Test Locally**: Run `npm run build` locally to identify issues
3. **Environment Variables**: Verify all required variables are set
4. **Network Configuration**: Ensure Sepolia testnet is properly configured

## Advanced Configuration

### 1. Custom Build Settings

If you need custom build settings, create a `vercel.json` file:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "functions": {
    "app/api/**/*.js": {
      "runtime": "nodejs18.x"
    }
  }
}
```

### 2. Preview Deployments

- Every push to non-main branches creates a preview deployment
- Use preview deployments for testing before merging to main
- Preview URLs are automatically generated and shared

### 3. Automatic Deployments

- Main branch pushes trigger automatic production deployments
- Configure branch protection rules in GitHub for safer deployments
- Use pull request previews for code review

## Monitoring and Maintenance

### 1. Performance Monitoring

- Use Vercel Analytics to monitor Core Web Vitals
- Set up alerts for build failures
- Monitor deployment frequency and success rates

### 2. Security

- Regularly update dependencies
- Monitor for security vulnerabilities
- Use environment variables for sensitive data
- Enable Vercel's security features

### 3. Scaling

- Vercel automatically handles scaling
- Monitor usage in the Vercel dashboard
- Upgrade plan if needed for higher limits

## Support

For issues related to:
- **Vercel**: Check [Vercel Documentation](https://vercel.com/docs)
- **Application**: Open an issue in the GitHub repository
- **Wallet Integration**: Check RainbowKit documentation

## Success Checklist

- [ ] Repository successfully imported to Vercel
- [ ] Build completes without errors
- [ ] Environment variables properly configured
- [ ] Application accessible via production URL
- [ ] Wallet connection working
- [ ] Custom domain configured (if applicable)
- [ ] Analytics and monitoring set up
- [ ] Team members have appropriate access

## Next Steps

After successful deployment:

1. **Test thoroughly** on the production environment
2. **Set up monitoring** and alerting
3. **Configure CI/CD** for automated deployments
4. **Document** any custom configurations
5. **Share** the application with stakeholders

---

**Note**: This deployment guide assumes you have the necessary permissions to access the GitHub repository and deploy to Vercel. Contact your team administrator if you encounter permission issues.
