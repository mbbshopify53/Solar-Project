export type RoofType = 'gabled' | 'hip';

export interface SolarLayoutConfig {
  roofType: RoofType;
  panelCount: number; // 12 to 36
  tiltAngle: number; // 15 to 45 deg
  azimuth: number; // 0 to 360 deg
  timeOfDay: number; // 6 to 18 (hours in decimal, e.g. 12.5 = 12:30 PM)
  season: 'summer' | 'equinox' | 'winter';
  panelWattage: number; // 400W default
}

export interface SolarCalculationResult {
  systemSizeKw: number;
  annualProductionKwh: number;
  monthlyOffsetPercentage: number;
  estimatedMonthlySavings: number;
  estimatedAnnualSavings: number;
  estimated25YrNetSavings: number;
  federalTaxCreditValue: number;
  estimatedGrossCost: number;
  netSystemCost: number;
  paybackPeriodYears: number;
  co2OffsetMetricTonsYear: number;
  treesPlantedEquivalent: number;
}

export interface LeadFormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  monthlyElectricBill: number;
  roofType: RoofType;
  roofAgeYears: number;
  sunExposure: 'high' | 'moderate' | 'partial';
  includeBattery: boolean;
  preferredContactMethod: 'phone' | 'email' | 'text';
  timeframe: 'immediate' | '1-3_months' | '3-6_months' | 'exploring';
  notes: string;
  // Attached 3D system design from visualizer
  designedSystemSizeKw?: number;
  designedPanelCount?: number;
  designedTiltAngle?: number;
}

export interface SubmittedLeadRecord extends LeadFormData {
  id: string;
  createdAt: string;
  status: 'new' | 'contacted' | 'site_visit_scheduled' | 'proposal_sent';
  calculation: SolarCalculationResult;
}

export interface ProjectCaseStudy {
  id: string;
  title: string;
  location: string;
  roofType: RoofType;
  roofMaterial: string;
  systemSizeKw: number;
  panelCount: number;
  panelBrand: string;
  inverterType: string;
  hasBatteryBackup: boolean;
  batteryModel?: string;
  annualProductionKwh: number;
  annualSavingsUsd: number;
  utilityOffsetPercentage: number;
  completionDate: string;
  installDurationDays: number;
  summary: string;
  keyHighlights: string[];
  homeowner: {
    name: string;
    neighborhood: string;
    quote: string;
    rating: number;
  };
}
