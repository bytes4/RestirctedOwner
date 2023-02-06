import { expect } from "chai";
import { ethers } from "hardhat";

describe("RestrictedOwner", () => {
  it("should become the ownwer", async () => {
    const provider = ethers.provider;
    let signer = provider.getSigner();
    let address = await signer.getAddress();

    const UnrestrictedOwnerDeployer = await ethers.getContractFactory(
      "UnrestrictedOwner",
      signer
    );
    const unrestrictedOwner = await UnrestrictedOwnerDeployer.deploy();

    const calldata = unrestrictedOwner.interface.encodeFunctionData(
      "changeOwner",
      [unrestrictedOwner.address]
    );

    const RestrictedOwnerDeployer = await ethers.getContractFactory(
      "RestrictedOwner",
      signer
    );
    const restrictedOwner = await RestrictedOwnerDeployer.deploy(
      unrestrictedOwner.address
    );

    expect(await restrictedOwner.owner()).to.be.equal(address);

    await restrictedOwner.fallback({
      data: calldata,
      gasLimit: 6000000,
    });

    expect(await restrictedOwner.owner()).to.be.equal(
      unrestrictedOwner.address
    );
  });
});
