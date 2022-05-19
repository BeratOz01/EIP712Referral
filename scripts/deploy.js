const hre = require("hardhat");

async function main() {
  const Referral = await hre.ethers.getContractFactory("EIP712Referral");
  const referral = await Referral.deploy(5, 1000);

  await referral.deployed();
  console.log("Referral contract deployed to:", referral.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
