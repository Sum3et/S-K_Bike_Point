import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { InvoiceModal } from '../../components/ui/InvoiceModal';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Wrench, Search, FileText } from 'lucide-react';

interface HistoryItem {
  invoiceId: string;
  jobId: string;
  vehicle: string;
  regNo: string;
  date: string;
  serviceType: string;
  laborTotal: number;
  parts: { name: string; cost: number }[];
  paymentStatus: 'PAID';
  assignedMechanic: string;
}

const PAST_SERVICES: HistoryItem[] = [
  {
    invoiceId: 'SKB-INV-2026-080',
    jobId: 'JOB-2026-080',
    vehicle: 'Honda Activa 6G',
    regNo: 'MH 02 CD 5678',
    date: '2026-09-29',
    serviceType: 'Express Service & Rear Brake Shoe Replacement',
    laborTotal: 250,
    parts: [
      { name: 'Castrol Activ 10W-30 Scooter Oil (800ml)', cost: 380 },
      { name: 'Honda Genuine Rear Brake Shoes', cost: 340 },
    ],
    paymentStatus: 'PAID',
    assignedMechanic: 'Ramesh (Mechanic)',
  },
  {
    invoiceId: 'SKB-INV-2026-042',
    jobId: 'JOB-2026-042',
    vehicle: 'Royal Enfield Classic 350',
    regNo: 'MH 02 AB 1234',
    date: '2026-06-18',
    serviceType: 'Periodic 5,000 km Service & Motul 7100 Flush',
    laborTotal: 450,
    parts: [
      { name: 'Motul 7100 15W-50 (2.5L)', cost: 1850 },
      { name: 'Genuine Oil Filter', cost: 165 },
      { name: 'Chain Lube & Wash', cost: 200 },
    ],
    paymentStatus: 'PAID',
    assignedMechanic: 'Sanjay Yadav (Workshop Head)',
  },
  {
    invoiceId: 'SKB-INV-2026-015',
    jobId: 'JOB-2026-015',
    vehicle: 'Honda Activa 6G',
    regNo: 'MH 02 CD 5678',
    date: '2026-03-02',
    serviceType: 'Brake Cable Tuning & Spark Plug Replacement',
    laborTotal: 200,
    parts: [
      { name: 'NGK Spark Plug', cost: 160 },
      { name: 'Air Filter Cleaning Element', cost: 120 },
    ],
    paymentStatus: 'PAID',
    assignedMechanic: 'Ramesh (Mechanic)',
  },
];

export const CustomerHistoryPage: React.FC = () => {
  const [history] = useState<HistoryItem[]>(PAST_SERVICES);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBill, setSelectedBill] = useState<HistoryItem | null>(null);

  const calculateGrandTotal = (item: HistoryItem) => {
    const partsTotal = item.parts.reduce((a, b) => a + b.cost, 0);
    const subtotal = partsTotal + item.laborTotal;
    return subtotal + Math.round(subtotal * 0.18);
  };

  const filteredHistory = history.filter((item) => {
    const q = searchTerm.toLowerCase().trim();
    if (!q) return true;
    return (
      item.invoiceId.toLowerCase().includes(q) ||
      item.vehicle.toLowerCase().includes(q) ||
      item.regNo.toLowerCase().includes(q) ||
      item.serviceType.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-orange-600">
            <Wrench className="w-3.5 h-3.5" />
            <span>Service History</span>
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Past Repairs & Invoices
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm text-slate-500 font-medium">
            View completed workshop visits, replaced spare parts, and download GST tax receipts
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <Card className="p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search past bills by vehicle, service type, or invoice number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
          />
        </div>
      </Card>

      {/* History Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredHistory.map((item) => {
          const grandTotal = calculateGrandTotal(item);
          return (
            <div
              key={item.invoiceId}
              className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-orange-300 hover:shadow-sm transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="font-mono text-xs font-bold text-orange-600 block">
                      {item.invoiceId}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-0.5">{item.vehicle}</h3>
                  </div>
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {item.regNo}
                  </span>
                </div>

                <p className="text-xs text-slate-600 font-medium my-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  {item.serviceType}
                </p>

                <div className="space-y-1.5 my-3 text-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Replaced Parts & Consumables ({item.parts.length})
                  </span>
                  {item.parts.map((p, idx) => (
                    <div key={idx} className="flex items-center justify-between text-slate-600">
                      <span>• {p.name}</span>
                      <span className="font-mono font-bold text-slate-800">₹{p.cost}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">{formatDate(item.date)}</span>
                  <strong className="text-slate-900 font-mono font-black text-sm">
                    {formatCurrency(grandTotal)}
                  </strong>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setSelectedBill(item)}
                  leftIcon={<FileText className="w-3.5 h-3.5 text-orange-600" />}
                >
                  View Bill
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reusable GST Invoice Modal */}
      <InvoiceModal
        isOpen={!!selectedBill}
        onClose={() => setSelectedBill(null)}
        data={selectedBill}
      />
    </div>
  );
};
