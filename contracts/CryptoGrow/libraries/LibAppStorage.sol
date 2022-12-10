// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {ILink} from "../interfaces/ILink.sol";

library LibAppStorage {
  struct Layout {
    address dao;
    address daoTreasury;
    address cryptoGrow;
    address rarityFarming;
    address hrvstContract;
    address vrfCoordinator;
    address childChainManager;
    string itemsBaseUri;
    bytes32 domainSeparator;
    bytes32 keyHash;
    uint144 fee;
    ILink link;
    uint256 listingFeeInWei;
  }

  bytes32 internal constant STORAGE_SLOT = keccak256("cryptogrow.contracts.storage.App");

  function layout() internal pure returns (Layout storage l) {
    bytes32 slot = STORAGE_SLOT;
    assembly {
      l.slot := slot
    }
  }
}
