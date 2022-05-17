export const loadContract = async (name, web3) => {
  let contract = null;

  try {
    const res = await fetch(`/contracts/${name}.json`);
    const Artifact = await res.json();

    let networkID = await web3.eth.net.getId();

    contract = new web3.eth.Contract(
      Artifact.abi,
      "0x5FbDB2315678afecb367f032d93F642f64180aa3"
    );
    console.log(`Contract ${name} loaded`);
  } catch (e) {
    console.error(`Contract ${name} not found`);
  }

  return contract;
};
