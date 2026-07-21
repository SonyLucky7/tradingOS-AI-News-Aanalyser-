// Market Hours & Trading Schedule Engine for TradeOS AI

export interface MarketStatus {
  isOpen: boolean;
  statusText: string;
  reason: 'WEEKEND' | 'AFTER_HOURS' | 'OPEN';
  nextOpenTime: string;
  tradingHours: string;
}

export function checkMarketStatus(category: string): MarketStatus {
  const now = new Date();

  // Crypto is 24/7/365 Open
  if (category === 'CRYPTO') {
    return {
      isOpen: true,
      statusText: 'MARKET OPEN (24/7/365)',
      reason: 'OPEN',
      nextOpenTime: 'Active',
      tradingHours: 'Continuous 24/7'
    };
  }

  // Get IST time (Asia/Kolkata)
  const istTimeStr = now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
  const istDate = new Date(istTimeStr);
  const day = istDate.getDay(); // 0 = Sun, 6 = Sat
  const hours = istDate.getHours();
  const minutes = istDate.getMinutes();
  const timeInMins = hours * 60 + minutes;

  // 1. Indian Stock Market (NSE / BSE)
  if (category === 'INDIAN_STOCKS') {
    if (day === 0 || day === 6) {
      return {
        isOpen: false,
        statusText: '⚠️ NSE/BSE CLOSED (WEEKEND)',
        reason: 'WEEKEND',
        nextOpenTime: 'Monday 09:15 AM IST',
        tradingHours: 'Mon–Fri 09:15 AM to 03:30 PM IST'
      };
    }
    const openTimeMins = 9 * 60 + 15; // 09:15 IST
    const closeTimeMins = 15 * 60 + 30; // 15:30 IST

    if (timeInMins >= openTimeMins && timeInMins <= closeTimeMins) {
      return {
        isOpen: true,
        statusText: '🟢 NSE/BSE LIVE MARKET OPEN',
        reason: 'OPEN',
        nextOpenTime: 'Today 03:30 PM IST (Close)',
        tradingHours: 'Mon–Fri 09:15 AM to 03:30 PM IST'
      };
    } else {
      return {
        isOpen: false,
        statusText: '⚠️ NSE/BSE MARKET CLOSED (AFTER HOURS)',
        reason: 'AFTER_HOURS',
        nextOpenTime: timeInMins < openTimeMins ? 'Today 09:15 AM IST' : 'Tomorrow 09:15 AM IST',
        tradingHours: 'Mon–Fri 09:15 AM to 03:30 PM IST'
      };
    }
  }

  // 2. Forex Markets (Gold, EURUSD, DXY)
  if (category === 'FOREX' || category === 'COMMODITIES') {
    // Forex is closed on weekends (Saturday & Sunday until Sun 17:00 EST / 02:30 IST Mon)
    if (day === 6 || (day === 0 && timeInMins < 17 * 60 + 30)) {
      return {
        isOpen: false,
        statusText: '⚠️ FOREX/METALS MARKET CLOSED (WEEKEND)',
        reason: 'WEEKEND',
        nextOpenTime: 'Monday 02:30 AM IST (Sun 5PM EST)',
        tradingHours: 'Sun 5:00 PM EST to Fri 5:00 PM EST'
      };
    }
    return {
      isOpen: true,
      statusText: '🟢 FOREX/METALS MARKET OPEN',
      reason: 'OPEN',
      nextOpenTime: 'Friday 02:30 AM IST (Weekend Close)',
      tradingHours: 'Continuous Mon–Fri 24h'
    };
  }

  // 3. US Equities (SPX, Nasdaq)
  if (category === 'US_STOCKS') {
    if (day === 0 || day === 6) {
      return {
        isOpen: false,
        statusText: '⚠️ US MARKETS CLOSED (WEEKEND)',
        reason: 'WEEKEND',
        nextOpenTime: 'Monday 07:00 PM IST (09:30 AM EST)',
        tradingHours: 'Mon–Fri 09:30 AM to 04:00 PM EST'
      };
    }
    return {
      isOpen: false,
      statusText: '⚠️ US MARKETS CLOSED (AFTER HOURS)',
      reason: 'AFTER_HOURS',
      nextOpenTime: 'Today 07:00 PM IST (09:30 AM EST)',
      tradingHours: 'Mon–Fri 09:30 AM to 04:00 PM EST'
    };
  }

  return {
    isOpen: true,
    statusText: 'MARKET OPEN',
    reason: 'OPEN',
    nextOpenTime: 'Active',
    tradingHours: 'Regular Hours'
  };
}
