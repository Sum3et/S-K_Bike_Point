import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { InvoiceModal } from '../../components/ui/InvoiceModal';
import { useWorkshop, InvoiceRecord } from '../../hooks/useWorkshop';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { ReceiptText, Search, Filter, Eye } from 'lucide-react';

export const InvoicesPage: React.FC = () => {
  const { invoices } = useWorkshop();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PAID' | 'PENDING'>('ALL');
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceRecord | null>(null);

  const calculateGrandTotal = (inv: InvoiceRecord) => {
    const partsTotal = inv.parts.reduce((acc, p) => acc + p.cost, 0);
    const subtotal = partsTotal + inv.laborTotal;
    return subtotal + Math.round(subtotal * 0.18);
  };

  const filteredInvoices = invoices.filter((inv) => {
    const matchesStatus = statusFilter === 'ALL' || inv.paymentStatus === statusFilter;
    const q = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !q ||
      inv.invoiceNumber.toLowerCase().includes(q) ||
      inv.jobId.toLowerCase().includes(q) ||
      inv.customerName.toLowerCase().includes(q) ||
      inv.vehicle.toLowerCase().includes(q) ||
      inv.regNo.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-orange-600">
            <ReceiptText className="w-3.5 h-3.5" />
            <span>Workshop Billing & GST Ledger</span>
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Invoices & Billing ({invoices.length})
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm text-slate-500 font-medium">
            View, print, and share GST tax invoices and customer receipts
          </p>
        </div>
      </div>

      {/* Filter & Search */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by invoice number, customer, or bike..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-slate-500 font-semibold flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5" /> Status:
            </span>
            {(['ALL', 'PAID', 'PENDING'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  statusFilter === st
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                {st === 'ALL' ? 'All Invoices' : st === 'PAID' ? 'Paid Bills' : 'Payment Due'}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Invoices Table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-800">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Invoice No</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Vehicle</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4 text-right">Total (Incl. GST)</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.map((inv) => {
                const isPaid = inv.paymentStatus === 'PAID';
                return (
                  <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-orange-600 text-sm block">
                        {inv.invoiceNumber}
                      </span>
                      <span className="font-mono text-slate-400 text-[11px]">Ref: {inv.jobId}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{inv.customerName}</div>
                      <div className="text-slate-500 font-mono text-[11px] mt-0.5">{inv.customerPhone}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800">{inv.vehicle}</div>
                      <div className="font-mono text-[11px] font-bold text-slate-500">{inv.regNo}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-medium">
                      {formatDate(inv.date)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-black text-slate-900 text-sm">
                      {formatCurrency(calculateGrandTotal(inv))}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block font-mono text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                          isPaid
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-amber-50 text-amber-900 border-amber-200'
                        }`}
                      >
                        {isPaid ? 'PAID' : 'DUE ON PICKUP'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button
                        variant="secondary"
                        size="sm"
                        leftIcon={<Eye className="w-3.5 h-3.5 text-orange-600" />}
                        onClick={() => setSelectedInvoice(inv)}
                      >
                        View Bill
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Reusable GST Invoice Modal */}
      <InvoiceModal
        isOpen={!!selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
        data={selectedInvoice}
      />
    </div>
  );
};
