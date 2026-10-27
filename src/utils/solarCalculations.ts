import { SolarCalculationResult, SolarLayoutConfig } from '../types/solar';

/**
 * Calculates solar position (elevation angle and azimuth)
 * based on time of day (6.0 to 18.0) and seasonal declination.
 */
export function calculateSunPosition(timeOfDay: number, season: 'summer' | 'equinox' | 'winter') {
  // Solar noon is at 12.0
  const hourAngle = (timeOfDay - 12) * 15; // degrees from noon (-90 to +90)

  // Solar declination approx: Summer (+23.45 deg), Equinox (0 deg), Winter (-23.45 deg)
  const declination = season === 'summer' ? 23.45 : season === 'winter' ? -23.45 : 0;
  const latitude = 34.0; // Typical southern/mid-latitude reference (Los Angeles / Atlanta / Phoenix)

  const latRad = (latitude * Math.PI) / 180;
  const decRad = (declination * Math.PI) / 180;
  const haRad = (hourAngle * Math.PI) / 180;

  // Elevation angle alpha: sin(alpha) = sin(lat)*sin(dec) + cos(lat)*cos(dec)*cos(ha)
  const sinElevation =
    Math.sin(latRad) * Math.sin(decRad) +
    Math.cos(latRad) * Math.cos(decRad) * Math.cos(haRad);
  const elevationRad = Math.asin(Math.max(-0.1, Math.min(1.0, sinElevation)));
  const elevationDeg = Math.max(0, (elevationRad * 180) / Math.PI);

  // Azimuth angle gamma (measured from North = 0, East = 90, South = 180, West = 270)
  // Simplified realistic path from morning (East: ~100°) to noon (South: 180°) to evening (West: ~260°)
  let azimuthDeg = 180 + hourAngle * 0.95;
  if (azimuthDeg < 60) azimuthDeg = 60;
  if (azimuthDeg > 300) azimuthDeg = 300;

  // Compute 3D light vector coordinates (Three.js space: Y is up, -Z is North, +Z is South, +X is East, -X is West)
  const dist = 42;
  const y = Math.max(2, Math.sin(elevationRad) * dist);
  const horizDist = Math.cos(elevationRad) * dist;
  // Azimuth from North (0°):
  const azRad = (azimuthDeg * Math.PI) / 180;
  const x = Math.sin(azRad) * horizDist;
  const z = -Math.cos(azRad) * horizDist;

  // Solar color temperature based on elevation:
  // Low elevation (<15°) = warm amber/golden hour, Mid (15°-40°) = warm white, High (>40°) = crisp pure sunlight
  let lightColor = '#ffffff';
  let lightIntensity = 2.4;
  if (elevationDeg < 12) {
    lightColor = '#ff9f43';
    lightIntensity = 1.3;
  } else if (elevationDeg < 25) {
    lightColor = '#ffdda1';
    lightIntensity = 1.9;
  } else {
    lightColor = '#fffbf0';
    lightIntensity = 2.5;
  }

  return {
    elevationDeg,
    azimuthDeg,
    position: { x, y, z },
    lightColor,
    lightIntensity,
  };
}

/**
 * Calculates full financial and engineering solar metrics
 */
