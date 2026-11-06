import React, { useState } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { StatutoryNotice } from '../components/common/StatutoryNotice';
import { useAuth } from '../context/AuthContext';
import {
  ClipboardCheck,
  Printer,
  CheckCircle,
  Home,
  Baby,
  Users,
  HeartPulse,
  PawPrint,
} from 'lucide-react';

interface ChecklistItem {
  id: string;
  category: 'immediate' | 'supplies' | 'evacuation' | 'drought';
  text: string;
  reason: string;
}

export const PreparednessPage: React.FC = () => {
  const { user, updateHouseholdProfile } = useAuth();

  // Household Profile States
  const [infantsCount, setInfantsCount] = useState(user?.householdProfile?.infantsCount || 1);
  const [elderlyCount, setElderlyCount] = useState(user?.householdProfile?.elderlyCount || 1);
  const [mobilityImpaired, setMobilityImpaired] = useState(user?.householdProfile?.mobilityImpaired || false);
  const [dwellingType, setDwellingType] = useState<'ground_floor' | 'upper_floor' | 'independent_house'>(
    user?.householdProfile?.dwellingType || 'ground_floor'
  );
  const [hasLivestock, setHasLivestock] = useState(user?.householdProfile?.hasLivestock ?? true);

  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({});

  const toggleItem = (id: string) => {
    setCompletedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSaveProfile = () => {
    updateHouseholdProfile({
      infantsCount,
      elderlyCount,
      mobilityImpaired,
      dwellingType,
      hasLivestock,
    });
  };

  // Dynamic Rule-Based Generation of Tailored Checklist
  const generateChecklist = (): ChecklistItem[] => {
    const list: ChecklistItem[] = [
      {
        id: 'c_core_1',
        category: 'supplies',
        text: 'Store 3-day drinking water buffer (min 4 litres per person per day) in sealed containers.',
        reason: 'Universal disaster health protocol: flood ingress contaminates municipal water mains.',
      },
      {
        id: 'c_core_2',
        category: 'immediate',
        text: 'Charge mobile phones and power banks; secure battery-powered radio and torch.',
        reason: 'Storms trigger power feeder blackouts to prevent transformer electrocution.',
      },
    ];

    if (dwellingType === 'ground_floor') {
      list.push({
        id: 'c_dwelling_1',
        category: 'immediate',
        text: 'Elevate essential electronics, critical documents, and bedding at least 1.5m above floor level.',
        reason: 'Ground-floor dwellings face rapid water ingress during pluvial surface runoff.',
      });
      list.push({
        id: 'c_dwelling_2',
        category: 'evacuation',
        text: 'Pre-identify upper-floor refuge access or nearest municipal shelter on high ground.',
        reason: 'Low-lying ground-floor units require early vertical evacuation before roads submerge.',
      });
    }

    if (infantsCount > 0) {
      list.push({
        id: 'c_infant_1',
        category: 'supplies',
        text: 'Pack 5-day infant milk formula, sterile feeding supplies, rehydration salts (ORS), and waterproof nappies.',
        reason: 'Infants are at acute risk of dehydration from waterborne pathogens during floods.',
      });
    }

    if (elderlyCount > 0 || mobilityImpaired) {
      list.push({
        id: 'c_elderly_1',
        category: 'evacuation',
        text: 'Pack 14-day supply of prescription chronic medicines, doctor prescriptions, and mobility aids.',
        reason: 'Pharmacies and transport links often remain inaccessible for multiple days post-disaster.',
      });
      list.push({
        id: 'c_elderly_2',
        category: 'evacuation',
        text: 'Register elderly/mobility-impaired family members with Ward Emergency Officer for prioritized evacuation assistance.',
        reason: 'NDMA Standard Operating Procedure for vulnerable citizens with limited transit capacity.',
      });
    }

    if (hasLivestock) {
      list.push({
        id: 'c_livestock_1',
        category: 'evacuation',
        text: 'Untie livestock from low sheds and move herds to elevated embankment ground before water rises.',
        reason: 'Tethered cattle are the #1 cause of agrarian livestock mortality in riverine surges.',
      });
      list.push({
        id: 'c_livestock_2',
        category: 'drought',
        text: 'Store dry fodder in elevated waterproof plastic wraps; plan alternative tanker water rationing.',
        reason: 'Agricultural drought desiccates local grazing pastures, causing acute fodder shortage.',
      });
    }

    // Drought resilience action
    list.push({
      id: 'c_drought_1',
      category: 'drought',
      text: 'Implement soil mulching across standing crops to reduce evaporative soil-moisture loss by 40%.',
      reason: 'Standard ICAR agronomic practice during prolonged precipitation deficits.',
    });

    return list;
  };

  const checklist = generateChecklist();
  const completedCount = Object.values(completedItems).filter(Boolean).length;
  const progressPct = Math.round((completedCount / checklist.length) * 100);

  return (
    <div className="min-h-screen bg-obsidian text-bone flex flex-col justify-between">
      <Navbar />

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6 flex-1">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-graphite">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs text-mint font-mono mb-1">
              <ClipboardCheck className="w-3.5 h-3.5" />
              <span>Tailored Household Action Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-bone">
              Personalised Emergency Preparedness Plan
            </h1>
          </div>

          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-carbon border border-graphite text-mint text-xs font-semibold hover:border-mint transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save Checklist</span>
          </button>
        </div>

        <StatutoryNotice />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Profile Configuration Column */}
          <div className="lg:col-span-4 glass-panel p-6 rounded-2xl border border-graphite space-y-5">
            <div className="pb-3 border-b border-graphite flex items-center justify-between">
              <h3 className="font-semibold text-sm text-bone flex items-center gap-2">
                <Users className="w-4 h-4 text-mint" /> Household Vulnerability Profile
              </h3>
              <span className="text-[11px] text-mint font-mono">Dynamic</span>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-ash font-medium flex items-center gap-1">
                  <Baby className="w-3.5 h-3.5 text-mint" /> Infants / Young Children (under 5)
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={infantsCount}
                  onChange={(e) => setInfantsCount(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-lg bg-carbon border border-graphite text-bone focus:border-mint focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-ash font-medium flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-amber-400" /> Elderly Family Members (60+)
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={elderlyCount}
                  onChange={(e) => setElderlyCount(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-lg bg-carbon border border-graphite text-bone focus:border-mint focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-carbon/60 border border-graphite">
                <span className="flex items-center gap-1.5 text-ash">
                  <HeartPulse className="w-3.5 h-3.5 text-rose-400" /> Mobility Impaired / Dialysis
                </span>
                <input
                  type="checkbox"
                  checked={mobilityImpaired}
                  onChange={(e) => setMobilityImpaired(e.target.checked)}
                  className="w-4 h-4 accent-mint"
                />
              </div>

              <div className="space-y-1">
                <label className="text-ash font-medium flex items-center gap-1">
                  <Home className="w-3.5 h-3.5 text-mint" /> Dwelling Elevation
                </label>
                <select
                  value={dwellingType}
                  onChange={(e) => setDwellingType(e.target.value as any)}
                  className="w-full px-3 py-1.5 rounded-lg bg-carbon border border-graphite text-bone focus:border-mint focus:outline-none"
                >
                  <option value="ground_floor">Ground Floor (High Ingress Risk)</option>
                  <option value="upper_floor">Upper Floor / Apartment</option>
                  <option value="independent_house">Independent House / Multi-Story</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-carbon/60 border border-graphite">
                <span className="flex items-center gap-1.5 text-ash">
                  <PawPrint className="w-3.5 h-3.5 text-amber-300" /> Farm Livestock / Cattle
                </span>
                <input
                  type="checkbox"
                  checked={hasLivestock}
                  onChange={(e) => setHasLivestock(e.target.checked)}
                  className="w-4 h-4 accent-mint"
                />
              </div>

              <button
                type="button"
                onClick={handleSaveProfile}
                className="w-full py-2 rounded-lg bg-mint text-obsidian font-bold text-xs hover:bg-mint/90 transition-colors shadow-sm"
              >
                Save Household Profile
              </button>
            </div>
          </div>

          {/* Generated Checklist Column */}
          <div className="lg:col-span-8 space-y-5">
            {/* Progress Card */}
            <div className="glass-panel p-5 rounded-2xl border border-graphite space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-sm text-bone">Preparedness Completion Status</h3>
                  <span className="text-xs text-ash">
                    {completedCount} of {checklist.length} safety items verified
                  </span>
                </div>
                <span className="text-2xl font-bold font-mono text-mint font-tabular">{progressPct}%</span>
              </div>

              <div className="w-full bg-carbon rounded-full h-2.5 overflow-hidden border border-graphite">
                <div
                  className="bg-mint h-full rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(92,255,177,0.4)]"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>

            {/* Checklist Items */}
            <div className="space-y-3">
              {checklist.map((item) => {
                const isChecked = !!completedItems[item.id];
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleItem(item.id)}
                    className={`glass-panel p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                      isChecked
                        ? 'border-mint/40 bg-mint/5'
                        : 'border-graphite hover:border-mint/40 bg-carbon/50'
                    }`}
                  >
                    <button
                      type="button"
                      className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                        isChecked
                          ? 'bg-mint border-mint text-obsidian'
                          : 'border-graphite bg-carbon'
                      }`}
                    >
                      {isChecked && <CheckCircle className="w-3.5 h-3.5" />}
                    </button>

                    <div className="space-y-1 flex-1">
                      <p
                        className={`text-xs font-medium leading-relaxed ${
                          isChecked ? 'line-through text-ash' : 'text-bone'
                        }`}
                      >
                        {item.text}
                      </p>
                      <p className="text-[11px] text-ash leading-relaxed">
                        <strong className="text-mint">Why: </strong> {item.reason}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Official Guidance Citations */}
            <div className="p-4 rounded-xl bg-carbon/60 border border-graphite text-[11px] text-ash space-y-1">
              <span className="font-semibold text-bone block">Guidance Authority Reference:</span>
              <p>
                Adapted from National Disaster Management Authority (NDMA) Flood Preparedness SOPs (2023) and ICAR Drought Resilient Agriculture Protocols. Always heed local administrative evacuation directives.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
