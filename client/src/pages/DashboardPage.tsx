import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { LocationSelector } from '../components/dashboard/LocationSelector';
import { FreshnessStrip } from '../components/dashboard/FreshnessStrip';
import { FloodRiskCard } from '../components/dashboard/FloodRiskCard';
import { DroughtRiskCard } from '../components/dashboard/DroughtRiskCard';
import { TrendCharts } from '../components/dashboard/TrendCharts';
import { HazardMap } from '../components/gis/HazardMap';
import { StatutoryNotice } from '../components/common/StatutoryNotice';
import type { Catchment, EnvironmentalData } from '../services/api';
import { fetchCatchments, fetchLatestEnvironmentalData } from '../services/api';
import { Activity, Layers, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const [catchments, setCatchments] = useState<Catchment[]>([]);
  const [selectedId, setSelectedId] = useState<string>('catchment_pune_01');
  const [data, setData] = useState<EnvironmentalData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCatchments().then((list) => {
      setCatchments(list);
      if (list.length > 0 && !selectedId) {
        setSelectedId(list[0].id);
      }
    });
  }, []);

  const loadData = (id: string) => {
    setLoading(true);
    fetchLatestEnvironmentalData(id).then((res) => {
      setData(res);
      setLoading(false);
    });
  };

  useEffect(() => {
    if (selectedId) {
      loadData(selectedId);
    }
  }, [selectedId]);

  return (
    <div className="min-h-screen bg-obsidian text-bone flex flex-col justify-between">
      <Navbar />

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-7 flex-1">
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-graphite">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs text-mint font-mono mb-1">
              <Activity className="w-3.5 h-3.5" />
              <span>Real-Time Environmental Intelligence Layer</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-display font-extrabold text-bone tracking-tight">
              {data?.catchment.name || 'Catchment Monitoring'}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <LocationSelector
              catchments={catchments}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
            <Link
              to="/simulator"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-mint text-obsidian font-bold text-xs hover:bg-mint/90 transition-all mint-border-glow"
            >
              <span>Test What-If Runoff</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Telemetry Freshness & Health Strip */}
        {data && (
          <FreshnessStrip
            score={data.quality.dataQualityScore}
            latencyHrs={data.quality.telemetryLatencyHrs}
            isImputed={data.quality.isImputed}
            attribution={data.sourceAttribution}
            updatedAt={data.updatedAt}
            onRefresh={() => loadData(selectedId)}
          />
        )}

        {/* Mandatory Statutory Notice */}
        <StatutoryNotice />

        {loading || !data ? (
          <div className="h-96 flex flex-col items-center justify-center space-y-3 glass-panel rounded-3xl border border-graphite">
            <div className="w-8 h-8 rounded-full border-2 border-mint border-t-transparent animate-spin" />
            <span className="text-xs text-ash font-mono">
              Calibrating hydro-meteorological models...
            </span>
          </div>
        ) : (
          <div className="space-y-7">
            {/* Dual Hazard Grid: Flood Risk (Mint) + Drought Risk (Ember) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FloodRiskCard
                rainfall24h={data.weather.rainfall24hMm}
                rainfall6h={data.weather.rainfall6hMm}
                soilMoisture={data.weather.soilMoisturePct}
                stageM={data.hydrology.stageM}
                warningStageM={data.hydrology.warningStageM}
                dangerStageM={data.hydrology.dangerStageM}
                dischargeCumecs={data.hydrology.dischargeCumecs}
                rateOfRise={data.hydrology.rateOfRiseMPerHr}
                qualityScore={data.quality.dataQualityScore}
                latencyHrs={data.quality.telemetryLatencyHrs}
                riverName={data.hydrology.riverName}
              />

              <DroughtRiskCard
                spei3={data.drought.spei3}
                precipDeficit30d={data.drought.precipDeficit30dPct}
                soilMoistureDeficit={data.drought.soilMoistureDeficitPct}
                consecutiveDryDays={data.drought.consecutiveDryDays}
                isDroughtProne={data.catchment.isDroughtProne}
              />
            </div>

            {/* Geospatial Hazard Map Canvas */}
            <HazardMap />

            {/* Recharts Hydrograph & Trend Visualizer */}
            <TrendCharts
              warningStageM={data.hydrology.warningStageM}
              dangerStageM={data.hydrology.dangerStageM}
              currentStageM={data.hydrology.stageM}
              rainfall24h={data.weather.rainfall24hMm}
            />

            {/* Actionable Preparedness Card */}
            <div className="glass-panel p-6 sm:p-7 rounded-3xl border border-graphite flex flex-col sm:flex-row items-center justify-between gap-5 bg-carbon/90">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-mint/10 border border-mint/30 flex items-center justify-center text-mint flex-shrink-0">
                  <Layers className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-base text-bone">
                    Need an Action Plan for This Location?
                  </h4>
                  <p className="text-xs text-ash">
                    Generate an instant, household-tailored preparedness checklist for this catchment.
                  </p>
                </div>
              </div>
              <Link
                to="/preparedness"
                className="px-5 py-2.5 rounded-xl bg-mint text-obsidian font-bold text-xs hover:bg-mint/90 transition-all mint-border-glow whitespace-nowrap"
              >
                Generate Tailored Checklist
              </Link>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};