export function calculateSolarMetrics(
  config: Partial<SolarLayoutConfig>,
  monthlyElectricBill: number = 220,
  includeBattery: boolean = false
): SolarCalculationResult {
  const panelCount = config.panelCount ?? 24;
  const panelWattage = config.panelWattage ?? 400; // 400W premium module
  const tiltAngle = config.tiltAngle ?? 28; // deg
  const azimuth = config.azimuth ?? 180; // south

  // System Size in kW DC
  const systemSizeKw = (panelCount * panelWattage) / 1000;

  // Derate factor for orientation and tilt:
  // Ideal tilt is ~30° facing 180° South.
  const tiltLoss = Math.abs(tiltAngle - 30) * 0.003;
  const azimuthDeviationFromSouth = Math.min(
    Math.abs(azimuth - 180),
    Math.abs(azimuth - 180 + 360)
  );
  const azimuthLoss = (azimuthDeviationFromSouth / 180) * 0.15;
  const orientationFactor = Math.max(0.72, 1.0 - tiltLoss - azimuthLoss);

  // Average US solar peak sun hours per day: ~4.7 hours/day
  // 365 days * 4.7 hrs * system kW * efficiency derate (~0.82 system efficiency)
  const annualProductionKwh = Math.round(
    systemSizeKw * 4.7 * 365 * 0.82 * orientationFactor
  );

  // Electricity utility rate assumption: $0.21/kWh average blended residential
  const electricRateKwh = 0.21;
  const estimatedAnnualConsumptionKwh = (monthlyElectricBill * 12) / electricRateKwh;

  const monthlyOffsetPercentage = Math.min(
    125,
    Math.round((annualProductionKwh / estimatedAnnualConsumptionKwh) * 100)
  );

  const estimatedAnnualSavings = Math.round(
    Math.min(estimatedAnnualConsumptionKwh, annualProductionKwh) * electricRateKwh
  );
  const estimatedMonthlySavings = Math.round(estimatedAnnualSavings / 12);

  // Industry average turnkey installed cost: ~$2.85 per Watt DC
  let estimatedGrossCost = Math.round(systemSizeKw * 1000 * 2.85);
  if (includeBattery) {
    estimatedGrossCost += 11500; // Add 13.5 kWh home battery storage
  }

  // 30% Federal Clean Energy Tax Credit (ITC - Section 25D)
  const federalTaxCreditValue = Math.round(estimatedGrossCost * 0.3);
  const netSystemCost = estimatedGrossCost - federalTaxCreditValue;

  // 25-Year Cumulative Savings:
  // Utility rates escalate at ~3.5% annually historically.
  // Solar panels degrade at 0.5% per year (Tier-1 warranty).
  let cumulativeSavings = 0;
  let currentAnnualSavings = estimatedAnnualSavings;
  for (let year = 1; year <= 25; year++) {
    cumulativeSavings += currentAnnualSavings;
    currentAnnualSavings = currentAnnualSavings * 1.035 * 0.995; // 3.5% rate rise - 0.5% degradation
  }
  const estimated25YrNetSavings = Math.round(cumulativeSavings - netSystemCost);

  // Payback period
  const paybackPeriodYears = Number(
    (netSystemCost / Math.max(500, estimatedAnnualSavings)).toFixed(1)
  );

  // Environmental impact: EPA factor = 0.85 lbs CO2 / kWh
  const co2OffsetMetricTonsYear = Number(
    ((annualProductionKwh * 0.85) / 2204.62).toFixed(1)
  );
  const treesPlantedEquivalent = Math.round(co2OffsetMetricTonsYear * 16.5);

  return {
    systemSizeKw: Number(systemSizeKw.toFixed(2)),
    annualProductionKwh,
    monthlyOffsetPercentage,
    estimatedMonthlySavings,
    estimatedAnnualSavings,
    estimated25YrNetSavings,
    federalTaxCreditValue,
    estimatedGrossCost,
    netSystemCost,
    paybackPeriodYears,
    co2OffsetMetricTonsYear,
    treesPlantedEquivalent,
  };
}

/**
 * Format currency helper
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

export interface RoiTimelinePoint {
  year: number;
  label: string;
  cumulativeNetProfit: number;
  cumulativeSolarSavings: number;
  cumulativeUtilityCostWithoutSolar: number;
  annualSolarSavings: number;
}

/**
 * Generates year-by-year 25-year financial trajectory data for Recharts
 */
export function generate25YearRoiTimeline(
  calculation: SolarCalculationResult,
  monthlyElectricBill: number
): RoiTimelinePoint[] {
  const points: RoiTimelinePoint[] = [];
  const netCost = calculation.netSystemCost;

  let currentYearAnnualSolarSavings = calculation.estimatedAnnualSavings;
  let runningSolarSavings = 0;
  let runningUtilityCostNoSolar = 0;
  let currentYearUtilityCost = monthlyElectricBill * 12;

  // Year 0: Initial investment (net after 30% tax credit)
  points.push({
    year: 0,
    label: 'Install',
    cumulativeNetProfit: -netCost,
    cumulativeSolarSavings: 0,
    cumulativeUtilityCostWithoutSolar: 0,
    annualSolarSavings: 0,
  });

  for (let year = 1; year <= 25; year++) {
    runningSolarSavings += currentYearAnnualSolarSavings;
    runningUtilityCostNoSolar += currentYearUtilityCost;

    const cumulativeNetProfit = Math.round(runningSolarSavings - netCost);

    points.push({
      year,
      label: `Yr ${year}`,
      cumulativeNetProfit,
      cumulativeSolarSavings: Math.round(runningSolarSavings),
      cumulativeUtilityCostWithoutSolar: Math.round(runningUtilityCostNoSolar),
      annualSolarSavings: Math.round(currentYearAnnualSolarSavings),
    });

    // 3.5% utility escalation, 0.5% panel degradation
    currentYearAnnualSolarSavings = currentYearAnnualSolarSavings * 1.035 * 0.995;
    currentYearUtilityCost = currentYearUtilityCost * 1.035;
  }

  return points;
}
