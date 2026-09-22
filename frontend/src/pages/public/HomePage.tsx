import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { WORKSHOP_CONFIG } from '../../config/workshopConfig';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { formatCurrency } from '../../utils/formatters';
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
  Printer,
  Lock,
  ShieldCheck,
} from 'lucide-react';

interface BikeCategory {
  id: 'scooter' | 'commuter' | 'performance' | 'cruiser';
  label: string;
  sub: string;
  baseMultiplier: number;
}

interface ServiceTier {
  id: 'general' | 'express' | 'engine' | 'wash';
  name: string;
  tagline: string;
  baseLabor: number;
  duration: string;
  checklist: string[];
}

interface OilOption {
  id: 'semi' | 'synthetic' | 'race';
  name: string;
  grade: string;
  price: number;
}

const BIKE_CATEGORIES: BikeCategory[] = [
  { id: 'scooter', label: 'Scooter', sub: 'Activa, Jupiter, Access', baseMultiplier: 0.9 },
  { id: 'commuter', label: 'Commuter (100–125cc)', sub: 'Splendor, Shine, Platina', baseMultiplier: 1.0 },
  { id: 'performance', label: 'Performance (150–250cc)', sub: 'Pulsar, Apache, MT-15, Duke', baseMultiplier: 1.3 },
  { id: 'cruiser', label: 'Cruiser & RE (350cc+)', sub: 'Classic 350, Hunter, Himalayan', baseMultiplier: 1.6 },
];

const SERVICE_TIERS: ServiceTier[] = [
  {
    id: 'general',
    name: 'General Periodic Service',
    tagline: 'Complete mechanical checkup, engine oil flush, chain lube & wash.',
    baseLabor: 450,
    duration: '2 - 3 Hours',
    checklist: ['24-Point Safety Inspection', 'Engine Oil & Filter Change', 'Brake Adjustment & Cleaning', 'Chain Tension & Lube', 'Pressure Foam Wash'],
  },
  {
    id: 'express',
    name: 'Express Oil & Lube',
    tagline: 'Quick 30-minute pit stop for daily riders.',
    baseLabor: 250,
    duration: '30 Minutes',
    checklist: ['Engine Oil Flush', 'Air Filter Clean', 'Tire Pressure & Chain Lube', 'Brake Free-play Check'],
  },
  {
    id: 'engine',
    name: 'Engine Tuning & FI Diagnostics',
    tagline: 'Deep diagnostics for low mileage, tapping sounds, or power loss.',
    baseLabor: 850,
    duration: '1 Day',
    checklist: ['Tappet / Valve Clearance Tuning', 'Carburetor / Injector Clean', 'OBD-II Fault Scanner Check', 'Spark Plug Gap Calibration'],
  },
  {
    id: 'wash',
    name: 'Foam Wash & Polish',
    tagline: 'High-pressure snow foam wash with chain degrease and body polish.',
    baseLabor: 200,
    duration: '45 Minutes',
    checklist: ['Snow Foam Pressure Wash', 'Engine Bay Degreasing', 'Chain Scrub & Lube', 'Wax Gloss Polish'],
  },
];

const OIL_OPTIONS: OilOption[] = [
  { id: 'semi', name: 'Castrol Activ (Semi-Synthetic)', grade: '10W-30 / 20W-40', price: 380 },
  { id: 'synthetic', name: 'Motul 7100 (100% Fully Synthetic)', grade: '15W-50 / 10W-40', price: 750 },
  { id: 'race', name: 'Motul 300V (Race Grade)', grade: '15W-50 Ester', price: 1200 },
];

