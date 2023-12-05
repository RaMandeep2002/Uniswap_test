const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Library contract testing:- ', async () => {
  let uniswapV2Library;
  beforeEach(async () => {
    signers = await ethers.getSigners();

    let UniswapV2Library = await ethers.getContractFactory('LibraryTest');
    uniswapV2Library = await UniswapV2Library.connect(signers[0]).deploy();
  });

  describe('Funcitinal tsting:- ', async () => {
    it('getAmountsOut() tesing:- ', async () => {
      const amountIn = 39;
      const reserveIn = 200;
      const reserveOut = 400;

      const amountOut = await uniswapV2Library.getAmountOut(
        amountIn,
        reserveIn,
        reserveOut
      );

      console.log('Amount out is:- ', amountOut);
    });
  });
});
