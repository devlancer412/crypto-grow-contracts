/* global ethers */

import { JsonFragment } from "@ethersproject/abi";
import { BaseContract } from "ethers";
import { ethers } from "ethers";
import { Fragment } from "ethers/lib/utils";
import { IDiamondCut } from "../types";

export const FacetCutAction = { Add: 0, Replace: 1, Remove: 2 };

export class ContractWithSelectors {
  selectors: string[] = [];
  contract: BaseContract;

  constructor(contract: BaseContract, selectors: string[] = []) {
    this.contract = contract;
    const signatures = Object.keys(contract.interface.functions);
    this.selectors = selectors.length
      ? selectors
      : signatures.reduce((acc: string[], val) => {
          if (val !== "init(bytes)") {
            acc.push(contract.interface.getSighash(val));
          }
          return acc;
        }, []);
  }

  remove(functionNames: string[]) {
    let selectors = this.selectors.map((item) => item);
    for (const functionName of functionNames) {
      selectors = selectors.filter((v: string) => {
        if (v === this.contract.interface.getSighash(functionName)) {
          return false;
        }
        return true;
      });
    }

    this.selectors = selectors;
    return this;
  }

  get(functionNames: string[]) {
    const selectors = this.selectors.filter((v) => {
      for (const functionName of functionNames) {
        if (v === this.contract.interface.getSighash(functionName)) {
          return true;
        }
      }
      return false;
    });

    return new ContractWithSelectors(this.contract, selectors);
  }

  removeSelectors(signatures: string[]) {
    const iface = new ethers.utils.Interface(signatures.map((v) => "function " + v));
    const removeSelectors = signatures.map((v) => iface.getSighash(v));
    const selectors = this.selectors.filter((v) => !removeSelectors.includes(v));

    this.selectors = selectors;
    return removeSelectors;
  }
}

// get function selector from function signature
export const getSelector = (func: string): string => {
  const abiInterface = new ethers.utils.Interface([func]);
  return abiInterface.getSighash(ethers.utils.Fragment.from(func));
};

// find a particular address position in the return value of diamondLoupeFacet.facets()
export const findAddressPositionInFacets = (facetAddress: string, facets: IDiamondCut.FacetCutStruct[]) => {
  for (let i = 0; i < facets.length; i++) {
    if (facets[i].facetAddress === facetAddress) {
      return i;
    }
  }
};
