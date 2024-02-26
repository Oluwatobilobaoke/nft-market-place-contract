import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

import { expect } from "chai";
import { ethers } from "hardhat";

describe("Marketplace", () => {
  async function deployContracts() {
    const [owner, addr1, addr2] = await ethers.getSigners();

    const NFT = await ethers.getContractFactory("NFT");
    const nft = await NFT.deploy(owner.address);

    const Marketplace = await ethers.getContractFactory("Marketplace");
    const marketplace = await Marketplace.deploy(owner.address);

    return { owner, addr1, addr2, nft, marketplace };
  }

  describe("Deployment", () => {
    it("Should deploy the contracts", async () => {
      const { nft, marketplace } = await deployContracts();
      expect(nft.target).to.be.properAddress;
      expect(marketplace.target).to.be.properAddress;
    });
  });

  describe("Minting", () => {
    it("Should mint an NFT", async () => {
      const { owner, nft } = await deployContracts();
      await nft.safeMint(owner.address, "https://token-uri.com");
      const balance = await nft.balanceOf(owner.address);
      expect(balance).to.equal(1);
    });
  });
});
