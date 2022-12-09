// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {LibDiamond} from "../../shared/libraries/LibDiamond.sol";
import {ERC20Base} from "@solidstate/contracts/token/ERC20/base/ERC20Base.sol";
import {ERC20Extended} from "@solidstate/contracts/token/ERC20/extended/ERC20Extended.sol";
import {ERC20Metadata} from "@solidstate/contracts/token/ERC20/metadata/ERC20Metadata.sol";
import {LibMeta} from "../../shared/libraries/LibMeta.sol";

contract HRVSTFacet is ERC20Base, ERC20Extended, ERC20Metadata {
  function mint() external {
    uint256 amount = 1e18;
    _mint(LibMeta.msgSender(), amount);
  }

  function mintTo(address _user) external {
    uint256 amount = 1e18;
    _mint(_user, amount);
  }
}
