// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
// import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";

contract TokenB is ERC20 {
    constructor() ERC20("MyTokenB", "MTKB"){
         _mint(msg.sender, 10000000 * 10 ** 18);
    }

}