// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {ILink} from "../interfaces/ILink.sol";

struct AppStorage {
  address dao;
  address daoTreasury;
  address cryptoGrow;
  address rarityFarming;
  address hrvstContract;
  address vrfCoordinator;
  address childChainManager;
  string name;
  string symbol;
  string itemsBaseUri;
  bytes32 domainSeparator;
  bytes32 keyHash;
  uint144 fee;
  ILink link;
  uint256 listingFeeInWei;
  // havest variables
  uint256 totalSupply;
  mapping(address => uint256) balances;
  mapping(address => uint256) approvedContractIndexes;
  address[] approvedContracts;
  mapping(address => mapping(address => uint256)) allowances;
}
