import { parseUnits } from "ethers/lib/utils";
import { DeployFunction } from "hardhat-deploy/types";
import { InitDiamond__factory } from "../types";
import { Ship } from "../utils";

const func: DeployFunction = async (hre) => {
  const { deploy } = await Ship.init(hre);

  await deploy(InitDiamond__factory, {
    args: [],
  });
};

export default func;
func.tags = ["diamond_init"];
func.dependencies = ["diamond"];
