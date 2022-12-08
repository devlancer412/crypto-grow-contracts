import { DeployFunction } from "hardhat-deploy/types";
import { DiamondCutFacet__factory } from "../types";
import { Ship } from "../utils";

const func: DeployFunction = async (hre) => {
  const { deploy } = await Ship.init(hre);
  await deploy(DiamondCutFacet__factory);
};

export default func;
func.tags = ["diamond_cut_facet"];
