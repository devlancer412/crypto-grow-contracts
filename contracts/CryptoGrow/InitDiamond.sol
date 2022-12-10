// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {ILink} from "./interfaces/ILink.sol";

import {LibAppStorage} from "./libraries/LibAppStorage.sol";
import {ERC20MetadataStorage} from "@solidstate/contracts/token/ERC20/metadata/ERC20MetadataStorage.sol";

/**
 * @title Diamond init contract.
 */
contract InitDiamond {
  struct Args {
    address dao;
    address daoTreasury;
    address cryptoGrow;
    address rarityFarming;
    address hrvstContract;
    bytes32 chainlinkKeyHash;
    uint256 chainlinkFee;
    address vrfCoordinator;
    address linkAddress;
    address childChainManager;
    string name;
    string symbol;
  }

  /**
   * @notice Init app storate state.
   * @param _args Init params
   */
  function init(Args memory _args) external {
    LibAppStorage.Layout storage appLayout = LibAppStorage.layout();
    appLayout.dao = _args.dao;
    appLayout.daoTreasury = _args.daoTreasury;
    appLayout.rarityFarming = _args.rarityFarming;
    appLayout.cryptoGrow = _args.cryptoGrow;
    appLayout.itemsBaseUri = "https://cryptogrow.com/metadata/items/";
    appLayout.childChainManager = _args.childChainManager;

    appLayout.domainSeparator = _domainSeparator("cryptoGrowDiamond", "V1");

    appLayout.hrvstContract = _args.hrvstContract;
    appLayout.keyHash = _args.chainlinkKeyHash;
    appLayout.fee = uint144(_args.chainlinkFee);
    appLayout.vrfCoordinator = _args.vrfCoordinator;
    appLayout.link = ILink(_args.linkAddress);

    appLayout.listingFeeInWei = 1e17;

    ERC20MetadataStorage.Layout storage erc20Layout = ERC20MetadataStorage.layout();
    erc20Layout.name = _args.name;
    erc20Layout.symbol = _args.symbol;
    erc20Layout.decimals = 18;
  }

  /**
   * @notice Generate domain separatore
   * @param name Name of app
   * @param version Version of app
   * @return bytes32 Domain separatore
   */
  function _domainSeparator(
    string memory name,
    string memory version
  ) internal view returns (bytes32) {
    bytes32 hashedName = keccak256(bytes(name));
    bytes32 hashedVersion = keccak256(bytes(version));
    bytes32 typeHash = keccak256(
      "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
    );

    return keccak256(abi.encode(typeHash, hashedName, hashedVersion, block.chainid, address(this)));
  }
}
