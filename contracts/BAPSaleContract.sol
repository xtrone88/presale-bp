// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";

contract TokenMintERC20Token is Ownable {

  address private immutable BAP;
  address private immutable BAP_OWNER;
  uint256 public BAP_PRICE;

  constructor(address _BAP, address _BAP_OWNER) {
    BAP = _BAP;
    BAP_OWNER = _BAP_OWNER;
    BAP_PRICE = 11; // means 0.11$
  }

  event Purchased(address receiver, uint256 amount);

  /**
   * Request the quantity of purchasing BAP with ETH or stable coins (such as USDC, USDT) and specified amount
   */
  function buy(uint256 quantity, address token, uint256 amount) public returns (bool) {
    
    emit Purchased(msg.sender, quantity);
  }

  function setBapPrice(uint256 price) public onlyOwner {
    BAP_PRICE = price;
  }
  
}