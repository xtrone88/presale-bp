export enum COINS {
  ETH = 0,
  USDT,
  // DOGE,
}

export enum CHAINS {
  ETHEREUM = 1,
  BINANCE = 56,
  RINKEBY = 4,
}

export const COIN_LOGOS = [
  'https://cryptologos.cc/logos/thumbs/ethereum.png?v=014',
  'https://cryptologos.cc/logos/thumbs/tether.png?v=014',
  'https://cryptologos.cc/logos/thumbs/dogecoin.png?v=014',
]

export const COINMAP = {
  [CHAINS.ETHEREUM]: ['', '0xdAC17F958D2ee523a2206206994597C13D831ec7', ''],
  [CHAINS.BINANCE]: [
    '0x2170ed0880ac9a755fd29b2688956bd959f933f8',
    '0x55d398326f99059ff775485246999027b3197955',
    '0x4206931337dc273a630d328da6441786bfad668f',
  ],
  [CHAINS.RINKEBY]: ['', '0x3b00ef435fa4fcff5c209a37d1f3dcff37c705ad', ''],
} as {
  [key: number]: string[]
}

export const PRICE_FEEDER = [
  '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419',
  '0x3E7d1eAB13ad0104d2750B8863b489D65364e32D',
  '0x2465CefD3b488BE410b941b1d4b2767088e2A028',
]

export const COIN_NAMES = ['ETH', 'USDT', 'DOGE']
