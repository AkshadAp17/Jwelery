import axios from 'axios';
import * as cheerio from 'cheerio';

export interface LiveRates {
  gold: {
    rate24k: number;
    rate22k: number;
    rate20k: number;
    rate18k: number;
    change: number;
    updatedAt: string;
  };
  silver: {
    rate: number;
    change: number;
    updatedAt: string;
  };
}

class LiveRatesService {
  private cachedRates: LiveRates | null = null;
  private lastUpdate: number = 0;
  private updateInterval: number = 30000; // 30 seconds
  private isUpdating: boolean = false;

  constructor() {
    // Start automatic updates
    this.startAutoUpdate();
  }

  async getLiveRates(): Promise<LiveRates> {
    const now = Date.now();
    
    // Return cached rates if they're fresh (less than 30 seconds old)
    if (this.cachedRates && (now - this.lastUpdate) < this.updateInterval) {
      return this.cachedRates;
    }

    // Fetch new rates
    return await this.fetchRates();
  }

  private async fetchRates(): Promise<LiveRates> {
    if (this.isUpdating) {
      return this.cachedRates || this.getFallbackRates();
    }

    this.isUpdating = true;

    try {
      const response = await axios.get('http://www.omgolds.com/LiveRates.html', {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      const $ = cheerio.load(response.data);
      const currentTime = new Date().toISOString();

      // Extract gold rates (adjust selectors based on actual website structure)
      const gold24k = this.parseRate($('#gold24k').text()) || this.parseRate($('[data-rate="24k"]').text()) || 6800;
      const gold22k = Math.round(gold24k * 0.916); // 22k is typically 91.6% of 24k
      const gold20k = Math.round(gold24k * 0.833); // 20k is typically 83.3% of 24k
      const gold18k = Math.round(gold24k * 0.750); // 18k is typically 75% of 24k

      // Extract silver rate
      const silverRate = this.parseRate($('#silver').text()) || this.parseRate($('[data-rate="silver"]').text()) || 85;

      // Calculate change (simplified - in real implementation, you'd compare with previous rates)
      const goldChange = this.cachedRates ? gold24k - (this.cachedRates.gold.rate24k || gold24k) : 0;
      const silverChange = this.cachedRates ? silverRate - (this.cachedRates.silver.rate || silverRate) : 0;

      this.cachedRates = {
        gold: {
          rate24k: gold24k,
          rate22k: gold22k,
          rate20k: gold20k,
          rate18k: gold18k,
          change: goldChange,
          updatedAt: currentTime
        },
        silver: {
          rate: silverRate,
          change: silverChange,
          updatedAt: currentTime
        }
      };

      this.lastUpdate = Date.now();
      console.log(`Live rates updated: Gold 24K: ₹${gold24k}, Silver: ₹${silverRate}`);

    } catch (error) {
      console.error('Failed to fetch live rates from OMGolds:', error);
      
      // Use fallback rates if fetching fails
      if (!this.cachedRates) {
        this.cachedRates = this.getFallbackRates();
      }
    } finally {
      this.isUpdating = false;
    }

    return this.cachedRates;
  }

  private parseRate(text: string): number | null {
    if (!text) return null;
    
    // Remove currency symbols and extract number
    const cleaned = text.replace(/[₹,\s]/g, '');
    const number = parseFloat(cleaned);
    
    return isNaN(number) ? null : Math.round(number);
  }

  private getFallbackRates(): LiveRates {
    const currentTime = new Date().toISOString();
    return {
      gold: {
        rate24k: 6800,
        rate22k: 6250,
        rate20k: 5800,
        rate18k: 5100,
        change: 0,
        updatedAt: currentTime
      },
      silver: {
        rate: 85,
        change: 0,
        updatedAt: currentTime
      }
    };
  }

  private startAutoUpdate(): void {
    // Update immediately
    this.fetchRates();

    // Then update every 30 seconds
    setInterval(() => {
      this.fetchRates().catch(err => {
        console.error('Scheduled rate update failed:', err);
      });
    }, this.updateInterval);

    console.log('Live rates service started - updating every 30 seconds');
  }

  // Get rates formatted for the existing API
  async getFormattedRates() {
    const liveRates = await this.getLiveRates();
    
    return [
      {
        material: "gold",
        rate: liveRates.gold.rate22k, // Use 22K for main gold rate
        change: liveRates.gold.change,
        updatedAt: liveRates.gold.updatedAt
      },
      {
        material: "silver", 
        rate: liveRates.silver.rate,
        change: liveRates.silver.change,
        updatedAt: liveRates.silver.updatedAt
      }
    ];
  }
}

export const liveRatesService = new LiveRatesService();