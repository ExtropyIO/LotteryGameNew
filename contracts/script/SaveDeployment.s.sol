// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";

contract SaveDeployment is Script {
    function saveContract(string memory name, address addr) external {
        string memory chainId = vm.toString(block.chainid);
        string memory json = "deployments";
        
        vm.serializeAddress(json, name, addr);
        
        string memory filename = string.concat(
            "./deployments/",
            chainId,
            ".json"
        );
        
        vm.writeJson(vm.serializeString(json, "chainId", chainId), filename);
    }
}