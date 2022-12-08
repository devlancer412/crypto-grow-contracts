// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IERC20} from "../shared/interfaces/IERC20.sol";
import {LibMeta} from "../shared/libraries/LibMeta.sol";

contract CollateralEscrow {
  struct AppStorage {
    address owner;
  }
  AppStorage internal s;

  constructor(address _hTokenContract) {
    s.owner = LibMeta.msgSender();
    approveCryptoGrowDiamond(_hTokenContract);
  }

  function approveCryptoGrowDiamond(address _hTokenContract) public {
    require(LibMeta.msgSender() == s.owner, "CollateralEscrow: Not owner of contract");
    require(
      IERC20(_hTokenContract).approve(s.owner, type(uint256).max),
      "CollateralEscrow: token not approved for transfer"
    );
  }
}
