/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-expressions */
const { expect } = require("chai");
const { ethers } = require("hardhat");
const signData = require("./helpers");

// Helper function for parse BigNumber to int
const toInt = (v) => {
  return parseInt(v);
};

describe("EIP712Referral", function () {
  let EIP712Referral, contract, owner, addr1, addr2, addrs;

  before(async function () {
    EIP712Referral = await ethers.getContractFactory("EIP712Referral");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    contract = await EIP712Referral.deploy(5, 60 * 10);
  });

  describe("Initial", () => {
    it("should deploy", async function () {
      expect(contract.address).to.be.not.equal(
        "0x0000000000000000000000000000000000000000"
      );
      expect(contract.address).to.be.not.equal("");
      expect(contract.address).to.be.not.equal(0x0);
    });

    it("should have correct owner", async function () {
      expect(await contract.owner()).to.be.equal(owner.address);
    });

    it("should have correct maxReferralAmount", async function () {
      expect(await contract.getMaxReferralAmount()).to.be.equal(5);
    });

    it("should have correct referralExpiration", async function () {
      expect(await contract.getReferralExpiration()).to.be.equal(60 * 10);
    });

    it("should have correct totalValidAddresses", async function () {
      expect(await contract.getTotalValidAddresses()).to.be.equal(0);
    });
  });

  describe("Only Owner", () => {
    it("should not allow non-owner to set validness of referrers", async function () {
      await expect(
        contract.connect(addr1).setReferrerValid([addr2.address])
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("should set owner to valid referrer", async function () {
      expect(await contract.isValidReferrer(owner.address)).to.be.true;
    });

    it("owner can set validness of referrers", async function () {
      await contract.connect(owner).setReferrerValid([addr1.address]);
      expect(await contract.isValidReferrer(addr1.address)).to.be.true;
    });
  });

  describe("Referral", () => {
    it("Valid referral can sign data and non-refferer can submit referral", async () => {
      const referrer = owner.address;
      let referree = addr2.address;
      const timestamp = await contract.getTimestamp();
      const { chainId } = await ethers.provider.getNetwork();

      const signature = await signData(
        chainId,
        contract.address,
        referrer,
        referree,
        toInt(timestamp),
        owner
      );

      await contract.connect(addr2).submitReferral(
        {
          referrer,
          referree,
          timestamp: toInt(timestamp),
        },
        signature
      );

      expect(await contract.isValidReferrer(addr2.address)).to.be.true;
      expect(await contract.isValidReferrer(addrs[0].address)).to.be.false;

      referree = addrs[0].address;

      await expect(
        contract.connect(addrs[0]).submitReferral(
          {
            referrer,
            referree,
            timestamp: toInt(timestamp),
          },
          signature
        )
      ).to.be.revertedWith("Signature is not valid");

      await expect(
        contract.connect(addr2).submitReferral(
          {
            referrer,
            referree,
            timestamp: toInt(timestamp),
          },
          signature
        )
      ).to.be.revertedWith("You are already a referree");
    });
  });
});
