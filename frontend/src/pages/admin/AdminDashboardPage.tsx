import React, { useState } from 'react';
import { useWorkshop, ServiceJob } from '../../hooks/useWorkshop';
import { StatCard } from '../../components/ui/StatCard';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { Users, Bike, Wrench, IndianRupee, AlertTriangle, ReceiptText, PlusCircle, TrendingUp, Boxes, Eye, Filter, Calendar, Sparkles } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { ServiceStatus } from '../../types/dashboard';

const inputCls = 'w-full rounded-xl bg-white border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500';

export const AdminDashboardPage: React.FC = () => {
  const { jobs, customers, inventory, invoices, addJob, updateJobStatus } = useWorkshop();
  const [selectedJob, setSelectedJob] = useState<ServiceJob | null>(null);
  const [isNewJobModalOpen, setIsNewJobModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

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

  // Calculate live KPIs from persistent state
  const totalCustomers = customers.length;
  const totalVehicles = customers.reduce((acc, c) => acc + c.vehicles.length, 0);
  const activeJobs = jobs.filter((j) => j.status !== 'DELIVERED').length;
  const todayRevenue = invoices.filter((inv) => inv.paymentStatus === 'PAID').reduce((acc, inv) => {
    const pTot = inv.parts.reduce((pa, p) => pa + p.cost, 0);
    const sub = pTot + inv.laborTotal;
    return acc + sub + Math.round(sub * 0.18);
  }, 18500);
  const lowStockParts = inventory.filter((i) => i.stock <= i.minThreshold);
  const pendingInvoices = invoices.filter((i) => i.paymentStatus === 'PENDING').length;

  const weeklyRevenue = [
    { day: 'Mon', revenue: 18500 },
    { day: 'Tue', revenue: 24200 },
    { day: 'Wed', revenue: 19800 },
    { day: 'Thu', revenue: 31400 },
    { day: 'Fri', revenue: 28900 },
    { day: 'Sat', revenue: 42500 },
    { day: 'Sun', revenue: 15600 },
  ];

  const filteredJobs = jobs.filter((job) => statusFilter === 'ALL' || job.status === statusFilter);

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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-orange-600">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Workshop Command Center</span>
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Admin Dashboard</h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium">Real-time overview of active job cards, revenue metrics, inventory, and customer intake</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-600 shadow-2xs font-medium">
            <Calendar className="w-3.5 h-3.5 text-orange-600" />
            <span>Today: {new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <Button variant="primary" leftIcon={<PlusCircle className="w-4 h-4" />} onClick={() => setIsNewJobModalOpen(true)}>
            Create Job Card
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard title="Total Customers" value={totalCustomers} icon={<Users className="w-5 h-5" />} trend={{ value: '+8.4%', isPositive: true }} colorScheme="blue" />
        <StatCard title="Total Bikes" value={totalVehicles} icon={<Bike className="w-5 h-5" />} trend={{ value: '+12.1%', isPositive: true }} colorScheme="slate" />
        <StatCard title="Active Jobs" value={activeJobs} icon={<Wrench className="w-5 h-5" />} subtitle={`${activeJobs} in workshop`} colorScheme="amber" />
        <StatCard title="Revenue" value={formatCurrency(todayRevenue)} icon={<IndianRupee className="w-5 h-5" />} trend={{ value: '+14.2%', isPositive: true }} colorScheme="emerald" />
        <StatCard title="Low Stock Spares" value={lowStockParts.length} icon={<AlertTriangle className="w-5 h-5" />} subtitle={`${lowStockParts.length} need reorder`} colorScheme="rose" />
        <StatCard title="Pending Invoices" value={pendingInvoices} icon={<ReceiptText className="w-5 h-5" />} subtitle="Payment due" colorScheme="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-orange-600" />
                <span>Weekly Workshop Revenue & Volume</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">Daily turnover trends and service completions</p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">Avg ₹25,400/day</span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyRevenue} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ea580c" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#ea580c" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="day" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: '12px', color: '#0f172a' }}
                  formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Revenue']}
                  labelFormatter={(label) => `Day: ${label}`}
                />
                <Area type="monotone" dataKey="revenue" stroke="#ea580c" strokeWidth={2.5} fillOpacity={1} fill="url(#revenueGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Boxes className="w-4 h-4 text-rose-600" />
                <span>Inventory Alerts</span>
              </h3>
              <span className="text-xs font-bold text-rose-700 px-2 py-0.5 rounded-full bg-rose-50 border border-rose-200">{lowStockParts.length} Critical</span>
            </div>
            <p className="text-xs text-slate-500 mb-4 font-medium">Fast-moving parts below minimum replenishment levels</p>

            <div className="space-y-2.5">
              {lowStockParts.slice(0, 4).map((item) => (
                <div key={item.sku} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between hover:border-slate-300 transition-colors">
                  <div className="pr-2">
                    <p className="text-xs font-bold text-slate-900 leading-tight">{item.name}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5 font-medium">Code: <span className="font-mono text-slate-700 font-bold">{item.sku}</span> • {item.category}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="inline-block text-xs font-bold text-rose-700 bg-rose-100/70 px-2 py-0.5 rounded border border-rose-200">{item.stock} left</span>
                    <p className="text-[10px] text-slate-400 mt-0.5">Min: {item.minThreshold}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Wrench className="w-4 h-4 text-orange-600" />
              <span>Live Service Job Queue ({jobs.length})</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">Real-time status of two-wheelers currently in workshop</p>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-slate-500 font-semibold flex items-center gap-1 mr-1"><Filter className="w-3.5 h-3.5" /> Filter:</span>
            {['ALL', 'RECEIVED', 'INSPECTION', 'IN_PROGRESS', 'READY', 'DELIVERED'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${statusFilter === st ? 'bg-orange-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'}`}
              >
                {st === 'ALL' ? 'All Jobs' : st.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Vehicle & Reg No</TableHead>
              <TableHead>Service Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Est. Cost</TableHead>
              <TableHead>Logged</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredJobs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-slate-400 font-medium">No service jobs matching filter "{statusFilter}"</TableCell>
              </TableRow>
            ) : (
              filteredJobs.map((job) => (
                <TableRow key={job.jobId}>
                  <TableCell className="font-mono text-xs font-bold text-orange-600">{job.jobId}</TableCell>
                  <TableCell className="font-bold text-slate-900">{job.customerName}</TableCell>
                  <TableCell>
                    <div className="text-xs font-bold text-slate-800">{job.vehicleModel}</div>
                    <div className="text-[11px] font-mono font-semibold text-slate-500">{job.registrationNumber}</div>
                  </TableCell>
                  <TableCell className="text-xs text-slate-600 max-w-[220px] truncate font-medium">{job.serviceType}</TableCell>
                  <TableCell><StatusBadge status={job.status} /></TableCell>
                  <TableCell className="font-bold text-slate-900">{formatCurrency(job.estimatedCost)}</TableCell>
                  <TableCell className="text-xs text-slate-500 font-medium">{formatDateTime(job.createdDate)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => setSelectedJob(job)} leftIcon={<Eye className="w-3.5 h-3.5" />}>Inspect</Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Inspect Job Modal */}
      <Modal isOpen={!!selectedJob} onClose={() => setSelectedJob(null)} title={`Job Card — ${selectedJob?.jobId}`} description="Technical details and stage status">
        {selectedJob && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <div><span className="text-slate-500 font-medium">Customer:</span><p className="font-bold text-slate-900 mt-0.5">{selectedJob.customerName}</p></div>
              <div><span className="text-slate-500 font-medium">Status:</span><div className="mt-0.5"><StatusBadge status={selectedJob.status} /></div></div>
              <div><span className="text-slate-500 font-medium">Vehicle:</span><p className="font-bold text-slate-900 mt-0.5">{selectedJob.vehicleModel}</p></div>
              <div><span className="text-slate-500 font-medium">Reg No:</span><p className="font-mono font-bold text-orange-600 mt-0.5">{selectedJob.registrationNumber}</p></div>
            </div>

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
              <label className="text-xs font-bold text-slate-700">Customer Request & Notes</label>
              <p className="mt-1 text-sm font-medium text-slate-800 p-3 rounded-xl bg-slate-50 border border-slate-200">{selectedJob.serviceType}</p>
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
      <Modal isOpen={isNewJobModalOpen} onClose={() => setIsNewJobModalOpen(false)} title="Create New Service Job Card" description="Check in a two-wheeler for inspection or repairs">
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
              <label className="block text-xs font-bold text-slate-700 mb-1">Registration No.</label>
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
              <label className="block text-xs font-bold text-slate-700 mb-1">Estimated Cost (₹)</label>
              <input type="number" required value={newJobForm.estimatedCost} onChange={(e) => setNewJobForm({ ...newJobForm, estimatedCost: Number(e.target.value) })} className={inputCls} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Primary Request & Diagnosis</label>
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
