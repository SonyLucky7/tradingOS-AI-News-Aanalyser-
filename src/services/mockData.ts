import { NewsEvent, MarketTicker, RiskMarker, OptionChainData, JournalEntry, EconomicEvent } from '../types/tradeos';

// ========================================================================================
// TRADEOS AI — COMPLETE INSTITUTIONAL ASSET DIRECTORY
// 100+ Trading Pairs: Crypto, NSE Indian Stocks, Forex Majors/Minors, Commodities, US Stocks
// ========================================================================================

const c = (data: number[], price: number) => [...data.slice(-(4)), price]; // compact chart helper

export const INITIAL_TICKERS: MarketTicker[] = [

  // ─────────────────────────── CRYPTO (20 pairs) ───────────────────────────
  { symbol: 'BTCUSDT', name: 'Bitcoin / US Dollar', category: 'CRYPTO', price: 67845.50, change24h: 3.42, high24h: 68400, low24h: 65200, volume24h: '$38.4B', fundingRate: 0.0125, openInterest: '$18.2B', chartData: c([65200,65600,66400,67100,67500], 67845.50) },
  { symbol: 'ETHUSDT', name: 'Ethereum / US Dollar', category: 'CRYPTO', price: 3520.10, change24h: 4.18, high24h: 3580, low24h: 3350, volume24h: '$19.1B', fundingRate: 0.0098, openInterest: '$9.4B', chartData: c([3350,3390,3420,3480], 3520.10) },
  { symbol: 'SOLUSDT', name: 'Solana / US Dollar', category: 'CRYPTO', price: 182.40, change24h: 5.60, high24h: 188, low24h: 172, volume24h: '$6.2B', chartData: c([172,175,178,180], 182.40) },
  { symbol: 'XRPUSDT', name: 'Ripple / US Dollar', category: 'CRYPTO', price: 0.6285, change24h: 2.10, high24h: 0.645, low24h: 0.610, volume24h: '$2.4B', chartData: c([0.610,0.618,0.625,0.627], 0.6285) },
  { symbol: 'BNBUSDT', name: 'Binance Coin / US Dollar', category: 'CRYPTO', price: 598.40, change24h: 1.80, high24h: 612, low24h: 585, volume24h: '$2.8B', chartData: c([585,590,595,597], 598.40) },
  { symbol: 'DOGEUSDT', name: 'Dogecoin / US Dollar', category: 'CRYPTO', price: 0.1642, change24h: 7.20, high24h: 0.172, low24h: 0.152, volume24h: '$3.1B', chartData: c([0.152,0.158,0.162,0.163], 0.1642) },
  { symbol: 'ADAUSDT', name: 'Cardano / US Dollar', category: 'CRYPTO', price: 0.4520, change24h: 3.85, high24h: 0.468, low24h: 0.432, volume24h: '$1.2B', chartData: c([0.432,0.440,0.448,0.450], 0.4520) },
  { symbol: 'AVAXUSDT', name: 'Avalanche / US Dollar', category: 'CRYPTO', price: 38.90, change24h: 4.50, high24h: 40.20, low24h: 37.10, volume24h: '$1.6B', chartData: c([37.10,37.80,38.40,38.70], 38.90) },
  { symbol: 'DOTUSDT', name: 'Polkadot / US Dollar', category: 'CRYPTO', price: 7.25, change24h: 2.30, high24h: 7.50, low24h: 7.05, volume24h: '$580M', chartData: c([7.05,7.12,7.18,7.22], 7.25) },
  { symbol: 'MATICUSDT', name: 'Polygon / US Dollar', category: 'CRYPTO', price: 0.7180, change24h: 1.95, high24h: 0.735, low24h: 0.698, volume24h: '$420M', chartData: c([0.698,0.705,0.712,0.716], 0.7180) },
  { symbol: 'LINKUSDT', name: 'Chainlink / US Dollar', category: 'CRYPTO', price: 16.45, change24h: 3.10, high24h: 17.00, low24h: 15.80, volume24h: '$890M', chartData: c([15.80,16.00,16.20,16.40], 16.45) },
  { symbol: 'LTCUSDT', name: 'Litecoin / US Dollar', category: 'CRYPTO', price: 82.60, change24h: 1.40, high24h: 84.50, low24h: 81.00, volume24h: '$620M', chartData: c([81.00,81.50,82.00,82.40], 82.60) },
  { symbol: 'UNIUSDT', name: 'Uniswap / US Dollar', category: 'CRYPTO', price: 10.85, change24h: 5.20, high24h: 11.20, low24h: 10.20, volume24h: '$380M', chartData: c([10.20,10.45,10.65,10.80], 10.85) },
  { symbol: 'NEARUSDT', name: 'NEAR Protocol / US Dollar', category: 'CRYPTO', price: 8.42, change24h: 6.80, high24h: 8.80, low24h: 7.85, volume24h: '$750M', chartData: c([7.85,8.05,8.25,8.38], 8.42) },
  { symbol: 'AAVEUSDT', name: 'Aave / US Dollar', category: 'CRYPTO', price: 112.30, change24h: 2.90, high24h: 116.00, low24h: 108.50, volume24h: '$290M', chartData: c([108.50,110.00,111.50,112.00], 112.30) },
  { symbol: 'APTUSDT', name: 'Aptos / US Dollar', category: 'CRYPTO', price: 9.68, change24h: 4.15, high24h: 10.10, low24h: 9.20, volume24h: '$450M', chartData: c([9.20,9.40,9.55,9.65], 9.68) },
  { symbol: 'SUIUSDT', name: 'Sui / US Dollar', category: 'CRYPTO', price: 1.92, change24h: 8.50, high24h: 2.05, low24h: 1.76, volume24h: '$1.1B', chartData: c([1.76,1.82,1.88,1.90], 1.92) },
  { symbol: 'ARBUSDT', name: 'Arbitrum / US Dollar', category: 'CRYPTO', price: 1.18, change24h: 3.40, high24h: 1.22, low24h: 1.13, volume24h: '$520M', chartData: c([1.13,1.15,1.16,1.17], 1.18) },
  { symbol: 'OPUSDT', name: 'Optimism / US Dollar', category: 'CRYPTO', price: 2.65, change24h: 2.80, high24h: 2.74, low24h: 2.55, volume24h: '$340M', chartData: c([2.55,2.58,2.62,2.64], 2.65) },
  { symbol: 'PEPEUSDT', name: 'Pepe / US Dollar', category: 'CRYPTO', price: 0.00001245, change24h: 12.50, high24h: 0.00001320, low24h: 0.00001100, volume24h: '$1.8B', chartData: c([0.00001100,0.00001150,0.00001200,0.00001230], 0.00001245) },

  // ─────────────────────────── NSE INDIAN STOCKS (25 stocks) ───────────────────────────
  { symbol: 'NIFTY50', name: 'NSE Nifty 50 Index', category: 'INDIAN_STOCKS', price: 24580.25, change24h: 0.85, high24h: 24650, low24h: 24390, volume24h: '₹42,500 Cr', chartData: c([24390,24420,24480,24550], 24580.25) },
  { symbol: 'BANKNIFTY', name: 'NSE Bank Nifty Index', category: 'INDIAN_STOCKS', price: 52410.80, change24h: -0.32, high24h: 52800, low24h: 52200, volume24h: '₹28,100 Cr', chartData: c([52800,52650,52500,52350], 52410.80) },
  { symbol: 'RELIANCE', name: 'Reliance Industries Ltd', category: 'INDIAN_STOCKS', price: 3120.50, change24h: 1.20, high24h: 3145, low24h: 3090, volume24h: '₹3,400 Cr', chartData: c([3090,3105,3112,3118], 3120.50) },
  { symbol: 'TCS', name: 'Tata Consultancy Services', category: 'INDIAN_STOCKS', price: 4250.00, change24h: 0.65, high24h: 4280, low24h: 4210, volume24h: '₹2,100 Cr', chartData: c([4210,4230,4245,4248], 4250.00) },
  { symbol: 'INFY', name: 'Infosys Limited', category: 'INDIAN_STOCKS', price: 1840.20, change24h: 1.85, high24h: 1860, low24h: 1810, volume24h: '₹1,950 Cr', chartData: c([1810,1825,1835,1838], 1840.20) },
  { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd', category: 'INDIAN_STOCKS', price: 1645.80, change24h: -0.45, high24h: 1660, low24h: 1635, volume24h: '₹4,100 Cr', chartData: c([1660,1652,1640,1643], 1645.80) },
  { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd', category: 'INDIAN_STOCKS', price: 1225.40, change24h: 1.10, high24h: 1235, low24h: 1210, volume24h: '₹2,800 Cr', chartData: c([1210,1218,1222,1224], 1225.40) },
  { symbol: 'SBIN', name: 'State Bank of India', category: 'INDIAN_STOCKS', price: 885.20, change24h: 2.15, high24h: 892, low24h: 865, volume24h: '₹3,200 Cr', chartData: c([865,872,880,883], 885.20) },
  { symbol: 'TATAMOTORS', name: 'Tata Motors Ltd', category: 'INDIAN_STOCKS', price: 1012.60, change24h: 3.40, high24h: 1025, low24h: 980, volume24h: '₹2,650 Cr', chartData: c([980,995,1005,1010], 1012.60) },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel Ltd', category: 'INDIAN_STOCKS', price: 1520.90, change24h: 0.92, high24h: 1535, low24h: 1505, volume24h: '₹1,800 Cr', chartData: c([1505,1510,1515,1518], 1520.90) },
  { symbol: 'ITC', name: 'ITC Limited', category: 'INDIAN_STOCKS', price: 465.30, change24h: -0.18, high24h: 470, low24h: 462, volume24h: '₹2,200 Cr', chartData: c([470,468,466,465], 465.30) },
  { symbol: 'WIPRO', name: 'Wipro Limited', category: 'INDIAN_STOCKS', price: 542.80, change24h: 1.55, high24h: 548, low24h: 535, volume24h: '₹980 Cr', chartData: c([535,538,540,542], 542.80) },
  { symbol: 'HCLTECH', name: 'HCL Technologies Ltd', category: 'INDIAN_STOCKS', price: 1685.40, change24h: 2.10, high24h: 1700, low24h: 1650, volume24h: '₹1,200 Cr', chartData: c([1650,1665,1675,1683], 1685.40) },
  { symbol: 'SUNPHARMA', name: 'Sun Pharma Industries', category: 'INDIAN_STOCKS', price: 1780.60, change24h: 0.75, high24h: 1795, low24h: 1765, volume24h: '₹850 Cr', chartData: c([1765,1770,1775,1778], 1780.60) },
  { symbol: 'BAJFINANCE', name: 'Bajaj Finance Ltd', category: 'INDIAN_STOCKS', price: 7250.00, change24h: -1.20, high24h: 7380, low24h: 7200, volume24h: '₹2,400 Cr', chartData: c([7380,7340,7280,7260], 7250.00) },
  { symbol: 'MARUTI', name: 'Maruti Suzuki India Ltd', category: 'INDIAN_STOCKS', price: 12450.00, change24h: 1.05, high24h: 12550, low24h: 12300, volume24h: '₹1,100 Cr', chartData: c([12300,12350,12400,12440], 12450.00) },
  { symbol: 'ADANIENT', name: 'Adani Enterprises Ltd', category: 'INDIAN_STOCKS', price: 3280.40, change24h: 4.20, high24h: 3350, low24h: 3140, volume24h: '₹3,800 Cr', chartData: c([3140,3200,3250,3270], 3280.40) },
  { symbol: 'TATASTEEL', name: 'Tata Steel Ltd', category: 'INDIAN_STOCKS', price: 168.45, change24h: 2.60, high24h: 172, low24h: 164, volume24h: '₹4,500 Cr', chartData: c([164,165,167,168], 168.45) },
  { symbol: 'POWERGRID', name: 'Power Grid Corp of India', category: 'INDIAN_STOCKS', price: 342.80, change24h: 0.55, high24h: 346, low24h: 340, volume24h: '₹1,600 Cr', chartData: c([340,341,342,342], 342.80) },
  { symbol: 'NTPC', name: 'NTPC Limited', category: 'INDIAN_STOCKS', price: 395.60, change24h: 1.80, high24h: 400, low24h: 388, volume24h: '₹2,100 Cr', chartData: c([388,392,394,395], 395.60) },
  { symbol: 'AXISBANK', name: 'Axis Bank Ltd', category: 'INDIAN_STOCKS', price: 1180.25, change24h: 0.85, high24h: 1195, low24h: 1170, volume24h: '₹1,900 Cr', chartData: c([1170,1175,1178,1179], 1180.25) },
  { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank Ltd', category: 'INDIAN_STOCKS', price: 1830.50, change24h: -0.60, high24h: 1850, low24h: 1820, volume24h: '₹1,400 Cr', chartData: c([1850,1845,1835,1832], 1830.50) },
  { symbol: 'HINDUNILVR', name: 'Hindustan Unilever Ltd', category: 'INDIAN_STOCKS', price: 2680.00, change24h: 0.30, high24h: 2695, low24h: 2670, volume24h: '₹800 Cr', chartData: c([2670,2675,2678,2679], 2680.00) },
  { symbol: 'LTIM', name: 'LTIMindtree Limited', category: 'INDIAN_STOCKS', price: 5840.20, change24h: 2.45, high24h: 5900, low24h: 5700, volume24h: '₹950 Cr', chartData: c([5700,5750,5800,5830], 5840.20) },
  { symbol: 'ASIANPAINT', name: 'Asian Paints Ltd', category: 'INDIAN_STOCKS', price: 3150.80, change24h: -0.90, high24h: 3200, low24h: 3130, volume24h: '₹650 Cr', chartData: c([3200,3180,3160,3152], 3150.80) },

  // ─────────────────────────── FOREX MAJORS & MINORS (15 pairs) ───────────────────────────
  { symbol: 'EURUSD', name: 'Euro / US Dollar', category: 'FOREX', price: 1.0885, change24h: -0.24, high24h: 1.0920, low24h: 1.0860, volume24h: '$112B', chartData: c([1.0920,1.0910,1.0895,1.0890], 1.0885) },
  { symbol: 'GBPUSD', name: 'British Pound / US Dollar', category: 'FOREX', price: 1.2945, change24h: 0.35, high24h: 1.2980, low24h: 1.2900, volume24h: '$84B', chartData: c([1.2900,1.2920,1.2935,1.2942], 1.2945) },
  { symbol: 'USDJPY', name: 'US Dollar / Japanese Yen', category: 'FOREX', price: 156.80, change24h: -0.55, high24h: 157.90, low24h: 156.20, volume24h: '$95B', chartData: c([157.90,157.40,157.00,156.85], 156.80) },
  { symbol: 'AUDUSD', name: 'Australian Dollar / US Dollar', category: 'FOREX', price: 0.6720, change24h: 0.42, high24h: 0.6745, low24h: 0.6690, volume24h: '$38B', chartData: c([0.6690,0.6700,0.6710,0.6718], 0.6720) },
  { symbol: 'USDCAD', name: 'US Dollar / Canadian Dollar', category: 'FOREX', price: 1.3625, change24h: -0.18, high24h: 1.3660, low24h: 1.3600, volume24h: '$42B', chartData: c([1.3660,1.3645,1.3630,1.3627], 1.3625) },
  { symbol: 'NZDUSD', name: 'New Zealand Dollar / USD', category: 'FOREX', price: 0.6145, change24h: 0.28, high24h: 0.6170, low24h: 0.6120, volume24h: '$18B', chartData: c([0.6120,0.6130,0.6140,0.6143], 0.6145) },
  { symbol: 'USDCHF', name: 'US Dollar / Swiss Franc', category: 'FOREX', price: 0.8845, change24h: -0.32, high24h: 0.8880, low24h: 0.8820, volume24h: '$35B', chartData: c([0.8880,0.8865,0.8850,0.8847], 0.8845) },
  { symbol: 'EURGBP', name: 'Euro / British Pound', category: 'FOREX', price: 0.8410, change24h: -0.15, high24h: 0.8430, low24h: 0.8395, volume24h: '$22B', chartData: c([0.8430,0.8420,0.8415,0.8412], 0.8410) },
  { symbol: 'EURJPY', name: 'Euro / Japanese Yen', category: 'FOREX', price: 170.72, change24h: 0.48, high24h: 171.50, low24h: 170.00, volume24h: '$28B', chartData: c([170.00,170.30,170.55,170.68], 170.72) },
  { symbol: 'GBPJPY', name: 'British Pound / Japanese Yen', category: 'FOREX', price: 202.95, change24h: 0.65, high24h: 203.80, low24h: 201.50, volume24h: '$24B', chartData: c([201.50,202.00,202.50,202.85], 202.95) },
  { symbol: 'USDINR', name: 'US Dollar / Indian Rupee', category: 'FOREX', price: 83.42, change24h: -0.08, high24h: 83.55, low24h: 83.35, volume24h: '$15B', chartData: c([83.55,83.50,83.45,83.43], 83.42) },
  { symbol: 'XAGUSD', name: 'Silver Spot / US Dollar', category: 'FOREX', price: 31.25, change24h: 2.10, high24h: 31.80, low24h: 30.60, volume24h: '$8B', chartData: c([30.60,30.85,31.05,31.20], 31.25) },
  { symbol: 'DXY', name: 'US Dollar Index', category: 'FOREX', price: 104.35, change24h: 0.38, high24h: 104.60, low24h: 103.95, volume24h: 'Macro Index', chartData: c([103.95,104.10,104.20,104.32], 104.35) },
  { symbol: 'USDSGD', name: 'US Dollar / Singapore Dollar', category: 'FOREX', price: 1.3480, change24h: 0.12, high24h: 1.3510, low24h: 1.3460, volume24h: '$12B', chartData: c([1.3460,1.3470,1.3475,1.3478], 1.3480) },
  { symbol: 'USDHKD', name: 'US Dollar / Hong Kong Dollar', category: 'FOREX', price: 7.8095, change24h: 0.02, high24h: 7.8110, low24h: 7.8080, volume24h: '$10B', chartData: c([7.8080,7.8085,7.8090,7.8093], 7.8095) },

  // ─────────────────────────── COMMODITIES (8 instruments) ───────────────────────────
  { symbol: 'XAUUSD', name: 'Gold Spot / US Dollar', category: 'COMMODITIES', price: 4067.90, change24h: 1.50, high24h: 4078.90, low24h: 4060.00, volume24h: '$64B', chartData: c([4060,4062,4065,4068], 4067.90) },
  { symbol: 'USOIL', name: 'WTI Crude Oil', category: 'COMMODITIES', price: 82.40, change24h: 2.30, high24h: 83.10, low24h: 80.20, volume24h: '$42B', chartData: c([80.20,81.10,81.90,82.30], 82.40) },
  { symbol: 'UKOIL', name: 'Brent Crude Oil', category: 'COMMODITIES', price: 86.75, change24h: 1.90, high24h: 87.50, low24h: 85.20, volume24h: '$38B', chartData: c([85.20,85.80,86.30,86.60], 86.75) },
  { symbol: 'NATGAS', name: 'Natural Gas', category: 'COMMODITIES', price: 2.85, change24h: -1.40, high24h: 2.95, low24h: 2.80, volume24h: '$8B', chartData: c([2.95,2.92,2.88,2.86], 2.85) },
  { symbol: 'COPPER', name: 'Copper Futures', category: 'COMMODITIES', price: 4.52, change24h: 1.20, high24h: 4.58, low24h: 4.45, volume24h: '$6B', chartData: c([4.45,4.48,4.50,4.51], 4.52) },
  { symbol: 'PLATINUM', name: 'Platinum Spot', category: 'COMMODITIES', price: 1025.40, change24h: 0.85, high24h: 1035, low24h: 1015, volume24h: '$3B', chartData: c([1015,1020,1023,1025], 1025.40) },
  { symbol: 'PALLADIUM', name: 'Palladium Spot', category: 'COMMODITIES', price: 1145.80, change24h: -0.60, high24h: 1160, low24h: 1140, volume24h: '$1.5B', chartData: c([1160,1155,1148,1146], 1145.80) },
  { symbol: 'WHEAT', name: 'Wheat Futures', category: 'COMMODITIES', price: 615.50, change24h: 0.90, high24h: 620, low24h: 608, volume24h: '$2B', chartData: c([608,610,613,615], 615.50) },

  // ─────────────────────────── US STOCKS / INDICES (10 instruments) ───────────────────────────
  { symbol: 'SPX', name: 'S&P 500 Index', category: 'US_STOCKS', price: 5560.40, change24h: 0.62, high24h: 5580, low24h: 5520, volume24h: '$210B', chartData: c([5520,5540,5555,5558], 5560.40) },
  { symbol: 'NASDAQ', name: 'Nasdaq Composite Index', category: 'US_STOCKS', price: 18245.80, change24h: 0.95, high24h: 18350, low24h: 18100, volume24h: '$165B', chartData: c([18100,18150,18200,18240], 18245.80) },
  { symbol: 'DJI', name: 'Dow Jones Industrial Average', category: 'US_STOCKS', price: 40580.20, change24h: 0.42, high24h: 40700, low24h: 40400, volume24h: '$95B', chartData: c([40400,40450,40520,40570], 40580.20) },
  { symbol: 'AAPL', name: 'Apple Inc', category: 'US_STOCKS', price: 234.80, change24h: 1.25, high24h: 236.50, low24h: 232.00, volume24h: '$12.5B', chartData: c([232,233,234,234.50], 234.80) },
  { symbol: 'MSFT', name: 'Microsoft Corp', category: 'US_STOCKS', price: 448.90, change24h: 0.80, high24h: 452, low24h: 445, volume24h: '$8.2B', chartData: c([445,446,447,448.50], 448.90) },
  { symbol: 'TSLA', name: 'Tesla Inc', category: 'US_STOCKS', price: 258.40, change24h: 3.50, high24h: 265, low24h: 248, volume24h: '$18.5B', chartData: c([248,252,256,257], 258.40) },
  { symbol: 'NVDA', name: 'NVIDIA Corp', category: 'US_STOCKS', price: 135.60, change24h: 2.80, high24h: 138, low24h: 131, volume24h: '$42B', chartData: c([131,133,134,135], 135.60) },
  { symbol: 'AMZN', name: 'Amazon.com Inc', category: 'US_STOCKS', price: 198.50, change24h: 1.10, high24h: 200, low24h: 196, volume24h: '$6.5B', chartData: c([196,197,198,198.30], 198.50) },
  { symbol: 'GOOGL', name: 'Alphabet Inc (Google)', category: 'US_STOCKS', price: 185.20, change24h: 0.65, high24h: 187, low24h: 184, volume24h: '$5.8B', chartData: c([184,184.50,185,185.10], 185.20) },
  { symbol: 'META', name: 'Meta Platforms Inc', category: 'US_STOCKS', price: 520.40, change24h: 1.80, high24h: 528, low24h: 512, volume24h: '$7.2B', chartData: c([512,515,518,520], 520.40) },
];

export const INITIAL_NEWS_EVENTS: NewsEvent[] = [
  {
    id: 'news-geo-100',
    headline: '🚨 GEOPOLITICAL BREAKING: US-IRAN-CHINA CONFLICT ESCALATES OVER STRAIT OF HORMUZ CONTROL',
    source: 'InvestingLive Macro Analysis / Reuters',
    timeAgo: 'Just now',
    timestamp: new Date().toISOString(),
    category: 'COMMODITIES',
    importanceScore: 99,
    urgency: 'CRITICAL',
    confidencePercent: 98,
    sentiment: 'BEARISH',
    expectedVolatility: 'EXTREME',
    affectedSymbols: ['USOIL', 'UKOIL', 'XAUUSD', 'DXY', 'SPX'],
    summary: 'US signals zero tolerance for Iranian control over the Strait of Hormuz. Rubio notes Tehran lacks serious diplomatic intent while China maintains cooperative stance. High risk of crude oil supply shock.',
    aiExplanation: 'Control over the Strait of Hormuz represents Iran\'s primary strategic leverage over global crude shipments. Diplomatic stalemate and military posturing directly push Crude Oil (USOIL/UKOIL) and Gold (XAUUSD) higher while creating stagflation risk for equities.',
    historicalComparison: 'Matches 2019 Gulf Tanker Crisis pattern where Hormuz shipping threats sparked an immediate +7.8% spike in WTI Crude within 48 hours.',
    probabilityLargeMove: 96,
    effectTimeframe: '24 - 72 Hours',
    tradeRecommendation: 'BULLISH CRUDE OIL & GOLD — Tighten stop loss on equities. Hedge against energy volatility.',
    warningAlert: '⚠️ CRITICAL GEOPOLITICAL CATALYST: Strait of Hormuz escalation in progress. Expect sharp volatility in Crude Oil & Safe Haven Gold.'
  },
  {
    id: 'news-101',
    headline: '⚠️ FED CHAIRMAN POWELL EMERGENCY SPEECH SCHEDULED IN 15 MIN',
    source: 'Federal Reserve Press / Reuters',
    timeAgo: '2 mins ago',
    timestamp: new Date(Date.now() - 2 * 60000).toISOString(),
    category: 'FOREX',
    importanceScore: 98,
    urgency: 'CRITICAL',
    confidencePercent: 96,
    sentiment: 'BEARISH',
    expectedVolatility: 'EXTREME',
    affectedSymbols: ['BTCUSDT', 'EURUSD', 'SPX', 'DXY', 'XAUUSD'],
    summary: 'Powell expected to address sticky core inflation numbers ahead of the blackout period. Market probability of rate hike fear spike.',
    aiExplanation: 'Fed speeches immediately preceding blackout windows trigger liquidity pullbacks. Expect 2-3% whip-saw in risk assets. DO NOT open leverage trades until 20 mins post-speech.',
    historicalComparison: 'Similar setup on March 2024 Fed speech resulted in a $2,400 BTC liquidity sweep down followed by full V-recovery.',
    probabilityLargeMove: 94,
    effectTimeframe: 'Immediate (Next 30 mins)',
    tradeRecommendation: 'PAUSE NEW TRADES — Close loose stops. Expected spread widening.',
    warningAlert: '⚠️ HIGH VOLATILITY IMMINENT: Fed Chair Powell speaks in 15 mins. Protect open positions.'
  },
  {
    id: 'news-102',
    headline: 'WHALE ALERT: 14,500 BTC ($983M) MOVED FROM COINBASE COLD STORAGE TO BINANCE EXCHANGE',
    source: 'Arkham Intelligence / Whale Alert',
    timeAgo: '8 mins ago',
    timestamp: new Date(Date.now() - 8 * 60000).toISOString(),
    category: 'CRYPTO',
    importanceScore: 89,
    urgency: 'HIGH',
    confidencePercent: 92,
    sentiment: 'BEARISH',
    expectedVolatility: 'HIGH',
    affectedSymbols: ['BTCUSDT', 'ETHUSDT'],
    summary: 'Large institutional wallet cluster deposited 14.5k BTC onto Binance hot wallets during high funding rate spike (+0.035%).',
    aiExplanation: 'Exchange net inflows exceeding $500M historically indicate OTC hedging or impending market sell pressure. Potential spot dump to retest liquidity at $66,200.',
    historicalComparison: 'Matches Coinbase-to-Binance deposit pattern on May 12, 2024 (preceded 4.2% drop).',
    probabilityLargeMove: 86,
    effectTimeframe: '15 mins - 2 hours',
    tradeRecommendation: 'AVOID BTC LONG — Watch $66,200 bid wall before re-evaluating.'
  },
  {
    id: 'news-103',
    headline: 'RBI ANNOUNCES SURPRISE LIQUIDITY INFUSION OF ₹50,000 CR VIA VARIABLE RATE REPO',
    source: 'RBI Press Release / Economic Times',
    timeAgo: '18 mins ago',
    timestamp: new Date(Date.now() - 18 * 60000).toISOString(),
    category: 'INDIAN_STOCKS',
    importanceScore: 91,
    urgency: 'HIGH',
    confidencePercent: 95,
    sentiment: 'BULLISH',
    expectedVolatility: 'HIGH',
    affectedSymbols: ['BANKNIFTY', 'NIFTY50'],
    summary: 'Reserve Bank of India injects ₹50,000 Crore overnight liquidity to ease interbank tight call money rates.',
    aiExplanation: 'Immediate positive catalyst for Indian banking stocks (HDFC, ICICI, SBI). Reduces cost of funds and boosts credit growth outlook.',
    historicalComparison: 'Last VRR liquidity boost in Dec 2023 pushed BankNifty up +640 points in 2 trading sessions.',
    probabilityLargeMove: 91,
    effectTimeframe: 'Rest of trading day',
    tradeRecommendation: 'BULLISH BANKNIFTY — Look for dip entry near 52,250 support.'
  },
  {
    id: 'news-104',
    headline: 'MIDDLE EAST TENSIONS ESCALATE: CRUDE OIL PIPELINE ATTACKED NEAR HORMUZ STRAIT',
    source: 'Bloomberg Macro / Energy Intelligence',
    timeAgo: '25 mins ago',
    timestamp: new Date(Date.now() - 25 * 60000).toISOString(),
    category: 'COMMODITIES',
    importanceScore: 94,
    urgency: 'CRITICAL',
    confidencePercent: 91,
    sentiment: 'BULLISH',
    expectedVolatility: 'EXTREME',
    affectedSymbols: ['USOIL', 'XAUUSD', 'DXY', 'SPX'],
    summary: 'Drone strike reported on key Saudi oil infrastructure line feeding Red Sea ports.',
    aiExplanation: 'Supply disruption fears directly push Brent & WTI Crude higher. Gold surges on safe-haven demand while equities face stagflation drag.',
    historicalComparison: 'Hormuz shipping incidents trigger immediate +3% to +5% oil spike within 60 minutes.',
    probabilityLargeMove: 95,
    effectTimeframe: '24 - 48 Hours',
    tradeRecommendation: 'BULLISH CRUDE & GOLD — Bearish index futures.'
  }
];

export const INITIAL_RISK_MARKERS: RiskMarker[] = [
  {
    id: 'risk-01',
    title: 'Strait of Hormuz Naval Blockade Threat',
    category: 'MILITARY',
    severity: 'CRITICAL',
    lat: 26.5667,
    lng: 56.2500,
    locationName: 'Strait of Hormuz, Persian Gulf',
    affectedMarkets: ['USOIL', 'XAUUSD', 'SPX'],
    summary: 'Naval drills and drone alerts threatening 20% of global daily crude oil supply transit.',
    aiDossier: 'Military movement detected by radar satellite imagery. Oil tankers halting transit. High probability of Brent Crude breaking $85/bbl.',
    timestamp: '15 mins ago'
  },
  {
    id: 'risk-02',
    title: 'Red Sea Submarine Fiber Optic Cable Cut',
    category: 'CYBER',
    severity: 'HIGH',
    lat: 20.0000,
    lng: 38.5000,
    locationName: 'Red Sea Corridor',
    affectedMarkets: ['BTCUSDT', 'SPX', 'EURUSD'],
    summary: 'Three major undersea telecom cables damaged causing 40% latency spike in EU-Asia trade routing.',
    aiDossier: 'High frequency trading nodes reporting packet drops between London and Mumbai exchanges. Increased execution slippage on forex desks.',
    timestamp: '42 mins ago'
  },
  {
    id: 'risk-03',
    title: 'Cyclone Warning at Major Australian Iron Ore Port',
    category: 'WEATHER',
    severity: 'MEDIUM',
    lat: -20.3100,
    lng: 118.5700,
    locationName: 'Port Hedland, Western Australia',
    affectedMarkets: ['AUDUSD', 'COMMODITIES'],
    summary: 'Category 3 Tropical Cyclone approaching world largest iron ore export terminal.',
    aiDossier: 'Vessel loading suspended for 72 hours. Expect AUD fluctuations and iron ore price futures rally.',
    timestamp: '1 hour ago'
  }
];

export const INITIAL_OPTION_CHAIN: OptionChainData = {
  symbol: 'NIFTY50',
  underlyingPrice: 24580.25,
  pcrRatio: 1.18,
  maxPain: 24500,
  fiiNetFlowCr: 1850.40,
  diiNetFlowCr: -420.10,
  interpretation: 'BULLISH STRUCTURE: Call writing highest at 24,800. Put writing heavy at 24,500 indicating solid floor support. FII Net Buyers.',
  rows: [
    { strikePrice: 24300, callOI: 12450, callOIChange: -2100, callIV: 13.2, callLTP: 310.5, putOI: 89400, putOIChange: 14500, putIV: 14.1, putLTP: 18.2 },
    { strikePrice: 24400, callOI: 24100, callOIChange: -1800, callIV: 12.8, callLTP: 225.0, putOI: 112000, putOIChange: 22400, putIV: 13.8, putLTP: 32.5 },
    { strikePrice: 24500, callOI: 45200, callOIChange: 4200, callIV: 12.5, callLTP: 152.8, putOI: 148500, putOIChange: 38100, putIV: 13.4, putLTP: 58.4 },
    { strikePrice: 24600, callOI: 98500, callOIChange: 18200, callIV: 12.1, callLTP: 92.4, putOI: 74200, putOIChange: 12100, putIV: 13.1, putLTP: 98.6 },
    { strikePrice: 24700, callOI: 142000, callOIChange: 29500, callIV: 11.9, callLTP: 48.2, putOI: 31000, putOIChange: -4200, putIV: 12.9, putLTP: 154.1 },
    { strikePrice: 24800, callOI: 185000, callOIChange: 41000, callIV: 11.6, callLTP: 21.5, putOI: 12400, putOIChange: -1200, putIV: 12.6, putLTP: 228.0 },
  ]
};

export const INITIAL_JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: 'j-01',
    symbol: 'BTCUSDT',
    side: 'LONG',
    entryPrice: 67100,
    exitPrice: 65800,
    pnlUsd: -1300,
    pnlPercent: -1.93,
    riskReward: 2.5,
    entryTime: 'Today 14:15',
    setupName: 'Bullish Flag Breakout',
    emotion: 'FOMO',
    mistakes: ['Ignored upcoming Fed speech calendar warning', 'Entered without waiting for 15-min candle close'],
    attachedNews: 'Fed Chair Powell speech announced 10 mins prior to trade entry',
    aiPsychologyCoachFeedback: '⚠️ CRITICAL REPEATED ERROR: You traded 10 minutes before a scheduled high-impact Fed event. You experienced FOMO during a fake breakout. TradeOS AI system flagged this warning 15 mins prior. Discipline score: 42/100.'
  },
  {
    id: 'j-02',
    symbol: 'BANKNIFTY',
    side: 'LONG',
    entryPrice: 52150,
    exitPrice: 52650,
    pnlUsd: 2500,
    pnlPercent: 0.95,
    riskReward: 3.1,
    entryTime: 'Yesterday 10:30',
    setupName: 'RBI Liquidity Support Reversal',
    emotion: 'CALM',
    mistakes: ['None — followed TradeOS AI signal'],
    attachedNews: 'RBI ₹50,000 Cr VRR liquidity injection news release',
    aiPsychologyCoachFeedback: '🎯 EXCELLENT EXECUTION: Perfect alignment with Indian Market Agent recommendation. You entered on dip support following fundamental catalyst. Discipline score: 96/100.'
  }
];

export const INITIAL_ECONOMIC_EVENTS: EconomicEvent[] = [
  {
    id: 'ec-1',
    time: '18:30 IST',
    currency: 'USD',
    event: 'Fed Chair Powell Testifies Before Senate Banking Committee',
    impact: 'HIGH',
    forecast: 'Hawkish Stance',
    previous: '5.25%',
    countdownMinutes: 14,
    aiWarning: '⚠️ CRITICAL: Powell speech precedes blackout period. Paused leverage entry on BTC, EURUSD & SPX.'
  },
  {
    id: 'ec-2',
    time: '20:00 IST',
    currency: 'USD',
    event: 'US Core CPI Inflation Rate (YoY)',
    impact: 'HIGH',
    forecast: '3.3%',
    previous: '3.4%',
    countdownMinutes: 104,
    aiWarning: 'High volatility expected across US Treasuries, DXY Dollar Index, and Gold XAUUSD.'
  },
  {
    id: 'ec-3',
    time: '20:45 IST',
    currency: 'EUR',
    event: 'ECB Rate Decision & Christine Lagarde Press Conference',
    impact: 'HIGH',
    forecast: '4.25%',
    previous: '4.50%',
    countdownMinutes: 149,
    aiWarning: 'EURUSD liquidity sweep expected. Watch 1.0850 support level.'
  },
  {
    id: 'ec-4',
    time: '22:00 IST',
    currency: 'USD',
    event: 'US EIA Weekly Crude Oil Inventories',
    impact: 'HIGH',
    forecast: '-1.8M bbl',
    previous: '+1.2M bbl',
    countdownMinutes: 224,
    aiWarning: 'High impact on WTI Crude Oil (USOIL/UKOIL) & energy sector equities.'
  },
  {
    id: 'ec-5',
    time: 'Tomorrow 11:00 IST',
    currency: 'INR',
    event: 'RBI Monetary Policy Committee (MPC) Interest Rate Decision',
    impact: 'HIGH',
    forecast: '6.50%',
    previous: '6.50%',
    countdownMinutes: 1140,
    aiWarning: 'Watch BankNifty Option Chain PCR and FII Net Flow before rate statement.'
  },
  {
    id: 'ec-6',
    time: 'Tomorrow 12:30 IST',
    currency: 'GBP',
    event: 'UK Monthly GDP Growth Rate (MoM)',
    impact: 'MEDIUM',
    forecast: '0.2%',
    previous: '0.0%',
    countdownMinutes: 1230,
    aiWarning: 'Cable (GBPUSD) volatility expected. Monitor London session opening.'
  },
  {
    id: 'ec-7',
    time: 'Friday 18:30 IST',
    currency: 'USD',
    event: 'US Non-Farm Payrolls (NFP) & Unemployment Rate',
    impact: 'HIGH',
    forecast: '185K',
    previous: '206K',
    countdownMinutes: 3040,
    aiWarning: 'Tier-1 Economic Event. Expect 150+ pip swing in Gold (XAUUSD) & S&P 500 futures.'
  }
];
