import React, { createContext, useContext, useState, useEffect } from 'react';
import { ServiceStatus } from '../types/dashboard';

export interface ServiceJob {
  jobId: string;
  customerName: string;
  customerPhone: string;
  vehicleModel: string;
  registrationNumber: string;
  serviceType: string;
  status: ServiceStatus;
  estimatedCost: number;
  assignedMechanic: string;
  createdDate: string;
  stageName: string;
  stageNumber: number;
  totalStages: number;
  diagnosticNotes: string;
  replacedParts: { name: string; cost: number; hsn?: string }[];
  paymentStatus: 'PAID' | 'PENDING';
}

export interface CustomerRecord {
  id: number;
  name: string;
  phone: string;
  email: string;
  registeredSince: string;
  totalSpend: number;
  totalVisits: number;
  vehicles: {
    model: string;
    regNo: string;
    year: string;
    lastService: string;
  }[];
}

export interface InvoiceRecord {
  id: string;
  invoiceNumber: string;
  jobId: string;
  customerName: string;
  customerPhone: string;
  vehicle: string;
  regNo: string;
  date: string;
  laborTotal: number;
  parts: { name: string; cost: number; hsn?: string }[];
  paymentStatus: 'PAID' | 'PENDING';
  assignedMechanic: string;
}

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: 'Engine Oils' | 'Braking' | 'Electrical' | 'Engine Parts' | 'Chassis & Chain';
  stock: number;
  minThreshold: number;
  unitPrice: number;
  location: string;
}

const DEFAULT_JOBS: ServiceJob[] = [
  {
    jobId: 'JOB-2026-081',
    customerName: 'Rahul Sharma',
    customerPhone: '+91 98230 12345',
    vehicleModel: 'Royal Enfield Classic 350',
    registrationNumber: 'MH 02 AB 1234',
    serviceType: 'General Full Service + Motul Synthetic Oil',
    status: 'IN_PROGRESS',
    estimatedCost: 2785,
    assignedMechanic: 'Sanjay Yadav (Workshop Head)',
    createdDate: new Date().toISOString(),
    stageName: 'Engine Oil Flush & Tappet Valve Adjustment',
    stageNumber: 3,
    totalStages: 5,
    diagnosticNotes: 'Tappet clearance set to factory spec (0.08mm). Brake pads have ~65% life remaining.',
    replacedParts: [
      { name: 'Motul 7100 15W-50 (2.5L)', cost: 1850, hsn: '2710' },
      { name: 'RE Genuine Oil Filter', cost: 165, hsn: '8714' },
      { name: 'Spark Plug Dual Set', cost: 320, hsn: '8714' },
    ],
    paymentStatus: 'PENDING',
  },
  {
    jobId: 'JOB-2026-080',
    customerName: 'Pooja Patel',
    customerPhone: '+91 98765 43210',
    vehicleModel: 'Honda Activa 6G',
    registrationNumber: 'MH 02 CD 5678',
    serviceType: 'Express Service & Rear Brake Shoe Replacement',
    status: 'READY',
    estimatedCost: 1170,
    assignedMechanic: 'Ramesh (Mechanic)',
    createdDate: new Date(Date.now() - 3600000 * 3).toISOString(),
    stageName: 'Washed, Polished & Ready for Pickup',
    stageNumber: 5,
    totalStages: 5,
    diagnosticNotes: 'Brake cable lubricated. Road test completed smoothly.',
    replacedParts: [
      { name: 'Castrol Activ 10W-30 Scooter Oil (800ml)', cost: 380, hsn: '2710' },
      { name: 'Honda Genuine Rear Brake Shoes', cost: 340, hsn: '8714' },
    ],
    paymentStatus: 'PAID',
  },
  {
    jobId: 'JOB-2026-079',
    customerName: 'Vikram Mehta',
    customerPhone: '+91 97654 32109',
    vehicleModel: 'Yamaha MT-15 V2',
    registrationNumber: 'MH 02 EF 9012',
    serviceType: 'Chain Sprocket Set & Coolant Flush',
    status: 'INSPECTION',
    estimatedCost: 3200,
    assignedMechanic: 'Sanjay Yadav (Workshop Head)',
    createdDate: new Date(Date.now() - 3600000 * 5).toISOString(),
    stageName: 'Initial Diagnostics & Chain Slack Check',
    stageNumber: 1,
    totalStages: 4,
    diagnosticNotes: 'Chain teeth worn out. Replacement sprocket kit recommended.',
    replacedParts: [{ name: 'Rolon Brass Chain Sprocket Kit', cost: 2450, hsn: '8714' }],
    paymentStatus: 'PENDING',
  },
  {
    jobId: 'JOB-2026-078',
    customerName: 'Anil Deshmukh',
    customerPhone: '+91 91234 56780',
    vehicleModel: 'Hero Splendor Plus',
    registrationNumber: 'MH 02 GH 3456',
    serviceType: 'Carburetor Clean & Clutch Cable Replacement',
    status: 'RECEIVED',
    estimatedCost: 650,
    assignedMechanic: 'Sanjay Yadav (Workshop Head)',
    createdDate: new Date(Date.now() - 3600000 * 8).toISOString(),
    stageName: 'Vehicle Intake & Token Issued',
    stageNumber: 1,
    totalStages: 4,
    diagnosticNotes: 'Low idle rpm. Carburetor jet cleaning scheduled.',
    replacedParts: [{ name: 'Hero Genuine Clutch Cable', cost: 140, hsn: '8714' }],
    paymentStatus: 'PENDING',
  },
  {
    jobId: 'JOB-2026-077',
    customerName: 'Karan Johar',
    customerPhone: '+91 99887 76655',
    vehicleModel: 'KTM Duke 250',
    registrationNumber: 'MH 02 JK 7890',
    serviceType: 'Full Synthetic Service & Front Disc Brake Pads',
    status: 'DELIVERED',
    estimatedCost: 4100,
    assignedMechanic: 'Ramesh (Mechanic)',
    createdDate: new Date(Date.now() - 86400000).toISOString(),
    stageName: 'Delivered & Bill Settled',
    stageNumber: 5,
    totalStages: 5,
    diagnosticNotes: 'Brake fluid flushed with DOT 4. Test ride approved.',
    replacedParts: [
      { name: 'Motul 300V 15W-50 Ester (1.5L)', cost: 1800, hsn: '2710' },
      { name: 'KTM OEM Sintered Brake Pads', cost: 1450, hsn: '8714' },
    ],
    paymentStatus: 'PAID',
  },
];

