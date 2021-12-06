// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";

contract TokenMintERC20Token is Ownable {

  address private immutable BAP;

  constructor(address _BAP) {
    BAP = _BAP;
  }

  event Purchased(address receiver, uint256 amount);

  /**
   * Request the quantity of purchasing BAP with ETH or stable coins (such as USDC, USDT) and specified amount
   */
  function buy(uint256 quantity, address token, uint256 amount) public returns (bool) {
    
    emit Purchased(msg.sender, quantity);
  }
  
}