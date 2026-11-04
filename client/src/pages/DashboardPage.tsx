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
    <div className="min-h-screen bg-abyss text-offwhite flex flex-col justify-between">
      <Navbar />

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6 flex-1">
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-cyan/20">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs text-cyan font-mono mb-1">
              <Activity className="w-3.5 h-3.5" />
              <span>Real-Time Environmental Intelligence Layer</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-offwhite">
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
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cyan text-abyss font-semibold text-xs hover:bg-cyan/90 transition-colors"
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
          <div className="h-96 flex flex-col items-center justify-center space-y-3 glass-panel rounded-2xl border border-cyan/20">
            <div className="w-8 h-8 rounded-full border-2 border-cyan border-t-transparent animate-spin" />
            <span className="text-xs text-offwhite/60 font-mono">
              Calibrating hydro-meteorological models...
            </span>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Dual Hazard Grid: Flood Risk + Drought Risk */}
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

            {/* Quick Link to Actionable Preparedness */}
            <div className="glass-panel p-5 rounded-2xl border border-cyan/20 flex flex-col sm:flex-row items-center justify-between gap-4 bg-deep/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal/20 border border-teal/40 flex items-center justify-center text-teal">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-offwhite">
                    Need an Action Plan for This Location?
                  </h4>
                  <p className="text-xs text-offwhite/60">
                    Generate an instant, household-tailored preparedness checklist for this catchment.
                  </p>
                </div>
              </div>
              <Link
                to="/preparedness"
                className="px-4 py-2 rounded-lg bg-teal text-abyss font-bold text-xs hover:bg-teal/90 transition-colors whitespace-nowrap"
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
