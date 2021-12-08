// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./AggregatorV3Interface.sol";

contract BAPSaleContract is Ownable {
    address private immutable BAP;
    address private immutable BAP_OWNER;
    uint256 private BAP_PRICE;

    mapping(address => address) private PRICE_FEEDERS;

    constructor(address _BAP, address _BAP_OWNER) {
        BAP = _BAP;
        BAP_OWNER = _BAP_OWNER;
        BAP_PRICE = 11000000; // means 0.11$

        // ETH/USD
        PRICE_FEEDERS[
            address(0)
        ] = 0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419;
        // USDT/USD
        PRICE_FEEDERS[
            address(0xdAC17F958D2ee523a2206206994597C13D831ec7)
        ] = 0x3E7d1eAB13ad0104d2750B8863b489D65364e32D;
    }

    event PriceChanged(uint256 price);
    event Purchased(address receiver, uint256 amount);

    function bapPrice() public view returns (uint256) {
        return BAP_PRICE;
    }

    function setBapPrice(uint256 price) public onlyOwner {
        BAP_PRICE = price;
        emit PriceChanged(price);
    }

    /**
     * Request the quantity of purchasing BAP with ETH or stable coins (such as USDC, USDT) and specified amount
     */
    function buy(
        uint256 quantity,
        address token,
        uint256 amount
    ) public payable {
        require(IERC20(BAP).balanceOf(BAP_OWNER) > quantity, "Required BAP exceeds the balance");
        require(quantity > 0 || (token == address(0) && msg.value > 0) || amount > 0, "You have wrong parameters");

        if (token == address(0)) {
            amount = msg.value;
        }
        uint256 payment = (uint256(getLatestPrice(PRICE_FEEDERS[token])) * amount) / (quantity * BAP_PRICE);
        require(amount > payment, "You have paid less than expected");

        if (token != address(0)) {
            IERC20(token).transferFrom(msg.sender, address(this), payment);
        }

        uint256 remain = amount - payment;
        if (token == address(0) && remain > 0) {
            payable(msg.sender).transfer(remain);
        }

        IERC20(BAP).transferFrom(BAP_OWNER, msg.sender, quantity);
        
        emit Purchased(msg.sender, quantity);
    }

    function withraw(address token, uint256 amount) public payable onlyOwner {
        uint256 balance = 0;
        if (token == address(0)) {
            balance = address(this).balance;
        } else {
            balance = IERC20(token).balanceOf(address(this));
        }

        require(balance > amount, "Required amount exceeds the balance");

        if (token == address(0)) {
            payable(BAP_OWNER).transfer(amount);
        } else {
            IERC20(token).transfer(BAP_OWNER, amount);
        }
    }

    function getLatestPrice(address feeder) public view returns (int256) {
        (
            uint80 roundID,
            int256 price,
            uint256 startedAt,
            uint256 timeStamp,
            uint80 answeredInRound
        ) = AggregatorV3Interface(feeder).latestRoundData();
        return price;
    }
}
