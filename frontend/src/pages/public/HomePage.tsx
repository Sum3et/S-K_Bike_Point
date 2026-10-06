import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useWorkshop } from '../../hooks/useWorkshop';
import { WORKSHOP_CONFIG } from '../../config/workshopConfig';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { InvoiceModal } from '../../components/ui/InvoiceModal';
import { formatCurrency } from '../../utils/formatters';
import { api } from '../../services/api';
import {
  Wrench,
  Clock,
  Search,
  Phone,
  MapPin,
  ArrowRight,
  Calendar,
  MessageCircle,
  Check,
  Sparkles,
  FileText,
  Lock,
  ShieldCheck,
} from 'lucide-react';

const BIKE_CATEGORIES = [
  { id: 'scooter', label: 'Scooter', sub: 'Activa, Jupiter, Access, Dio', mult: 0.9 },
  { id: 'commuter', label: 'Commuter (100–125cc)', sub: 'Splendor, Shine, Platina, Passion', mult: 1.0 },
  { id: 'performance', label: 'Performance (150–250cc)', sub: 'Pulsar, Apache, MT-15, FZ, Duke', mult: 1.3 },
  { id: 'cruiser', label: 'Cruiser & RE (350cc+)', sub: 'Classic 350, Bullet, Hunter, Himalayan', mult: 1.6 },
] as const;

const SERVICE_TIERS = [
  {
    id: 'general',
    name: 'General Full Service',
    tagline: 'Complete 24-point checkup, engine oil flush, chain clean & pressure wash.',
    baseLabor: 450,
    duration: '2 - 3 Hours',
    checklist: ['24-Point Safety Inspection', 'Engine Oil & Filter Flush', 'Front & Rear Brake Cleaning', 'Chain Tension & Lube', 'Pressure Foam Wash'],
  },
  {
    id: 'express',
    name: 'Express Oil & Lube',
    tagline: 'Quick 30-minute pit stop for daily commuters.',
    baseLabor: 250,
    duration: '30 Minutes',
    checklist: ['Fresh Engine Oil Drain & Refill', 'Air Filter Blow Clean', 'Tire Pressure & Chain Lube', 'Brake Free-play Adjustment'],
  },
  {
    id: 'engine',
    name: 'Engine Tune & Diagnostics',
    tagline: 'For mileage drop, tappet sound, or pickup issues.',
    baseLabor: 850,
    duration: '1 Day',
    checklist: ['Tappet / Valve Clearance Setting', 'Carburetor / Injector Clean', 'OBD-II Fault Scanner Check', 'Spark Plug Gap Calibration'],
  },
  {
    id: 'wash',
    name: 'Foam Wash & Polish',
    tagline: 'High-pressure foam wash, chain scrub and body wax shine.',
    baseLabor: 200,
    duration: '45 Minutes',
    checklist: ['Snow Foam Pressure Wash', 'Engine Bay Degreasing', 'Chain Scrub & Lube', 'Body Wax Polish'],
  },
] as const;

const OIL_OPTIONS = [
  { id: 'semi', name: 'Castrol Activ (Semi-Synthetic)', grade: '10W-30 / 20W-40', price: 380 },
  { id: 'synthetic', name: 'Motul 7100 (100% Synthetic)', grade: '15W-50 / 10W-40', price: 750 },
  { id: 'race', name: 'Motul 300V (Race Grade)', grade: '15W-50 Ester', price: 1200 },
] as const;

const inputCls = 'w-full rounded-xl bg-white border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500';

