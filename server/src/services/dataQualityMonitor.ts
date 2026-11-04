export interface QualityAuditResult {
  dataQualityScore: number; // 0 to 100
  telemetryLatencyHrs: number;
  isStale: boolean;
  isStuckValue: boolean;
  isImputed: boolean;
  sourceDisagreement: boolean;
  flags: string[];
}

export const evaluateQuality = (
  latencyHrs: number,
  recentReadings: number[],
  satellitePrecipMm: number,
  groundPrecipMm: number,
  isImputed: boolean = false
): QualityAuditResult => {
  let score = 100;
  const flags: string[] = [];

  // 1. Latency check
  const isStale = latencyHrs > 2.0;
  if (latencyHrs > 6.0) {
    score -= 40;
    flags.push(`Extreme telemetry latency: ${latencyHrs.toFixed(1)}h behind real-time`);
  } else if (latencyHrs > 2.0) {
    score -= 15;
    flags.push(`Telemetry delayed: ${latencyHrs.toFixed(1)}h lag`);
  }

  // 2. Sensor stuck-value detection (repeated identical decimal values during active rainfall)
  let isStuckValue = false;
  if (recentReadings.length >= 4) {
    const allSame = recentReadings.every((val) => Math.abs(val - recentReadings[0]) < 0.001);
    if (allSame && groundPrecipMm > 10.0) {
      isStuckValue = true;
      score -= 30;
      flags.push('Potential stuck sensor: gauge stage unchanged despite heavy precipitation');
    }
  }

  // 3. Imputation flag
  if (isImputed) {
    score -= 20;
    flags.push('Data stream is interpolated from spatial neighbors');
  }

  // 4. Satellite vs ground gauge divergence
  let sourceDisagreement = false;
  const precipDivergence = Math.abs(satellitePrecipMm - groundPrecipMm);
  if (precipDivergence > 50.0) {
    sourceDisagreement = true;
    score -= 15;
    flags.push(`Source disagreement: Satellite GPM (${satellitePrecipMm}mm) diverges from in-situ (${groundPrecipMm}mm)`);
  }

  const finalScore = Math.max(15, Math.min(100, score));

  return {
    dataQualityScore: finalScore,
    telemetryLatencyHrs: latencyHrs,
    isStale,
    isStuckValue,
    isImputed,
    sourceDisagreement,
    flags,
  };
};

