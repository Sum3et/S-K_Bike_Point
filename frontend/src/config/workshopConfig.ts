/**
 * S K Bike Point — Workshop Configuration
 * 
 * Edit any shop details, address, phone number, and service rates here.
 */

export const WORKSHOP_CONFIG = {
  // Workshop Brand Details
  shopName: "S K Bike Point",
  tagline: "Two-Wheeler Service & Repair Center",
  ownerName: "Sanjay Kumar Yadav",
  
  // Contact & Location Details
  contact: {
    phone: "+91 98699 04097",
    altPhone: "+91 98699 04097",
    whatsapp: "+91 98699 04097",
    email: "contact@skbikepoint.com",
    addressLine1: "Metro Pillar No. 102, JP Rd",
    addressLine2: "Opp. YWCA Girls Hostel, Dhakoji Sethpada, Navneeth Colony, Andheri West",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400058",
    fullAddress: "Metro Pillar No. 102, JP Rd, Opp. YWCA Girls Hostel, Dhakoji Sethpada, Navneeth Colony, Andheri West, Mumbai, Maharashtra 400058",
    timings: "Monday – Saturday: 9:00 AM – 8:00 PM (Sunday Closed)",
  },

  // Key Services Offered at the Workshop
  services: [
    {
      id: "general-service",
      name: "General Periodic Servicing",
      description: "Complete 24-point check, engine oil change, air filter cleaning, brake adjustment & chain lubrication.",
      startingPrice: 450,
      duration: "2 - 3 Hours",
    },
    {
      id: "oil-change",
      name: "Engine Oil & Filter Change",
      description: "Quick engine oil flush using genuine Castrol / Motul oil and OEM filter replacement.",
      startingPrice: 350,
      duration: "30 Minutes",
    },
    {
      id: "brake-service",
      name: "Brakes & Clutch Repair",
      description: "Front/rear brake shoe & disc pad replacement, cable lubrication, and clutch tuning.",
      startingPrice: 250,
      duration: "1 Hour",
    },
    {
      id: "engine-work",
      name: "Engine Repair & Tune-up",
      description: "Tappet adjustment, carburetor cleaning / FI diagnosis, spark plug change, and mileage tuning.",
      startingPrice: 850,
      duration: "1 Day",
    },
    {
      id: "electrical",
      name: "Battery & Wiring Diagnostics",
      description: "Battery charging & testing, starter motor repair, headlight/horn wiring, and fuse replacement.",
      startingPrice: 200,
      duration: "45 Minutes",
    },
    {
      id: "washing",
      name: "Water Foam Wash & Polish",
      description: "High-pressure foam wash, chain degreasing, and spray wax polish.",
      startingPrice: 150,
      duration: "45 Minutes",
    },
  ],
};
