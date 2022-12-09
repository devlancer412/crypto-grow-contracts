import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import {
  Diamond,
  DiamondCutFacet,
  DiamondCutFacet__factory,
  DiamondLoupeFacet,
  DiamondLoupeFacet__factory,
  Diamond__factory,
  HRVSTFacet,
  HRVSTFacet__factory,
  OwnershipFacet,
  OwnershipFacet__factory,
} from "../types";
import { deployments } from "hardhat";
import chai from "chai";
import { solidity } from "ethereum-waffle";
import { Ship } from "../utils";
import { ContractWithSelectors } from "../utils/FacetUtils";

chai.use(solidity);
const { expect, assert } = chai;

let ship: Ship;
let diamond: Diamond;
let diamondCutFacet: DiamondCutFacet;
let diamondLoupeFacet: DiamondLoupeFacet;
let ownershipFacet: OwnershipFacet;
let harvestFacet: HRVSTFacet;
let facetAddresses: string[];

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

describe("Diamond test", () => {
  before(async () => {
    const scaffold = await setup();

    alice = scaffold.accounts.alice;
    bob = scaffold.accounts.bob;
    deployer = scaffold.accounts.deployer;
    signer = scaffold.accounts.signer;

    diamond = await scaffold.ship.connect(Diamond__factory);
    diamondCutFacet = await scaffold.ship.connect(DiamondCutFacet__factory, diamond.address);
    diamondLoupeFacet = await scaffold.ship.connect(DiamondLoupeFacet__factory, diamond.address);
    ownershipFacet = await scaffold.ship.connect(OwnershipFacet__factory, diamond.address);
    harvestFacet = await scaffold.ship.connect(HRVSTFacet__factory, diamond.address);

    facetAddresses = [];
  });

  it("should have four facets -- call to facetAddresses function", async () => {
    for (const address of await diamondLoupeFacet.facetAddresses()) {
      facetAddresses.push(address);
    }

    expect(facetAddresses.length).to.eq(4);
  });

  it("facets should have the right function selectors -- call to facetFunctionSelectors function", async () => {
    const diamondCutWithSelectors = new ContractWithSelectors(diamondCutFacet);
    let result = await diamondLoupeFacet.facetFunctionSelectors(facetAddresses[0]);
    assert.sameMembers(result, diamondCutWithSelectors.selectors);

    const diamondLoupeWithSelectors = new ContractWithSelectors(diamondLoupeFacet);
    result = await diamondLoupeFacet.facetFunctionSelectors(facetAddresses[1]);
    assert.sameMembers(result, diamondLoupeWithSelectors.selectors);

    const ownershipWithSelectors = new ContractWithSelectors(ownershipFacet);
    result = await diamondLoupeFacet.facetFunctionSelectors(facetAddresses[2]);
    assert.sameMembers(result, ownershipWithSelectors.selectors);

    const harvestWithSelectors = new ContractWithSelectors(harvestFacet);
    result = await diamondLoupeFacet.facetFunctionSelectors(facetAddresses[3]);
    assert.sameMembers(result, harvestWithSelectors.selectors);
  });

  it("selectors should be associated to facets correctly -- multiple calls to facetAddress function", async () => {
    assert.equal(facetAddresses[0], await diamondLoupeFacet.facetAddress("0x1f931c1c"));
    assert.equal(facetAddresses[1], await diamondLoupeFacet.facetAddress("0xcdffacc6"));
    assert.equal(facetAddresses[1], await diamondLoupeFacet.facetAddress("0x01ffc9a7"));
    assert.equal(facetAddresses[2], await diamondLoupeFacet.facetAddress("0xf2fde38b"));
  });
});
