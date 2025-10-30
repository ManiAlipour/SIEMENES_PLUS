// -----------------------------------------------------------------------------
// highlighted-categories.ts
// دیتا برای سکشن اسکرول افقی دسته‌های منتخب
// نوشته شده توسط مانی 😎
// -----------------------------------------------------------------------------

export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
};

export type HighlightedCategory = {
  id: string;
  title: string;
  products: Product[];
};

export const highlightedCategories: HighlightedCategory[] = [
  {
    id: "controllers",
    title: "کنترلرها (PLC / DCS)",
    products: [
      {
        id: "plc1",
        name: "SIMATIC S7‑1200 PLC",
        price: 8500000,
        image: "/images/products/plc.png",
      },
      {
        id: "plc2",
        name: "SIMATIC S7‑1500 PLC",
        price: 12500000,
        image: "/images/products/plc.png",
      },
      {
        id: "plc3",
        name: "LOGO! MINI Controller",
        price: 4800000,
        image: "/images/products/plc.png",
      },
      {
        id: "plc4",
        name: "ET200SP Remote I/O",
        price: 6500000,
        image: "/images/products/plc.png",
      },
      {
        id: "plc5",
        name: "SIMATIC S5 Legacy Unit",
        price: 3200000,
        image: "/images/products/plc.png",
      },
      {
        id: "plc6",
        name: "DCS Redundant Controller",
        price: 18500000,
        image: "/images/products/plc.png",
      },
    ],
  },
  {
    id: "drives",
    title: "درایوها و اینورترها",
    products: [
      {
        id: "inv1",
        name: "SINAMICS G120 Standard Inverter",
        price: 6700000,
        image: "/images/products/inverter.png",
      },
      {
        id: "inv2",
        name: "MICROMASTER 440 Inverter",
        price: 5900000,
        image: "/images/products/inverter.png",
      },
      {
        id: "inv3",
        name: "SINAMICS S210 Servo Drive",
        price: 9100000,
        image: "/images/products/inverter.png",
      },
      {
        id: "inv4",
        name: "SINAMICS G120X HVAC Drive",
        price: 7300000,
        image: "/images/products/inverter.png",
      },
      {
        id: "inv5",
        name: "MICROMASTER 420 Compact Drive",
        price: 5100000,
        image: "/images/products/inverter.png",
      },
      {
        id: "inv6",
        name: "SINAMICS V90 Servo System",
        price: 10800000,
        image: "/images/products/inverter.png",
      },
    ],
  },
  {
    id: "interfaces",
    title: "واسط‌های ماشین و انسان (HMI)",
    products: [
      {
        id: "hmi1",
        name: "SIMATIC HMI KTP700 Basic",
        price: 5200000,
        image: "/images/products/hmi.png",
      },
      {
        id: "hmi2",
        name: "SIMATIC HMI TP1200 Comfort",
        price: 9800000,
        image: "/images/products/hmi.png",
      },
      {
        id: "hmi3",
        name: "SIMATIC Mobile Panel 277",
        price: 8700000,
        image: "/images/products/hmi.png",
      },
      {
        id: "hmi4",
        name: "Unified Comfort Panel 22",
        price: 15400000,
        image: "/images/products/hmi.png",
      },
      {
        id: "hmi5",
        name: "SIMATIC Smart-Line 1000",
        price: 6500000,
        image: "/images/products/hmi.png",
      },
      {
        id: "hmi6",
        name: "Pro-face HMI AGP3300T",
        price: 5700000,
        image: "/images/products/hmi.png",
      },
    ],
  },
];
