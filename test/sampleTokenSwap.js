const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('MYTokeSwap', async () => {
  // let signer;
  let tokenA;
  let tokenB;
  let uniswapV2Factory;
  let weth;
  let uniswapV2Pair;
  let uniswapV2Router;
  let getInit;
  let uniswapV2PairAt;
  let pair;
  let taxableToken;

  // const TOKEN_A_AMOUNT = ethers.parseEther('1');
  // const TOKEN_B_AMOUNT = ethers.parseEther('10');
  const TOKEN_A_AMOUNT = ethers.parseEther('1000');
  const TOKEN_B_AMOUNT = ethers.parseEther('1000');
  const ETH_AMOUNT = ethers.parseEther('1000');
  const LIQUDITY_AMOUNT = ethers.parseEther('100');
  const amountInq = ethers.parseEther('1000');
  const amountIn = ethers.parseEther('10');
  const amountOut = ethers.parseEther('1');
  const AMMOUNT_MIN = ethers.parseEther('100');
  const AMMOUNT_MAX = ethers.parseEther('100');
  const TOKEN_A_TEST = ethers.parseEther('200');
  const TOKEN_B_TEST = ethers.parseEther('100');

  beforeEach(async () => {
    signer = await ethers.getSigners();

    const TokenA = await ethers.getContractFactory('TokenA');
    tokenA = await TokenA.connect(signer[0]).deploy();

    const TokenB = await ethers.getContractFactory('TokenB');
    tokenB = await TokenB.connect(signer[0]).deploy();

    const WETH = await ethers.getContractFactory('WETH9');
    weth = await WETH.deploy();

    const UniswapV2Factory = await ethers.getContractFactory(
      'UniswapV2Factory'
    );
    uniswapV2Factory = await UniswapV2Factory.connect(signer[0]).deploy(
      signer[0].address
    );

    const Uniswapv2Router = await ethers.getContractFactory(
      'UniswapV2Router02'
    );
    uniswapV2Router = await Uniswapv2Router.connect(signer[0]).deploy(
      uniswapV2Factory.target,
      weth.target
    );

    const GetInit = await ethers.getContractFactory('CalHash');
    getInit = await GetInit.deploy();

    initHash = await getInit.connect(signer[0]).getInitHash();

    const UniswapV2Pair = await ethers.getContractFactory('UniswapV2Pair');
    uniswapV2Pair = await UniswapV2Pair.connect(signer[0]).deploy();

    const TaxableToken = await ethers.getContractFactory('tax_token');
    taxableToken = await TaxableToken.deploy();
  });
  async function _addLiquidity() {
    // console.log(initHash);
    await tokenA
      .connect(signer[0])
      .approve(uniswapV2Router.target, TOKEN_A_AMOUNT);
    await tokenB
      .connect(signer[0])
      .approve(uniswapV2Router.target, TOKEN_B_AMOUNT);

    await uniswapV2Router
      .connect(signer[0])
      .addLiquidity(
        tokenA.target,
        tokenB.target,
        TOKEN_A_AMOUNT,
        TOKEN_B_AMOUNT,
        1,
        1,
        signer[0].address,
        1764541741
      );
  }

  async function _addLiquidityETH() {
    // console.log(initHash);
    await tokenA
      .connect(signer[0])
      .approve(uniswapV2Router.target, TOKEN_A_AMOUNT);

    await uniswapV2Router
      .connect(signer[0])
      .addLiquidityETH(
        tokenA.target,
        TOKEN_A_AMOUNT,
        1,
        ETH_AMOUNT,
        signer[0].address,
        1764541741,
        { value: ETH_AMOUNT }
      );
  }

  async function _addLiquiditytxble() {
    await tokenA
      .connect(signer[0])
      .approve(uniswapV2Router.target, TOKEN_A_AMOUNT);

    await taxableToken
      .connect(signer[0])
      .approve(uniswapV2Router.target, TOKEN_B_AMOUNT);
    await uniswapV2Router
      .connect(signer[0])
      .addLiquidity(
        tokenA.target,
        taxableToken.target,
        TOKEN_A_AMOUNT,
        TOKEN_B_AMOUNT,
        1,
        1,
        signer[0].address,
        1764541741
      );
  }

  async function _addLiquidityETHtxble() {
    await taxableToken
      .connect(signer[0])
      .approve(uniswapV2Router.target, TOKEN_B_AMOUNT);
    await uniswapV2Router
      .connect(signer[0])
      .addLiquidityETH(
        taxableToken.target,
        TOKEN_A_AMOUNT,
        1,
        ETH_AMOUNT,
        signer[0].address,
        1764541741,
        { value: ETH_AMOUNT }
      );
  }

  describe('Token check the token Namne and Total supply we have to setted in contract..', async () => {
    it('Check The name of the TokenA and TokenB??', async () => {
      expect(await tokenA.name()).to.equal('MyTokenA');
      // console.log(await tokenA.name());
      expect(await tokenB.name()).to.equal('MyTokenB');
      // console.log(await tokenB.name());
    });
  });
  describe('Function Used in Uniswapv2Router02', async () => {
    it('To Add a Liquidity..', async () => {
      let iniBalT1 = await tokenA.balanceOf(signer[0].address);
      let iniBalT2 = await tokenB.balanceOf(signer[0].address);
      await _addLiquidity();
      pair = await uniswapV2Factory.getPair(tokenA.target, tokenB.target);
      uniswapV2PairAt = await uniswapV2Pair.connect(signer[0]).attach(pair);

      let fnlBalT1 = await tokenA.balanceOf(signer[0].address);
      let fnlBalT2 = await tokenB.balanceOf(signer[0].address);

      // console.log(
      //   `Reserve After addLiquidity: ${await uniswapV2PairAt.getReserves()}`
      // );
      // console.log(`Contract Address of Uniswap Pair: ${uniswapV2Pair.target}`);
      // console.log(`Pair Address : ${pair}`);
      // console.log(
      //   `Balance Of Liquidity Provider after liquidity : ${await uniswapV2PairAt.balanceOf(
      //     signer[0].address
      //   )}`
      // );

      // console.log(`
      // Initial Balance of Token A : ${iniBalT1}
      // Initial Balance of Token B : ${iniBalT2}
      // Final Balance of Token A   : ${fnlBalT1}
      // Final Balance of Token B   : ${fnlBalT2}
      // `);

      await tokenA
        .connect(signer[0])
        .approve(uniswapV2Router.target, TOKEN_A_TEST);
      await tokenB
        .connect(signer[0])
        .approve(uniswapV2Router.target, TOKEN_B_TEST);

      let ainiBalT1 = await tokenA.balanceOf(signer[0].address);
      let ainiBalT2 = await tokenB.balanceOf(signer[0].address);

      await uniswapV2Router
        .connect(signer[0])
        .addLiquidity(
          tokenA.target,
          tokenB.target,
          TOKEN_A_TEST,
          TOKEN_B_TEST,
          1,
          1,
          signer[0].address,
          1764541741
        );

      let afnlBalT1 = await tokenA.balanceOf(signer[0].address);
      let afnlBalT2 = await tokenB.balanceOf(signer[0].address);

      // console.log(
      //   `Reserve After addLiquidity: ${await uniswapV2PairAt.getReserves()}`
      // );
      // console.log(`Contract Address of Uniswap Pair: ${uniswapV2Pair.target}`);
      // console.log(`Pair Address : ${pair}`);
      // console.log(
      //   `Balance Of Liquidity Provider after liquidity : ${await uniswapV2PairAt.balanceOf(
      //     signer[0].address
      //   )}`
      // );

      // console.log(`
      // Initial Balance of Token A : ${ainiBalT1}
      // Initial Balance of Token B : ${ainiBalT2}
      // Final Balance of Token A   : ${afnlBalT1}
      // Final Balance of Token B   : ${afnlBalT2}
      // `);
    });
    it('addLiquidityETH Function', async () => {
      await _addLiquidityETH();
      // console.log(`Contract Address of Uniswap Pair: ${uniswapV2Pair.target}`);
      pair = await uniswapV2Factory.getPair(tokenA.target, weth.target);
      // console.log(`Pair Address : ${pair}`);
      uniswapV2PairAt = await uniswapV2Pair.connect(signer[0]).attach(pair);

      // console.log(
      //   `Balance Of Liquidity Provider: ${await uniswapV2PairAt.balanceOf(
      //     signer[0].address
      //   )}`
      // );

      // console.log(
      //   `Reserve After addLiquidity: ${await uniswapV2PairAt.getReserves()}`
      // );

      // let ainiBalT1 = await tokenA.balanceOf(signer[0].address);
      // let ainiBalT2 = await weth.balanceOf(signer[0].address);

      // let afnlBalT1 = await tokenA.balanceOf(signer[0].address);
      // let afnlBalT2 = await weth.balanceOf(signer[0].address);

      // console.log(`
      // Initial Balance of Token A : ${ainiBalT1}
      // Initial Balance of Token B : ${ainiBalT2}
      // Final Balance of Token A   : ${afnlBalT1}
      // Final Balance of Token B   : ${afnlBalT2}
      // `);
    });
    it('Hit remove Liquidity function', async () => {
      await _addLiquidity();
      pair = await uniswapV2Factory.getPair(tokenA.target, tokenB.target);

      uniswapV2PairAt = await uniswapV2Pair.connect(signer[0]).attach(pair);

      // console.log(
      //   `Balance Of Liquidity Provider after liquidity : ${await uniswapV2PairAt.balanceOf(
      //     signer[0].address
      //   )}`
      // );

      let liquidity = await uniswapV2PairAt.balanceOf(signer[0].address);

      // console.log(
      //   'Reserve After Add Liquidity: ',
      //   await uniswapV2PairAt.getReserves()
      // );
      let initalBalanceTokenA = await tokenA.balanceOf(signer[0].address);
      let initalBalanceTokenB = await tokenB.balanceOf(signer[0].address);
      await uniswapV2PairAt
        .connect(signer[0])
        .approve(uniswapV2Router.target, liquidity);

      await uniswapV2Router
        .connect(signer[0])
        .removeLiquidity(
          tokenA.target,
          tokenB.target,
          liquidity,
          1,
          1,
          signer[0].address,
          1724915257
        );
      // console.log(
      //   `\nBalance Of Liquidity Provider after liquidity is removed: ${await uniswapV2PairAt.balanceOf(
      //     signer[0].address
      //   )}`
      // );

      // console.log(
      //   `Reserve After Remove Liquidity: ${await uniswapV2PairAt.getReserves()}`
      // );

      let finalbalanceTokenA = await tokenA.balanceOf(signer[0].address);
      let finalBalanceTokenB = await tokenB.balanceOf(signer[0].address);

      // console.log('Inital Balance of Token A: - ', initalBalanceTokenA);
      // console.log('Inintal balance of Token b: - ', initalBalanceTokenB);
      // console.log('Final balance of Token A: - ', finalbalanceTokenA);
      // console.log('Final balance of Token b: - ', finalBalanceTokenB);
    });
    it('RemoveLiqidityETH', async () => {
      // console.log(initHash);
      await tokenA
        .connect(signer[0])
        .approve(uniswapV2Router.target, TOKEN_A_AMOUNT);

      await uniswapV2Router
        .connect(signer[0])
        .addLiquidityETH(
          tokenA.target,
          TOKEN_A_AMOUNT,
          1,
          ETH_AMOUNT,
          signer[0].address,
          1764541741,
          { value: ETH_AMOUNT }
        );
      // console.log(`Contract Address of Uniswap Pair: ${uniswapV2Pair.target}`);
      pair = await uniswapV2Factory.getPair(tokenA.target, weth.target);
      // console.log(`Pair Address : ${pair}`);
      uniswapV2PairAt = await uniswapV2Pair.connect(signer[0]).attach(pair);

      let liquidity = await uniswapV2PairAt.balanceOf(signer[0].address);

      // console.log(
      //   `Balance Of Liquidity Provider after liquidity : ${await uniswapV2PairAt.balanceOf(
      //     signer[0].address
      //   )}`
      // );

      await uniswapV2PairAt
        .connect(signer[0])
        .approve(uniswapV2Router.target, liquidity);

      // console.log(
      //   `Reserve before Remove Liquidity: ${await uniswapV2PairAt.getReserves()}`
      // );

      await uniswapV2Router
        .connect(signer[0])
        .removeLiquidityETH(
          tokenA.target,
          liquidity,
          1,
          1,
          signer[0].address,
          1724915257
        );
      // console.log(
      //   `\nBalance Of Liquidity Provider after liquidity is removed: ${await uniswapV2PairAt.balanceOf(
      //     signer[0].address
      //   )}`
      // );

      // console.log(
      //   `Reserve After Remove Liquidity: ${await uniswapV2PairAt.getReserves()}`
      // );
    });
    it('SwapExactTokensForTokens', async () => {
      await _addLiquidity();
      // console.log(
      //   `Contract Address of Uniswap Pair Contract: ${uniswapV2Pair.target}`
      // );
      pair = await uniswapV2Factory.getPair(tokenA.target, tokenB.target);
      // console.log(`Pair Address Of TokenA/TokenB via Factory: ${pair}`);
      let uniswapV2PairAt = await uniswapV2Pair.connect(signer[0]).attach(pair);
      let liquidity = await uniswapV2PairAt.balanceOf(signer[0].address);
      // // console.log(`Liquidity After addLiquidity Function : ${liquidity}`);
      // console.log(
      //   `Reserve After addLiquidity: ${await uniswapV2PairAt.getReserves()}`
      // );
      await uniswapV2PairAt
        .connect(signer[0])
        .approve(uniswapV2Router.target, liquidity);
      await tokenA
        .connect(signer[0])
        .approve(uniswapV2Router.target, TOKEN_A_AMOUNT);
      let iniBalT1 = await tokenA.balanceOf(signer[0].address);
      let iniBalT2 = await tokenB.balanceOf(signer[0].address);

      await uniswapV2Router
        .connect(signer[0])
        .swapExactTokensForTokens(
          amountIn,
          1,
          [tokenA.target, tokenB.target],
          signer[0].address,
          1764541741
        );

      // console.log(`\nLiquidity After swap Function : ${liquidity}`);
      // console.log(`Reserve After swap: ${await uniswapV2PairAt.getReserves()}`);

      let fnlBalT1 = await tokenA.balanceOf(signer[0].address);
      let fnlBalT2 = await tokenB.balanceOf(signer[0].address);
      // let fnlBalT3 = (parseInt(await tokenA.balanceOf(signer[4].address))/1e18);
      expect(iniBalT1).to.be.greaterThan(fnlBalT1);
      expect(fnlBalT2).to.be.greaterThan(iniBalT2);
      // expect(fnlBalT3).to.equal(0.3);
    //   console.log(`
    // Initial Balance of Token A : ${iniBalT1}
    // Initial Balance of Token B : ${iniBalT2}
    // Final Balance of Token A   : ${fnlBalT1}
    // Final Balance of Token B   : ${fnlBalT2}
    // `);
    });
    it('swapTokensForExactTokens Function', async () => {
      await _addLiquidity();

      // console.log(
      //   `Contract Address of Uniswap Pair Contract: ${uniswapV2Pair.target}`
      // );
      pair = await uniswapV2Factory.getPair(tokenA.target, tokenB.target);
      // console.log(`Pair Address Of TokenA/TokenB via Factory: ${pair}`);
      let uniswapV2PairAt = await uniswapV2Pair.connect(signer[0]).attach(pair);
      let liquidity = await uniswapV2PairAt.balanceOf(signer[0].address);
      // console.log(`Liquidity After addLiquidity Function : ${liquidity}`);
      // console.log(
      //   `Reserve After addLiquidity: ${await uniswapV2PairAt.getReserves()}`
      // );
      await uniswapV2PairAt
        .connect(signer[0])
        .approve(uniswapV2Router.target, liquidity);
      await tokenA
        .connect(signer[0])
        .approve(uniswapV2Router.target, TOKEN_A_AMOUNT);
      let iniBalT1 = await tokenA.balanceOf(signer[0].address);
      let iniBalT2 = await tokenB.balanceOf(signer[0].address);
      // uint amountOut,uint amountInMax,address[] calldata path, address to, uint deadline
      await uniswapV2Router
        .connect(signer[0])
        .swapTokensForExactTokens(
          amountOut,
          AMMOUNT_MAX,
          [tokenA.target, tokenB.target],
          signer[0].address,
          1764541741
        );
      // console.log(`\nLiquidity After swap Function : ${liquidity}`);
      // console.log(`Reserve After swap: ${await uniswapV2PairAt.getReserves()}`);

      let fnlBalT1 = await tokenA.balanceOf(signer[0].address);
      let fnlBalT2 = await tokenB.balanceOf(signer[0].address);

      // console.log(`
      // Initial Balance of Token A : ${iniBalT1}
      // Initial Balance of Token B : ${iniBalT2}
      // Final Balance of Token A   : ${fnlBalT1}
      // Final Balance of Token B   : ${fnlBalT2}
      // `);
    });
    it('swapExactETHForTokens', async () => {
      await _addLiquidityETH();

      let initalToken = await tokenA.balanceOf(signer[0].address);
      // console.log('initalToken', initalToken);
      // (uint amountOutMin, address[] calldata path, address to, uint deadline)
      await uniswapV2Router
        .connect(signer[0])
        .swapExactETHForTokens(
          1,
          [weth.target, tokenA.target],
          signer[0].address,
          1764541741,
          { value: amountIn }
        );

      let finalBalance = await tokenA.balanceOf(signer[0].address);
      // console.log('Final Balance of Token A: - ', finalBalance);
      expect(initalToken).to.be.lessThan(finalBalance);
    });
    it('swapTokensForExactETH', async () => {
      // console.log('swapTokensForExactETH');
      await _addLiquidityETH();

      let initalToken = await tokenA.balanceOf(signer[0].address);
      // console.log('initial balance', initalToken);
      await tokenA
        .connect(signer[0])
        .approve(uniswapV2Router.target, TOKEN_A_AMOUNT);
      // console.log('check01');
      // console.log(amountOut);
      // console.log(TOKEN_A_AMOUNT);
      // //  (uint amountOut, uint amountInMax, address[] calldata path, address to, uint deadline)
      await uniswapV2Router
        .connect(signer[0])
        .swapTokensForExactETH(
          amountOut,
          TOKEN_A_AMOUNT,
          [tokenA.target, weth.target],
          signer[0].address,
          1764541741
        );
      let finalBalance = await tokenA.balanceOf(signer[0].address);
      // console.log('Final Balance of Token A: - ', finalBalance);

      // expect(initalToken).to.be.greaterThan(finalBalance);
    });
    it('swapExactTokensForETH function', async () => {
      await _addLiquidityETH();
      const initialBalanceOftokenA = await tokenA.balanceOf(signer[0].address);
      // console.log(initialBalanceOftokenA);
      await tokenA
        .connect(signer[0])
        .approve(uniswapV2Router.target, amountInq);
      // (uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline)
      await uniswapV2Router
        .connect(signer[0])
        .swapExactTokensForETH(
          amountIn,
          1,
          [tokenA.target, weth.target],
          signer[0].address,
          1764541741
        );
      const finalBalanceofTokenA = await tokenA.balanceOf(signer[0].address);
      // console.log(
      //   'Inital balance',
      //   initialBalanceOftokenA,
      //   'Final balance: -',
      //   finalBalanceofTokenA
      // );

      expect(initialBalanceOftokenA).to.be.greaterThan(finalBalanceofTokenA);
    });
    it('swapETHForExactTokens', async () => {
      await _addLiquidityETH();

      const initalBalance = await tokenA.balanceOf(signer[0].address);

      // await tokenA
      //   .connect(signer[0])
      //   .approve(uniswapV2Router.target, amountOut);

      await uniswapV2Router
        .connect(signer[0])
        .swapETHForExactTokens(
          amountOut,
          [weth.target, tokenA.target],
          signer[0].address,
          1764541741,
          { value: amountIn }
        );

      const finalBalance = await tokenA.balanceOf(signer[0].address);

      // console.log('Inital Balance: ', initalBalance);
      // console.log('Final Balance: ', finalBalance);
    });
    it('swapExactTokensForTokensSupportingFeeOnTransferTokens Function', async () => {
      await _addLiquiditytxble();

      let iniBalT1 = await tokenA.balanceOf(signer[0].address);
      let iniBalT2 = await taxableToken.balanceOf(signer[0].address);

      // console.log('InitalBalance : - ', iniBalT1);
      // console.log('Inital Balance of taxable token: - ', iniBalT2);

      await tokenA
        .connect(signer[0])
        .approve(uniswapV2Router.target, TOKEN_A_AMOUNT);
      await uniswapV2Router
        .connect(signer[0])
        .swapExactTokensForTokensSupportingFeeOnTransferTokens(
          amountIn,
          1,
          [tokenA.target, taxableToken.target],
          signer[0].address,
          1764541741
        );

      let finalbalf1 = await tokenA.balanceOf(signer[0].address);
      let finalbalt1 = await taxableToken.balanceOf(signer[0].address);

      // console.log('Final balance of Token A: - ', finalbalf1);
      // console.log('Final balance of Taxable token: - ', finalbalt1);
    });
    it('swapExactETHForTokensSupportingFeeOnTransferTokens Function', async () => {
      await _addLiquidityETHtxble();

      let initalBalanceToken = await taxableToken.balanceOf(signer[0].address);

      await uniswapV2Router
        .connect(signer[0])
        .swapExactETHForTokensSupportingFeeOnTransferTokens(
          1,
          [weth.target, taxableToken.target],
          signer[0].address,
          1764541741,
          { value: amountIn }
        );

      let finalBalanceToken = await taxableToken.balanceOf(signer[0].address);

      // console.log('Inital Balance: - ', initalBalanceToken);
      // console.log('Final Balance: - ', finalBalanceToken);

      expect(initalBalanceToken).to.be.lessThan(finalBalanceToken);
    });
    it('swapExactTokensForETHSupportingFeeOnTransferTokens Function', async () => {
      await _addLiquidityETHtxble();

      let initalBalanceToken = await taxableToken.balanceOf(signer[0].address);

      await taxableToken
        .connect(signer[0])
        .approve(uniswapV2Router.target, amountInq);
      await uniswapV2Router
        .connect(signer[0])
        .swapExactTokensForETHSupportingFeeOnTransferTokens(
          amountIn,
          1,
          [taxableToken.target, weth.target],
          signer[0].address,
          1764541741
        );

      let finalbalanceToken = await taxableToken.balanceOf(signer[0].address);

      // console.log('Inital Balance: - ', initalBalanceToken);
      // console.log('Final Balance: - ', finalbalanceToken);
    });
  });
});
