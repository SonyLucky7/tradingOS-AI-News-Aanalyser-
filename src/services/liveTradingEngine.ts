export interface LivePosition {
  id: string;
  symbol: string;
  type: 'LONG' | 'SHORT';
  entryPrice: number;
  quantity: number;
  takeProfit?: number;
  stopLoss?: number;
  status: 'OPEN' | 'CLOSED';
  pnl?: number;
  openTime: number;
  closeTime?: number;
}

export interface LiveAccount {
  balance: number;
  equity: number;
  positions: LivePosition[];
  tradeHistory: LivePosition[];
}

export class LiveTradingEngine {
  private account: LiveAccount;

  constructor(initialBalance: number = 10000) {
    // Try to load from localStorage first
    const saved = localStorage.getItem('tradeos_live_paper_account');
    if (saved) {
      try {
        this.account = JSON.parse(saved);
      } catch (e) {
        this.account = this.getDefaultAccount(initialBalance);
      }
    } else {
      this.account = this.getDefaultAccount(initialBalance);
    }
  }

  private getDefaultAccount(initialBalance: number): LiveAccount {
    return {
      balance: initialBalance,
      equity: initialBalance,
      positions: [],
      tradeHistory: []
    };
  }

  private saveState() {
    localStorage.setItem('tradeos_live_paper_account', JSON.stringify(this.account));
  }

  public getAccount(): LiveAccount {
    return this.account;
  }

  public openPosition(symbol: string, type: 'LONG' | 'SHORT', price: number, quantity: number, tp?: number, sl?: number) {
    const cost = price * quantity;
    if (this.account.balance < cost) {
      throw new Error('Insufficient balance');
    }

    this.account.balance -= cost;

    const newPos: LivePosition = {
      id: Math.random().toString(36).substr(2, 9),
      symbol,
      type,
      entryPrice: price,
      quantity,
      takeProfit: tp,
      stopLoss: sl,
      status: 'OPEN',
      pnl: 0,
      openTime: Date.now()
    };

    this.account.positions.push(newPos);
    this.updateEquity(price); // Initial equity update
    this.saveState();
  }

  public closePosition(id: string, currentPrice: number) {
    const posIndex = this.account.positions.findIndex(p => p.id === id);
    if (posIndex === -1) return;

    const pos = this.account.positions[posIndex];
    let pnl = 0;

    if (pos.type === 'LONG') {
      pnl = (currentPrice - pos.entryPrice) * pos.quantity;
    } else {
      pnl = (pos.entryPrice - currentPrice) * pos.quantity;
    }

    // Return the initial capital + PnL to balance
    this.account.balance += (pos.entryPrice * pos.quantity) + pnl;
    
    pos.status = 'CLOSED';
    pos.pnl = pnl;
    pos.closeTime = Date.now();

    this.account.tradeHistory.push({ ...pos });
    this.account.positions.splice(posIndex, 1);
    
    this.updateEquity(currentPrice);
    this.saveState();
  }

  public updateEquity(currentPrice: number) {
    let openPnl = 0;
    let capitalLocked = 0;

    for (const pos of this.account.positions) {
      let pnl = 0;
      if (pos.type === 'LONG') {
        pnl = (currentPrice - pos.entryPrice) * pos.quantity;
      } else {
        pnl = (pos.entryPrice - currentPrice) * pos.quantity;
      }
      pos.pnl = pnl;
      openPnl += pnl;
      capitalLocked += pos.entryPrice * pos.quantity;
    }

    this.account.equity = this.account.balance + capitalLocked + openPnl;
    
    // Periodically save state so PnL updates are stored if needed, though strictly only balance/positions matter for saveState.
  }

  public resetAccount(initialBalance: number = 10000) {
    this.account = this.getDefaultAccount(initialBalance);
    this.saveState();
  }
}

// Global instance to maintain state across unmounts
export const liveEngine = new LiveTradingEngine();
