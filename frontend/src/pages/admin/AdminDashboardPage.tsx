import React, { useState, useEffect } from 'react';
import { dashboardService } from '../../services/dashboardService';
import { AdminDashboardData, ServiceJobSummary } from '../../types/dashboard';
import { StatCard } from '../../components/ui/StatCard';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ErrorState } from '../../components/ui/EmptyState';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { Users, Bike, Wrench, IndianRupee, AlertTriangle, ReceiptText, PlusCircle, TrendingUp, Boxes, Eye, Filter, CheckCircle2, Calendar, Sparkles } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const AdminDashboardPage: React.FC = () => {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<ServiceJobSummary | null>(null);
  const [isNewJobModalOpen, setIsNewJobModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await dashboardService.getAdminDashboard();
      setData(res);
    } catch (err: any) {
      setError(err?.message || 'Failed to load dashboard metrics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchDashboardData(); }, []);

  if (isLoading) return <LoadingSpinner size="lg" label="Loading Workshop Analytics & Jobs..." className="min-h-[60vh]" />;
  if (error || !data) return <ErrorState message={error || 'Unable to connect'} onRetry={fetchDashboardData} />;

  const filteredJobs = data.recentServiceJobs.filter((job) => statusFilter === 'ALL' || job.status === statusFilter);

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
        <StatCard title="Total Customers" value={data.totalCustomers} icon={<Users className="w-5 h-5" />} trend={{ value: '+8.4%', isPositive: true }} colorScheme="blue" />
        <StatCard title="Total Vehicles" value={data.totalVehicles} icon={<Bike className="w-5 h-5" />} trend={{ value: '+12.1%', isPositive: true }} colorScheme="slate" />
        <StatCard title="Active Jobs" value={data.activeServiceJobs} icon={<Wrench className="w-5 h-5" />} subtitle="4 on lift right now" colorScheme="amber" />
        <StatCard title="Today's Revenue" value={formatCurrency(data.todayRevenue)} icon={<IndianRupee className="w-5 h-5" />} trend={{ value: '+14.2%', isPositive: true }} colorScheme="emerald" />
        <StatCard title="Low Stock Parts" value={data.lowStockParts} icon={<AlertTriangle className="w-5 h-5" />} subtitle="Action required" colorScheme="rose" />
        <StatCard title="Pending Invoices" value={data.pendingInvoices} icon={<ReceiptText className="w-5 h-5" />} subtitle="Awaiting payment" colorScheme="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-orange-600" />
                <span>Weekly Workshop Revenue & Job Volume</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">Daily turnover trends and service completions</p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">Avg ₹25,400/day</span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.weeklyRevenue} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
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
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', color: '#0f172a' }}
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
              <span className="text-xs font-bold text-rose-700 px-2 py-0.5 rounded-full bg-rose-50 border border-rose-200">{data.lowStockAlerts.length} Critical</span>
            </div>
            <p className="text-xs text-slate-500 mb-4 font-medium">Fast-moving parts below minimum replenishment levels</p>

            <div className="space-y-2.5">
              {data.lowStockAlerts.map((item) => (
                <div key={item.partNumber} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between hover:border-slate-300 transition-colors">
                  <div className="pr-2">
                    <p className="text-xs font-bold text-slate-900 leading-tight">{item.partName}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5 font-medium">Code: <span className="font-mono text-slate-700 font-bold">{item.partNumber}</span> • {item.category}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="inline-block text-xs font-bold text-rose-700 bg-rose-100/70 px-2 py-0.5 rounded border border-rose-200">{item.currentStock} left</span>
                    <p className="text-[10px] text-slate-400 mt-0.5">Min: {item.minThreshold}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button variant="secondary" size="sm" className="w-full mt-4" onClick={() => alert('Inventory Purchase Order module will open in Phase 2.')}>
            Create Purchase Reorder
          </Button>
        </Card>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Wrench className="w-4 h-4 text-orange-600" />
              <span>Live Service Job Queue</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">Real-time status of two-wheelers currently in workshop</p>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-slate-500 font-semibold flex items-center gap-1 mr-1"><Filter className="w-3.5 h-3.5" /> Filter:</span>
            {['ALL', 'IN_PROGRESS', 'READY', 'INSPECTION', 'RECEIVED', 'DELIVERED'].map((st) => (
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

      <Modal isOpen={!!selectedJob} onClose={() => setSelectedJob(null)} title={`Service Job Card — ${selectedJob?.jobId}`} description="Comprehensive technical and billing breakdown">
        {selectedJob && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <div><span className="text-slate-500 font-medium">Customer:</span><p className="font-bold text-slate-900 mt-0.5">{selectedJob.customerName}</p></div>
              <div><span className="text-slate-500 font-medium">Status:</span><div className="mt-0.5"><StatusBadge status={selectedJob.status} /></div></div>
              <div><span className="text-slate-500 font-medium">Vehicle:</span><p className="font-bold text-slate-900 mt-0.5">{selectedJob.vehicleModel}</p></div>
              <div><span className="text-slate-500 font-medium">Reg No:</span><p className="font-mono font-bold text-orange-600 mt-0.5">{selectedJob.registrationNumber}</p></div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">Service Required & Diagnostics</label>
              <p className="mt-1 text-sm font-medium text-slate-800 p-3 rounded-xl bg-slate-50 border border-slate-200">{selectedJob.serviceType}</p>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-orange-50 border border-orange-200">
              <span className="text-xs font-bold text-slate-800">Estimated Total (Parts + Labor):</span>
              <span className="text-lg font-black text-orange-700">{formatCurrency(selectedJob.estimatedCost)}</span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <Button variant="secondary" size="sm" onClick={() => setSelectedJob(null)}>Close</Button>
              <Button variant="primary" size="sm" leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />} onClick={() => { alert(`Job Card ${selectedJob.jobId} updated!`); setSelectedJob(null); }}>
                Update Status
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={isNewJobModalOpen} onClose={() => setIsNewJobModalOpen(false)} title="Create New Service Job Card" description="Check in a two-wheeler for inspection or repairs">
        <form onSubmit={(e) => { e.preventDefault(); alert('Job Card created!'); setIsNewJobModalOpen(false); }} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Customer Search / Mobile</label>
            <input type="text" defaultValue="Rahul Sharma (+91 98230 12345)" className="w-full rounded-xl bg-white border border-slate-300 px-3.5 py-2 text-sm text-slate-900" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Vehicle Model</label>
              <input type="text" defaultValue="Royal Enfield Classic 350" className="w-full rounded-xl bg-white border border-slate-300 px-3.5 py-2 text-sm text-slate-900" required />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Registration No.</label>
              <input type="text" defaultValue="MH 12 AB 1234" className="w-full rounded-xl bg-white border border-slate-300 px-3.5 py-2 text-sm text-slate-900" required />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Primary Concern / Service Type</label>
            <textarea rows={2} defaultValue="Full periodic service, front disc pad check, synthetic oil flush" className="w-full rounded-xl bg-white border border-slate-300 px-3.5 py-2 text-sm text-slate-900" required />
          </div>
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <Button variant="secondary" type="button" size="sm" onClick={() => setIsNewJobModalOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit" size="sm">Generate Job Card</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
