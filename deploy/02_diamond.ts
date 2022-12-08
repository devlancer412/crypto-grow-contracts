import { DeployFunction } from "hardhat-deploy/types";
import { DiamondCutFacet__factory, Diamond__factory } from "../types";
import { Ship } from "../utils";

const func: DeployFunction = async (hre) => {
  const { deploy, accounts, connect } = await Ship.init(hre);
  const diamondCutFacet = await connect(DiamondCutFacet__factory);
  await deploy(Diamond__factory, {
    args: [accounts.deployer.address, diamondCutFacet.address],
  });
};

export default func;
func.tags = ["diamond"];
func.dependencies = ["diamond_cut_facet"];
