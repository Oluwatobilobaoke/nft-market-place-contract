import { ethers } from "hardhat";

async function main() {
  const initialOwner = "0x77158c23cC2D9dd3067a82E2067182C85fA3b1F6";

  const NFT = await ethers.deployContract("NFT", [initialOwner]);
  await NFT.waitForDeployment();

  const Marketplace = await ethers.deployContract("Marketplace", [
    initialOwner,
  ]);
  await Marketplace.waitForDeployment();

  console.log(`NFT deployed to ${NFT.target}`);
  console.log(`NFT Marketplace deployed to ${Marketplace.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// npx hardhat run scripts/deploy.ts --network sepolia
