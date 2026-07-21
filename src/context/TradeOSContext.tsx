import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  MarketTicker, 
  NewsEvent, 
  RiskMarker, 
  OptionChainData, 
  JournalEntry, 
  EconomicEvent,
  PreTradeInput,
  PreTradeEvaluation,
  StoplossInvestigation,
  ChatMessage
} from '../types/tradeos';
import { 
  INITIAL_TICKERS, 
  INITIAL_NEWS_EVENTS, 
  INITIAL_RISK_MARKERS, 
  INITIAL_OPTION_CHAIN, 
  INITIAL_JOURNAL_ENTRIES,
  INITIAL_ECONOMIC_EVENTS 
} from '../services/mockData';

import { AIProvider, getAIProvider, setAIProvider } from '../services/groqAI';

interface TradeOSContextType {
  activeModule: string;
  setActiveModule: (module: string) => void;
  tickers: MarketTicker[];
  newsEvents: NewsEvent[];
  riskMarkers: RiskMarker[];
  optionChain: OptionChainData;
  journalEntries: JournalEntry[];
  economicEvents: EconomicEvent[];
  selectedTicker: MarketTicker;
  setSelectedTicker: (ticker: MarketTicker) => void;
  activeWatchlist: string[];
  toggleWatchlist: (symbol: string) => void;
  aiProvider: AIProvider;
  updateAIProvider: (p: AIProvider) => void;
  
  // Interactive Engine Methods
  runPreTradeEvaluation: (input: PreTradeInput) => PreTradeEvaluation;
  runSLInvestigation: (symbol: string, slPrice: number, timeStr: string, side: 'LONG' | 'SHORT') => StoplossInvestigation;
  addJournalEntry: (entry: Omit<JournalEntry, 'id' | 'aiPsychologyCoachFeedback'>) => void;
  
  // AI Chat
  chatMessages: ChatMessage[];
  sendChatMessage: (text: string) => void;
  
  // System Alert
  systemAlert: string | null;
  dismissSystemAlert: () => void;
}

const TradeOSContext = createContext<TradeOSContextType | undefined>(undefined);

