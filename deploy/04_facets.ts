import { DeployFunction } from "hardhat-deploy/types";
import {
  Diamond__factory,
  HRVSTFacet__factory,
  IDiamondCut,
  DiamondLoupeFacet__factory,
  OwnershipFacet__factory,
  InitDiamond__factory,
  DiamondCutFacet__factory,
  InitDiamond,
} from "../types";
import { Ship } from "../utils";
import { ContractWithSelectors } from "../utils/FacetUtils";
import { ContractFactory } from "ethers";
import { parseUnits } from "ethers/lib/utils";

const func: DeployFunction = async (hre) => {
  const { deploy, accounts, connect } = await Ship.init(hre);

  const FacetCutAction = { Add: 0, Replace: 1, Remove: 2 };
  const facets: (new () => ContractFactory)[] = [
    DiamondLoupeFacet__factory,
    OwnershipFacet__factory,
    HRVSTFacet__factory,
  ];
  const diamond = await connect(Diamond__factory);
  const diamondInit = await connect(InitDiamond__factory);
  const diamondCut = await connect(DiamondCutFacet__factory, diamond.address);

  const cuts: IDiamondCut.FacetCutStruct[] = [];
  for (const Facet of facets) {
    const facet = await deploy(Facet);
    console.log(`deployed: ${facet.address}`);
    cuts.push({
      facetAddress: facet.address,
      action: FacetCutAction.Add,
      functionSelectors: new ContractWithSelectors(facet.contract).selectors,
    });
  }

  const hrvst = await connect(HRVSTFacet__factory);

  const args: InitDiamond.ArgsStruct = {
    dao: accounts.alice.address,
    daoTreasury: accounts.alice.address,
    cryptoGrow: accounts.alice.address,
    rarityFarming: accounts.alice.address,
    hrvstContract: diamond.address,
    chainlinkKeyHash: "0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15",
    chainlinkFee: parseUnits("150", 9),
    vrfCoordinator: "0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D",
    linkAddress: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
    childChainManager: accounts.alice.address,
    name: "HRVST",
    symbol: "HRVST",
  };

  const calldata = diamondInit.interface.encodeFunctionData("init", [args]);

  const tx = await diamondCut.diamondCut(cuts, diamondInit.address, calldata);
  await tx.wait();
};

export default func;
func.tags = ["facets"];
func.dependencies = ["diamond_init"];
