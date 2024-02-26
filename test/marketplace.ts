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
      const { addr1, nft } = await deployContracts();

      const depositAmount = ethers.parseEther("0.002");

      // Mint an NFT
      await nft
        .connect(addr1)
        .safeMint(addr1.address, "https://token-uri.com", {
          value: depositAmount,
        });
      const balance = await nft.balanceOf(addr1.address);
      expect(balance).to.equal(1);
    });
  });

  describe("Listing", () => {
    it("Should list an NFT", async () => {
      const { addr1, nft, marketplace } = await deployContracts();

      const depositAmount = ethers.parseEther("0.002");

      // Mint an NFT
      await nft
        .connect(addr1)
        .safeMint(addr1.address, "https://token-uri.com", {
          value: depositAmount,
        });

      // List the NFT
      await nft.connect(addr1).setApprovalForAll(marketplace.target, true);

      await marketplace
        .connect(addr1)
        .createListing(0, nft.target, ethers.parseEther("0.01"));
    });

    it("Should buy an NFT", async () => {
      const { addr1, addr2, nft, marketplace } = await deployContracts();

      const depositAmount = ethers.parseEther("0.002");

      // Mint an NFT
      await nft
        .connect(addr1)
        .safeMint(addr1.address, "https://token-uri.com", {
          value: depositAmount,
        });

      // List the NFT
      await nft.connect(addr1).setApprovalForAll(marketplace.target, true);

      await marketplace
        .connect(addr1)
        .createListing(0, nft.target, ethers.parseEther("0.01"));

      // Buy the NFT
      await marketplace.connect(addr2).buyListing(0, nft.target, {
        value: ethers.parseEther("0.01"),
      });

      const balance = await nft.balanceOf(addr2.address);
      expect(balance).to.equal(1);
    });
  });
});
