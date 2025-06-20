// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";

contract HelperConfig is Script {
    struct NetworkConfig {
        uint256 deployerKey;
        address someOtherContract; // If you need to interact with existing contracts
    }
    
    NetworkConfig public activeNetworkConfig;
    
    constructor() {
        if (block.chainid == 11155111) {
            activeNetworkConfig = getSepoliaConfig();
        } else if (block.chainid == 1) {
            activeNetworkConfig = getMainnetConfig();
        } else {
            activeNetworkConfig = getAnvilConfig();
        }
    }
    
    function getSepoliaConfig() public view returns (NetworkConfig memory) {
        return NetworkConfig({
            deployerKey: vm.envUint("SEPOLIA_PRIVATE_KEY"),
            someOtherContract: address(0) // Add actual addresses if needed
        });
    }
    
    function getMainnetConfig() public view returns (NetworkConfig memory) {
        return NetworkConfig({
            deployerKey: vm.envUint("PRIVATE_KEY"),
            someOtherContract: address(0)
        });
    }
    
    function getAnvilConfig() public returns (NetworkConfig memory) {
        // Deploy mocks if needed for local testing
        return NetworkConfig({
            deployerKey: vm.envUint("LOCAL_PRIVATE_KEY"),
            someOtherContract: address(0)
        });
    }
}