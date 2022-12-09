// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {LibMeta} from "../shared/libraries/LibMeta.sol";
import {IDiamondCut} from "../shared/interfaces/IDiamondCut.sol";
import {IERC165} from "../shared/interfaces/IERC165.sol";
import {IDiamondLoupe} from "../shared/interfaces/IDiamondLoupe.sol";
import {IERC173} from "../shared/interfaces/IERC173.sol";
import {ILink} from "./interfaces/ILink.sol";

import {LibDiamond} from "../shared/libraries/LibDiamond.sol";
import {LibAppStorage} from "./libraries/LibAppStorage.sol";
import {ERC20MetadataStorage} from "@solidstate/contracts/token/ERC20/metadata/ERC20MetadataStorage.sol";

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

  function init(Args memory _args) external {
    LibDiamond.DiamondStorage storage ds = LibDiamond.diamondStorage();

    // adding ERC165 data
    ds.supportedInterfaces[type(IERC165).interfaceId] = true;
    ds.supportedInterfaces[type(IDiamondCut).interfaceId] = true;
    ds.supportedInterfaces[type(IDiamondLoupe).interfaceId] = true;
    ds.supportedInterfaces[type(IERC173).interfaceId] = true;

    LibAppStorage.Layout storage appLayout = LibAppStorage.layout();
    appLayout.dao = _args.dao;
    appLayout.daoTreasury = _args.daoTreasury;
    appLayout.rarityFarming = _args.rarityFarming;
    appLayout.cryptoGrow = _args.cryptoGrow;
    appLayout.itemsBaseUri = "https://cryptogrow.com/metadata/items/";
    appLayout.childChainManager = _args.childChainManager;

    appLayout.domainSeparator = LibMeta.domainSeparator("cryptoGrowDiamond", "V1");

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
}
