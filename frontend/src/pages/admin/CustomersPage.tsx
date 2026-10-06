import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { useWorkshop, CustomerRecord } from '../../hooks/useWorkshop';
import { formatCurrency } from '../../utils/formatters';
import { Users, Search, Phone, ChevronRight } from 'lucide-react';

export const CustomersPage: React.FC = () => {
  const { customers } = useWorkshop();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerRecord | null>(null);

  const filteredCustomers = customers.filter((c) => {
    const q = searchTerm.toLowerCase().trim();
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.vehicles.some((v) => v.model.toLowerCase().includes(q) || v.regNo.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-orange-600">
            <Users className="w-3.5 h-3.5" />
            <span>Customer & Bike Directory</span>
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Customers & Bikes ({customers.length})
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm text-slate-500 font-medium">
            Search customer records, view registered two-wheelers, visit history, and total spending
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <Card className="p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by customer name, phone, or bike number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
          />
        </div>
      </Card>

      {/* Customer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map((cust) => (
          <div
            key={cust.id}
            className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-orange-300 hover:shadow-sm transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{cust.name}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                    <Phone className="w-3.5 h-3.5 text-orange-600" />
                    <span>{cust.phone}</span>
                  </div>
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {cust.totalVisits} visit{cust.totalVisits > 1 ? 's' : ''}
                </span>
              </div>

              <div className="space-y-2 my-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Registered Bikes ({cust.vehicles.length})
                </span>
                {cust.vehicles.map((v, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-800 block">{v.model}</span>
                      <span className="font-mono text-[11px] text-orange-700 font-bold">{v.regNo}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">Last: {v.lastService}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block">Total Spend</span>
                <strong className="text-slate-900 font-mono font-bold">{formatCurrency(cust.totalSpend)}</strong>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedCustomer(cust)}
                rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
              >
                Profile
              </Button>
            </div>
          </div>
        ))}
      </div>

      {filteredCustomers.length === 0 && (
        <Card className="text-center py-12 text-slate-400">
          <Users className="w-10 h-10 mx-auto text-slate-300 mb-2" />
          <p className="font-bold text-slate-600">No customers found</p>
          <p className="text-xs text-slate-400 mt-1">Check in a bike on the Service Jobs page to register a customer</p>
        </Card>
      )}

      {/* Customer Details Modal */}
      <Modal
        isOpen={!!selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
        title={selectedCustomer?.name || 'Customer Details'}
        description="Customer profile, registered two-wheelers, and workshop spend"
      >
        {selectedCustomer && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Phone:</span>
                <strong className="text-slate-900 font-mono">{selectedCustomer.phone}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Email:</span>
                <strong className="text-slate-900">{selectedCustomer.email}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Customer Since:</span>
                <strong className="text-slate-900">{selectedCustomer.registeredSince}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Total Workshop Spend:</span>
                <strong className="text-orange-600 font-mono text-sm font-black">
                  {formatCurrency(selectedCustomer.totalSpend)}
                </strong>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-800 mb-2">Registered Vehicles</h4>
              <div className="space-y-2">
                {selectedCustomer.vehicles.map((v, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-900 block">{v.model} ({v.year})</span>
                      <span className="font-mono text-xs font-bold text-orange-600">{v.regNo}</span>
                    </div>
                    <span className="text-xs text-slate-500">Last Service: {v.lastService}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end pt-3 border-t border-slate-100">
              <Button variant="secondary" size="sm" onClick={() => setSelectedCustomer(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