const SAMPLE_LOOKUP_RECORDS: Record<string, any> = {
  'JOB-2026-081': {
    jobId: 'JOB-2026-081',
    regNo: 'MH 02 AB 1234',
    customer: 'Rahul S.',
    vehicle: 'Royal Enfield Classic 350',
    service: 'General Periodic Service + Motul Synthetic Oil',
    status: 'IN_PROGRESS',
    paymentStatus: 'PENDING',
    stageNumber: 3,
    totalStages: 5,
    stageName: 'Engine Oil Flush & Tappet Valve Adjustment',
    assignedMechanic: 'Sunil Gaikwad (Master Mechanic)',
    intakeTime: 'Today, 09:30 AM',
    estimatedReadyTime: 'Today, 05:00 PM',
    replacedParts: [
      { name: 'Motul 7100 15W-50 (2.5L)', cost: 1850 },
      { name: 'Royal Enfield Genuine Oil Filter', cost: 165 },
      { name: 'Spark Plug Dual Set', cost: 320 },
    ],
    diagnosticNotes: 'Tappet clearance adjusted to factory spec (0.08mm). Brake pads in good health (~65%).',
  },
  'MH 02 AB 1234': {
    jobId: 'JOB-2026-081',
    regNo: 'MH 02 AB 1234',
    customer: 'Rahul S.',
    vehicle: 'Royal Enfield Classic 350',
    service: 'General Periodic Service + Motul Synthetic Oil',
    status: 'IN_PROGRESS',
    paymentStatus: 'PENDING',
    stageNumber: 3,
    totalStages: 5,
    stageName: 'Engine Oil Flush & Tappet Valve Adjustment',
    assignedMechanic: 'Sunil Gaikwad (Master Mechanic)',
    intakeTime: 'Today, 09:30 AM',
    estimatedReadyTime: 'Today, 05:00 PM',
    replacedParts: [
      { name: 'Motul 7100 15W-50 (2.5L)', cost: 1850 },
      { name: 'Royal Enfield Genuine Oil Filter', cost: 165 },
      { name: 'Spark Plug Dual Set', cost: 320 },
    ],
    diagnosticNotes: 'Tappet clearance adjusted to factory spec (0.08mm). Brake pads in good health (~65%).',
  },
  'MH 12 AB 1234': {
    jobId: 'JOB-2026-081',
    regNo: 'MH 12 AB 1234',
    customer: 'Rahul S.',
    vehicle: 'Royal Enfield Classic 350',
    service: 'General Periodic Service + Motul Synthetic Oil',
    status: 'IN_PROGRESS',
    paymentStatus: 'PENDING',
    stageNumber: 3,
    totalStages: 5,
    stageName: 'Engine Oil Flush & Tappet Valve Adjustment',
    assignedMechanic: 'Sunil Gaikwad (Master Mechanic)',
    intakeTime: 'Today, 09:30 AM',
    estimatedReadyTime: 'Today, 05:00 PM',
    replacedParts: [
      { name: 'Motul 7100 15W-50 (2.5L)', cost: 1850 },
      { name: 'Royal Enfield Genuine Oil Filter', cost: 165 },
      { name: 'Spark Plug Dual Set', cost: 320 },
    ],
    diagnosticNotes: 'Tappet clearance adjusted to factory spec (0.08mm). Brake pads in good health (~65%).',
  },
  'MH 02 CD 5678': {
    jobId: 'JOB-2026-080',
    regNo: 'MH 02 CD 5678',
    customer: 'Pooja P.',
    vehicle: 'Honda Activa 6G',
    service: 'Express Service & Rear Brake Shoe Replacement',
    status: 'READY',
    paymentStatus: 'PAID',
    stageNumber: 5,
    totalStages: 5,
    stageName: 'Inspection & Final Polish Complete — Ready for Pickup',
    assignedMechanic: 'Ramesh K.',
    intakeTime: 'Today, 11:15 AM',
    estimatedReadyTime: 'Ready for Collection',
    replacedParts: [
      { name: 'Castrol Activ 10W-30 Scooter Oil (800ml)', cost: 380 },
      { name: 'Honda Genuine Rear Brake Shoes', cost: 340 },
    ],
    diagnosticNotes: 'Brake cable adjusted and lubricated. Road tested and washed.',
  },
  'MH 14 CD 5678': {
    jobId: 'JOB-2026-080',
    regNo: 'MH 14 CD 5678',
    customer: 'Pooja P.',
    vehicle: 'Honda Activa 6G',
    service: 'Express Service & Rear Brake Shoe Replacement',
    status: 'READY',
    paymentStatus: 'PAID',
    stageNumber: 5,
    totalStages: 5,
    stageName: 'Inspection & Final Polish Complete — Ready for Pickup',
    assignedMechanic: 'Ramesh K.',
    intakeTime: 'Today, 11:15 AM',
    estimatedReadyTime: 'Ready for Collection',
    replacedParts: [
      { name: 'Castrol Activ 10W-30 Scooter Oil (800ml)', cost: 380 },
      { name: 'Honda Genuine Rear Brake Shoes', cost: 340 },
    ],
    diagnosticNotes: 'Brake cable adjusted and lubricated. Road tested and washed.',
  },
  'JOB-2026-080': {
    jobId: 'JOB-2026-080',
    regNo: 'MH 02 CD 5678',
    customer: 'Pooja P.',
    vehicle: 'Honda Activa 6G',
    service: 'Express Service & Rear Brake Shoe Replacement',
    status: 'READY',
    paymentStatus: 'PAID',
    stageNumber: 5,
    totalStages: 5,
    stageName: 'Inspection & Final Polish Complete — Ready for Pickup',
    assignedMechanic: 'Ramesh K.',
    intakeTime: 'Today, 11:15 AM',
    estimatedReadyTime: 'Ready for Collection',
    replacedParts: [
      { name: 'Castrol Activ 10W-30 Scooter Oil (800ml)', cost: 380 },
      { name: 'Honda Genuine Rear Brake Shoes', cost: 340 },
    ],
    diagnosticNotes: 'Brake cable adjusted and lubricated. Road tested and washed.',
  },
};

