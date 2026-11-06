export type CountryId = 'indonesia' | 'japan' | 'australia' | 'saudi_arabia' | 'south_korea';

export interface Product {
  id: string;
  name: string;
  category: 'Natural Resources' | 'Agriculture' | 'High-Tech' | 'Energy' | 'Heavy Industry';
  icon: string;
  description: string;
  whyWeProduce: string; // Comparative advantage explanation for Grade 8
  everydayUses: string;
  productionCost: number; // Cost to produce domestically
  baseMarketPrice: number; // Base selling price on world market
  unit: string; // e.g. "tons", "containers", "thousand units"
}

export interface CountryInfo {
  id: CountryId;
  name: string;
  flag: string;
  capital: string;
  region: string;
  traderName: string;
  traderRole: string;
  traderAvatar: string;
  motto: string;
  currencyName: string;
  startingTreasury: number;
  initialWarehouseSlots: number;
  mapCoords: { x: number; y: number }; // Percentage coords on world map (0-100)
  economicSummary: string;
  domesticProducts: Product[];
  neededImports: {
    productName: string;
    whyNeeded: string;
    bestSupplier: string;
    icon: string;
  }[];
}

export interface TradeOrder {
  id: string;
  buyerCountryId: CountryId;
  sellerCountryId: CountryId;
  productId: string;
  productName: string;
  icon: string;
  quantity: number;
  unit: string;
  offeredPricePerUnit: number;
  urgency: 'Normal' | 'High Demand' | 'Emergency';
  storyDescription: string;
}

export interface InventoryItem {
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
  avgCost: number;
  category: string;
  icon: string;
  originCountryId: CountryId;
}

export interface TradeTransaction {
  id: string;
  timestamp: number;
  type: 'EXPORT' | 'IMPORT';
  partnerCountryId: CountryId;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalValue: number;
  shippingFee: number;
  tariffFee: number;
}

export interface TradeProblemEvent {
  id: string;
  title: string;
  category: 'Supply Chain' | 'Tariff Policy' | 'Natural Resource' | 'Currency & Tech';
  description: string;
  imageIcon: string;
  icon?: string;
  impactSummary: string;
  options: {
    label: string;
    explanation: string;
    costImpact: number; // +/- treasury
    priceModifierProduct?: string;
    priceModifierPercent?: number;
    scorePoints: number;
    feedback: string;
  }[];
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  topic: string;
}
