import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { formatMileage, formatDate } from '../../utils/formatters';
import { Bike, PlusCircle, Calendar, ShieldCheck } from 'lucide-react';

interface VehicleItem {
  id: number;
  make: string;
  model: string;
  year: string;
  registrationNumber: string;
  mileageKm: number;
  lastServiceDate: string;
  status: 'ACTIVE' | 'IN_SERVICE';
  engineNo: string;
  fuelType: string;
}

const INITIAL_VEHICLES: VehicleItem[] = [
  {
    id: 1,
    make: 'Royal Enfield',
    model: 'Classic 350',
    year: '2023',
    registrationNumber: 'MH 02 AB 1234',
    mileageKm: 8450,
    lastServiceDate: '2026-09-29',
    status: 'IN_SERVICE',
    engineNo: 'J350-98214',
    fuelType: 'Petrol (FI)',
  },
  {
    id: 2,
    make: 'Honda',
    model: 'Activa 6G',
    year: '2022',
    registrationNumber: 'MH 02 CD 5678',
    mileageKm: 14200,
    lastServiceDate: '2026-08-14',
    status: 'ACTIVE',
    engineNo: 'JF91E-10492',
    fuelType: 'Petrol',
  },
];

const inputCls = 'w-full rounded-xl bg-white border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500';

export const CustomerVehiclesPage: React.FC = () => {
  const [vehicles, setVehicles] = useState<VehicleItem[]>(INITIAL_VEHICLES);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleItem | null>(null);

  const [form, setForm] = useState({
    make: 'Royal Enfield',
    model: '',
    year: '2024',
    registrationNumber: '',
    mileageKm: 5000,
  });

  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    const newV: VehicleItem = {
      id: Date.now(),
      make: form.make,
      model: form.model,
      year: form.year,
      registrationNumber: form.registrationNumber.toUpperCase(),
      mileageKm: Number(form.mileageKm) || 0,
      lastServiceDate: 'Check-in pending',
      status: 'ACTIVE',
      engineNo: `ENG-${Math.floor(10000 + Math.random() * 90000)}`,
      fuelType: 'Petrol',
    };
    setVehicles([...vehicles, newV]);
    setIsAddModalOpen(false);
    setForm({ make: 'Royal Enfield', model: '', year: '2024', registrationNumber: '', mileageKm: 5000 });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-orange-600">
            <Bike className="w-3.5 h-3.5" />
            <span>My Garage</span>
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Registered Two-Wheelers
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm text-slate-500 font-medium">
            Manage your bikes and scooters, check odometer readings, and schedule periodic services
          </p>
        </div>

        <Button variant="primary" leftIcon={<PlusCircle className="w-4 h-4" />} onClick={() => setIsAddModalOpen(true)}>
          Add Two-Wheeler
        </Button>
      </div>

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {vehicles.map((v) => (
          <div
            key={v.id}
            className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-orange-300 hover:shadow-sm transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {v.make} • {v.year}
                  </span>
                  <h3 className="text-lg font-black text-slate-900 mt-0.5">{v.model}</h3>
                  <span className="inline-block mt-1 font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                    {v.registrationNumber}
                  </span>
                </div>
                <StatusBadge status={v.status} />
              </div>

              <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs my-3">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Odometer</span>
                  <strong className="text-slate-900">{formatMileage(v.mileageKm)}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Last Service</span>
                  <strong className="text-slate-900">{formatDate(v.lastServiceDate)}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Engine No.</span>
                  <span className="font-mono text-slate-700">{v.engineNo}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Fuel Type</span>
                  <span className="text-slate-700">{v.fuelType}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <span className="text-emerald-700 text-xs font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Genuine Service
              </span>
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<Calendar className="w-3.5 h-3.5 text-orange-600" />}
                onClick={() => {
                  setSelectedVehicle(v);
                  setIsBookModalOpen(true);
                }}
              >
                Book Service
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Vehicle Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add Two-Wheeler to Garage" description="Register a motorcycle or scooter to track maintenance">
        <form onSubmit={handleAddVehicle} className="space-y-3 pt-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Brand / Make</label>
              <select value={form.make} onChange={(e) => setForm({ ...form, make: e.target.value })} className={inputCls}>
                <option>Royal Enfield</option>
                <option>Honda</option>
                <option>Yamaha</option>
                <option>Hero</option>
                <option>Bajaj</option>
                <option>TVS</option>
                <option>KTM</option>
                <option>Suzuki</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Model Name</label>
              <input type="text" placeholder="e.g. Classic 350 / Activa" required value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} className={inputCls} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Registration Number</label>
              <input type="text" placeholder="MH 02 AB 1234" required value={form.registrationNumber} onChange={(e) => setForm({ ...form, registrationNumber: e.target.value })} className={`${inputCls} uppercase font-mono`} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Odometer (km)</label>
              <input type="number" required value={form.mileageKm} onChange={(e) => setForm({ ...form, mileageKm: Number(e.target.value) })} className={inputCls} />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <Button variant="secondary" type="button" size="sm" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit" size="sm">Save Vehicle</Button>
          </div>
        </form>
      </Modal>

      {/* Book Service Modal */}
      <Modal isOpen={isBookModalOpen} onClose={() => setIsBookModalOpen(false)} title="Schedule Service Visit" description={`Book service for ${selectedVehicle?.model || 'your bike'}`}>
        <form onSubmit={(e) => { e.preventDefault(); alert(`Service booked for ${selectedVehicle?.model || 'vehicle'}!`); setIsBookModalOpen(false); }} className="space-y-3 pt-1">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Selected Vehicle</label>
            <input type="text" disabled value={`${selectedVehicle?.model} (${selectedVehicle?.registrationNumber})`} className={`${inputCls} bg-slate-100 text-slate-600`} />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Service Type</label>
            <select className={inputCls}>
              <option>General Periodic Service</option>
              <option>Express Oil & Lube Change</option>
              <option>Brake & Clutch Repair</option>
              <option>Engine Tuning & Diagnostics</option>
              <option>Foam Wash & Wax Polish</option>
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Date</label>
              <input type="date" defaultValue={new Date().toISOString().split('T')[0]} required className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Time Slot</label>
              <select className={inputCls}>
                <option>Morning (09:30 AM - 12:30 PM)</option>
                <option>Afternoon (01:00 PM - 04:00 PM)</option>
                <option>Evening (04:30 PM - 07:30 PM)</option>
              </select>
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <Button variant="secondary" type="button" size="sm" onClick={() => setIsBookModalOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit" size="sm">Confirm Slot</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