const DEFAULT_CUSTOMERS: CustomerRecord[] = [
  {
    id: 1,
    name: 'Rahul Sharma',
    phone: '+91 98230 12345',
    email: 'rahul.sharma@example.com',
    registeredSince: 'Jan 2025',
    totalSpend: 14500,
    totalVisits: 5,
    vehicles: [
      { model: 'Royal Enfield Classic 350', regNo: 'MH 02 AB 1234', year: '2023', lastService: 'Today' },
      { model: 'Honda Activa 5G', regNo: 'MH 02 XZ 9900', year: '2019', lastService: '12 Jan 2026' },
    ],
  },
  {
    id: 2,
    name: 'Pooja Patel',
    phone: '+91 98765 43210',
    email: 'pooja.patel@example.com',
    registeredSince: 'Mar 2025',
    totalSpend: 6200,
    totalVisits: 3,
    vehicles: [
      { model: 'Honda Activa 6G', regNo: 'MH 02 CD 5678', year: '2022', lastService: 'Today' },
    ],
  },
  {
    id: 3,
    name: 'Vikram Mehta',
    phone: '+91 97654 32109',
    email: 'vikram.m@example.com',
    registeredSince: 'Jun 2025',
    totalSpend: 9800,
    totalVisits: 4,
    vehicles: [
      { model: 'Yamaha MT-15 V2', regNo: 'MH 02 EF 9012', year: '2023', lastService: '20 Feb 2026' },
    ],
  },
  {
    id: 4,
    name: 'Anil Deshmukh',
    phone: '+91 91234 56780',
    email: 'anil.deshmukh@example.com',
    registeredSince: 'Nov 2024',
    totalSpend: 3400,
    totalVisits: 2,
    vehicles: [
      { model: 'Hero Splendor Plus', regNo: 'MH 02 GH 3456', year: '2021', lastService: '15 Jan 2026' },
    ],
  },
  {
    id: 5,
    name: 'Karan Johar',
    phone: '+91 99887 76655',
    email: 'karan.j@example.com',
    registeredSince: 'Aug 2025',
    totalSpend: 18200,
    totalVisits: 6,
    vehicles: [
      { model: 'KTM Duke 250', regNo: 'MH 02 JK 7890', year: '2024', lastService: 'Yesterday' },
    ],
  },
];

