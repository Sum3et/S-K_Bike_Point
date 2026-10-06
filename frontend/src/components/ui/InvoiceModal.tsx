import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { WORKSHOP_CONFIG } from '../../config/workshopConfig';
import { formatCurrency } from '../../utils/formatters';
import { Wrench, Printer, MessageCircle, Check, Clock } from 'lucide-react';

export interface InvoiceModalData {
  jobId?: string;
  invoiceNumber?: string;
  invoiceId?: string;
  customer?: string;
  customerName?: string;
  customerPhone?: string;
  vehicle?: string;
  vehicleModel?: string;
  regNo?: string;
  registrationNumber?: string;
  date?: string;
  laborTotal?: number;
  parts?: { name: string; cost: number; hsn?: string }[];
  replacedParts?: { name: string; cost: number; hsn?: string }[];
  paymentStatus?: 'PAID' | 'PENDING' | string;
  assignedMechanic?: string;
}

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: InvoiceModalData | null;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ isOpen, onClose, data }) => {
  if (!data) return null;

  const isPaid = data.paymentStatus === 'PAID';
  const partsList = data.replacedParts || data.parts || [];
  const partsTotal = partsList.reduce((acc, p) => acc + (p.cost || 0), 0);
  const laborTotal = data.laborTotal ?? 450;
  const subtotal = partsTotal + laborTotal;
  const cgst = Math.round(subtotal * 0.09);
  const sgst = Math.round(subtotal * 0.09);
  const grandTotal = subtotal + cgst + sgst;

  const jobId = data.jobId || 'JOB-2026-081';
  const invNum = data.invoiceNumber || data.invoiceId || `SKB-INV-${jobId.replace(/[^0-9]/g, '') || '2026-081'}`;
  const regNo = data.regNo || data.registrationNumber || 'MH 02 AB 1234';
  const vehicle = data.vehicle || data.vehicleModel || 'Two Wheeler';
  const customer = data.customer || data.customerName || 'Customer';
  const mechanic = data.assignedMechanic || 'Workshop Staff';
  const billDate = data.date || new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isPaid ? 'GST Tax Invoice' : 'Workshop Job Card & Cost Estimate'}
      description={isPaid ? 'Official GST service bill & receipt (Paid)' : 'Provisional estimate — Official GST Tax Invoice issued on pickup payment.'}
      size="lg"
    >
      <div className="space-y-4">
        <div id="printable-gst-invoice" className="p-5 sm:p-6 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs shadow-xs space-y-4 font-sans">
          {/* Invoice Header */}
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4 pb-4 border-b-2 border-slate-900">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-600 text-white font-bold">
                  <Wrench className="w-4 h-4" />
                </div>
                <span className="text-base font-black uppercase text-slate-950 font-mono tracking-tight">{WORKSHOP_CONFIG.shopName}</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium mt-1">Bike & Scooter Service • Genuine Spare Parts</p>
              <p className="text-[11px] text-slate-600 max-w-sm mt-0.5 leading-relaxed">{WORKSHOP_CONFIG.contact.fullAddress}</p>
              <p className="text-[11px] text-slate-700 font-bold mt-1">Phone: {WORKSHOP_CONFIG.contact.phone}</p>
            </div>

            <div className="text-left sm:text-right space-y-1">
              <span className={`inline-block px-2.5 py-0.5 rounded font-mono text-xs font-black uppercase border ${
                isPaid ? 'bg-emerald-100 text-emerald-900 border-emerald-300' : 'bg-amber-100 text-amber-900 border-amber-300'
              }`}>
                {isPaid ? '✓ PAID TAX INVOICE' : 'ESTIMATE (PAY ON PICKUP)'}
              </span>
              <p className="font-mono text-xs font-bold text-slate-950 mt-1">{isPaid ? `Invoice: ${invNum}` : `Doc: EST-${jobId}`}</p>
              <p className="text-[11px] text-slate-600">Job Card: <strong>{jobId}</strong></p>
              <p className="text-[11px] text-slate-600">Date: <strong>{billDate}</strong></p>
              <p className="text-[10px] text-slate-500 font-mono">GSTIN: 27AABCS1429B1Z8 (MH)</p>
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Vehicle Reg No</span>
              <span className="font-mono text-slate-950 text-sm font-bold">{regNo}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Vehicle Model</span>
              <span className="font-bold text-slate-800">{vehicle}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Customer</span>
              <span className="font-bold text-slate-800">{customer}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Lead Mechanic</span>
              <span className="font-bold text-slate-800">{mechanic}</span>
            </div>
          </div>

          {/* Table */}
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
                {partsList.map((part, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-2 px-3 font-mono text-slate-400">{idx + 1}</td>
                    <td className="py-2 px-3 font-medium text-slate-900">{part.name}</td>
                    <td className="py-2 px-3 text-center font-mono text-slate-500 text-[11px]">{part.hsn || '8714 / 2710'}</td>
                    <td className="py-2 px-3 text-center font-mono">1</td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">{formatCurrency(part.cost)}</td>
                  </tr>
                ))}
                <tr className="hover:bg-slate-50/50">
                  <td className="py-2 px-3 font-mono text-slate-400">{partsList.length + 1}</td>
                  <td className="py-2 px-3 font-medium text-slate-900">Workshop Service Labor, 24-Point Inspection & Tuning</td>
                  <td className="py-2 px-3 text-center font-mono text-slate-500 text-[11px]">998729</td>
                  <td className="py-2 px-3 text-center font-mono">1</td>
                  <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">{formatCurrency(laborTotal)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Bottom Totals */}
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4 pt-2">
            <div className="space-y-1.5 text-[11px] text-slate-600 max-w-xs">
              {isPaid ? (
                <div className="flex items-center gap-1.5 text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200">
                  <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                  <span>Paid in Full (Cash / UPI / QR)</span>
                </div>
              ) : (
                <div className="space-y-1 p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900">
                  <div className="flex items-center gap-1.5 font-bold text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-amber-700" />
                    <span>Payment Pending on Bike Pickup</span>
                  </div>
                  <p className="text-[10px] text-amber-800 leading-normal">
                    Pay at the counter when picking up your bike. Stamped GST Tax Invoice will be handed over.
                  </p>
                </div>
              )}
              <p className="text-[10px] text-slate-500 pt-1">
                * 30-day / 1,000 km workshop warranty on service labor. 100% genuine parts guaranteed.
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

          <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
            <div>
              <span>Signatory: </span>
              <strong className="text-slate-900">{WORKSHOP_CONFIG.ownerName}</strong>
            </div>
            <div className="text-right">
              <span className="italic">S K Bike Point • Andheri West, Mumbai</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <Button variant="secondary" size="sm" onClick={onClose}>Close</Button>
          <div className="flex items-center gap-2">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(
                `*S K BIKE POINT - ${isPaid ? 'GST Service Invoice (PAID)' : 'Job Card & Estimate'}*\nVehicle: ${regNo} (${vehicle})\nJob Card: ${jobId}\nTotal: ${formatCurrency(grandTotal)}\nStatus: ${isPaid ? 'Paid & Ready for Collection' : 'In Progress (Payment on Pickup)'}\nWorkshop: +91 98699 04097`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="secondary" size="sm" leftIcon={<MessageCircle className="w-3.5 h-3.5 text-emerald-600" />}>
                WhatsApp
              </Button>
            </a>
            <Button variant="primary" size="sm" onClick={() => window.print()} leftIcon={<Printer className="w-3.5 h-3.5" />}>
              {isPaid ? 'Print Tax Invoice (PDF)' : 'Print Estimate'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
