const hre = require("hardhat");

async function main() {
  const referral = await hre.ethers.getContractFactory("EIP712Referral");
  const EIP712Referral = await referral.deploy(5, 1000);

  await EIP712Referral.deployed();
  console.log("Referral contract deployed to:", EIP712Referral.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
