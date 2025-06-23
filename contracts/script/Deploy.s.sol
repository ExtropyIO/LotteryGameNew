
pragma solidity ^0.8.19;
import "forge-std/Script.sol";
import "forge-std/StdJson.sol";
import "../src/Lottery.sol";
contract DeployScript is Script {
    using stdJson for string;

    function run() external {
        // Load the private key from the .env file
        uint256 deployerPrivateKey = vm.envUint("LOCAL_PRIVATE_KEY");
        
        string memory deploymentsPath = "contracts/deployments.json";
        
        // --- DEPLOYMENT ---
        vm.startBroadcast(deployerPrivateKey);

        // 1. Deploy the Lottery contract
        Lottery lottery = new Lottery();
        
        // 2. Initialize the lottery with a seed value (like in the old script)
        uint8 seed = 9;
        lottery.initialiseLottery(seed);

        vm.stopBroadcast();

        // --- UPDATE DEPLOYMENTS FILE ---
        
        // 3. Get the current chain ID
        string memory chainId = vm.toString(block.chainid);
        
        // 4. Define the key path for the JSON update
        // Example: "31337.contracts.Lottery"
        string memory key = string.concat(chainId, ".contracts.Lottery");
        
        // 5. Use the serializeAddress cheatcode to update the JSON file.
        // This reads the file, sets the value at the specified key, and writes it back.
        vm.serializeAddress(deploymentsPath, key, address(lottery));

        // 6. Log the results to the console
        console.log("");
        console.log("Lottery contract deployed to:", address(lottery));
        console.log("Initialised with seed:", seed);
        console.log("Updated contracts/deployments.json with new address.");
    }
}
