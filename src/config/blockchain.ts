export enum COINS {
  ETH = 0,
  USDT,
  USDC,
}

export enum CHAINS {
  ETHEREUM = 1,
  BINANCE = 56,
  RINKEBY = 4,
}

export const COIN_LOGOS = [
  'https://cryptologos.cc/logos/thumbs/ethereum.png?v=014',
  'https://cryptologos.cc/logos/thumbs/tether.png?v=014',
  'https://cryptologos.cc/logos/thumbs/usd-coin.png?v=014',
]

export const COINMAP = {
  [CHAINS.ETHEREUM]: [
    '',
    '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  ],
  [CHAINS.BINANCE]: [
    '0x2170ed0880ac9a755fd29b2688956bd959f933f8',
    '0x55d398326f99059ff775485246999027b3197955',
    '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
  ],
  [CHAINS.RINKEBY]: [
    '',
    '0x3b00ef435fa4fcff5c209a37d1f3dcff37c705ad',
    '0x7d66CDe53cc0A169cAE32712fC48934e610aeF14',
  ],
} as {
  [key: number]: string[]
}

export const PRICE_FEEDER = [
  '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419',
  '0x3E7d1eAB13ad0104d2750B8863b489D65364e32D',
  '0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6',
]

export const COIN_NAMES = ['ETH', 'USDT', 'USDC']

export const COIN_DECIMALS = [8, 0, 0]
export const COIN_SLIDER_STEP = [0.00000001, 1, 1]
