import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { StatutoryNotice } from '../components/common/StatutoryNotice';
import { useAuth } from '../context/AuthContext';
import {
  ShieldCheck,
  MapPin,
  Send,
  AlertCircle,
  CheckCircle2,
  Clock,
  Navigation,
} from 'lucide-react';

interface ReportItem {
  _id: string;
  reportType: string;
  title: string;
  description: string;
  location: {
    lat: number;
    lng: number;
    landmark: string;
    district: string;
  };
  waterDepthCm?: number;
  trustStatus: 'unverified' | 'corroborated' | 'verified';
  submittedBy: {
    userName: string;
    userRole: string;
  };
  verifiedBy?: string;
  createdAt: string;
  isDemo?: boolean;
}

export const CommunityPage: React.FC = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form states
  const [reportType, setReportType] = useState('inundation');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [landmark, setLandmark] = useState('');
  const [district, setDistrict] = useState('Pune');
  const [waterDepthCm, setWaterDepthCm] = useState<number | ''>('');
  const [lat, setLat] = useState<number>(18.5204);
  const [lng, setLng] = useState<number>(73.8567);

  const fetchReports = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/reports`);
      if (res.ok) {
        const data = await res.json();
        setReports(data.reports);
      }
    } catch {
      // Mock initial fallback if server is offline
      setReports([
        {
          _id: 'report_demo_01',
          reportType: 'inundation',
          title: 'Water overtopping Sangam Bridge low causeway',
          description: 'River water has reached 30cm over the pedestrian causeway. Current velocity is moderate.',
          location: { lat: 18.5314, lng: 73.8653, landmark: 'Sangam Bridge', district: 'Pune' },
          waterDepthCm: 30,
          trustStatus: 'verified',
          verifiedBy: 'Field Officer Patil (Volunteer Responder)',
          submittedBy: { userName: 'Anil Deshmukh', userRole: 'citizen' },
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          isDemo: true,
        },
        {
          _id: 'report_demo_02',
          reportType: 'embankment_breach',
          title: 'Erosion on right bank levee near Holkar Bridge',
          description: 'Minor scouring on earthen embankment after dam discharge. No houses inundated yet.',
          location: { lat: 19.9982, lng: 73.7912, landmark: 'Holkar Bridge Embankment', district: 'Nashik' },
          waterDepthCm: 0,
          trustStatus: 'corroborated',
          submittedBy: { userName: 'Sunita Gaikwad', userRole: 'citizen' },
          createdAt: new Date(Date.now() - 7200000).toISOString(),
          isDemo: true,
        },
      ]);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLat(Number(pos.coords.latitude.toFixed(4)));
          setLng(Number(pos.coords.longitude.toFixed(4)));
          setMsg({ type: 'success', text: 'GPS locked successfully!' });
        },
        () => {
          setMsg({ type: 'error', text: 'Could not access GPS. Using map coordinates.' });
        }
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMsg(null);

    const payload = {
      reportType,
      title,
      description,
      landmark: landmark || 'Local Sector',
      district,
      lat,
      lng,
      waterDepthCm: waterDepthCm !== '' ? Number(waterDepthCm) : 0,
    };

    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      const token = localStorage.getItem('bh_token');
      const res = await fetch(`${apiUrl}/reports/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setMsg({ type: 'success', text: 'Report added to ground verification queue!' });
        setTitle('');
        setDescription('');
        setLandmark('');
        setWaterDepthCm('');
        fetchReports();
      } else {
        const err = await res.json();
        setMsg({ type: 'error', text: err.error || 'Submission failed' });
      }
    } catch {
      // Local addition
      const mockReport: ReportItem = {
        _id: 'report_' + Date.now(),
        reportType,
        title,
        description,
        location: { lat, lng, landmark: landmark || 'Local Sector', district },
        waterDepthCm: waterDepthCm !== '' ? Number(waterDepthCm) : 0,
        trustStatus: user?.role === 'admin' || user?.role === 'volunteer' ? 'verified' : 'unverified',
        submittedBy: { userName: user?.name || 'Citizen', userRole: user?.role || 'citizen' },
        createdAt: new Date().toISOString(),
      };
      setReports([mockReport, ...reports]);
      setMsg({ type: 'success', text: 'Report added locally to verification feed.' });
      setTitle('');
      setDescription('');
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerify = async (reportId: string, trustStatus: 'corroborated' | 'verified') => {
    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      const token = localStorage.getItem('bh_token');
      await fetch(`${apiUrl}/reports/${reportId}/verify`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ trustStatus }),
      });
    } catch {}

    // Update local state
    setReports((prev) =>
      prev.map((r) =>
        r._id === reportId
          ? {
              ...r,
              trustStatus,
              verifiedBy: `${user?.name || 'Authorized Responder'} (${user?.role || 'volunteer'})`,
            }
          : r
      )
    );
  };

  const filteredReports = reports.filter((r) => {
    if (filterStatus === 'all') return true;
    return r.trustStatus === filterStatus;
  });

  return (
    <div className="min-h-screen bg-obsidian text-bone flex flex-col justify-between">
      <Navbar />

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6 flex-1">
        {/* Header */}
        <div className="pb-4 border-b border-graphite">
          <div className="inline-flex items-center gap-1.5 text-xs text-mint font-mono mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Volunteered Geographic Information (VGI) Pipeline</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-bone">
            Community Ground Verification Feed
          </h1>
          <p className="text-xs sm:text-sm text-ash">
            Submit on-the-ground hazard observations. Reports undergo automated GPS cluster deduplication and field verification by registered volunteers and emergency administrators.
          </p>
        </div>

        <StatutoryNotice />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Submission Form Column */}
          <div className="lg:col-span-5 glass-panel p-6 rounded-2xl border border-graphite space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-graphite">
              <h3 className="font-semibold text-sm text-bone flex items-center gap-2">
                <MapPin className="w-4 h-4 text-mint" /> Submit Ground Observation
              </h3>
              <span className="text-[11px] text-mint font-mono">Role: {user?.role || 'Citizen'}</span>
            </div>

            {msg && (
              <div
                className={`p-3 rounded-lg text-xs flex items-start gap-2 ${
                  msg.type === 'success'
                    ? 'bg-mint/10 border border-mint/40 text-mint'
                    : 'bg-rose-950/60 border border-rose-500/40 text-rose-300'
                }`}
              >
                {msg.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-mint flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                )}
                <span>{msg.text}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="text-ash font-medium">Hazard Incident Type</label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-carbon border border-graphite text-bone focus:border-mint focus:outline-none"
                >
                  <option value="inundation">Overland / Street Inundation</option>
                  <option value="embankment_breach">River Embankment Scour / Breach</option>
                  <option value="river_obstruction">Drainage Siltation / Culvert Blockage</option>
                  <option value="dry_well">Agricultural Borewell Failure (Drought)</option>
                  <option value="crop_wilting">Severe Crop Moisture Wilting</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-ash font-medium">Incident Summary</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Water overflowing causeway by 20cm"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-carbon border border-graphite text-bone focus:border-mint focus:outline-none placeholder:text-ash/40"
                />
              </div>

              <div className="space-y-1">
                <label className="text-ash font-medium">Detailed Observation</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Note water velocity, affected roads, or agricultural impacts..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-carbon border border-graphite text-bone focus:border-mint focus:outline-none placeholder:text-ash/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-ash font-medium">District</label>
                  <input
                    type="text"
                    required
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-carbon border border-graphite text-bone focus:border-mint focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-ash font-medium">Water Depth (cm, if flood)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 25"
                    value={waterDepthCm}
                    onChange={(e) => setWaterDepthCm(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-carbon border border-graphite text-bone focus:border-mint focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* GPS Coordinates & Lock */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-ash font-medium">Coordinates (Lat, Lng)</label>
                  <button
                    type="button"
                    onClick={handleGetLocation}
                    className="text-mint hover:underline flex items-center gap-1 text-[11px]"
                  >
                    <Navigation className="w-3 h-3" /> Use My GPS
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                  <input
                    type="number"
                    step="0.0001"
                    value={lat}
                    onChange={(e) => setLat(Number(e.target.value))}
                    className="px-2.5 py-1.5 rounded bg-carbon border border-graphite text-bone focus:border-mint focus:outline-none"
                  />
                  <input
                    type="number"
                    step="0.0001"
                    value={lng}
                    onChange={(e) => setLng(Number(e.target.value))}
                    className="px-2.5 py-1.5 rounded bg-carbon border border-graphite text-bone focus:border-mint focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 rounded-lg bg-mint text-obsidian font-bold hover:bg-mint/90 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(92,255,177,0.3)] disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submitting ? 'Submitting...' : 'Submit Ground Report'}</span>
              </button>
            </form>
          </div>

          {/* Verification Feed Column */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-graphite">
              <h3 className="font-semibold text-sm text-bone">
                Active Ground Reports ({filteredReports.length})
              </h3>

              {/* Status Filter */}
              <div className="flex rounded-lg bg-carbon border border-graphite p-0.5 text-xs">
                {['all', 'verified', 'corroborated', 'unverified'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setFilterStatus(st)}
                    className={`px-2.5 py-1 rounded capitalize transition-colors ${
                      filterStatus === st
                        ? 'bg-mint text-obsidian font-semibold'
                        : 'text-ash hover:text-mint'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {filteredReports.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center glass-panel rounded-2xl border border-graphite text-ash text-xs">
                No ground reports match the selected filter.
              </div>
            ) : (
              <div className="space-y-3">
                {filteredReports.map((r) => {
                  const isVerified = r.trustStatus === 'verified';
                  const isCorroborated = r.trustStatus === 'corroborated';
                  const canVerify = user?.role === 'admin' || user?.role === 'volunteer';

                  return (
                    <div
                      key={r._id}
                      className="glass-panel p-4 sm:p-5 rounded-xl border border-graphite space-y-3 hover:border-mint/40 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${
                                isVerified
                                  ? 'bg-mint/10 border-mint/40 text-mint'
                                  : isCorroborated
                                  ? 'bg-ember/10 border-ember/40 text-ember'
                                  : 'bg-carbon border-graphite text-ash'
                              }`}
                            >
                              {r.trustStatus}
                            </span>
                            <span className="text-[11px] font-mono text-mint uppercase">
                              {r.reportType.replace('_', ' ')}
                            </span>
                          </div>
                          <h4 className="font-semibold text-sm text-bone mt-1">{r.title}</h4>
                        </div>

                        {r.waterDepthCm !== undefined && r.waterDepthCm > 0 && (
                          <span className="font-mono text-xs font-semibold text-mint bg-carbon px-2 py-1 rounded border border-graphite">
                            {r.waterDepthCm} cm depth
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-ash leading-relaxed">{r.description}</p>

                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-graphite text-[11px] text-ash">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-mint" />
                          <span>
                            {r.location.district} ({r.location.lat.toFixed(3)}, {r.location.lng.toFixed(3)})
                          </span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(r.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </span>
                      </div>

                      {/* Volunteer/Admin verification actions */}
                      {canVerify && r.trustStatus === 'unverified' && (
                        <div className="pt-2 border-t border-graphite flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleVerify(r._id, 'corroborated')}
                            className="px-2.5 py-1 rounded bg-ember/10 border border-ember/30 text-ember text-xs hover:bg-ember/20"
                          >
                            Corroborate
                          </button>
                          <button
                            onClick={() => handleVerify(r._id, 'verified')}
                            className="px-2.5 py-1 rounded bg-mint/10 border border-mint/30 text-mint text-xs hover:bg-mint/20 font-semibold"
                          >
                            Mark Verified
                          </button>
                        </div>
                      )}

                      {r.verifiedBy && (
                        <div className="text-[10px] text-mint font-mono">
                          ✓ Verified by {r.verifiedBy}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
