const { ethers } = require("hardhat");

async function main() {
  // Get the contract factory
  const ShieldedMintForge = await ethers.getContractFactory("ShieldedMintForge");
  
  // Deploy the contract
  // You'll need to provide the verifier and priceOracle addresses
  const verifier = "0x0000000000000000000000000000000000000000"; // Replace with actual verifier address
  const priceOracle = "0x0000000000000000000000000000000000000000"; // Replace with actual price oracle address
  
  console.log("Deploying ShieldedMintForge...");
  const shieldedMintForge = await ShieldedMintForge.deploy(verifier, priceOracle);
  
  await shieldedMintForge.waitForDeployment();
  
  console.log("ShieldedMintForge deployed to:", await shieldedMintForge.getAddress());
  
  // Save the deployment info
  const deploymentInfo = {
    contractAddress: await shieldedMintForge.getAddress(),
    verifier: verifier,
    priceOracle: priceOracle,
    network: "sepolia",
    timestamp: new Date().toISOString()
  };
  
  console.log("Deployment info:", JSON.stringify(deploymentInfo, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
