import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Diamond, Diamond__factory, HRVSTFacet, HRVSTFacet__factory } from "../types";
import { deployments } from "hardhat";
import chai from "chai";
import { solidity } from "ethereum-waffle";
import { Ship } from "../utils";
import { constants } from "ethers";
import { parseEther } from "ethers/lib/utils";

chai.use(solidity);
const { expect } = chai;

let ship: Ship;
let diamond: Diamond;
let harvestFacet: HRVSTFacet;

let alice: SignerWithAddress;
let bob: SignerWithAddress;
let signer: SignerWithAddress;
let deployer: SignerWithAddress;

const setup = deployments.createFixture(async (hre) => {
  ship = await Ship.init(hre);
  const { accounts, users } = ship;
  await deployments.fixture(["facets"]);

  return {
    ship,
    accounts,
    users,
  };
});

describe("Havest token test", () => {
  before(async () => {
    const scaffold = await setup();

    alice = scaffold.accounts.alice;
    bob = scaffold.accounts.bob;
    deployer = scaffold.accounts.deployer;
    signer = scaffold.accounts.signer;

    diamond = await scaffold.ship.connect(Diamond__factory);
    harvestFacet = await scaffold.ship.connect(HRVSTFacet__factory, diamond.address);
  });

  it("name should be HRVST", async () => {
    const name = await harvestFacet.name();

    expect(name).to.eq("HRVST");
  });

  it("symbol should be HRVST", async () => {
    const symbol = await harvestFacet.symbol();

    expect(symbol).to.eq("HRVST");
  });

  it("decimals should be HRVST", async () => {
    const decimals = await harvestFacet.decimals();

    expect(decimals).to.eq(18);
  });

  it("Alice mint token", async () => {
    await expect(harvestFacet.connect(alice).mint())
      .emit(harvestFacet, "Transfer")
      .withArgs(constants.AddressZero, alice.address, parseEther("1"));
  });

  it("Deployment should assign the total supply of tokens to the owner", async function () {
    const owner = await diamond.owner();
    const ownerBalance = await harvestFacet.balanceOf(owner);
    expect(await harvestFacet.totalSupply()).to.eq(ownerBalance.add(parseEther("1")).toString());
  });
});
