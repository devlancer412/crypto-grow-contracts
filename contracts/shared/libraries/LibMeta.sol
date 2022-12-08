// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library LibMeta {
  function msgSender() internal view returns (address) {
    return msg.sender;
  }

  function msgData() internal pure returns (bytes calldata) {
    return msg.data;
  }

  function domainSeparator(
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
