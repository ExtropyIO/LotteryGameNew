var Lottery = artifacts.require("./Lottery.sol");
var instance;

contract('Lottery', function(accounts) {
    it("should initialise lottery", function() {
        return Lottery.deployed().then(function(instance) {
            return instance.initialiseLottery.sendTransaction(4);
        });
    });

    it("should register team", function() {
        return Lottery.deployed().then(function(instance1) {
            instance = instance1;
            return instance.initialiseLottery.sendTransaction(4);
        }).then(function(TxID) {
            // console.log(TxID);
            return instance.registerTeam("0x627306090abab3a6e1400e9345bc60c78a8bef57", "Team Rocket", "Password01");
        }).then(function(response) {
            var registered = false;
            for (var i = 0; i < response.logs.length; i++) {
                var log = response.logs[i];
                if (log.event == "TeamRegistered") {
                    registered = true;
                }
            }
            assert.ok(registered);
        });
    });

    it("should get team count", function() {
        return Lottery.deployed().then(function(instance1) {
            instance = instance1;
            return instance.initialiseLottery.sendTransaction(4);
        }).then(function(TxID) {
            // console.log(TxID);
            return instance.getTeamCount.call();
        }).then(function(result) {
            assert.equal(1, result.toNumber());
        })
    });

    it("should get team name", function() {
        return Lottery.deployed().then(function(instance1) {
          instance = instance1;
          return instance.initialiseLottery.sendTransaction(4);
        }).then(function(TxID) {
            // console.log(TxID);
            return instance.getTeamDetails.call(0);
        }).then(function(result) {
            assert.equal("Default Team", result[0]);
        })
    });

    it("should get team address", function() {
        return Lottery.deployed().then(function(instance1) {
          instance = instance1;
          return instance.initialiseLottery.sendTransaction(4);
        }).then(function(TxID) {
            // console.log(TxID);
            return instance.getTeamDetails.call(0);
        }).then(function(result) {
          assert.equal("0x0000000000000000000000000000000000000000", result[1]);
        })
    });

    it("should get team score", function() {
        return Lottery.deployed().then(function(instance1) {
          instance = instance1;
          return instance.initialiseLottery.sendTransaction(4);
        }).then(function(TxID) {
            // console.log(TxID);
            return instance.getTeamDetails.call(0);
        }).then(function(result) {
            assert.equal(13, result[2].toNumber());
        })
    });


});
