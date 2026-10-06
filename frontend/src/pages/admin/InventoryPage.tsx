import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { useWorkshop, InventoryItem } from '../../hooks/useWorkshop';
import { formatCurrency } from '../../utils/formatters';
import { Boxes, Search, PlusCircle, AlertTriangle, Plus, Minus, Filter } from 'lucide-react';

const inputCls = 'w-full rounded-xl bg-white border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500';

export const InventoryPage: React.FC = () => {
  const { inventory, adjustInventoryStock, addInventoryItem } = useWorkshop();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [newItem, setNewItem] = useState({
    sku: '',
    name: '',
    category: 'Engine Oils' as InventoryItem['category'],
    stock: 5,
    minThreshold: 5,
    unitPrice: 450,
    location: 'Rack A1',
  });

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    addInventoryItem({
      sku: newItem.sku.toUpperCase(),
      name: newItem.name,
      category: newItem.category,
      stock: Number(newItem.stock) || 0,
      minThreshold: Number(newItem.minThreshold) || 3,
      unitPrice: Number(newItem.unitPrice) || 100,
      location: newItem.location,
    });
    setIsAddModalOpen(false);
    setNewItem({
      sku: '',
      name: '',
      category: 'Engine Oils',
      stock: 5,
      minThreshold: 5,
      unitPrice: 450,
      location: 'Rack A1',
    });
  };

  const filteredInventory = inventory.filter((item) => {
    const matchesCat = categoryFilter === 'ALL' || item.category === categoryFilter;
    const q = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !q ||
      item.name.toLowerCase().includes(q) ||
      item.sku.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  const lowStockCount = inventory.filter((i) => i.stock <= i.minThreshold).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-orange-600">
            <Boxes className="w-3.5 h-3.5" />
            <span>Spares & Inventory</span>
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Spare Parts Stock ({inventory.length})
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm text-slate-500 font-medium">
            Monitor spare parts stock, track low-quantity alerts, and update prices
          </p>
        </div>

        <div className="flex items-center gap-3">
          {lowStockCount > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-800">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>{lowStockCount} Low Stock Alert{lowStockCount > 1 ? 's' : ''}</span>
            </div>
          )}
          <Button variant="primary" leftIcon={<PlusCircle className="w-4 h-4" />} onClick={() => setIsAddModalOpen(true)}>
            Add New Part
          </Button>
        </div>
      </div>

      {/* Filter & Search */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by part name, SKU, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-slate-500 font-semibold flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5" /> Category:
            </span>
            {['ALL', 'Engine Oils', 'Braking', 'Electrical', 'Engine Parts', 'Chassis & Chain'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  categoryFilter === cat
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-800">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Part Details / SKU</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4 text-right">Unit Price (₹)</th>
                <th className="py-3.5 px-4 text-center">In Stock</th>
                <th className="py-3.5 px-4 text-right">Stock Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInventory.map((item) => {
                const isLow = item.stock <= item.minThreshold;
                return (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 text-xs">{item.name}</div>
                      <div className="font-mono text-slate-400 text-[11px] mt-0.5">{item.sku}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium text-[11px]">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">{item.location}</td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 text-xs">
                      {formatCurrency(item.unitPrice)}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block font-mono font-bold px-2.5 py-0.5 rounded-full border text-xs ${
                          isLow ? 'bg-rose-50 text-rose-800 border-rose-200' : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        }`}
                      >
                        {item.stock} {isLow ? '(Low)' : 'units'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => adjustInventoryStock(item.id, -1)}
                          className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 flex items-center justify-center font-bold"
                          title="Decrease 1"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => adjustInventoryStock(item.id, 1)}
                          className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 flex items-center justify-center font-bold"
                          title="Increase 1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Item Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add Spare Part" description="Register a new item in the workshop stock ledger">
        <form onSubmit={handleAddItem} className="space-y-3 pt-1">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Part Name</label>
            <input type="text" placeholder="e.g. Bosch Front Disc Brake Pads (Classic 350)" required value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} className={inputCls} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Part SKU / Code</label>
              <input type="text" placeholder="BRK-BOS-RE350" required value={newItem.sku} onChange={(e) => setNewItem({ ...newItem, sku: e.target.value })} className={`${inputCls} uppercase font-mono`} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
              <select value={newItem.category} onChange={(e) => setNewItem({ ...newItem, category: e.target.value as any })} className={inputCls}>
                <option>Engine Oils</option>
                <option>Braking</option>
                <option>Electrical</option>
                <option>Engine Parts</option>
                <option>Chassis & Chain</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Initial Stock</label>
              <input type="number" required value={newItem.stock} onChange={(e) => setNewItem({ ...newItem, stock: Number(e.target.value) })} className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Min. Alert Level</label>
              <input type="number" required value={newItem.minThreshold} onChange={(e) => setNewItem({ ...newItem, minThreshold: Number(e.target.value) })} className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Unit Price (₹)</label>
              <input type="number" required value={newItem.unitPrice} onChange={(e) => setNewItem({ ...newItem, unitPrice: Number(e.target.value) })} className={inputCls} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Rack / Bin Location</label>
            <input type="text" placeholder="e.g. Rack B-3 / Top Shelf" required value={newItem.location} onChange={(e) => setNewItem({ ...newItem, location: e.target.value })} className={inputCls} />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <Button variant="secondary" type="button" size="sm" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit" size="sm">Save Spare Part</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
