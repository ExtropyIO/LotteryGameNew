// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../../lib/forge-std/src/Script.sol";
import "../src/MyContract.sol";

contract DeployScript is Script {
    function run() external returns (MyContract) {
        uint256 deployerPrivateKey;
        
        // Determine which private key to use based on chain ID
        if (block.chainid == 1) {
            // Mainnet
            deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        } else if (block.chainid == 11155111) {
            // Sepolia
            deployerPrivateKey = vm.envUint("SEPOLIA_PRIVATE_KEY");
        } else {
            // Local (Anvil/Hardhat)
            deployerPrivateKey = vm.envUint("LOCAL_PRIVATE_KEY");
        }
        
        vm.startBroadcast(deployerPrivateKey);
        
        MyContract myContract = new MyContract();
        
        console.log("MyContract deployed to:", address(myContract));
        console.log("Network:", block.chainid);
        
        vm.stopBroadcast();
        
        return myContract;
    }
}