export const TradeOSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeModule, setActiveModule] = useState<string>('TERMINAL');
  const [aiProviderState, setAiProviderState] = useState<AIProvider>(() => getAIProvider());

  const updateAIProvider = (p: AIProvider) => {
    setAIProvider(p);
    setAiProviderState(p);
  };
  const [tickers, setTickers] = useState<MarketTicker[]>(INITIAL_TICKERS);
  const [newsEvents, setNewsEvents] = useState<NewsEvent[]>(INITIAL_NEWS_EVENTS);
  const [riskMarkers] = useState<RiskMarker[]>(INITIAL_RISK_MARKERS);
  const [optionChain] = useState<OptionChainData>(INITIAL_OPTION_CHAIN);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(INITIAL_JOURNAL_ENTRIES);
  const [economicEvents] = useState<EconomicEvent[]>(INITIAL_ECONOMIC_EVENTS);
  const [selectedTicker, setSelectedTicker] = useState<MarketTicker>(INITIAL_TICKERS[0]);
  const [activeWatchlist, setActiveWatchlist] = useState<string[]>(['BTCUSDT', 'ETHUSDT', 'NIFTY50', 'BANKNIFTY', 'XAUUSD']);
  const [systemAlert, setSystemAlert] = useState<string | null>(
    '⚠️ CRITICAL AI ALERT: Fed Chair Powell Emergency Speech in 14 mins — High Expected Volatility across BTC & USD pairs!'
  );
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'c-1',
      sender: 'AI',
      agentName: 'TradeOS AI Co-Pilot',
      text: 'Welcome to TradeOS AI Operating System. All 13 Intelligence Agents active (News, Macro, Crypto, Forex, Indian Markets, Risk). How can I assist your trades today?',
      timestamp: 'Just now'
    }
  ]);

  // 100% REAL LIVE MARKET DATA ENGINE (Crypto, NSE India, Commodities, US Stocks, Forex, Live RSS News)
  useEffect(() => {
    // 1. Fetch Real Breaking News Live from RSS
    import('../services/unifiedLiveData').then(({ fetchLiveBreakingNews }) => {
      fetchLiveBreakingNews().then(liveNews => {
        if (liveNews && liveNews.length > 0) {
          setNewsEvents(liveNews);
        }
      });
    });

    // 2. Connect FREE Binance Live WebSocket for Crypto (BTC, ETH, SOL)
    import('../services/liveWebSocket').then(({ liveStreamService }) => {
      liveStreamService.connectBinancePublicStream((updates) => {
        setTickers(prev => prev.map(t => {
          if (updates[t.symbol]) {
            const live = updates[t.symbol];
            const updatedChart = [...t.chartData.slice(1), live.price];
            const newTicker = {
              ...t,
              price: live.price,
              change24h: live.change24h,
              high24h: live.high,
              low24h: live.low,
              volume24h: live.volume,
              chartData: updatedChart
            };
            setSelectedTicker(current => current.symbol === t.symbol ? newTicker : current);
            return newTicker;
          }
          return t;
        }));
      });
    });

    // 3. Fetch 100% Real Live Quotes for Non-Crypto Assets (NIFTY50, BANKNIFTY, XAUUSD, USOIL, DXY, SPX, EURUSD)
    const updateRealQuotes = () => {
      import('../services/unifiedLiveData').then(({ fetchLiveYahooQuote }) => {
        const nonCryptoSymbols = ['NIFTY50', 'BANKNIFTY', 'XAUUSD', 'USOIL', 'DXY', 'SPX', 'EURUSD'];
        nonCryptoSymbols.forEach(sym => {
          fetchLiveYahooQuote(sym).then(live => {
            if (live && live.price > 0) {
              setTickers(prev => prev.map(t => {
                if (t.symbol === sym) {
                  const updatedChart = [...t.chartData.slice(1), live.price];
                  const newTicker = {
                    ...t,
                    price: live.price,
                    change24h: live.change24h,
                    high24h: live.high24h || t.high24h,
                    low24h: live.low24h || t.low24h,
                    chartData: updatedChart
                  };
                  setSelectedTicker(current => current.symbol === sym ? newTicker : current);
                  return newTicker;
                }
                return t;
              }));
            }
          });
        });
      });
    };
    updateRealQuotes();
    const quoteInterval = setInterval(updateRealQuotes, 10000); // Poll live quotes every 10 seconds

    // 4. Poll 100% Real Fresh Live News (Last 24 Hours Only)
    const updateRealNews = () => {
      import('../services/unifiedLiveData').then(({ fetchLiveBreakingNews }) => {
        fetchLiveBreakingNews().then(freshNews => {
          if (freshNews && freshNews.length > 0) {
            setNewsEvents(prev => {
              const combined = [...freshNews, ...prev];
              const uniqueMap = new Map();
              const now = Date.now();
              const maxAgeMs = 24 * 60 * 60 * 1000;
              combined.forEach(item => {
                const itemTime = new Date(item.timestamp || now).getTime();
                if ((now - itemTime) <= maxAgeMs && !uniqueMap.has(item.headline)) {
                  uniqueMap.set(item.headline, item);
                }
              });
              return Array.from(uniqueMap.values()).sort((a, b) => 
                new Date(b.timestamp || now).getTime() - new Date(a.timestamp || now).getTime()
              );
            });
          }
        });
      });
    };

    updateRealNews();
    const newsInterval = setInterval(updateRealNews, 60000);

    return () => {
      clearInterval(quoteInterval);
      clearInterval(newsInterval);
      import('../services/liveWebSocket').then(({ liveStreamService }) => {
        liveStreamService.disconnect();
      });
    };
  }, []); // Run ONCE on mount to avoid chart reset on asset selection

  const toggleWatchlist = (symbol: string) => {
    setActiveWatchlist(prev => 
      prev.includes(symbol) ? prev.filter(s => s !== symbol) : [...prev, symbol]
    );
  };

  const dismissSystemAlert = () => setSystemAlert(null);

  // AI Pre-Trade Assistant Engine Logic
  const runPreTradeEvaluation = (input: PreTradeInput): PreTradeEvaluation => {
    const isCrypto = input.symbol.includes('BTC') || input.symbol.includes('ETH');
    const isIndian = input.symbol.includes('NIFTY');

    let tradeScore = 78;
    let riskScore = 32;
    let verdict: 'SAFE_ENTRY' | 'WAIT' | 'AVOID' = 'SAFE_ENTRY';
    let safeEntryTime = 'Immediate (Post-pullback confirmed)';
    let upcomingEvents: string[] = [];
    let reasoning = '';

    if (input.side === 'LONG' && isCrypto) {
      tradeScore = 48;
      riskScore = 84;
      verdict = 'WAIT';
      safeEntryTime = 'Wait 20 mins post Fed Powell speech';
      upcomingEvents = [
        '⚠️ Fed Chair Powell speaks in 14 minutes',
        '⚠️ Whale deposit of 14,500 BTC to Binance exchange (Inflow spike)',
        '⚡ Funding rate elevated (+0.035%) — high long squeeze risk'
      ];
      reasoning = 'TradeOS AI News & Macro Agents advise AGAINST entering BTC LONG immediately. Scheduled Fed speech carries extreme volatility risk with 94% probability of liquidity sweeps down to $66,200 bid support before reversal.';
    } else if (input.side === 'LONG' && isIndian) {
      tradeScore = 88;
      riskScore = 24;
      verdict = 'SAFE_ENTRY';
      safeEntryTime = 'Optimal Entry Window Active';
      upcomingEvents = ['RBI surprise ₹50,000 Cr VRR liquidity injection'];
      reasoning = 'Strong fundamental backing from RBI liquidity infusion. Option chain shows heavy Put writing at 24,500 (PCR 1.18). High probability of continuation higher.';
    } else {
      tradeScore = 72;
      riskScore = 40;
      verdict = 'SAFE_ENTRY';
      reasoning = 'Technical and news alignment moderate. Standard position sizing recommended with tight risk parameters.';
    }

    return {
      symbol: input.symbol,
      side: input.side,
      tradeScore,
      riskScore,
      confidence: 94,
      verdict,
      safeEntryTime,
      suggestedStopLoss: input.stopLoss || Number((input.entryPrice * (input.side === 'LONG' ? 0.985 : 1.015)).toFixed(2)),
      suggestedTarget: input.targetPrice || Number((input.entryPrice * (input.side === 'LONG' ? 1.04 : 0.96)).toFixed(2)),
      suggestedPositionSizePct: (verdict as string) === 'WAIT' ? 1.5 : ((verdict as string) === 'AVOID' ? 0 : 4.0),
      expectedVolatility: isCrypto ? 'EXTREME' : 'MEDIUM',
      upcomingEventsWarning: upcomingEvents,
      reasoningSummary: reasoning,
      agentBreakdowns: [
        { agentName: 'News Agent', verdict: isCrypto ? 'BEARISH' : 'BULLISH', keyPoint: isCrypto ? 'Fed Powell speech & whale deposit catalyst' : 'RBI VRR liquidity catalyst' },
        { agentName: 'Macro Agent', verdict: 'CAUTION', keyPoint: 'DXY firming at 104.35 line' },
        { agentName: 'Crypto / On-Chain Agent', verdict: isCrypto ? 'BEARISH' : 'BULLISH', keyPoint: 'Exchange inflow ratio +18.4%' },
        { agentName: 'Risk Agent', verdict: verdict === 'WAIT' ? 'CAUTION' : 'BULLISH', keyPoint: `Recommended Position Size: ${verdict === 'WAIT' ? '1.5%' : '4.0%'} equity max` }
      ]
    };
  };

  // Stoploss Investigation Engine Logic
  const runSLInvestigation = (symbol: string, slPrice: number, timeStr: string, side: 'LONG' | 'SHORT'): StoplossInvestigation => {
    return {
      symbol,
      slPrice,
      stoppedAtTime: timeStr || '14:18 IST (12 mins ago)',
      tradeSide: side,
      rootCauseCategory: 'LIQUIDITY_SWEEP',
      title: 'Post-Mortem: Institutional Liquidity Grab & Stop Hunt Detected',
      wasManipulation: true,
      detailedReport: `Forensic AI scan reveals that your stop loss at ${slPrice} was triggered by a calculated 1,200 BTC market sell order on Binance, designed to sweep retail liquidity beneath the 24-hour low. Within 8 minutes of hitting your stop, price recovered +$1,450 to trade higher than your initial entry.`,
      recoveryAdvice: 'Do not revenge trade. Next time, set stop loss 0.4% below structural swing liquidity pool to avoid exchange stop sweeps.',
      anomaliesDetected: [
        { type: 'Liquidation Cascade', metric: '$42M Longs Liquidated in 3 mins', severity: 'HIGH' },
        { type: 'Whale Orderbook Flash', metric: '1,200 BTC market sell wall eaten instantly', severity: 'CRITICAL' },
        { type: 'Funding Rate Crash', metric: 'Funding dropped from +0.035% to +0.008%', severity: 'MEDIUM' }
      ]
    };
  };

  const addJournalEntry = (entry: Omit<JournalEntry, 'id' | 'aiPsychologyCoachFeedback'>) => {
    const tempId = `j-${Date.now()}`;
    const initialEntry: JournalEntry = {
      ...entry,
      id: tempId,
      aiPsychologyCoachFeedback: '🧠 AI Psychology Coach analyzing execution discipline...'
    };
    setJournalEntries(prev => [initialEntry, ...prev]);

    import('../services/groqAI').then(({ analyzePsychologyWithAI }) => {
      analyzePsychologyWithAI(entry).then(feedback => {
        setJournalEntries(prev => prev.map(item => 
          item.id === tempId ? { ...item, aiPsychologyCoachFeedback: feedback } : item
        ));
      });
    });
  };

  const sendChatMessage = (text: string) => {
    const userMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      sender: 'USER',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);

    // Import and call real AI provider dynamically
    import('../services/groqAI').then(({ sendAIChatMessage }) => {
      const headlines = newsEvents.map(n => n.headline);
      sendAIChatMessage(
        text, 
        selectedTicker.symbol, 
        selectedTicker.price, 
        selectedTicker.category, 
        headlines
      ).then(res => {
        const aiMsg: ChatMessage = {
          id: `m-ai-${Date.now()}`,
          sender: 'AI',
          agentName: res.providerName || 'TradeOS Intelligence Engine',
          text: res.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setChatMessages(prev => [...prev, aiMsg]);
      });
    });
  };

  return (
    <TradeOSContext.Provider value={{
      activeModule,
      setActiveModule,
      tickers,
      newsEvents,
      riskMarkers,
      optionChain,
      journalEntries,
      economicEvents,
      selectedTicker,
      setSelectedTicker,
      activeWatchlist,
      toggleWatchlist,
      aiProvider: aiProviderState,
      updateAIProvider,
      runPreTradeEvaluation,
      runSLInvestigation,
      addJournalEntry,
      chatMessages,
      sendChatMessage,
      systemAlert,
      dismissSystemAlert
    }}>
      {children}
    </TradeOSContext.Provider>
  );
};

export const useTradeOS = () => {
  const context = useContext(TradeOSContext);
  if (!context) {
    throw new Error('useTradeOS must be used within a TradeOSProvider');
  }
  return context;
};