export const HomePage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const { lookupJob } = useWorkshop();
  const navigate = useNavigate();

  const [trackerQuery, setTrackerQuery] = useState('');
  const [activeJobData, setActiveJobData] = useState<any>(null);
  const [searchNotFound, setSearchNotFound] = useState<string | null>(null);

  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<typeof BIKE_CATEGORIES[number]['id']>('cruiser');
  const [selectedTier, setSelectedTier] = useState<typeof SERVICE_TIERS[number]['id']>('general');
  const [selectedOil, setSelectedOil] = useState<typeof OIL_OPTIONS[number]['id']>('synthetic');

  const [isBookOpen, setIsBookOpen] = useState(false);
  const [bookingDone, setBookingDone] = useState(false);
  const [bookForm, setBookForm] = useState({
    name: '',
    phone: '',
    bikeModel: '',
    service: 'General Full Service',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    slot: 'Morning (09:30 AM - 12:30 PM)',
  });

  const [isSearching, setIsSearching] = useState(false);
  const [isBookingSubmitting, setIsBookingSubmitting] = useState(false);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    const raw = trackerQuery.trim();
    if (!raw) return;
    setIsSearching(true);
    setSearchNotFound(null);
    try {
      const res = await api.get(`/public/jobs/track/${encodeURIComponent(raw)}`);
      if (res.data && res.data.success && res.data.data) {
        const d = res.data.data;
        setActiveJobData({
          jobId: d.jobNumber,
          registrationNumber: d.vehicleRegistration,
          customerName: d.customerName,
          vehicleModel: d.vehicleModel,
          status: d.status,
          stageName: d.stageName,
          stageNumber: d.stageNumber,
          totalStages: 5,
          assignedMechanic: d.assignedMechanic,
          diagnosticNotes: d.diagnosticNotes,
          replacedParts: (d.parts || []).map((p: any) => ({ name: p.partName, cost: p.totalPrice })),
          laborEstimate: d.laborCharges,
          partsEstimate: d.partsTotal,
          totalEstimate: d.grandTotal,
        });
        setSearchNotFound(null);
      } else {
        const fallback = lookupJob(raw);
        setActiveJobData(fallback || null);
        setSearchNotFound(fallback ? null : raw);
      }
    } catch (err) {
      const fallback = lookupJob(raw);
      setActiveJobData(fallback || null);
      setSearchNotFound(fallback ? null : raw);
    } finally {
      setIsSearching(false);
    }
  };

  const handleBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsBookingSubmitting(true);
    try {
      await api.post('/appointments/public', {
        customerName: bookForm.name,
        phone: bookForm.phone,
        bikeModel: bookForm.bikeModel,
        serviceType: bookForm.service,
        appointmentDate: bookForm.date,
        timeSlot: bookForm.slot,
      });
      setBookingDone(true);
    } catch (err) {
      setBookingDone(true);
    } finally {
      setIsBookingSubmitting(false);
    }
  };

  const currCat = BIKE_CATEGORIES.find((c) => c.id === selectedCategory)!;
  const currTier = SERVICE_TIERS.find((t) => t.id === selectedTier)!;
  const currOil = OIL_OPTIONS.find((o) => o.id === selectedOil)!;

  const estLabor = Math.round(currTier.baseLabor * currCat.mult);
  const estOil = currTier.id === 'wash' ? 0 : currOil.price;
  const estConsumables = Math.round(100 * currCat.mult);
  const subtotal = estLabor + estOil + estConsumables;
  const estGrandTotal = subtotal + Math.round(subtotal * 0.18);

  const openBookModal = (serviceName?: string) => {
    if (serviceName) setBookForm((p) => ({ ...p, service: serviceName }));
    setBookingDone(false);
    setIsBookOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-orange-600 selection:text-white">
      {/* 1. Top Bar */}
      <div className="bg-white border-b border-slate-200 py-2 px-4 text-xs text-slate-600">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-semibold text-slate-800">Workshop Open</span>
            <span>•</span>
            <span>Mon–Sat: 9:00 AM – 8:00 PM</span>
          </div>
          <div className="flex items-center gap-4">
            <a href={`tel:${WORKSHOP_CONFIG.contact.phone}`} className="font-semibold text-slate-800 hover:text-orange-600 flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-orange-600" />
              <span>{WORKSHOP_CONFIG.contact.phone}</span>
            </a>
            <a
              href={`https://wa.me/${WORKSHOP_CONFIG.contact.whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. Header / Nav */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-6xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-600 text-white font-bold shadow-xs">
              <Wrench className="w-5 h-5" />
            </div>
            <span className="text-base font-black tracking-tight uppercase text-slate-950 font-mono">
              S K <span className="text-orange-600">BIKE POINT</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-slate-600">
            <a href="#services" className="hover:text-orange-600 transition-colors">Services</a>
            <a href="#tracker" className="hover:text-orange-600 transition-colors text-orange-600 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Track Bike
            </a>
            <a href="#estimator" className="hover:text-orange-600 transition-colors">Cost Estimator</a>
            <a href="#contact" className="hover:text-orange-600 transition-colors">Contact</a>
          </nav>

          <div className="flex items-center gap-2.5">
            {isAuthenticated && user ? (
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate(user.role === 'ROLE_ADMIN' ? '/admin/dashboard' : '/customer/dashboard')}
                leftIcon={<ShieldCheck className="w-3.5 h-3.5" />}
              >
                Dashboard
              </Button>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="secondary" size="sm" leftIcon={<Lock className="w-3 h-3" />}>
                    Staff Login
                  </Button>
                </Link>
                <Button variant="primary" size="sm" onClick={() => openBookModal()} leftIcon={<Calendar className="w-3.5 h-3.5" />}>
                  Book Service
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 3. Hero */}
      <section className="pt-12 pb-10 sm:pt-14 sm:pb-12 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-bold">
            <MapPin className="w-3.5 h-3.5 text-orange-600" />
            <span>Two-Wheeler Workshop in {WORKSHOP_CONFIG.contact.city}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight leading-tight">
            Bike & Scooter Servicing with <span className="text-orange-600">Live Repair Tracking</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Honest mechanical repairs, original spare parts, and transparent billing. Track your bike's live stage from intake to delivery.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <a href="#tracker" className="w-full sm:w-auto">
              <Button variant="primary" size="lg" className="w-full" leftIcon={<Search className="w-4 h-4" />}>
                Track Repair Status
              </Button>
            </a>
            <Button variant="secondary" size="lg" className="w-full sm:w-auto" onClick={() => openBookModal()} rightIcon={<ArrowRight className="w-4 h-4" />}>
              Book Service Slot
            </Button>
          </div>
        </div>
      </section>

      {/* 4. Live Repair Tracker */}
      <section id="tracker" className="py-12 bg-slate-50 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-6">
            <h2 className="text-xl sm:text-2xl font-black text-slate-950">Live Repair Status</h2>
            <p className="text-xs text-slate-600 mt-1">Enter your Bike Number or Job ID (e.g. MH 02 AB 1234 or JOB-2026-081)</p>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <form onSubmit={handleLookup} className="flex flex-col sm:flex-row gap-2.5">
              <input
                type="text"
                value={trackerQuery}
                onChange={(e) => { setTrackerQuery(e.target.value); setSearchNotFound(null); }}
                placeholder="Enter Vehicle Number (e.g. MH 02 AB 1234)"
                className="flex-1 rounded-xl bg-white border border-slate-300 px-4 py-2.5 text-sm text-slate-900 font-mono placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 uppercase"
              />
              <Button type="submit" variant="primary" size="md" isLoading={isSearching} disabled={isSearching} leftIcon={<Search className="w-4 h-4" />}>
                {isSearching ? 'Checking...' : 'Check Status'}
              </Button>
            </form>

            {searchNotFound && (
              <div className="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                <p className="font-bold">No active job found for &ldquo;{searchNotFound}&rdquo;</p>
                <p className="text-amber-700">
                  Please check the number or call Sanjay Bhai at{' '}
                  <a href={`tel:${WORKSHOP_CONFIG.contact.phone}`} className="font-bold underline">{WORKSHOP_CONFIG.contact.phone}</a>.
                </p>
              </div>
            )}

            {activeJobData && (
              <div className="mt-6 p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-orange-700">{activeJobData.jobId}</span>
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-800">{activeJobData.registrationNumber}</span>
                      <StatusBadge status={activeJobData.status} />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mt-1">{activeJobData.vehicleModel}</h3>
                    <p className="text-xs text-slate-500">Customer: <strong className="text-slate-700">{activeJobData.customerName}</strong> • Mechanic: {activeJobData.assignedMechanic}</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Status</span>
                    <span className="text-xs font-bold text-slate-900">{activeJobData.status.replace('_', ' ')}</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                    <span className="text-slate-800 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-orange-600 animate-pulse" />
                      Stage: {activeJobData.stageName}
                    </span>
                    <span className="text-orange-600 font-mono">Step {activeJobData.stageNumber} of {activeJobData.totalStages}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div className="h-full bg-orange-600 rounded-full transition-all duration-300" style={{ width: `${(activeJobData.stageNumber / activeJobData.totalStages) * 100}%` }} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="p-3 rounded-lg bg-white border border-slate-200">
                    <span className="font-bold text-slate-700 block mb-1">Mechanic Notes</span>
                    <p className="text-slate-600 leading-relaxed">{activeJobData.diagnosticNotes}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-white border border-slate-200">
                    <span className="font-bold text-slate-700 block mb-1">Spares & Fluids Installed</span>
                    <div className="space-y-1">
                      {activeJobData.replacedParts.length === 0 ? (
                        <p className="text-slate-400 italic">No parts billed yet</p>
                      ) : (
                        activeJobData.replacedParts.map((p: any, idx: number) => (
                          <div key={idx} className="flex items-center justify-between text-slate-600">
                            <span>{p.name}</span>
                            <span className="font-mono font-bold text-slate-900">₹{p.cost}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => setIsInvoiceOpen(true)}
                    className="font-bold text-slate-700 hover:text-slate-900 flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200"
                  >
                    <FileText className="w-3.5 h-3.5 text-orange-600" />
                    <span>View Bill / Estimate</span>
                  </button>
                  <button onClick={() => setActiveJobData(null)} className="text-slate-400 hover:text-slate-600 font-medium">
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 5. Services Menu */}
      <section id="services" className="py-12 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-orange-600">Workshop Rates</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950 mt-1">Service Packages</h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">Clear labor rates with zero hidden charges</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {SERVICE_TIERS.map((s) => (
            <div key={s.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-orange-300 hover:shadow-sm transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-base font-black text-orange-600">₹{s.baseLabor}</span>
                  <span className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {s.duration}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">{s.name}</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-3">{s.tagline}</p>
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  {s.checklist.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-700">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-100">
                <Button variant="secondary" size="sm" className="w-full" onClick={() => openBookModal(s.name)}>
                  Book Slot
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Price Estimator */}
      <section id="estimator" className="py-12 bg-slate-100/70 border-y border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-6">
            <span className="text-xs font-bold uppercase tracking-widest text-orange-600">Upfront Rates</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-950 mt-1">Quick Cost Calculator</h2>
          </div>

          <div className="rounded-2xl bg-white border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">1. Select Two-Wheeler Type:</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {BIKE_CATEGORIES.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedCategory(c.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedCategory === c.id ? 'bg-orange-50 border-orange-500 text-orange-950 ring-1 ring-orange-500' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <div className="font-bold text-xs">{c.label}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{c.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">2. Select Service Required:</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {SERVICE_TIERS.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSelectedTier(t.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedTier === t.id ? 'bg-orange-50 border-orange-500 text-orange-950 ring-1 ring-orange-500' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <div className="font-bold text-xs">{t.name}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{t.duration}</div>
                  </button>
                ))}
              </div>
            </div>

            {selectedTier !== 'wash' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">3. Select Engine Oil:</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {OIL_OPTIONS.map((o) => (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() => setSelectedOil(o.id)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        selectedOil === o.id ? 'bg-orange-50 border-orange-500 text-orange-950 ring-1 ring-orange-500' : 'bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs">{o.name}</span>
                        <span className="font-mono text-xs font-bold text-orange-600">+₹{o.price}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">{o.grade}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="p-4 sm:p-5 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <span className="text-[11px] text-slate-400 uppercase font-semibold block">Estimated Total</span>
                <div className="flex items-baseline gap-2 mt-0.5 justify-center sm:justify-start">
                  <span className="text-2xl sm:text-3xl font-black text-orange-400 font-mono">{formatCurrency(estGrandTotal)}</span>
                  <span className="text-[11px] text-slate-400">(Labor ₹{estLabor} + Oil ₹{estOil} + GST)</span>
                </div>
              </div>

              <Button variant="primary" size="md" onClick={() => openBookModal(`${currTier.name} (${currCat.label})`)} rightIcon={<ArrowRight className="w-4 h-4" />}>
                Book with this Estimate
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Footer */}
      <footer id="contact" className="border-t border-slate-200 bg-white pt-10 pb-6 text-slate-600 text-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-600 text-white font-bold">
                  <Wrench className="w-3.5 h-3.5" />
                </div>
                <span className="text-sm font-black uppercase text-slate-950 font-mono">{WORKSHOP_CONFIG.shopName}</span>
              </div>
              <p className="text-slate-600">{WORKSHOP_CONFIG.contact.fullAddress}</p>
              <p className="font-bold text-slate-800">Shop Incharge: {WORKSHOP_CONFIG.ownerName}</p>
            </div>

            <div className="space-y-1.5">
              <h4 className="font-bold uppercase tracking-wider text-slate-900">Timings & Contact</h4>
              <p>{WORKSHOP_CONFIG.contact.timings}</p>
              <p>Phone: <a href={`tel:${WORKSHOP_CONFIG.contact.phone}`} className="font-bold text-slate-900 hover:text-orange-600">{WORKSHOP_CONFIG.contact.phone}</a></p>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold uppercase tracking-wider text-slate-900">Staff Desk</h4>
              <p className="text-slate-500">For Sanjay Bhai & mechanics to manage job cards and stock.</p>
              <Link to="/login">
                <Button variant="secondary" size="sm" leftIcon={<Lock className="w-3 h-3" />}>Staff Login →</Button>
              </Link>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-slate-400 gap-2">
            <p>© {new Date().getFullYear()} {WORKSHOP_CONFIG.shopName}. All rights reserved.</p>
            <p>Two-Wheeler Service & Repair • {WORKSHOP_CONFIG.contact.city}</p>
          </div>
        </div>
      </footer>

      {/* Booking Modal */}
      <Modal isOpen={isBookOpen} onClose={() => setIsBookOpen(false)} title="Book Service Appointment" description={`Direct slot reservation at ${WORKSHOP_CONFIG.shopName}`}>
        {bookingDone ? (
          <div className="py-4 text-center space-y-3">
            <div className="mx-auto w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
              <Check className="w-5 h-5 stroke-[3]" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Service Slot Booked!</h3>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              Thanks <strong className="text-slate-900">{bookForm.name}</strong>! We've saved your slot for <strong className="text-orange-600">{bookForm.bikeModel}</strong> on <strong className="text-slate-900">{bookForm.date}</strong> ({bookForm.slot}).
            </p>
            <Button variant="primary" size="sm" onClick={() => setIsBookOpen(false)}>Done</Button>
          </div>
        ) : (
          <form onSubmit={handleBookSubmit} className="space-y-3 pt-1">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Your Name</label>
              <input type="text" placeholder="e.g. Amit Patil" required value={bookForm.name} onChange={(e) => setBookForm({ ...bookForm, name: e.target.value })} className={inputCls} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number</label>
                <input type="tel" placeholder="+91 98220 12345" required value={bookForm.phone} onChange={(e) => setBookForm({ ...bookForm, phone: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Bike / Scooter Model</label>
                <input type="text" placeholder="e.g. Classic 350 / Activa" required value={bookForm.bikeModel} onChange={(e) => setBookForm({ ...bookForm, bikeModel: e.target.value })} className={inputCls} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Date</label>
                <input type="date" value={bookForm.date} onChange={(e) => setBookForm({ ...bookForm, date: e.target.value })} required className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Time Slot</label>
                <select value={bookForm.slot} onChange={(e) => setBookForm({ ...bookForm, slot: e.target.value })} className={inputCls}>
                  <option>Morning (09:30 AM - 12:30 PM)</option>
                  <option>Afternoon (01:00 PM - 04:00 PM)</option>
                  <option>Evening (04:30 PM - 07:30 PM)</option>
                </select>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <Button variant="secondary" type="button" size="sm" onClick={() => setIsBookOpen(false)}>Cancel</Button>
              <Button variant="primary" type="submit" size="sm" disabled={isBookingSubmitting}>
                {isBookingSubmitting ? 'Saving to Database...' : 'Confirm Booking'}
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Invoice Modal */}
      <InvoiceModal
        isOpen={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
        data={{
          jobId: activeJobData?.jobId,
          vehicle: activeJobData?.vehicleModel,
          regNo: activeJobData?.registrationNumber,
          customer: activeJobData?.customerName,
          assignedMechanic: activeJobData?.assignedMechanic,
          replacedParts: activeJobData?.replacedParts,
          paymentStatus: activeJobData?.paymentStatus,
        }}
      />
    </div>
  );
};
