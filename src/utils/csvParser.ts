// Client-side CSV parser
export interface CryptoData {
  Coin: string;
  Volatility: number;
  Risk: number;
  'Moonshot Score': string;
}

export async function parseCryptoData(): Promise<CryptoData[]> {
  try {
    const response = await fetch('/crypto_data.csv');
    const csvText = await response.text();
    
    // Parse CSV string
    const rows = csvText.split('\n');
    const headers = rows[0].split(',');
    const results: CryptoData[] = [];
    
    for (let i = 1; i < rows.length; i++) {
      if (rows[i].trim() === '') continue;
      
      const values = rows[i].split(',');
      const entry: any = {};
      
      headers.forEach((header, index) => {
        // Convert numeric values
        if (['Volatility', 'Risk'].includes(header)) {
          entry[header] = parseInt(values[index], 10);
        } else {
          entry[header] = values[index];
        }
      });
      
      results.push(entry as CryptoData);
    }
    
    return results;
  } catch (error) {
    console.error('Error parsing CSV:', error);
    return [];
  }
}

export function filterCryptoByPreferences(
  data: CryptoData[],
  riskTolerance: 'low' | 'medium' | 'high',
  volatilityPreference: 'low' | 'medium' | 'high',
  moonshotRate: 'conservative' | 'balanced' | 'aggressive'
): CryptoData[] {
  // Define thresholds based on preferences
  const riskThresholds = {
    low: { min: 0, max: 4 },
    medium: { min: 5, max: 7 },
    high: { min: 8, max: 10 }
  };
  
  const volatilityThresholds = {
    low: { min: 0, max: 15 },
    medium: { min: 16, max: 30 },
    high: { min: 31, max: 100 }
  };
  
  const moonshotThresholds = {
    conservative: ['3x'],
    balanced: ['5x'],
    aggressive: ['10x']
  };
  
  return data.filter(coin => {
    const riskMatch = coin.Risk >= riskThresholds[riskTolerance].min && 
                     coin.Risk <= riskThresholds[riskTolerance].max;
                     
    const volatilityMatch = coin.Volatility >= volatilityThresholds[volatilityPreference].min && 
                           coin.Volatility <= volatilityThresholds[volatilityPreference].max;
                           
    const moonshotMatch = moonshotThresholds[moonshotRate].includes(coin['Moonshot Score']);
    
    return riskMatch && volatilityMatch && moonshotMatch;
  });
}
