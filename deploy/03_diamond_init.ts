import { parseUnits } from "ethers/lib/utils";
import { DeployFunction } from "hardhat-deploy/types";
import { Diamond__factory, InitDiamond__factory, InitDiamond, HRVSTFacet } from "../types";
import { Ship } from "../utils";

const func: DeployFunction = async (hre) => {
  const { deploy } = await Ship.init(hre);

  await deploy(InitDiamond__factory);
};

export default func;
func.tags = ["diamond_init"];
func.dependencies = ["diamond"];
