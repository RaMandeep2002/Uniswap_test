// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./libraries/UniswapV2Library.sol";

contract LibraryTest {
    function getAmountOut(
        uint amountIn,
        uint reserveIn,
        uint reserveOut
    ) public pure returns (uint) {
        return UniswapV2Library.getAmountOut(amountIn, reserveIn, reserveOut);
    }
}
