// Real-time rates service that fetches from Metal Price API
interface RateResponse {
  material: string;
  rate: number;
  change: number;
  updatedAt: string;
}

interface MetalPriceApiResponse {
  success: boolean;
  timestamp: number;
  base: string;
  date: string;
  rates: {
    EUR?: number;
    XAU?: number; // Gold in troy ounces
    XAG?: number; // Silver in troy ounces
  };
}

class RatesService {
  private apiKey = process.env.METAL_PRICE_API_KEY;
  private apiUrl = 'https://api.metalpriceapi.com/v1/latest';
  private cache: { data: RateResponse[]; timestamp: number } | null = null;
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes cache
  
  // Fallback rates in case API fails
  private fallbackRates = {
    gold: 6250.00, // Base 24K gold rate per gram in INR
    silver: 82.00   // Base silver rate per gram in INR
  };

  // USD to INR exchange rate (approximate, will be updated from API)
  private usdToInr = 83.50;

  private async fetchFromApi(): Promise<RateResponse[]> {
    try {
      if (!this.apiKey) {
        console.warn('METAL_PRICE_API_KEY not found, using fallback rates');
        return this.getFallbackRates();
      }

      const url = `${this.apiUrl}?api_key=${this.apiKey}&base=USD&currencies=XAU,XAG`;
      const response = await fetch(url);
      
      if (!response.ok) {
        console.error(`Metal Price API error: ${response.status}`);
        return this.getFallbackRates();
      }

      const data: MetalPriceApiResponse = await response.json();
      
      if (!data.success || !data.rates.XAU || !data.rates.XAG) {
        console.error('Invalid Metal Price API response');
        return this.getFallbackRates();
      }

      // Convert from troy ounces to grams and USD to INR
      const goldPriceUsdPerOz = 1 / data.rates.XAU; // XAU is USD per troy ounce
      const silverPriceUsdPerOz = 1 / data.rates.XAG; // XAG is USD per troy ounce
      
      // 1 troy ounce = 31.1035 grams
      const goldPriceInrPerGram = (goldPriceUsdPerOz / 31.1035) * this.usdToInr;
      const silverPriceInrPerGram = (silverPriceUsdPerOz / 31.1035) * this.usdToInr;

      // Calculate change from previous cached rates
      let goldChange = 0;
      let silverChange = 0;
      
      if (this.cache?.data) {
        const prevGold = this.cache.data.find(r => r.material === 'gold');
        const prevSilver = this.cache.data.find(r => r.material === 'silver');
        
        if (prevGold) goldChange = goldPriceInrPerGram - prevGold.rate;
        if (prevSilver) silverChange = silverPriceInrPerGram - prevSilver.rate;
      }

      const now = new Date().toISOString();
      
      return [
        {
          material: 'gold',
          rate: goldPriceInrPerGram,
          change: goldChange,
          updatedAt: now
        },
        {
          material: 'silver',
          rate: silverPriceInrPerGram,
          change: silverChange,
          updatedAt: now
        }
      ];
    } catch (error) {
      console.error('Error fetching from Metal Price API:', error);
      return this.getFallbackRates();
    }
  }

  private getFallbackRates(): RateResponse[] {
    const now = new Date().toISOString();
    return [
      {
        material: 'gold',
        rate: this.fallbackRates.gold,
        change: 0,
        updatedAt: now
      },
      {
        material: 'silver',
        rate: this.fallbackRates.silver,
        change: 0,
        updatedAt: now
      }
    ];
  }

  async getCurrentRates(): Promise<RateResponse[]> {
    const now = Date.now();
    
    // Return cached data if still valid
    if (this.cache && (now - this.cache.timestamp) < this.cacheTimeout) {
      return this.cache.data;
    }

    // Fetch fresh data
    const rates = await this.fetchFromApi();
    
    // Update cache
    this.cache = {
      data: rates,
      timestamp: now
    };

    return rates;
  }

  // Get rate for specific purity
  calculatePurityRate(baseRate: number, purity: string): number {
    const purityMap: { [key: string]: number } = {
      '24K Gold': 1.0,
      '22K Gold': 0.916, // 22/24
      '20K Gold': 0.833, // 20/24
      '18K Gold': 0.750, // 18/24
      '16K Gold': 0.667, // 16/24
      '999 Silver': 1.0,  // Pure silver
      '925 Silver': 0.925, // Sterling silver
      '800 Silver': 0.800  // Lower grade silver
    };
    
    const purityFactor = purityMap[purity] || 1.0;
    return baseRate * purityFactor;
  }
}

export const ratesService = new RatesService();