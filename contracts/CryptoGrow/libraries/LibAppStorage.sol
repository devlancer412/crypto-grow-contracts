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

  function setDomainSeparator(string memory name, string memory version) public {
    bytes32 hashedName = keccak256(bytes(name));
    bytes32 hashedVersion = keccak256(bytes(version));
    bytes32 typeHash = keccak256(
      "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
    );

    layout().domainSeparator = keccak256(
      abi.encode(typeHash, hashedName, hashedVersion, block.chainid, address(this))
    );
  }
}
