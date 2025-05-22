var Lottery = artifacts.require("./Lottery.sol");
var Attacker = artifacts.require("./Attacker.sol");

module.exports = function(deployer) {
  var lotteryAddress;

  deployer.deploy(Lottery)
    .then((lotteryInstance) => {
      lotteryAddress = lotteryInstance.address;
      return lotteryInstance.initialiseLottery(9);
    })
    .then(() => {
      return deployer.deploy(Attacker, lotteryAddress);
    });

};