const DEFAULT_INVOICES: InvoiceRecord[] = [
  {
    id: '1',
    invoiceNumber: 'SKB-INV-2026-080',
    jobId: 'JOB-2026-080',
    customerName: 'Pooja Patel',
    customerPhone: '+91 98765 43210',
    vehicle: 'Honda Activa 6G',
    regNo: 'MH 02 CD 5678',
    date: '2026-09-29',
    laborTotal: 250,
    parts: [
      { name: 'Castrol Activ 10W-30 Scooter Oil (800ml)', cost: 380, hsn: '2710' },
      { name: 'Honda Genuine Rear Brake Shoes', cost: 340, hsn: '8714' },
    ],
    paymentStatus: 'PAID',
    assignedMechanic: 'Ramesh (Mechanic)',
  },
  {
    id: '2',
    invoiceNumber: 'SKB-INV-2026-081',
    jobId: 'JOB-2026-081',
    customerName: 'Rahul Sharma',
    customerPhone: '+91 98230 12345',
    vehicle: 'Royal Enfield Classic 350',
    regNo: 'MH 02 AB 1234',
    date: '2026-09-29',
    laborTotal: 450,
    parts: [
      { name: 'Motul 7100 15W-50 (2.5L)', cost: 1850, hsn: '2710' },
      { name: 'Royal Enfield Genuine Oil Filter', cost: 165, hsn: '8714' },
      { name: 'Spark Plug Dual Set', cost: 320, hsn: '8714' },
    ],
    paymentStatus: 'PENDING',
    assignedMechanic: 'Sanjay Yadav (Workshop Head)',
  },
  {
    id: '3',
    invoiceNumber: 'SKB-INV-2026-077',
    jobId: 'JOB-2026-077',
    customerName: 'Karan Johar',
    customerPhone: '+91 99887 76655',
    vehicle: 'KTM Duke 250',
    regNo: 'MH 02 JK 7890',
    date: '2026-09-28',
    laborTotal: 850,
    parts: [
      { name: 'Motul 300V 15W-50 Ester (1.5L)', cost: 1800, hsn: '2710' },
      { name: 'KTM OEM Sintered Brake Pads', cost: 1450, hsn: '8714' },
    ],
    paymentStatus: 'PAID',
    assignedMechanic: 'Ramesh (Mechanic)',
  },
  {
    id: '4',
    invoiceNumber: 'SKB-INV-2026-076',
    jobId: 'JOB-2026-076',
    customerName: 'Sanjay Deshmukh',
    customerPhone: '+91 98112 33445',
    vehicle: 'Bajaj Pulsar 150',
    regNo: 'MH 02 PQ 1122',
    date: '2026-09-27',
    laborTotal: 450,
    parts: [
      { name: 'Castrol Power1 20W-40 (1L)', cost: 420, hsn: '2710' },
      { name: 'Pulsar Genuine Clutch Plate Set', cost: 890, hsn: '8714' },
    ],
    paymentStatus: 'PAID',
    assignedMechanic: 'Ramesh (Mechanic)',
  },
];

const DEFAULT_INVENTORY: InventoryItem[] = [
  {
    id: '1',
    sku: 'OIL-MOT-7100',
    name: 'Motul 7100 4T 15W-50 Fully Synthetic (1L)',
    category: 'Engine Oils',
    stock: 2,
    minThreshold: 8,
    unitPrice: 750,
    location: 'Rack A1 - Top',
  },
  {
    id: '2',
    sku: 'OIL-CAS-ACT10W30',
    name: 'Castrol Activ 10W-30 Scooter Oil (800ml)',
    category: 'Engine Oils',
    stock: 14,
    minThreshold: 6,
    unitPrice: 380,
    location: 'Rack A2',
  },
  {
    id: '3',
    sku: 'BRK-HON-ACT-RR',
    name: 'Honda Genuine Rear Brake Shoes (Activa/Dio)',
    category: 'Braking',
    stock: 3,
    minThreshold: 6,
    unitPrice: 340,
    location: 'Bin B-12',
  },
  {
    id: '4',
    sku: 'BRK-RE-PAD-FR',
    name: 'Royal Enfield Classic 350 Disc Brake Pads (Front)',
    category: 'Braking',
    stock: 8,
    minThreshold: 4,
    unitPrice: 580,
    location: 'Bin B-04',
  },
  {
    id: '5',
    sku: 'FIL-RE-OIL-GEN',
    name: 'Royal Enfield Genuine Engine Oil Filter Element',
    category: 'Engine Parts',
    stock: 12,
    minThreshold: 5,
    unitPrice: 165,
    location: 'Bin C-01',
  },
  {
    id: '6',
    sku: 'SPK-NGK-CPR8EA',
    name: 'NGK CPR8EA-9 Spark Plug Set',
    category: 'Electrical',
    stock: 1,
    minThreshold: 10,
    unitPrice: 320,
    location: 'Drawer E-2',
  },
  {
    id: '7',
    sku: 'CHN-ROL-BRASS',
    name: 'Rolon Brass Heavy Duty Chain & Sprocket Kit',
    category: 'Chassis & Chain',
    stock: 4,
    minThreshold: 3,
    unitPrice: 2450,
    location: 'Rack D-Bottom',
  },
];

