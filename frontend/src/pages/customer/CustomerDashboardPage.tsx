import React, { useState, useEffect } from 'react';
import { dashboardService } from '../../services/dashboardService';
import { CustomerDashboardData } from '../../types/dashboard';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ErrorState } from '../../components/ui/EmptyState';
import { formatCurrency, formatDate, formatMileage } from '../../utils/formatters';
import { Bike, Wrench, Clock, CheckCircle2, Calendar, Download, AlertCircle, PlusCircle, Sparkles, ShieldCheck } from 'lucide-react';

export const CustomerDashboardPage: React.FC = () => {
  const [data, setData] = useState<CustomerDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);

  const fetchCustomerData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await dashboardService.getCustomerDashboard();
      setData(res);
    } catch (err: any) {
      setError(err?.message || 'Failed to load customer details');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchCustomerData(); }, []);

  if (isLoading) return <LoadingSpinner size="lg" label="Loading Your Vehicle Service Portal..." className="min-h-[60vh]" />;
  if (error || !data) return <ErrorState message={error || 'Unable to connect'} onRetry={fetchCustomerData} />;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-600 to-orange-700 text-white p-6 sm:p-8 shadow-lg shadow-orange-600/15">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-orange-200 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Customer Service Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Welcome back, {data.customerName}!</h1>
            <p className="mt-1 text-xs sm:text-sm text-orange-100 font-medium">
              You have <span className="text-white font-bold">{data.totalVehicles} registered vehicles</span> and <span className="text-white font-bold">{data.activeJobsCount} active service job</span> in progress.
            </p>
          </div>

          <Button variant="secondary" leftIcon={<PlusCircle className="w-4 h-4 text-orange-600" />} onClick={() => setIsBookModalOpen(true)} className="bg-white text-orange-700 hover:bg-orange-50 font-bold border-none shrink-0">
            Book Service Visit
          </Button>
        </div>
      </div>

      {data.activeService && (
        <Card className="border-orange-300 bg-white shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-orange-600">Live Service In Progress</span>
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
              </div>
              <h3 className="text-lg font-black text-slate-900 mt-0.5">{data.activeService.vehicle}</h3>
              <p className="text-xs text-slate-500 font-medium">
                Job Card: <span className="font-mono font-bold text-orange-600">{data.activeService.jobId}</span> • {data.activeService.serviceType}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs text-slate-500 font-medium block">Estimated Delivery:</span>
              <span className="text-sm font-bold text-orange-600 flex items-center gap-1.5 sm:justify-end mt-0.5">
                <Clock className="w-3.5 h-3.5" />
                {data.activeService.estimatedCompletion}
              </span>
            </div>
          </div>

          <div className="my-5">
            <div className="flex items-center justify-between text-xs font-bold mb-1.5">
              <span className="text-slate-700">Overall Repair Progress</span>
              <span className="text-orange-600">{data.activeService.progressPercentage}% Completed</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden p-0.5 border border-slate-200">
              <div className="h-full rounded-full bg-orange-600 transition-all duration-500" style={{ width: `${data.activeService.progressPercentage}%` }} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
            {data.activeService.steps.map((step, idx) => {
              const isDone = step.status === 'COMPLETED';
              const isCurr = step.status === 'CURRENT';
              return (
                <div key={idx} className={`p-3.5 rounded-xl border transition-all ${isDone ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : isCurr ? 'bg-orange-50 border-orange-400 text-orange-950 shadow-sm ring-1 ring-orange-400' : 'bg-slate-50 border-slate-200 text-slate-500 opacity-70'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider">Step {idx + 1}</span>
                    {isDone ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : isCurr ? <Wrench className="w-4 h-4 text-orange-600" /> : <Clock className="w-4 h-4 text-slate-400" />}
                  </div>
                  <h5 className="text-xs font-bold text-slate-900 mb-1">{step.stepName}</h5>
                  <p className="text-[11px] leading-tight text-slate-600 mb-2 font-medium">{step.description}</p>
                  <span className="text-[10px] font-mono text-slate-500 block font-semibold">{step.timestamp}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
            <span>Assigned Specialist: <strong className="text-slate-800 font-bold">{data.activeService.assignedMechanic}</strong></span>
            <span className="text-emerald-700 font-semibold flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 100% Genuine OEM Spares Guaranteed</span>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2"><Bike className="w-4 h-4 text-orange-600" /><span>My Registered Two-Wheelers</span></h3>
            <span className="text-xs text-slate-500 font-semibold">{data.vehicles.length} Vehicles</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {data.vehicles.map((v) => (
              <Card key={v.id} className="relative group hover:border-orange-300 transition-all p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{v.make} • {v.year}</span>
                    <h4 className="text-base font-bold text-slate-900 mt-0.5">{v.model}</h4>
                    <span className="inline-block mt-1 font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">{v.registrationNumber}</span>
                  </div>
                  <StatusBadge status={v.status} />
                </div>

                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 text-xs">
                  <div><span className="text-slate-500 font-medium block">Odometer:</span><span className="font-bold text-slate-900">{formatMileage(v.mileageKm)}</span></div>
                  <div><span className="text-slate-500 font-medium block">Last Service:</span><span className="font-bold text-slate-900">{formatDate(v.lastServiceDate)}</span></div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {data.maintenanceReminder && (
            <Card className="border-amber-300 bg-amber-50/60">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-800 mb-2">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>Preventive Service Due</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900">{data.maintenanceReminder.vehicle}</h4>
              <p className="text-xs text-slate-700 mt-1 font-medium">{data.maintenanceReminder.reminderText}</p>
              <div className="mt-3 pt-3 border-t border-amber-200 flex items-center justify-between text-xs">
                <span className="font-mono text-amber-900 font-bold">{data.maintenanceReminder.dueMileageOrDate}</span>
                <button onClick={() => setIsBookModalOpen(true)} className="font-bold text-orange-700 hover:text-orange-800 transition-colors">Schedule Now →</button>
              </div>
            </Card>
          )}

          {data.latestInvoice && (
            <Card>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Latest Tax Invoice</span>
                <StatusBadge status={data.latestInvoice.status} />
              </div>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-base font-bold text-slate-900">{data.latestInvoice.invoiceNumber}</span>
                <span className="text-base font-black text-emerald-600">{formatCurrency(data.latestInvoice.totalAmount)}</span>
              </div>
              <p className="text-xs text-slate-500 mt-1 font-medium">{data.latestInvoice.vehicle} • {formatDate(data.latestInvoice.date.toString())}</p>
              <Button variant="secondary" size="sm" className="w-full mt-3" leftIcon={<Download className="w-3.5 h-3.5" />} onClick={() => alert(`Downloading Invoice ${data.latestInvoice?.invoiceNumber}...`)}>
                Download PDF Bill
              </Button>
            </Card>
          )}
        </div>
      </div>

      <Card>
        <div className="mb-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2"><Calendar className="w-4 h-4 text-orange-600" /><span>Past Service Records & History</span></h3>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">Complete record of workshop maintenance and replaced parts</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-800">
            <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-600 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3.5">Invoice / Job</th>
                <th className="px-4 py-3.5">Vehicle</th>
                <th className="px-4 py-3.5">Service Details</th>
                <th className="px-4 py-3.5">Date</th>
                <th className="px-4 py-3.5">Amount</th>
                <th className="px-4 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.recentServices.map((hist) => (
                <tr key={hist.invoiceId} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3.5 font-mono text-xs font-bold text-orange-600">{hist.invoiceId}</td>
                  <td className="px-4 py-3.5 text-xs font-bold text-slate-900">{hist.vehicle}</td>
                  <td className="px-4 py-3.5 text-xs text-slate-600 font-medium">{hist.serviceType}</td>
                  <td className="px-4 py-3.5 text-xs text-slate-500 font-medium">{formatDate(hist.date.toString())}</td>
                  <td className="px-4 py-3.5 text-xs font-bold text-slate-900">{formatCurrency(hist.totalAmount)}</td>
                  <td className="px-4 py-3.5"><StatusBadge status={hist.paymentStatus} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={isBookModalOpen} onClose={() => setIsBookModalOpen(false)} title="Schedule Service Appointment" description="Select your vehicle and preferred service slot at S K Bike Point">
        <form onSubmit={(e) => { e.preventDefault(); alert('Your service appointment has been booked!'); setIsBookModalOpen(false); }} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Select Vehicle</label>
            <select className="w-full rounded-xl bg-white border border-slate-300 px-3.5 py-2 text-sm text-slate-900">
              {data.vehicles.map((v) => (
                <option key={v.id} value={v.id}>{v.model} ({v.registrationNumber})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Service Type</label>
            <select className="w-full rounded-xl bg-white border border-slate-300 px-3.5 py-2 text-sm text-slate-900">
              <option>Periodic General Maintenance & Oil Change</option>
              <option>Brake Inspection & Pad Replacement</option>
              <option>Engine Tuning & Carburetor / FI Clean</option>
              <option>Chain Sprocket & Clutch Service</option>
              <option>Electrical Diagnostics & Battery</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Date</label>
              <input type="date" defaultValue={new Date().toISOString().split('T')[0]} className="w-full rounded-xl bg-white border border-slate-300 px-3.5 py-2 text-sm text-slate-900" required />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Time Slot</label>
              <select className="w-full rounded-xl bg-white border border-slate-300 px-3.5 py-2 text-sm text-slate-900">
                <option>Morning (09:00 AM - 12:00 PM)</option>
                <option>Afternoon (12:00 PM - 03:00 PM)</option>
                <option>Evening (03:00 PM - 07:00 PM)</option>
              </select>
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <Button variant="secondary" type="button" size="sm" onClick={() => setIsBookModalOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit" size="sm">Confirm Booking</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