export const HomePage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Repair Tracker State (Starts clean and private)
  const [trackerQuery, setTrackerQuery] = useState('');
  const [activeJobData, setActiveJobData] = useState<any>(null);
  const [searchNotFound, setSearchNotFound] = useState<string | null>(null);

  // Digital Invoice State (Instant GST Invoice Access)
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [invoiceData, setInvoiceData] = useState<any>(null);

  // Estimator State
  const [selectedCategory, setSelectedCategory] = useState<'scooter' | 'commuter' | 'performance' | 'cruiser'>('cruiser');
  const [selectedTier, setSelectedTier] = useState<'general' | 'express' | 'engine' | 'wash'>('general');
  const [selectedOil, setSelectedOil] = useState<'semi' | 'synthetic' | 'race'>('synthetic');

  // Booking Modal State
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    name: '',
    phone: '',
    bikeModel: '',
    regNumber: '',
    service: 'General Periodic Service',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    slot: 'Morning (09:30 AM - 12:30 PM)',
  });

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = trackerQuery.trim().toUpperCase();
    if (!raw) return;

    // Normalize for flexible lookup (e.g. MH 02 AB 1234 or MH02AB1234)
    const normalized = raw.replace(/[^A-Z0-9]/g, '');
    
    // Check direct key or normalized match
    let found = SAMPLE_LOOKUP_RECORDS[raw];
    if (!found) {
      const matchKey = Object.keys(SAMPLE_LOOKUP_RECORDS).find(
        (k) => k.replace(/[^A-Z0-9]/g, '') === normalized
      );
      if (matchKey) {
        found = SAMPLE_LOOKUP_RECORDS[matchKey];
      }
    }

    if (found) {
      setActiveJobData(found);
      setSearchNotFound(null);
    } else {
      setActiveJobData(null);
      setSearchNotFound(raw);
    }
  };

  // Estimator Calculations
  const currentCategory = BIKE_CATEGORIES.find((c) => c.id === selectedCategory)!;
  const currentTier = SERVICE_TIERS.find((t) => t.id === selectedTier)!;
  const currentOil = OIL_OPTIONS.find((o) => o.id === selectedOil)!;

  const estimatedLabor = Math.round(currentTier.baseLabor * currentCategory.baseMultiplier);
  const estimatedOilPrice = currentTier.id === 'wash' ? 0 : currentOil.price;
  const estimatedConsumables = Math.round(100 * currentCategory.baseMultiplier);
  const subTotal = estimatedLabor + estimatedOilPrice + estimatedConsumables;
  const gstAmount = Math.round(subTotal * 0.18);
  const estimatedGrandTotal = subTotal + gstAmount;

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-orange-600 selection:text-white">
      
      {/* 1. Clean Top Bar */}
      <div className="bg-white border-b border-slate-200 py-2 px-4 text-xs text-slate-600">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-semibold text-slate-800">Workshop Open</span>
            <span>•</span>
            <span>Mon–Sat: 9:00 AM – 8:00 PM</span>
          </div>
          <div className="flex items-center gap-4">
            <a href={`tel:${WORKSHOP_CONFIG.contact.phone}`} className="font-semibold text-slate-800 hover:text-orange-600 transition-colors flex items-center gap-1">
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

      {/* 2. Clean Navigation */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-6xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-600 text-white font-bold shadow-xs">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-black tracking-tight uppercase text-slate-950 font-mono">
                S K <span className="text-orange-600">BIKE POINT</span>
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-slate-600">
            <a href="#services" className="hover:text-orange-600 transition-colors">Services</a>
            <a href="#tracker" className="hover:text-orange-600 transition-colors text-orange-600 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Live Repair Tracker
            </a>
            <a href="#estimator" className="hover:text-orange-600 transition-colors">Cost Estimator</a>
            <a href="#contact" className="hover:text-orange-600 transition-colors">Location</a>
          </nav>

          <div className="flex items-center gap-2.5">
            {isAuthenticated && user ? (
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate(user.role === 'ROLE_ADMIN' ? '/admin/dashboard' : '/customer/dashboard')}
                leftIcon={<ShieldCheck className="w-3.5 h-3.5" />}
              >
                Go to Admin Panel
              </Button>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="secondary" size="sm" leftIcon={<Lock className="w-3 h-3" />}>
                    Staff Login
                  </Button>
                </Link>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setBookingSubmitted(false);
                    setIsBookModalOpen(true);
                  }}
                  leftIcon={<Calendar className="w-3.5 h-3.5" />}
                >
                  Book Service
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 3. Minimalist Clean Hero Section */}
      <section className="pt-14 pb-12 sm:pt-16 sm:pb-16 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-bold">
            <MapPin className="w-3.5 h-3.5 text-orange-600" />
            <span>Two-Wheeler Workshop in {WORKSHOP_CONFIG.contact.city}, {WORKSHOP_CONFIG.contact.state}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight leading-[1.15]">
            Two-Wheeler Servicing, Genuine Spares & <span className="text-orange-600">Live Repair Tracking</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Professional servicing for motorcycles and scooters. Check your real-time job card status online, calculate service costs upfront, and get genuine parts guaranteed.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <a href="#tracker" className="w-full sm:w-auto">
              <Button variant="primary" size="lg" className="w-full" leftIcon={<Search className="w-4 h-4" />}>
                Track Bike Repair Status
              </Button>
            </a>
            <Button
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto"
              onClick={() => {
                setBookingSubmitted(false);
                setIsBookModalOpen(true);
              }}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Book Service Slot
            </Button>
          </div>
        </div>
      </section>

      {/* 4. Live Repair Tracker (Clean & Functional) */}
      <section id="tracker" className="py-12 bg-slate-50 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-6">
            <h2 className="text-xl sm:text-2xl font-black text-slate-950">Live Repair Tracker</h2>
            <p className="text-xs text-slate-600 mt-1">Enter your Vehicle Number or Job Card ID to see live stage and diagnostics</p>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <form onSubmit={handleLookup} className="flex flex-col sm:flex-row gap-2.5">
              <input
                type="text"
                value={trackerQuery}
                onChange={(e) => {
                  setTrackerQuery(e.target.value);
                  if (searchNotFound) setSearchNotFound(null);
                }}
                placeholder="Enter Vehicle Number (e.g. MH 02 AB 1234)"
                className="flex-1 rounded-xl bg-white border border-slate-300 px-4 py-2.5 text-sm text-slate-900 font-mono placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 uppercase"
              />
              <Button type="submit" variant="primary" size="md" leftIcon={<Search className="w-4 h-4" />}>
                Check Status
              </Button>
            </form>

            {/* Not Found Feedback */}
            {searchNotFound && (
              <div className="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                <p className="font-bold">No active service record found for &ldquo;{searchNotFound}&rdquo;</p>
                <p className="text-amber-700">
                  Please verify your vehicle registration number. If you just checked in your bike, please allow 10–15 minutes for intake logging, or call our workshop desk directly at{' '}
                  <a href={`tel:${WORKSHOP_CONFIG.contact.phone}`} className="font-bold underline hover:text-orange-600">
                    {WORKSHOP_CONFIG.contact.phone}
                  </a>.
                </p>
              </div>
            )}

            {/* Rendered Job Card Details */}
            {activeJobData && (
              <div className="mt-6 p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
                
                {/* Meta Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-orange-700">{activeJobData.jobId}</span>
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-800">
                        {activeJobData.regNo}
                      </span>
                      <StatusBadge status={activeJobData.status} />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mt-1">{activeJobData.vehicle}</h3>
                    <p className="text-xs text-slate-500">Customer: <strong className="text-slate-700">{activeJobData.customer}</strong> • Assigned: {activeJobData.assignedMechanic}</p>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Est. Delivery</span>
                    <span className="text-xs font-bold text-slate-900">{activeJobData.estimatedReadyTime}</span>
                  </div>
                </div>

                {/* Progress Bar & Stage */}
                <div>
                  <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                    <span className="text-slate-800 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-orange-600 animate-pulse" />
                      Stage: {activeJobData.stageName}
                    </span>
                    <span className="text-orange-600 font-mono">
                      Step {activeJobData.stageNumber} of {activeJobData.totalStages}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className="h-full bg-orange-600 rounded-full transition-all duration-300"
                      style={{ width: `${(activeJobData.stageNumber / activeJobData.totalStages) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Mechanic Note & Spares */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="p-3 rounded-lg bg-white border border-slate-200">
                    <span className="font-bold text-slate-700 block mb-1">Mechanic Diagnostic Notes</span>
                    <p className="text-slate-600 leading-relaxed">{activeJobData.diagnosticNotes}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-white border border-slate-200">
                    <span className="font-bold text-slate-700 block mb-1">Installed Spares & Fluids</span>
                    <div className="space-y-1">
                      {activeJobData.replacedParts.map((p: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between text-slate-600">
                          <span>{p.name}</span>
                          <span className="font-mono font-bold text-slate-900">₹{p.cost}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  {activeJobData.paymentStatus === 'PAID' ? (
                    <button
                      type="button"
                      onClick={() => {
                        setInvoiceData(activeJobData);
                        setIsInvoiceModalOpen(true);
                      }}
                      className="font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5 transition-colors py-1.5 px-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200"
                    >
                      <FileText className="w-3.5 h-3.5 text-emerald-600" />
                      <span>View & Print Paid GST Tax Invoice</span>
                      <span className="bg-emerald-200 text-emerald-900 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ml-1">
                        PAID RECEIPT
                      </span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setInvoiceData(activeJobData);
                        setIsInvoiceModalOpen(true);
                      }}
                      className="font-bold text-slate-700 hover:text-slate-900 flex items-center gap-1.5 transition-colors py-1.5 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200"
                    >
                      <FileText className="w-3.5 h-3.5 text-orange-600" />
                      <span>View Job Card & Cost Estimate</span>
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded ml-1">
                        Payment Due on Pickup
                      </span>
                    </button>
                  )}

                  <button onClick={() => setActiveJobData(null)} className="text-slate-400 hover:text-slate-600 font-medium self-end sm:self-auto">
                    Close
                  </button>
                </div>

              </div>
            )}
          </div>
        </div>
      </section>

      {/* 5. Clean Services Menu */}
      <section id="services" className="py-14 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-orange-600">Workshop Menu</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950 mt-1">Service & Repair Packages</h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">Transparent labor rates with no hidden add-ons</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {SERVICE_TIERS.map((s) => (
            <div
              key={s.id}
              className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-orange-300 hover:shadow-sm transition-all flex flex-col justify-between"
            >
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
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    setBookingForm((prev) => ({ ...prev, service: s.name }));
                    setBookingSubmitted(false);
                    setIsBookModalOpen(true);
                  }}
                >
                  Book Slot
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Clean Price Estimator */}
      <section id="estimator" className="py-14 bg-slate-100/70 border-y border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-orange-600">Quick Calculation</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-950 mt-1">Service Price Estimator</h2>
            <p className="text-xs text-slate-600 mt-1">Select your bike type and service to see upfront estimated cost</p>
          </div>

          <div className="rounded-2xl bg-white border border-slate-200 p-5 sm:p-7 shadow-xs space-y-6">
            
            {/* 1. Category */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                1. Select Two-Wheeler Type:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {BIKE_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedCategory === cat.id
                        ? 'bg-orange-50 border-orange-500 text-orange-950 ring-1 ring-orange-500'
                        : 'bg-slate-50 border-slate-200 text-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="font-bold text-xs">{cat.label}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{cat.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Service Tier */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                2. Select Service:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {SERVICE_TIERS.map((tier) => (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => setSelectedTier(tier.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedTier === tier.id
                        ? 'bg-orange-50 border-orange-500 text-orange-950 ring-1 ring-orange-500'
                        : 'bg-slate-50 border-slate-200 text-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="font-bold text-xs">{tier.name}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{tier.duration}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Engine Oil */}
            {selectedTier !== 'wash' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  3. Select Engine Oil Grade:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {OIL_OPTIONS.map((oil) => (
                    <button
                      key={oil.id}
                      type="button"
                      onClick={() => setSelectedOil(oil.id)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        selectedOil === oil.id
                          ? 'bg-orange-50 border-orange-500 text-orange-950 ring-1 ring-orange-500'
                          : 'bg-slate-50 border-slate-200 text-slate-800 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs">{oil.name}</span>
                        <span className="font-mono text-xs font-bold text-orange-600">+₹{oil.price}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">{oil.grade}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Price Box */}
            <div className="p-4 sm:p-5 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <span className="text-[11px] text-slate-400 uppercase font-semibold block">Approximate Estimated Total</span>
                <div className="flex items-baseline gap-2 mt-0.5 justify-center sm:justify-start">
                  <span className="text-2xl sm:text-3xl font-black text-orange-400 font-mono">
                    {formatCurrency(estimatedGrandTotal)}
                  </span>
                  <span className="text-[11px] text-slate-400 font-normal">
                    (Labor ₹{estimatedLabor} + Oil ₹{estimatedOilPrice} + Consumables & GST)
                  </span>
                </div>
              </div>

              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  setBookingForm((prev) => ({
                    ...prev,
                    service: `${currentTier.name} (${currentCategory.label})`,
                  }));
                  setBookingSubmitted(false);
                  setIsBookModalOpen(true);
                }}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Book with this Estimate
              </Button>
            </div>

          </div>
        </div>
      </section>

      {/* 7. Clean Footer & Contact Info */}
      <footer id="contact" className="border-t border-slate-200 bg-white pt-12 pb-8 text-slate-600">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-600 text-white font-bold">
                  <Wrench className="w-4 h-4" />
                </div>
                <span className="text-base font-black uppercase text-slate-950 font-mono">
                  {WORKSHOP_CONFIG.shopName}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Multi-brand motorcycle and scooter service center with computerized diagnostics and genuine spare parts.
              </p>
              <p className="text-xs text-slate-800 font-bold">
                Workshop Head: <span className="text-slate-950">{WORKSHOP_CONFIG.ownerName}</span>
              </p>
            </div>

            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Location & Hours</h4>
              <p className="text-xs text-slate-600 flex items-start gap-2">
                <MapPin className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                <span>{WORKSHOP_CONFIG.contact.fullAddress}</span>
              </p>
              <p className="text-xs text-slate-600 flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-600 shrink-0" />
                <span>{WORKSHOP_CONFIG.contact.timings}</span>
              </p>
              <p className="text-xs text-slate-600 flex items-center gap-2">
                <Phone className="w-4 h-4 text-orange-600 shrink-0" />
                <a href={`tel:${WORKSHOP_CONFIG.contact.phone}`} className="font-bold text-slate-900 hover:text-orange-600">
                  {WORKSHOP_CONFIG.contact.phone}
                </a>
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Workshop Staff & Admin</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Management desk for Sanjay Kumar Yadav & mechanics to update Job Cards, inventory stock, and invoices.
              </p>
              <div className="flex items-center gap-3">
                <Link to="/login">
                  <Button variant="secondary" size="sm" leftIcon={<Lock className="w-3.5 h-3.5" />}>
                    Staff Login Portal →
                  </Button>
                </Link>
              </div>
            </div>

          </div>

          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
            <p>© {new Date().getFullYear()} {WORKSHOP_CONFIG.shopName}. All rights reserved.</p>
            <p>Two-Wheeler Service & Repair Garage • {WORKSHOP_CONFIG.contact.city}</p>
          </div>
        </div>
      </footer>

      {/* 8. Clean Booking Modal */}
      <Modal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        title="Schedule Service Visit"
        description={`Direct slot confirmation at ${WORKSHOP_CONFIG.shopName}`}
      >
        {bookingSubmitted ? (
          <div className="py-6 text-center space-y-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Service Visit Requested!</h3>
            <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
              Thank you, <strong className="text-slate-900">{bookingForm.name || 'Customer'}</strong>! We have reserved your provisional slot for <strong className="text-orange-600">{bookingForm.bikeModel || 'your vehicle'}</strong> on <strong className="text-slate-900">{bookingForm.date}</strong> ({bookingForm.slot}).
            </p>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 font-mono">
              Booking Ref: <strong className="text-slate-900">APT-{Math.floor(1000 + Math.random() * 9000)}</strong>
            </div>
            <div className="pt-2 flex justify-center">
              <Button variant="primary" size="sm" onClick={() => setIsBookModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleBookingSubmit} className="space-y-3 pt-1">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Customer Name</label>
              <input
                type="text"
                placeholder="e.g. Rahul Sharma"
                required
                value={bookingForm.name}
                onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                className="w-full rounded-xl bg-white border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number</label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  required
                  value={bookingForm.phone}
                  onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                  className="w-full rounded-xl bg-white border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Bike Model</label>
                <input
                  type="text"
                  placeholder="e.g. Classic 350 / Activa 6G"
                  required
                  value={bookingForm.bikeModel}
                  onChange={(e) => setBookingForm({ ...bookingForm, bikeModel: e.target.value })}
                  className="w-full rounded-xl bg-white border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Date</label>
                <input
                  type="date"
                  value={bookingForm.date}
                  onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                  required
                  className="w-full rounded-xl bg-white border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Time Slot</label>
                <select
                  value={bookingForm.slot}
                  onChange={(e) => setBookingForm({ ...bookingForm, slot: e.target.value })}
                  className="w-full rounded-xl bg-white border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                >
                  <option>Morning (09:30 AM - 12:30 PM)</option>
                  <option>Afternoon (01:00 PM - 04:00 PM)</option>
                  <option>Evening (04:30 PM - 07:30 PM)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <Button variant="secondary" type="button" size="sm" onClick={() => setIsBookModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" size="sm">
                Confirm Booking
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* 9. GST Tax Invoice & Bill Download Modal */}
      <Modal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        title={invoiceData?.paymentStatus === 'PAID' ? 'Official GST Tax Invoice' : 'Workshop Job Card & Cost Estimate'}
        description={
          invoiceData?.paymentStatus === 'PAID'
            ? 'Official GST-compliant service bill & digital receipt (Paid)'
            : 'Provisional estimate — Official GST Tax Invoice is issued once payment is settled at the workshop desk'
        }
        size="lg"
      >
        {invoiceData && (() => {
          const isPaid = invoiceData.paymentStatus === 'PAID';
          const partsTotal = (invoiceData.replacedParts || []).reduce((acc: number, p: any) => acc + (p.cost || 0), 0);
          const laborTotal = 450;
          const subtotal = partsTotal + laborTotal;
          const cgst = Math.round(subtotal * 0.09);
          const sgst = Math.round(subtotal * 0.09);
          const grandTotal = subtotal + cgst + sgst;
          const invoiceNumber = `SKB-INV-${invoiceData.jobId.replace(/[^0-9]/g, '') || '2026-081'}`;

          return (
            <div className="space-y-4">
              {/* Printable Invoice Container */}
              <div id="printable-gst-invoice" className="p-5 sm:p-6 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs shadow-xs space-y-4 font-sans">
                
                {/* Header with Workshop GST Details */}
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4 pb-4 border-b-2 border-slate-900">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-600 text-white font-bold">
                        <Wrench className="w-4 h-4" />
                      </div>
                      <span className="text-base font-black uppercase text-slate-950 font-mono tracking-tight">
                        {WORKSHOP_CONFIG.shopName}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium mt-1">Multi-Brand Two Wheeler Workshop & Genuine Spares</p>
                    <p className="text-[11px] text-slate-600 max-w-sm mt-0.5 leading-relaxed">{WORKSHOP_CONFIG.contact.fullAddress}</p>
                    <p className="text-[11px] text-slate-700 font-bold mt-1">Phone: {WORKSHOP_CONFIG.contact.phone}</p>
                  </div>

                  <div className="text-left sm:text-right space-y-1">
                    {isPaid ? (
                      <span className="inline-block px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-900 font-mono text-xs font-black uppercase border border-emerald-300">
                        ✓ PAID TAX INVOICE
                      </span>
                    ) : (
                      <span className="inline-block px-2.5 py-0.5 rounded bg-amber-100 text-amber-900 font-mono text-xs font-black uppercase border border-amber-300">
                        PROVISIONAL ESTIMATE (UNPAID)
                      </span>
                    )}
                    <p className="font-mono text-xs font-bold text-slate-950 mt-1">
                      {isPaid ? `Invoice: ${invoiceNumber}` : `Doc: EST-${invoiceData.jobId}`}
                    </p>
                    <p className="text-[11px] text-slate-600">Job Card: <strong>{invoiceData.jobId}</strong></p>
                    <p className="text-[11px] text-slate-600">Date: <strong>{new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</strong></p>
                    <p className="text-[10px] text-slate-500 font-mono">GSTIN: 27AABCS1429B1Z8 (MH)</p>
                  </div>
                </div>

                {/* Customer & Bike Info Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Vehicle Reg No</span>
                    <span className="font-mono font-bold text-slate-950 text-sm">{invoiceData.regNo}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Vehicle Model</span>
                    <span className="font-bold text-slate-800">{invoiceData.vehicle}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Customer</span>
                    <span className="font-bold text-slate-800">{invoiceData.customer}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Lead Mechanic</span>
                    <span className="font-bold text-slate-800">{invoiceData.assignedMechanic}</span>
                  </div>
                </div>

                {/* Itemized Parts & Labor Table */}
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-[11px]">
                      <tr>
                        <th className="py-2 px-3">#</th>
                        <th className="py-2 px-3">Item / Service Description</th>
                        <th className="py-2 px-3 text-center">HSN/SAC</th>
                        <th className="py-2 px-3 text-center">Qty</th>
                        <th className="py-2 px-3 text-right">Amount (₹)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(invoiceData.replacedParts || []).map((part: any, idx: number) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="py-2 px-3 font-mono text-slate-400">{idx + 1}</td>
                          <td className="py-2 px-3 font-medium text-slate-900">{part.name}</td>
                          <td className="py-2 px-3 text-center font-mono text-slate-500 text-[11px]">2710 / 8714</td>
                          <td className="py-2 px-3 text-center font-mono">1</td>
                          <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">{formatCurrency(part.cost)}</td>
                        </tr>
                      ))}
                      <tr className="hover:bg-slate-50/50">
                        <td className="py-2 px-3 font-mono text-slate-400">{(invoiceData.replacedParts || []).length + 1}</td>
                        <td className="py-2 px-3 font-medium text-slate-900">
                          General Workshop Service Labor, 24-Pt Check & Tuning
                        </td>
                        <td className="py-2 px-3 text-center font-mono text-slate-500 text-[11px]">998729</td>
                        <td className="py-2 px-3 text-center font-mono">1</td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">{formatCurrency(laborTotal)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Calculation & Tax Summary */}
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4 pt-2">
                  <div className="space-y-1.5 text-[11px] text-slate-600 max-w-xs">
                    {isPaid ? (
                      <div className="flex items-center gap-1.5 text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200">
                        <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                        <span>Payment Status: PAID IN FULL (UPI / Cash)</span>
                      </div>
                    ) : (
                      <div className="space-y-1 p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900">
                        <div className="flex items-center gap-1.5 font-bold text-[11px]">
                          <Clock className="w-3.5 h-3.5 text-amber-700" />
                          <span>Payment Status: PENDING ON PICKUP</span>
                        </div>
                        <p className="text-[10px] text-amber-800 leading-normal">
                          Pay when collecting your bike from the workshop. Official GST Tax Invoice will be finalized and stamped upon payment settlement.
                        </p>
                      </div>
                    )}
                    <p className="text-[10px] text-slate-500 pt-1">
                      * 30 Days / 1,000 km workshop warranty on service labor. Genuine OEM replacement parts guaranteed.
                    </p>
                  </div>

                  <div className="w-full sm:w-64 space-y-1 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Parts & Labor Subtotal:</span>
                      <span className="font-mono font-bold">{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-slate-500 text-[11px]">
                      <span>CGST (9%):</span>
                      <span className="font-mono font-medium">{formatCurrency(cgst)}</span>
                    </div>
                    <div className="flex justify-between text-slate-500 text-[11px]">
                      <span>SGST (9%):</span>
                      <span className="font-mono font-medium">{formatCurrency(sgst)}</span>
                    </div>
                    <div className="flex justify-between text-slate-950 font-black text-sm pt-1.5 border-t border-slate-300">
                      <span>{isPaid ? 'Total Paid Amount:' : 'Estimated Total Due:'}</span>
                      <span className="font-mono text-orange-600 text-base">{formatCurrency(grandTotal)}</span>
                    </div>
                  </div>
                </div>

                {/* Signatory & Stamp Footer */}
                <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                  <div>
                    <span>Authorized Signatory: </span>
                    <strong className="text-slate-900">{WORKSHOP_CONFIG.ownerName}</strong>
                  </div>
                  <div className="text-right">
                    <span className="italic">S K Bike Point • Andheri West, Mumbai</span>
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsInvoiceModalOpen(false)}
                >
                  Close
                </Button>

                <div className="flex items-center gap-2">
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(
                      `*S K BIKE POINT - ${isPaid ? 'GST Service Invoice (PAID)' : 'Job Card & Estimate'}*\nVehicle: ${invoiceData.regNo} (${invoiceData.vehicle})\nJob Card: ${invoiceData.jobId}\nTotal: ${formatCurrency(grandTotal)}\nStatus: ${isPaid ? 'Paid & Ready for Collection' : 'In Progress (Payment on Pickup)'}\nWorkshop: +91 98699 04097`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="secondary" size="sm" leftIcon={<MessageCircle className="w-3.5 h-3.5 text-emerald-600" />}>
                      Share on WhatsApp
                    </Button>
                  </a>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => window.print()}
                    leftIcon={<Printer className="w-3.5 h-3.5" />}
                  >
                    {isPaid ? 'Print Paid Invoice (PDF)' : 'Print Estimate'}
                  </Button>
                </div>
              </div>
            </div>
          );
        })()}
      </Modal>

    </div>
  );
};