interface WorkshopContextType {
  jobs: ServiceJob[];
  customers: CustomerRecord[];
  invoices: InvoiceRecord[];
  inventory: InventoryItem[];
  addJob: (job: {
    customerName: string;
    customerPhone: string;
    vehicleModel: string;
    registrationNumber: string;
    serviceType: string;
    assignedMechanic: string;
    estimatedCost: number;
    diagnosticNotes?: string;
  }) => ServiceJob;
  updateJobStatus: (jobId: string, status: ServiceStatus, notes?: string) => void;
  addCustomer: (cust: {
    name: string;
    phone: string;
    email?: string;
    bikeModel: string;
    regNo: string;
    year?: string;
  }) => CustomerRecord;
  adjustInventoryStock: (id: string, delta: number) => void;
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => void;
  markInvoicePaid: (invoiceNumber: string) => void;
  lookupJob: (query: string) => ServiceJob | undefined;
}

const WorkshopContext = createContext<WorkshopContextType | undefined>(undefined);

const loadStorage = <T,>(key: string, defaultVal: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultVal;
  } catch {
    return defaultVal;
  }
};

const saveStorage = <T,>(key: string, val: T) => {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.error('Storage save error:', e);
  }
};

export const WorkshopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [jobs, setJobs] = useState<ServiceJob[]>(() => loadStorage('sk_jobs', DEFAULT_JOBS));
  const [customers, setCustomers] = useState<CustomerRecord[]>(() => loadStorage('sk_customers', DEFAULT_CUSTOMERS));
  const [invoices, setInvoices] = useState<InvoiceRecord[]>(() => loadStorage('sk_invoices', DEFAULT_INVOICES));
  const [inventory, setInventory] = useState<InventoryItem[]>(() => loadStorage('sk_inventory', DEFAULT_INVENTORY));

  useEffect(() => { saveStorage('sk_jobs', jobs); }, [jobs]);
  useEffect(() => { saveStorage('sk_customers', customers); }, [customers]);
  useEffect(() => { saveStorage('sk_invoices', invoices); }, [invoices]);
  useEffect(() => { saveStorage('sk_inventory', inventory); }, [inventory]);

  const addJob = (data: {
    customerName: string;
    customerPhone: string;
    vehicleModel: string;
    registrationNumber: string;
    serviceType: string;
    assignedMechanic: string;
    estimatedCost: number;
    diagnosticNotes?: string;
  }): ServiceJob => {
    const nextNum = jobs.length + 82;
    const jobId = `JOB-2026-0${nextNum}`;
    const cleanReg = data.registrationNumber.toUpperCase().trim();

    const newJob: ServiceJob = {
      jobId,
      customerName: data.customerName.trim(),
      customerPhone: data.customerPhone.trim(),
      vehicleModel: data.vehicleModel.trim(),
      registrationNumber: cleanReg,
      serviceType: data.serviceType,
      status: 'RECEIVED',
      estimatedCost: Number(data.estimatedCost) || 850,
      assignedMechanic: data.assignedMechanic,
      createdDate: new Date().toISOString(),
      stageName: 'Vehicle Intake & Token Issued',
      stageNumber: 1,
      totalStages: 5,
      diagnosticNotes: data.diagnosticNotes || 'Initial check-in diagnostics logged.',
      replacedParts: [],
      paymentStatus: 'PENDING',
    };

    setJobs((prev) => [newJob, ...prev]);

    // Also create matching invoice
    const newInvoice: InvoiceRecord = {
      id: String(Date.now()),
      invoiceNumber: `SKB-INV-2026-0${nextNum}`,
      jobId,
      customerName: data.customerName.trim(),
      customerPhone: data.customerPhone.trim(),
      vehicle: data.vehicleModel.trim(),
      regNo: cleanReg,
      date: new Date().toISOString().split('T')[0],
      laborTotal: 450,
      parts: [],
      paymentStatus: 'PENDING',
      assignedMechanic: data.assignedMechanic,
    };
    setInvoices((prev) => [newInvoice, ...prev]);

    // Ensure customer is registered
    setCustomers((prev) => {
      const existing = prev.find(
        (c) => c.phone.replace(/[^0-9]/g, '') === data.customerPhone.replace(/[^0-9]/g, '')
      );
      if (existing) {
        return prev.map((c) =>
          c.id === existing.id
            ? {
                ...c,
                totalVisits: c.totalVisits + 1,
                vehicles: c.vehicles.some((v) => v.regNo === cleanReg)
                  ? c.vehicles
                  : [...c.vehicles, { model: data.vehicleModel, regNo: cleanReg, year: '2024', lastService: 'Today' }],
              }
            : c
        );
      }
      const newCust: CustomerRecord = {
        id: Date.now(),
        name: data.customerName.trim(),
        phone: data.customerPhone.trim(),
        email: `${data.customerName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
        registeredSince: 'Today',
        totalSpend: 0,
        totalVisits: 1,
        vehicles: [{ model: data.vehicleModel, regNo: cleanReg, year: '2024', lastService: 'Today' }],
      };
      return [newCust, ...prev];
    });

    return newJob;
  };

  const updateJobStatus = (jobId: string, status: ServiceStatus, notes?: string) => {
    const stageMap: Record<ServiceStatus, { num: number; name: string }> = {
      RECEIVED: { num: 1, name: 'Vehicle Intake & Token Issued' },
      INSPECTION: { num: 2, name: '24-Point Mechanical Check' },
      IN_PROGRESS: { num: 3, name: 'Parts Replacement & Oil Flush in Progress' },
      READY: { num: 4, name: 'Washed, Polished & Ready for Pickup' },
      DELIVERED: { num: 5, name: 'Delivered & Bill Settled' },
    };

    const info = stageMap[status];

    setJobs((prev) =>
      prev.map((j) => {
        if (j.jobId !== jobId) return j;
        return {
          ...j,
          status,
          stageNumber: info.num,
          stageName: info.name,
          diagnosticNotes: notes || j.diagnosticNotes,
          paymentStatus: status === 'DELIVERED' ? ('PAID' as const) : j.paymentStatus,
        };
      })
    );

    if (status === 'DELIVERED') {
      setInvoices((prev) =>
        prev.map((inv) => (inv.jobId === jobId ? { ...inv, paymentStatus: 'PAID' as const } : inv))
      );
    }
  };

  const addCustomer = (data: {
    name: string;
    phone: string;
    email?: string;
    bikeModel: string;
    regNo: string;
    year?: string;
  }): CustomerRecord => {
    const newCustomer: CustomerRecord = {
      id: Date.now(),
      name: data.name.trim(),
      phone: data.phone.trim(),
      email: data.email?.trim() || `${data.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      registeredSince: 'Just Now',
      totalSpend: 0,
      totalVisits: 1,
      vehicles: [
        {
          model: data.bikeModel.trim(),
          regNo: data.regNo.toUpperCase().trim(),
          year: data.year || '2024',
          lastService: 'Check-in Today',
        },
      ],
    };
    setCustomers((prev) => [newCustomer, ...prev]);
    return newCustomer;
  };

  const adjustInventoryStock = (id: string, delta: number) => {
    setInventory((prev) =>
      prev.map((i) => (i.id === id ? { ...i, stock: Math.max(0, i.stock + delta) } : i))
    );
  };

  const addInventoryItem = (item: Omit<InventoryItem, 'id'>) => {
    const newItem: InventoryItem = { ...item, id: String(Date.now()) };
    setInventory((prev) => [newItem, ...prev]);
  };

  const markInvoicePaid = (invNum: string) => {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.invoiceNumber === invNum || inv.id === invNum ? { ...inv, paymentStatus: 'PAID' as const } : inv
      )
    );
  };

  const lookupJob = (query: string): ServiceJob | undefined => {
    const clean = query.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (!clean) return undefined;
    return jobs.find(
      (j) =>
        j.jobId.replace(/[^A-Z0-9]/g, '') === clean ||
        j.registrationNumber.replace(/[^A-Z0-9]/g, '') === clean
    );
  };

  return (
    <WorkshopContext.Provider
      value={{
        jobs,
        customers,
        invoices,
        inventory,
        addJob,
        updateJobStatus,
        addCustomer,
        adjustInventoryStock,
        addInventoryItem,
        markInvoicePaid,
        lookupJob,
      }}
    >
      {children}
    </WorkshopContext.Provider>
  );
};

export const useWorkshop = (): WorkshopContextType => {
  const context = useContext(WorkshopContext);
  if (!context) {
    throw new Error('useWorkshop must be used within a WorkshopProvider');
  }
  return context;
};
