import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Modal } from '../../components/ui/Modal';
import { useWorkshop, ServiceJob } from '../../hooks/useWorkshop';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { Wrench, Search, PlusCircle, Filter, Eye } from 'lucide-react';
import { ServiceStatus } from '../../types/dashboard';

const inputCls = 'w-full rounded-xl bg-white border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500';

export const ServiceJobsPage: React.FC = () => {
  const { jobs, addJob, updateJobStatus } = useWorkshop();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedJob, setSelectedJob] = useState<ServiceJob | null>(null);
  const [isNewJobModalOpen, setIsNewJobModalOpen] = useState(false);

  const [newJobForm, setNewJobForm] = useState({
    customerName: '',
    customerPhone: '',
    vehicleModel: '',
    registrationNumber: '',
    serviceType: 'General Full Service',
    assignedMechanic: 'Sanjay Yadav (Workshop Head)',
    estimatedCost: 1200,
    diagnosticNotes: '',
  });

  const filteredJobs = jobs.filter((job) => {
    const matchesStatus = statusFilter === 'ALL' || job.status === statusFilter;
    const q = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !q ||
      job.jobId.toLowerCase().includes(q) ||
      job.customerName.toLowerCase().includes(q) ||
      job.vehicleModel.toLowerCase().includes(q) ||
      job.registrationNumber.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    const created = addJob(newJobForm);
    setIsNewJobModalOpen(false);
    setSelectedJob(created);
    setNewJobForm({
      customerName: '',
      customerPhone: '',
      vehicleModel: '',
      registrationNumber: '',
      serviceType: 'General Full Service',
      assignedMechanic: 'Sanjay Yadav (Workshop Head)',
      estimatedCost: 1200,
      diagnosticNotes: '',
    });
  };

  const handleStatusChange = (jobId: string, st: ServiceStatus) => {
    updateJobStatus(jobId, st);
    if (selectedJob && selectedJob.jobId === jobId) {
      setSelectedJob((prev) => (prev ? { ...prev, status: st } : null));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-orange-600">
            <Wrench className="w-3.5 h-3.5" />
            <span>Workshop Floor</span>
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Service Job Cards ({jobs.length})
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm text-slate-500 font-medium">
            Active service repairs, mechanic assignments, and real-time stage updates
          </p>
        </div>

        <Button variant="primary" leftIcon={<PlusCircle className="w-4 h-4" />} onClick={() => setIsNewJobModalOpen(true)}>
          Create Job Card
        </Button>
      </div>

      {/* Filter & Search */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by job ID, customer, bike, or reg number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-slate-500 font-semibold flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5" /> Status:
            </span>
            {['ALL', 'RECEIVED', 'INSPECTION', 'IN_PROGRESS', 'READY', 'DELIVERED'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  statusFilter === st ? 'bg-orange-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                {st === 'ALL' ? 'All Jobs' : st.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredJobs.map((job) => (
          <div
            key={job.jobId}
            className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-orange-300 hover:shadow-sm transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <span className="font-mono text-xs font-black text-orange-600">{job.jobId}</span>
                  <h3 className="text-sm font-bold text-slate-900 mt-0.5">{job.vehicleModel}</h3>
                  <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200 inline-block mt-1">
                    {job.registrationNumber}
                  </span>
                </div>
                <StatusBadge status={job.status} />
              </div>

              <p className="text-xs text-slate-600 font-medium line-clamp-2 my-2.5 bg-slate-50 p-2 rounded-lg border border-slate-100">
                {job.serviceType}
              </p>

              <div className="my-3">
                <div className="flex items-center justify-between text-[11px] font-bold mb-1 text-slate-700">
                  <span className="truncate pr-2">{job.stageName}</span>
                  <span className="text-orange-600 font-mono shrink-0">{job.stageNumber}/{job.totalStages}</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-orange-600 rounded-full transition-all" style={{ width: `${(job.stageNumber / job.totalStages) * 100}%` }} />
                </div>
              </div>

              <div className="space-y-1 text-xs text-slate-500 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span>Customer:</span>
                  <strong className="text-slate-800">{job.customerName}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Mechanic:</span>
                  <strong className="text-slate-800">{job.assignedMechanic.split(' ')[0]}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Est. Cost:</span>
                  <strong className="text-slate-900 font-mono">{formatCurrency(job.estimatedCost)}</strong>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <span className="text-[10px] text-slate-400 font-mono">{formatDateTime(job.createdDate).split(',')[0]}</span>
              <Button variant="secondary" size="sm" onClick={() => setSelectedJob(job)} leftIcon={<Eye className="w-3.5 h-3.5" />}>
                Inspect Card
              </Button>
            </div>
          </div>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <Card className="text-center py-12 text-slate-400">
          <Wrench className="w-10 h-10 mx-auto text-slate-300 mb-2" />
          <p className="font-bold text-slate-600">No service jobs found</p>
          <p className="text-xs text-slate-400 mt-1">Try changing the status filter or create a new job card</p>
        </Card>
      )}

      {/* Inspect & Manage Job Modal */}
      <Modal
        isOpen={!!selectedJob}
        onClose={() => setSelectedJob(null)}
        title={`Job Card — ${selectedJob?.jobId}`}
        description="Technical details, parts replaced, and stage updater"
        size="lg"
      >
        {selectedJob && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <div>
                <span className="text-slate-500 font-medium block text-[10px] uppercase">Vehicle Reg</span>
                <span className="font-mono font-bold text-orange-700">{selectedJob.registrationNumber}</span>
              </div>
              <div>
                <span className="text-slate-500 font-medium block text-[10px] uppercase">Model</span>
                <span className="font-bold text-slate-900">{selectedJob.vehicleModel}</span>
              </div>
              <div>
                <span className="text-slate-500 font-medium block text-[10px] uppercase">Customer</span>
                <span className="font-bold text-slate-900">{selectedJob.customerName}</span>
              </div>
              <div>
                <span className="text-slate-500 font-medium block text-[10px] uppercase">Phone</span>
                <span className="font-mono font-bold text-slate-800">{selectedJob.customerPhone}</span>
              </div>
            </div>

            {/* Quick Status Control */}
            <div className="p-3.5 rounded-xl bg-orange-50 border border-orange-200">
              <label className="block text-xs font-bold text-slate-800 mb-2">Update Stage / Status:</label>
              <div className="flex items-center gap-2 flex-wrap">
                {(['RECEIVED', 'INSPECTION', 'IN_PROGRESS', 'READY', 'DELIVERED'] as ServiceStatus[]).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => handleStatusChange(selectedJob.jobId, st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      selectedJob.status === st ? 'bg-orange-600 text-white shadow-xs' : 'bg-white text-slate-700 hover:bg-orange-100 border border-orange-200'
                    }`}
                  >
                    {st.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Mechanic Notes</label>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
                {selectedJob.diagnosticNotes}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Installed Spares & Fluids</label>
              <div className="rounded-xl border border-slate-200 overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-2 px-3">Item</th>
                      <th className="py-2 px-3 text-right">Cost (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedJob.replacedParts.length === 0 ? (
                      <tr>
                        <td colSpan={2} className="py-2 px-3 text-slate-400 italic">No spare parts billed yet</td>
                      </tr>
                    ) : (
                      selectedJob.replacedParts.map((p, idx) => (
                        <tr key={idx}>
                          <td className="py-2 px-3 font-medium">{p.name}</td>
                          <td className="py-2 px-3 text-right font-mono font-bold">₹{p.cost}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900 text-white text-xs">
              <span>Estimated Total (Parts + Labor):</span>
              <strong className="text-orange-400 font-mono text-base font-black">{formatCurrency(selectedJob.estimatedCost)}</strong>
            </div>

            <div className="flex items-center justify-end pt-3 border-t border-slate-100">
              <Button variant="secondary" size="sm" onClick={() => setSelectedJob(null)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Create Job Card Modal */}
      <Modal
        isOpen={isNewJobModalOpen}
        onClose={() => setIsNewJobModalOpen(false)}
        title="New Service Job Card"
        description="Check in a two-wheeler for service or repairs"
      >
        <form onSubmit={handleCreateJob} className="space-y-3 pt-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Customer Name</label>
              <input type="text" placeholder="e.g. Rahul Sharma" required value={newJobForm.customerName} onChange={(e) => setNewJobForm({ ...newJobForm, customerName: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number</label>
              <input type="tel" placeholder="+91 98230 12345" required value={newJobForm.customerPhone} onChange={(e) => setNewJobForm({ ...newJobForm, customerPhone: e.target.value })} className={inputCls} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Vehicle Model</label>
              <input type="text" placeholder="e.g. Classic 350 / Activa" required value={newJobForm.vehicleModel} onChange={(e) => setNewJobForm({ ...newJobForm, vehicleModel: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Registration Number</label>
              <input type="text" placeholder="MH 02 AB 1234" required value={newJobForm.registrationNumber} onChange={(e) => setNewJobForm({ ...newJobForm, registrationNumber: e.target.value })} className={`${inputCls} uppercase font-mono`} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Assigned Mechanic</label>
              <select value={newJobForm.assignedMechanic} onChange={(e) => setNewJobForm({ ...newJobForm, assignedMechanic: e.target.value })} className={inputCls}>
                <option>Sanjay Yadav (Workshop Head)</option>
                <option>Ramesh (Mechanic)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Est. Cost (₹)</label>
              <input type="number" required value={newJobForm.estimatedCost} onChange={(e) => setNewJobForm({ ...newJobForm, estimatedCost: Number(e.target.value) })} className={inputCls} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Customer Request & Diagnosis</label>
            <textarea rows={2} placeholder="Full general service, brake inspection, engine oil flush" value={newJobForm.diagnosticNotes} onChange={(e) => setNewJobForm({ ...newJobForm, diagnosticNotes: e.target.value })} className={inputCls} />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <Button variant="secondary" type="button" size="sm" onClick={() => setIsNewJobModalOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit" size="sm">Create Job Card</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
