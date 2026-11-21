import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  ShoppingBag,
  BarChart3,
  Eye,
  RotateCcw,
  Trash2,
  Download,
  X,
  ArrowLeft,
  Users,
  UserPlus,
  Printer,
  Plus,
  Minus,
  CheckCircle2,
  Briefcase,
  Sliders,
  Upload,
  Image as ImageIcon,
  Search,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Package,
  Receipt,
  Tag,
} from 'lucide-react';

const STORAGE_KEY = 'msj_tier3_demo_v1';
const ITEMS_PER_PAGE = 6;

const INITIAL_DATA = {
  products: [
    {
      id: 'sg-1',
      name: 'Susquehanna Heavyweight Fleece Hoodie',
      category: 'Hoodies',
      price: 78,
      unitCost: 24,
      badge: 'Flagship Drop',
      description: '480 GSM brushed cotton fleece pullover hoodie with double-lined hood.',
      image: '',
      sizeStock: { S: 6, M: 12, L: 14, XL: 8, '2XL': 4 },
    },
    {
      id: 'sg-2',
      name: 'Vintage Wash Box Graphic Tee',
      category: 'Tees',
      price: 42,
      unitCost: 11.5,
      badge: 'Best Seller',
      description: '280 GSM pigment-dyed combed cotton boxy t-shirt with puff print.',
      image: '',
      sizeStock: { S: 10, M: 18, L: 15, XL: 9, '2XL': 5 },
    },
    {
      id: 'sg-3',
      name: 'Technical Utility Cargo Pant',
      category: 'Bottoms',
      price: 92,
      unitCost: 28,
      badge: 'Limited Run',
      description: 'Ripstop cotton-nylon articulated cargo trousers with adjustable ankle toggles.',
      image: '',
      sizeStock: { S: 4, M: 7, L: 8, XL: 5, '2XL': 2 },
    },
    {
      id: 'sg-4',
      name: 'Harrisburg Heritage Quilted Work Jacket',
      category: 'Outerwear',
      price: 128,
      unitCost: 41,
      badge: 'Winter Capsule',
      description: 'Heavy canvas chore coat with diamond-quilted insulated lining and brass hardware.',
      image: '',
      sizeStock: { S: 3, M: 6, L: 7, XL: 4, '2XL': 2 },
    },
    {
      id: 'sg-5',
      name: 'Garment-Dyed Thermal Waffle Long Sleeve',
      category: 'Tees',
      price: 54,
      unitCost: 15.5,
      badge: 'Core Essential',
      description: 'Midweight textured waffle-knit crewneck shirt built for layering.',
      image: '',
      sizeStock: { S: 8, M: 11, L: 9, XL: 6, '2XL': 3 },
    },
    {
      id: 'sg-6',
      name: 'Brushed Loopback Sweatpant',
      category: 'Bottoms',
      price: 72,
      unitCost: 21,
      badge: 'Restocked',
      description: 'Relaxed straight-leg French terry sweatpants with deep welt pockets.',
      image: '',
      sizeStock: { S: 5, M: 9, L: 10, XL: 5, '2XL': 2 },
    },
  ],
  orders: [
    {
      id: 'SG-2041',
      date: '2026-11-20',
      customerName: 'Jordan Taylor',
      customerEmail: 'jtaylor@example.com',
      address: '215 State St, Harrisburg, PA 17101',
      items: [
        {
          id: 'sg-1',
          name: 'Susquehanna Heavyweight Fleece Hoodie',
          size: 'L',
          qty: 2,
          price: 78,
          unitCost: 24,
        },
      ],
      subtotal: 156,
      discount: 0,
      shippingCollected: 0,
      total: 156,
      cogs: 48,
      labelCost: 9.5,
      fee: 4.82,
      fulfillmentStatus: 'Shipped',
      carrier: 'UPS',
      tracking: '1Z999AA10984512034',
    },
    {
      id: 'SG-2040',
      date: '2026-11-18',
      customerName: 'Devon Carter',
      customerEmail: 'dcarter@example.com',
      address: '804 Walnut St, Lemoyne, PA 17043',
      items: [
        {
          id: 'sg-2',
          name: 'Vintage Wash Box Graphic Tee',
          size: 'M',
          qty: 3,
          price: 42,
          unitCost: 11.5,
        },
      ],
      subtotal: 126,
      discount: 12.6,
      shippingCollected: 0,
      total: 113.4,
      cogs: 34.5,
      labelCost: 6.2,
      fee: 3.59,
      fulfillmentStatus: 'Delivered',
      carrier: 'USPS',
      tracking: '9400111899562841029384',
    },
    {
      id: 'SG-2039',
      date: '2026-11-16',
      customerName: 'Taylor Reed',
      customerEmail: 'treed@example.com',
      address: '330 Derry St, Hershey, PA 17033',
      items: [
        {
          id: 'sg-3',
          name: 'Technical Utility Cargo Pant',
          size: 'L',
          qty: 1,
          price: 92,
          unitCost: 28,
        },
      ],
      subtotal: 92,
      discount: 0,
      shippingCollected: 8.95,
      total: 100.95,
      cogs: 28,
      labelCost: 7.4,
      fee: 3.23,
      fulfillmentStatus: 'Unfulfilled',
      carrier: 'USPS',
      tracking: '',
    },
  ],
  pnlAdjustments: [
    {
      id: 'adj-1',
      date: '2026-11-14',
      type: 'revenue',
      title: 'Harrisburg Pop-Up Booth Cash Sales',
      amount: 420,
    },
  ],
  expenses: [
    {
      id: 'exp-1',
      date: '2026-11-05',
      category: 'Blank Apparel Restock',
      vendor: 'Wholesale Heavyweight Blanks Batch',
      amount: 145,
    },
    {
      id: 'exp-2',
      date: '2026-11-10',
      category: 'DTF Ink, Film & Powder',
      vendor: 'Commercial DTF Transfer Film Roll',
      amount: 54,
    },
    {
      id: 'exp-3',
      date: '2026-11-15',
      category: 'Marketing & Ads',
      vendor: 'Local Instagram Drop Campaign',
      amount: 35,
    },
  ],
  employees: [
    {
      id: 'emp-1',
      name: 'Maya Lin',
      role: 'DTF Print & Production Lead',
      department: 'Production & DTF',
      accessLevel: 'Fulfillment & Stock',
      payType: 'hourly',
      rate: 19,
      hours: 8,
      active: true,
    },
    {
      id: 'emp-2',
      name: 'Darius Brooks',
      role: 'Showroom & Pop-Up Associate',
      department: 'Retail & Pop-Up',
      accessLevel: 'POS & Orders',
      payType: 'hourly',
      rate: 16.5,
      hours: 6,
      active: true,
    },
    {
      id: 'emp-3',
      name: 'Elena Morales',
      role: 'Lookbook & Drop Photographer',
      department: 'Creative & Media',
      accessLevel: 'Read-Only Media',
      payType: 'flat',
      rate: 110,
      hours: 1,
      active: false,
    },
  ],
  promos: [
    { id: 'pr-1', code: 'WELCOME10', type: 'percent', value: 10, active: true, uses: 9 },
    { id: 'pr-2', code: 'VIP20', type: 'fixed', value: 20, active: true, uses: 4 },
  ],
  budgets: { restock: 35, tax: 25, owner: 25, growth: 15 },
};

function compressImageFile(file, maxDimension = 900) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      reject(new Error('Please choose a valid image file (JPG, PNG, or WebP).'));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDimension || height > maxDimension) {
          if (width >= height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL('image/webp', 0.84);
        resolve(compressedDataUrl);
      };
      img.onerror = () => reject(new Error('Could not process that image file.'));
      img.src = reader.result;
    };
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.readAsDataURL(file);
  });
}

export default function App() {
  const [mode, setMode] = useState('store');
  const [cfoTab, setCfoTab] = useState('pnl');
  const [storageWarning, setStorageWarning] = useState('');
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return INITIAL_DATA;
      const parsed = JSON.parse(saved);
      return {
        ...INITIAL_DATA,
        ...parsed,
        products: Array.isArray(parsed.products)
          ? parsed.products.map((p) => ({ image: '', description: '', ...p }))
          : INITIAL_DATA.products,
        employees: Array.isArray(parsed.employees) ? parsed.employees : INITIAL_DATA.employees,
        promos: Array.isArray(parsed.promos) ? parsed.promos : INITIAL_DATA.promos,
        orders: Array.isArray(parsed.orders)
          ? parsed.orders.map((o) => ({
              fulfillmentStatus: o.fulfillmentStatus || o.status || 'Unfulfilled',
              carrier: o.carrier || 'USPS',
              tracking: o.tracking || '',
              ...o,
            }))
          : INITIAL_DATA.orders,
      };
    } catch {
      return INITIAL_DATA;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      if (storageWarning) setStorageWarning('');
    } catch {
      setStorageWarning(
        'Browser storage limit reached—try removing an old product photo or using a smaller image.'
      );
    }
  }, [state]);

  // Refs for Ctrl+K / Quick Search Focus
  const adminSearchRef = useRef(null);
  const storeSearchRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (mode === 'cfo') {
          adminSearchRef.current?.focus();
        } else {
          storeSearchRef.current?.focus();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode]);

  // Storefront Catalog Discovery, Search, Filter, Sort & Pagination State
  const [storeSearch, setStoreSearch] = useState('');
  const [storeCategory, setStoreCategory] = useState('All');
  const [storeSizeFilter, setStoreSizeFilter] = useState('All');
  const [storeInStockOnly, setStoreInStockOnly] = useState(false);
  const [storeSort, setStoreSort] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);

  // Storefront Quick-View & Cart State
  const [selectedProd, setSelectedProd] = useState(null);
  const [selectedSize, setSelectedSize] = useState('L');
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState('');
  const [checkoutForm, setCheckoutForm] = useState({ name: '', email: '', address: '' });
  const [orderBanner, setOrderBanner] = useState('');

  // Admin & CFO Universal Search + Tab Filters
  const [adminGlobalSearch, setAdminGlobalSearch] = useState('');
  const [adminSearchOpen, setAdminSearchOpen] = useState(false);
  const [highlightedId, setHighlightedId] = useState('');
  const [orderFilter, setOrderFilter] = useState('All');
  const [orderSearch, setOrderSearch] = useState('');
  const [employeeSearch, setEmployeeSearch] = useState('');
  const [inventorySearch, setInventorySearch] = useState('');
  const [inventoryCatFilter, setInventoryCatFilter] = useState('All');
  const [slipOrder, setSlipOrder] = useState(null);
  const [payStubEmp, setPayStubEmp] = useState(null);

  const [newAdj, setNewAdj] = useState({
    date: '2026-11-21',
    type: 'revenue',
    title: '',
    amount: '',
  });
  const [newExp, setNewExp] = useState({
    date: '2026-11-21',
    category: 'Blank Apparel Restock',
    vendor: '',
    amount: '',
  });
  const [newEmp, setNewEmp] = useState({
    name: '',
    role: '',
    department: 'Production & DTF',
    accessLevel: 'Fulfillment & Stock',
    payType: 'hourly',
    rate: '',
    hours: '8',
  });
  const [newSku, setNewSku] = useState({
    name: '',
    category: 'Hoodies',
    badge: 'Capsule Drop',
    description: '',
    price: '68',
    unitCost: '21',
    image: '',
    S: 6,
    M: 10,
    L: 10,
    XL: 6,
    '2XL': 3,
  });
  const [newPromo, setNewPromo] = useState({
    code: '',
    type: 'percent',
    value: '15',
  });

  const resetDemo = () => {
    localStorage.removeItem(STORAGE_KEY);
    setState(INITIAL_DATA);
    setCart([]);
    setAppliedPromo(null);
    setOrderBanner('');
    setStorageWarning('');
    setStoreSearch('');
    setStoreCategory('All');
    setStoreSizeFilter('All');
    setStoreInStockOnly(false);
    setStoreSort('featured');
    setCurrentPage(1);
    setAdminGlobalSearch('');
    setOrderSearch('');
    setEmployeeSearch('');
    setInventorySearch('');
    setHighlightedId('');
  };

  const resetStoreFilters = () => {
    setStoreSearch('');
    setStoreCategory('All');
    setStoreSizeFilter('All');
    setStoreInStockOnly(false);
    setStoreSort('featured');
    setCurrentPage(1);
  };

  const handleExistingProductImageUpload = async (productId, file) => {
    if (!file) return;
    try {
      const dataUrl = await compressImageFile(file);
      setState((prev) => ({
        ...prev,
        products: prev.products.map((item) =>
          item.id === productId ? { ...item, image: dataUrl } : item
        ),
      }));
    } catch (err) {
      setStorageWarning(err.message || 'Unable to upload image.');
    }
  };

  const handleNewSkuImageUpload = async (file) => {
    if (!file) return;
    try {
      const dataUrl = await compressImageFile(file);
      setNewSku((prev) => ({ ...prev, image: dataUrl }));
    } catch (err) {
      setStorageWarning(err.message || 'Unable to upload image.');
    }
  };

  const employees = state.employees || [];
  const promos = state.promos || [];

  const getEmployeePayout = (emp) => {
    if (!emp.active) return 0;
    return emp.payType === 'hourly'
      ? Number(emp.rate || 0) * Number(emp.hours || 0)
      : Number(emp.rate || 0);
  };

  const totalUnitsForProduct = (prod) =>
    Object.values(prod.sizeStock || {}).reduce((a, b) => a + Number(b || 0), 0);

  // Dynamic Catalog Categories
  const catalogCategories = useMemo(() => {
    const unique = Array.from(new Set(state.products.map((p) => p.category).filter(Boolean)));
    return ['All', ...unique];
  }, [state.products]);

  // Filtered & Sorted Storefront Products
  const filteredStoreProducts = useMemo(() => {
    const query = storeSearch.trim().toLowerCase();
    const list = state.products.filter((prod) => {
      if (storeCategory !== 'All' && prod.category !== storeCategory) return false;
      if (storeSizeFilter !== 'All' && Number(prod.sizeStock?.[storeSizeFilter] || 0) <= 0) {
        return false;
      }
      if (storeInStockOnly && totalUnitsForProduct(prod) <= 0) return false;
      if (query) {
        const availableSizes = Object.entries(prod.sizeStock || {})
          .filter(([, qty]) => Number(qty) > 0)
          .map(([sz]) => sz.toLowerCase())
          .join(' ');
        const hay = `${prod.name} ${prod.category} ${prod.badge || ''} ${
          prod.description || ''
        } ${availableSizes}`.toLowerCase();
        if (!hay.includes(query)) return false;
      }
      return true;
    });

    if (storeSort === 'price-asc') {
      return [...list].sort((a, b) => Number(a.price) - Number(b.price));
    }
    if (storeSort === 'price-desc') {
      return [...list].sort((a, b) => Number(b.price) - Number(a.price));
    }
    if (storeSort === 'newest') {
      return [...list].reverse();
    }
    if (storeSort === 'stock-desc') {
      return [...list].sort((a, b) => totalUnitsForProduct(b) - totalUnitsForProduct(a));
    }
    return list;
  }, [state.products, storeSearch, storeCategory, storeSizeFilter, storeInStockOnly, storeSort]);

  const hasActiveStoreFilters =
    storeSearch.trim() !== '' ||
    storeCategory !== 'All' ||
    storeSizeFilter !== 'All' ||
    storeInStockOnly ||
    storeSort !== 'featured';

  const totalPages = Math.max(1, Math.ceil(filteredStoreProducts.length / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedStoreProducts = useMemo(() => {
    const startIdx = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
    return filteredStoreProducts.slice(startIdx, startIdx + ITEMS_PER_PAGE);
  }, [filteredStoreProducts, safeCurrentPage]);

  const showEditorialSpotlight = !hasActiveStoreFilters && safeCurrentPage === 1;
  const spotlightFeatured = showEditorialSpotlight ? paginatedStoreProducts[0] : null;
  const spotlightCompanion = showEditorialSpotlight ? paginatedStoreProducts.slice(1, 3) : [];
  const gridProducts = showEditorialSpotlight
    ? paginatedStoreProducts.slice(3)
    : paginatedStoreProducts;

  const openQuickView = (prod, preferredSize = null) => {
    const sizes = ['S', 'M', 'L', 'XL', '2XL'];
    let targetSize = preferredSize;
    if (!targetSize || Number(prod.sizeStock?.[targetSize] || 0) <= 0) {
      if (storeSizeFilter !== 'All' && Number(prod.sizeStock?.[storeSizeFilter] || 0) > 0) {
        targetSize = storeSizeFilter;
      } else {
        targetSize = sizes.find((sz) => Number(prod.sizeStock?.[sz] || 0) > 0) || 'L';
      }
    }
    setSelectedSize(targetSize);
    setSelectedProd(prod);
  };

  // Universal Admin Omnisearch (Searches Storefront Products, Orders, Team, Expenses, Promos, P&L)
  const adminOmnisearchResults = useMemo(() => {
    const q = adminGlobalSearch.trim().toLowerCase();
    if (!q) {
      return {
        total: 0,
        products: [],
        orders: [],
        employees: [],
        expenses: [],
        promos: [],
        adjustments: [],
      };
    }

    const matchedProducts = state.products.filter((p) =>
      `${p.id} ${p.name} ${p.category} ${p.badge || ''} ${p.description || ''} $${p.price}`
        .toLowerCase()
        .includes(q)
    );

    const matchedOrders = state.orders.filter((o) => {
      const itemsText = (o.items || []).map((i) => `${i.name} ${i.size}`).join(' ');
      return `${o.id} ${o.customerName} ${o.customerEmail} ${o.address} ${o.carrier || ''} ${
        o.tracking || ''
      } ${o.fulfillmentStatus || ''} ${itemsText}`
        .toLowerCase()
        .includes(q);
    });

    const matchedEmployees = employees.filter((e) =>
      `${e.name} ${e.role} ${e.department} ${e.accessLevel} ${e.payType} ${
        e.active ? 'active' : 'off-cycle'
      }`
        .toLowerCase()
        .includes(q)
    );

    const matchedExpenses = state.expenses.filter((ex) =>
      `${ex.date} ${ex.category} ${ex.vendor} $${ex.amount}`.toLowerCase().includes(q)
    );

    const matchedPromos = promos.filter((pr) =>
      `${pr.code} ${pr.type} ${pr.value} ${pr.active ? 'active' : 'paused'}`
        .toLowerCase()
        .includes(q)
    );

    const matchedAdjustments = state.pnlAdjustments.filter((adj) =>
      `${adj.date} ${adj.type} ${adj.title} $${adj.amount}`.toLowerCase().includes(q)
    );

    return {
      total:
        matchedProducts.length +
        matchedOrders.length +
        matchedEmployees.length +
        matchedExpenses.length +
        matchedPromos.length +
        matchedAdjustments.length,
      products: matchedProducts,
      orders: matchedOrders,
      employees: matchedEmployees,
      expenses: matchedExpenses,
      promos: matchedPromos,
      adjustments: matchedAdjustments,
    };
  }, [adminGlobalSearch, state.products, state.orders, employees, state.expenses, promos, state.pnlAdjustments]);

  const jumpToAdminRecord = (tab, id, extraFilterReset = {}) => {
    setCfoTab(tab);
    setHighlightedId(id);
    setAdminSearchOpen(false);
    if (extraFilterReset.inventorySearch !== undefined) {
      setInventorySearch(extraFilterReset.inventorySearch);
      setInventoryCatFilter('All');
    }
    if (extraFilterReset.orderSearch !== undefined) {
      setOrderSearch(extraFilterReset.orderSearch);
      setOrderFilter('All');
    }
    if (extraFilterReset.employeeSearch !== undefined) {
      setEmployeeSearch(extraFilterReset.employeeSearch);
    }
  };

  const jumpToStoreProduct = (productName) => {
    setAdminSearchOpen(false);
    setMode('store');
    setStoreCategory('All');
    setStoreSizeFilter('All');
    setStoreInStockOnly(false);
    setStoreSort('featured');
    setStoreSearch(productName);
    setCurrentPage(1);
  };

  // Financial & P&L Calculations
  const onlineMerch = state.orders.reduce((s, o) => s + Number(o.subtotal || 0), 0);
  const manualRev = state.pnlAdjustments
    .filter((a) => a.type === 'revenue')
    .reduce((s, a) => s + Number(a.amount || 0), 0);
  const manualDed = state.pnlAdjustments
    .filter((a) => a.type === 'deduction')
    .reduce((s, a) => s + Number(a.amount || 0), 0);
  const discounts = state.orders.reduce((s, o) => s + Number(o.discount || 0), 0);
  const shipCollected = state.orders.reduce((s, o) => s + Number(o.shippingCollected || 0), 0);
  const grossReceipts = onlineMerch - discounts + shipCollected + manualRev;

  const totalCogs = state.orders.reduce((s, o) => s + Number(o.cogs || 0), 0);
  const totalLabels = state.orders.reduce((s, o) => s + Number(o.labelCost || 0), 0);
  const totalFees = state.orders.reduce((s, o) => s + Number(o.fee || 0), 0);
  const grossProfit = grossReceipts - totalCogs - totalLabels - totalFees;

  const totalPayroll = employees.reduce((s, emp) => s + getEmployeePayout(emp), 0);
  const totalOverhead = state.expenses.reduce((s, e) => s + Number(e.amount || 0), 0);
  const trueNetProfit = grossProfit - totalPayroll - totalOverhead - manualDed;
  const netMarginPct = grossReceipts > 0 ? (trueNetProfit / grossReceipts) * 100 : 0;
  const laborPct = grossReceipts > 0 ? (totalPayroll / grossReceipts) * 100 : 0;

  const grossMarginRatio = grossReceipts > 0 ? grossProfit / grossReceipts : 0;
  const fixedOperatingCosts = totalPayroll + totalOverhead + manualDed;
  const breakEvenRevenue =
    grossMarginRatio > 0 ? fixedOperatingCosts / grossMarginRatio : fixedOperatingCosts;

  const stockRetailVal = state.products.reduce(
    (sum, p) => sum + totalUnitsForProduct(p) * Number(p.price || 0),
    0
  );
  const stockCostVal = state.products.reduce(
    (sum, p) => sum + totalUnitsForProduct(p) * Number(p.unitCost || 0),
    0
  );

  const budgetTotalPct =
    Number(state.budgets.restock || 0) +
    Number(state.budgets.tax || 0) +
    Number(state.budgets.owner || 0) +
    Number(state.budgets.growth || 0);

  const normalizeBudgets = () => {
    if (budgetTotalPct <= 0) {
      setState({ ...state, budgets: { restock: 35, tax: 25, owner: 25, growth: 15 } });
      return;
    }
    const r = Math.round((state.budgets.restock / budgetTotalPct) * 100);
    const t = Math.round((state.budgets.tax / budgetTotalPct) * 100);
    const o = Math.round((state.budgets.owner / budgetTotalPct) * 100);
    const g = Math.max(0, 100 - r - t - o);
    setState({ ...state, budgets: { restock: r, tax: t, owner: o, growth: g } });
  };

  const exportAccountingCSV = () => {
    const sections = [
      ['SECTION 1: EXECUTIVE SUMMARY'],
      ['Metric', 'Value'],
      ['Gross Receipts', grossReceipts.toFixed(2)],
      ['Gross Profit', grossProfit.toFixed(2)],
      ['Active Team Payroll', totalPayroll.toFixed(2)],
      ['Operating Expenses', totalOverhead.toFixed(2)],
      ['True Net Profit', trueNetProfit.toFixed(2)],
      ['Net Margin %', `${netMarginPct.toFixed(1)}%`],
      [],
      ['SECTION 2: ORDER LEDGER'],
      ['Order ID', 'Date', 'Customer', 'Status', 'Total', 'COGS', 'Label', 'Fee', 'Net Order Profit'],
      ...state.orders.map((o) => [
        o.id,
        o.date,
        `"${o.customerName}"`,
        o.fulfillmentStatus || 'Unfulfilled',
        Number(o.total).toFixed(2),
        Number(o.cogs).toFixed(2),
        Number(o.labelCost).toFixed(2),
        Number(o.fee).toFixed(2),
        (Number(o.total) - Number(o.cogs) - Number(o.labelCost) - Number(o.fee)).toFixed(2),
      ]),
      [],
      ['SECTION 3: TEAM PAYROLL LEDGER'],
      ['Employee', 'Role', 'Department', 'Pay Type', 'Rate', 'Hours', 'Status', 'Period Payout'],
      ...employees.map((e) => [
        `"${e.name}"`,
        `"${e.role}"`,
        `"${e.department}"`,
        e.payType,
        Number(e.rate).toFixed(2),
        e.payType === 'hourly' ? e.hours : 'N/A',
        e.active ? 'Active' : 'Off-Cycle',
        getEmployeePayout(e).toFixed(2),
      ]),
      [],
      ['SECTION 4: OPERATING EXPENSES'],
      ['Date', 'Category', 'Vendor', 'Amount'],
      ...state.expenses.map((ex) => [
        ex.date,
        `"${ex.category}"`,
        `"${ex.vendor}"`,
        Number(ex.amount).toFixed(2),
      ]),
    ];

    const csv = sections.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'Tier3-Executive-CFO-Report.csv';
    a.click();
  };

  // Cart & Storefront Checkout Helpers
  const cartSubtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const cartDiscount = appliedPromo
    ? appliedPromo.type === 'percent'
      ? cartSubtotal * (appliedPromo.value / 100)
      : Math.min(cartSubtotal, appliedPromo.value)
    : 0;
  const discountedSubtotal = Math.max(0, cartSubtotal - cartDiscount);
  const cartShipping = cart.length === 0 ? 0 : discountedSubtotal >= 100 ? 0 : 8.95;
  const cartTotal = discountedSubtotal + cartShipping;

  const handleApplyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    const found = promos.find((p) => p.code === code && p.active);
    if (!found) {
      setPromoError('Invalid or paused code. Try WELCOME10 or VIP20.');
      setAppliedPromo(null);
    } else {
      setPromoError('');
      setAppliedPromo(found);
    }
  };

  const handleDemoPurchase = (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const cogs = cart.reduce((s, i) => s + i.unitCost * i.qty, 0);
    const fee = Number((cartTotal * 0.029 + 0.3).toFixed(2));
    const id = `SG-${Math.floor(2042 + Math.random() * 899)}`;

    const newOrder = {
      id,
      date: new Date().toISOString().slice(0, 10),
      customerName: checkoutForm.name.trim() || 'Demo Shopper',
      customerEmail: checkoutForm.email.trim() || 'buyer@example.com',
      address: checkoutForm.address.trim() || 'Harrisburg, PA 17112',
      items: cart.map(({ id: itemId, name, size, qty, price, unitCost }) => ({
        id: itemId,
        name,
        size,
        qty,
        price,
        unitCost,
      })),
      subtotal: cartSubtotal,
      discount: cartDiscount,
      shippingCollected: cartShipping,
      total: cartTotal,
      cogs,
      labelCost: 6.5,
      fee,
      fulfillmentStatus: 'Unfulfilled',
      carrier: 'USPS',
      tracking: '',
    };

    const updatedProds = state.products.map((p) => {
      const ns = { ...p.sizeStock };
      cart.forEach((c) => {
        if (c.id === p.id) ns[c.size] = Math.max(0, (ns[c.size] || 0) - c.qty);
      });
      return { ...p, sizeStock: ns };
    });

    const updatedPromos = appliedPromo
      ? promos.map((pr) => (pr.id === appliedPromo.id ? { ...pr, uses: pr.uses + 1 } : pr))
      : promos;

    setState({
      ...state,
      products: updatedProds,
      orders: [newOrder, ...state.orders],
      promos: updatedPromos,
    });
    setCart([]);
    setAppliedPromo(null);
    setPromoInput('');
    setCheckoutForm({ name: '', email: '', address: '' });
    setOrderBanner(
      `Order ${id} ($${cartTotal.toFixed(2)}) created! Switch to Behind the Scenes (CFO Suite) to fulfill it, print a packing slip, and view updated P&L.`
    );
  };

  const activeEmployeeCount = employees.filter((e) => e.active).length;
  const totalLoggedHours = employees
    .filter((e) => e.active && e.payType === 'hourly')
    .reduce((sum, e) => sum + Number(e.hours || 0), 0);
  const unfulfilledOrdersCount = state.orders.filter(
    (o) => (o.fulfillmentStatus || 'Unfulfilled') === 'Unfulfilled'
  ).length;

  const filteredOrders = useMemo(() => {
    const q = orderSearch.trim().toLowerCase();
    return state.orders.filter((o) => {
      if (orderFilter !== 'All' && (o.fulfillmentStatus || 'Unfulfilled') !== orderFilter) {
        return false;
      }
      if (q) {
        const itemsText = (o.items || []).map((i) => i.name).join(' ');
        const hay = `${o.id} ${o.customerName} ${o.customerEmail} ${o.address} ${o.carrier || ''} ${
          o.tracking || ''
        } ${itemsText}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [state.orders, orderFilter, orderSearch]);

  const filteredEmployees = useMemo(() => {
    const q = employeeSearch.trim().toLowerCase();
    if (!q) return employees;
    return employees.filter((emp) =>
      `${emp.name} ${emp.role} ${emp.department} ${emp.accessLevel} ${emp.payType}`
        .toLowerCase()
        .includes(q)
    );
  }, [employees, employeeSearch]);

  const skuLeaderboard = useMemo(() => {
    const q = inventorySearch.trim().toLowerCase();
    return [...state.products]
      .filter((p) => {
        if (inventoryCatFilter !== 'All' && p.category !== inventoryCatFilter) return false;
        if (
          q &&
          !`${p.name} ${p.category} ${p.badge || ''} ${p.description || ''}`
            .toLowerCase()
            .includes(q)
        ) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        const mA = a.price > 0 ? (a.price - a.unitCost) / a.price : 0;
        const mB = b.price > 0 ? (b.price - b.unitCost) / b.price : 0;
        return mB - mA;
      });
  }, [state.products, inventorySearch, inventoryCatFilter]);

  const expenseByCategory = state.expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + Number(exp.amount || 0);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-[#F6F4EF] text-[#1C1917]">
      {/* TOP DEMO CONTROL BAR */}
      <div className="sticky top-0 z-50 border-b border-stone-800 bg-[#1C1917] px-4 py-2.5 text-[#F6F4EF]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span className="whitespace-nowrap border border-amber-500/50 bg-amber-500/15 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-widest text-amber-300">
              Tier 03 Flagship &amp; CFO
            </span>
            <span className="hidden text-xs text-stone-300 xl:inline">
              Storefront, Payroll &amp; Live CFO Ledger
            </span>
          </div>

          <div className="ml-auto flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setMode('store')}
              className={`inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap px-3 py-1.5 text-xs font-semibold tracking-wide transition ${
                mode === 'store'
                  ? 'bg-[#F6F4EF] text-[#1C1917]'
                  : 'border border-stone-700 text-stone-300 hover:border-stone-500 hover:text-white'
              }`}
            >
              <Eye className="h-3.5 w-3.5" />
              Customer Storefront
            </button>

            <button
              type="button"
              onClick={() => setMode('cfo')}
              className={`inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap px-3 py-1.5 text-xs font-semibold tracking-wide transition ${
                mode === 'cfo'
                  ? 'bg-amber-600 text-white'
                  : 'border border-stone-700 text-stone-300 hover:border-amber-500 hover:text-white'
              }`}
            >
              <BarChart3 className="h-3.5 w-3.5" />
              Behind the Scenes (CFO Suite)
            </button>

            <button
              type="button"
              onClick={resetDemo}
              className="inline-flex cursor-pointer items-center gap-1 whitespace-nowrap border border-stone-700 px-2.5 py-1.5 text-xs text-stone-300 hover:border-stone-500 hover:text-white"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset</span>
            </button>

            <a
              href="https://cloud.majorstylejunction.com/#contact"
              className="hidden items-center gap-1 whitespace-nowrap border border-amber-500/40 px-3 py-1.5 text-xs font-medium text-amber-300 hover:bg-stone-800 md:inline-flex"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to MSJ Cloud
            </a>
          </div>
        </div>
      </div>

      {/* =====================================================================
          VIEW 1: WARM EDITORIAL CUSTOMER STOREFRONT
         ===================================================================== */}
      {mode === 'store' ? (
        <>
          <header className="border-b border-stone-300 bg-[#F6F4EF]">
            <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-amber-800">
                  Harrisburg &bull; Limited Capsule
                </p>
                <span className="font-serif text-2xl font-normal tracking-tight text-[#1C1917]">
                  Susquehanna Goods
                </span>
              </div>

              {/* Header Customer Search + Bag Button */}
              <div className="flex flex-1 items-center justify-end gap-3 sm:max-w-md">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3 top-2.5 h-3.5 w-3.5 text-stone-500" />
                  <input
                    ref={storeSearchRef}
                    type="text"
                    value={storeSearch}
                    onChange={(e) => {
                      setStoreSearch(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Search clothes, hoodies, tees, sizes... (Ctrl+K)"
                    className="w-full border border-stone-300 bg-white py-2 pl-9 pr-7 text-xs text-[#1C1917] placeholder-stone-500 focus:border-[#1C1917] focus:outline-none"
                  />
                  {storeSearch && (
                    <button
                      type="button"
                      onClick={() => {
                        setStoreSearch('');
                        setCurrentPage(1);
                      }}
                      aria-label="Clear header search"
                      className="absolute right-2 top-2 cursor-pointer text-stone-500 hover:text-[#1C1917]"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setCartOpen(true)}
                  className="inline-flex shrink-0 cursor-pointer items-center gap-2 border border-[#1C1917] bg-[#1C1917] px-4 py-2 text-xs font-semibold uppercase tracking-widest text-[#F6F4EF] transition hover:border-amber-800 hover:bg-amber-800"
                >
                  <ShoppingBag className="h-3.5 w-3.5" />
                  <span>Bag ({cart.reduce((s, i) => s + i.qty, 0)})</span>
                </button>
              </div>
            </div>
          </header>

          <main className="mx-auto max-w-6xl px-6 py-12">
            {/* Editorial Split Hero */}
            <div className="grid gap-8 border-b border-stone-300 pb-10 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-7">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-800">
                  Autumn / Winter Study &mdash; Tier 03 Architecture
                </p>
                <h1 className="mt-3 font-serif text-4xl font-normal leading-tight text-[#1C1917] sm:text-5xl">
                  Tactile essentials paired with executive profit clarity.
                </h1>
              </div>
              <div className="border-l border-stone-400 pl-6 lg:col-span-5">
                <p className="text-sm leading-relaxed text-stone-700">
                  Search any garment, filter by category or available size, and sort across the full catalog below—or switch to{' '}
                  <strong>Behind the Scenes (CFO Suite)</strong> to search across the entire store, orders, team, and ledger.
                </p>
              </div>
            </div>

            {/* CATALOG SEARCH, FILTER & SORT CONTROLS */}
            <section
              id="store-catalog"
              aria-label="Catalog Filters and Search"
              className="mt-8 border border-stone-300 bg-[#EFECE4] p-5"
            >
              <div className="grid gap-3 md:grid-cols-12 md:items-center">
                {/* Search Input */}
                <div className="relative md:col-span-5">
                  <Search className="pointer-events-none absolute left-3.5 top-2.5 h-4 w-4 text-stone-500" />
                  <input
                    type="text"
                    value={storeSearch}
                    onChange={(e) => {
                      setStoreSearch(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Search garments, fabrics, categories, sizes..."
                    className="w-full border border-stone-300 bg-white py-2 pl-10 pr-8 text-xs text-[#1C1917] placeholder-stone-500 focus:border-[#1C1917] focus:outline-none"
                  />
                  {storeSearch && (
                    <button
                      type="button"
                      onClick={() => {
                        setStoreSearch('');
                        setCurrentPage(1);
                      }}
                      aria-label="Clear search"
                      className="absolute right-2.5 top-2.5 cursor-pointer text-stone-500 hover:text-[#1C1917]"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                {/* Sort Selector */}
                <div className="md:col-span-4">
                  <select
                    value={storeSort}
                    onChange={(e) => {
                      setStoreSort(e.target.value);
                      setCurrentPage(1);
                    }}
                    aria-label="Sort catalog"
                    className="w-full border border-stone-300 bg-white px-3 py-2 text-xs font-semibold text-[#1C1917] focus:border-[#1C1917] focus:outline-none"
                  >
                    <option value="featured">Sort: Featured Curated Order</option>
                    <option value="newest">Sort: Newest Additions First</option>
                    <option value="price-asc">Sort: Price (Low to High)</option>
                    <option value="price-desc">Sort: Price (High to Low)</option>
                    <option value="stock-desc">Sort: Highest Availability</option>
                  </select>
                </div>

                {/* In-Stock Toggle */}
                <div className="md:col-span-3">
                  <button
                    type="button"
                    onClick={() => {
                      setStoreInStockOnly((prev) => !prev);
                      setCurrentPage(1);
                    }}
                    className={`w-full cursor-pointer border px-3 py-2 text-xs font-semibold uppercase tracking-wider transition ${
                      storeInStockOnly
                        ? 'border-[#1C1917] bg-[#1C1917] text-[#F6F4EF]'
                        : 'border-stone-300 bg-white text-stone-700 hover:border-stone-500'
                    }`}
                  >
                    {storeInStockOnly ? 'In Stock Only: ON' : 'In Stock Only: OFF'}
                  </button>
                </div>
              </div>

              {/* Category & Size Filter Pills */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-stone-300 pt-4">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="mr-1 text-[10px] font-bold uppercase tracking-widest text-stone-500">
                    Category:
                  </span>
                  {catalogCategories.map((cat) => {
                    const count =
                      cat === 'All'
                        ? state.products.length
                        : state.products.filter((p) => p.category === cat).length;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          setStoreCategory(cat);
                          setCurrentPage(1);
                        }}
                        className={`cursor-pointer border px-3 py-1 text-xs font-semibold transition ${
                          storeCategory === cat
                            ? 'border-[#1C1917] bg-[#1C1917] text-[#F6F4EF]'
                            : 'border-stone-300 bg-white text-stone-700 hover:border-stone-500'
                        }`}
                      >
                        {cat} ({count})
                      </button>
                    );
                  })}
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="mr-1 text-[10px] font-bold uppercase tracking-widest text-stone-500">
                    Size:
                  </span>
                  {['All', 'S', 'M', 'L', 'XL', '2XL'].map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => {
                        setStoreSizeFilter(sz);
                        setCurrentPage(1);
                      }}
                      className={`cursor-pointer border px-2.5 py-1 text-xs font-bold transition ${
                        storeSizeFilter === sz
                          ? 'border-amber-800 bg-amber-800 text-white'
                          : 'border-stone-300 bg-white text-stone-700 hover:border-stone-500'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Results & Clear Bar */}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-stone-300/80 pt-3 text-xs text-stone-600">
                <span>
                  Showing <strong>{paginatedStoreProducts.length}</strong> of{' '}
                  <strong>{filteredStoreProducts.length}</strong> matching garments (Page{' '}
                  {safeCurrentPage} of {totalPages})
                </span>
                {hasActiveStoreFilters && (
                  <button
                    type="button"
                    onClick={resetStoreFilters}
                    className="cursor-pointer font-bold uppercase tracking-wider text-amber-800 underline hover:text-[#1C1917]"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            </section>

            {/* EMPTY STATE */}
            {filteredStoreProducts.length === 0 ? (
              <div className="mt-10 border border-stone-300 bg-white/80 p-12 text-center">
                <p className="font-serif text-2xl text-[#1C1917]">No garments match those filters</p>
                <p className="mt-2 text-sm text-stone-600">
                  Try clearing your search term, size, or category filter to browse the full collection.
                </p>
                <button
                  type="button"
                  onClick={resetStoreFilters}
                  className="mt-5 cursor-pointer border border-[#1C1917] bg-[#1C1917] px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-[#F6F4EF] hover:border-amber-800 hover:bg-amber-800"
                >
                  Reset Catalog Filters
                </button>
              </div>
            ) : (
              <>
                {/* SIGNATURE EDITORIAL SPOTLIGHT (Shown on Page 1 when browsing unfiltered) */}
                {showEditorialSpotlight && spotlightFeatured && (
                  <div className="mt-10 grid gap-8 lg:grid-cols-12">
                    <article className="flex flex-col justify-between border border-stone-300 bg-[#EFECE4] p-7 lg:col-span-6">
                      <div>
                        <div className="flex items-center justify-between border-b border-stone-300 pb-4 text-xs uppercase tracking-widest text-stone-600">
                          <span>01 &bull; {spotlightFeatured.badge}</span>
                          <span>{totalUnitsForProduct(spotlightFeatured)} units</span>
                        </div>

                        {spotlightFeatured.image ? (
                          <div className="my-6 h-64 w-full overflow-hidden border border-stone-300 bg-white">
                            <img
                              src={spotlightFeatured.image}
                              alt={spotlightFeatured.name}
                              className="h-full w-full object-cover object-center transition duration-300 hover:scale-105"
                            />
                          </div>
                        ) : (
                          <div className="my-7 flex h-48 items-center justify-center border border-stone-300 bg-[#F6F4EF] px-6 text-center">
                            <div>
                              <p className="text-[11px] uppercase tracking-[0.22em] text-amber-800">
                                {spotlightFeatured.category}
                              </p>
                              <p className="mt-2 font-serif text-2xl text-[#1C1917]">
                                {spotlightFeatured.name}
                              </p>
                            </div>
                          </div>
                        )}

                        <div className="flex items-baseline justify-between gap-4">
                          <h2 className="font-serif text-xl text-[#1C1917]">
                            {spotlightFeatured.name}
                          </h2>
                          <span className="shrink-0 text-lg font-semibold text-[#1C1917]">
                            ${Number(spotlightFeatured.price).toFixed(2)}
                          </span>
                        </div>
                        {spotlightFeatured.description && (
                          <p className="mt-1.5 text-xs leading-relaxed text-stone-600">
                            {spotlightFeatured.description}
                          </p>
                        )}

                        {/* Interactive Size Availability Strip */}
                        <div className="mt-4 flex flex-wrap items-center gap-1.5">
                          {['S', 'M', 'L', 'XL', '2XL'].map((sz) => {
                            const qty = Number(spotlightFeatured.sizeStock?.[sz] || 0);
                            return (
                              <button
                                key={sz}
                                type="button"
                                disabled={qty === 0}
                                onClick={() => openQuickView(spotlightFeatured, sz)}
                                className={`cursor-pointer border px-2 py-0.5 text-[11px] font-bold transition ${
                                  qty > 0
                                    ? 'border-stone-400 bg-white text-[#1C1917] hover:border-[#1C1917]'
                                    : 'cursor-not-allowed border-stone-300 bg-stone-200/60 text-stone-400 line-through'
                                }`}
                              >
                                {sz}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <button
                        type="button"
                        disabled={totalUnitsForProduct(spotlightFeatured) === 0}
                        onClick={() => openQuickView(spotlightFeatured)}
                        className="mt-6 w-full cursor-pointer border border-[#1C1917] bg-[#1C1917] py-3 text-xs font-semibold uppercase tracking-widest text-[#F6F4EF] transition hover:border-amber-800 hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        {totalUnitsForProduct(spotlightFeatured) === 0
                          ? 'Sold Out'
                          : 'Select Size & Add'}
                      </button>
                    </article>

                    <div className="flex flex-col justify-between gap-6 lg:col-span-6">
                      {spotlightCompanion.map((prod, idx) => {
                        const units = totalUnitsForProduct(prod);
                        return (
                          <article
                            key={prod.id}
                            className="flex flex-1 flex-col justify-between border border-stone-300 bg-white/75 p-6"
                          >
                            <div className="flex items-start gap-4">
                              {prod.image && (
                                <div className="h-24 w-24 shrink-0 overflow-hidden border border-stone-300 bg-white">
                                  <img
                                    src={prod.image}
                                    alt={prod.name}
                                    className="h-full w-full object-cover object-center"
                                  />
                                </div>
                              )}
                              <div className="flex-1">
                                <div className="flex items-center justify-between text-xs uppercase tracking-widest text-stone-500">
                                  <span>
                                    0{idx + 2} &bull; {prod.badge}
                                  </span>
                                  <span className="text-amber-800">{units} in stock</span>
                                </div>
                                <div className="mt-2 flex items-baseline justify-between gap-4">
                                  <h2 className="font-serif text-xl text-[#1C1917]">{prod.name}</h2>
                                  <span className="shrink-0 text-base font-semibold text-[#1C1917]">
                                    ${Number(prod.price).toFixed(2)}
                                  </span>
                                </div>
                                <p className="mt-1 text-xs uppercase tracking-wider text-stone-500">
                                  Category: {prod.category}
                                </p>
                                {prod.description && (
                                  <p className="mt-1.5 text-xs text-stone-600">{prod.description}</p>
                                )}

                                <div className="mt-3 flex flex-wrap gap-1.5">
                                  {['S', 'M', 'L', 'XL', '2XL'].map((sz) => {
                                    const qty = Number(prod.sizeStock?.[sz] || 0);
                                    return (
                                      <button
                                        key={sz}
                                        type="button"
                                        disabled={qty === 0}
                                        onClick={() => openQuickView(prod, sz)}
                                        className={`cursor-pointer border px-2 py-0.5 text-[10px] font-bold transition ${
                                          qty > 0
                                            ? 'border-stone-300 bg-[#F6F4EF] text-[#1C1917] hover:border-[#1C1917]'
                                            : 'cursor-not-allowed border-stone-200 bg-stone-100 text-stone-400 line-through'
                                        }`}
                                      >
                                        {sz}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>

                            <button
                              type="button"
                              disabled={units === 0}
                              onClick={() => openQuickView(prod)}
                              className="mt-5 w-full cursor-pointer border border-stone-800 bg-transparent py-2.5 text-xs font-semibold uppercase tracking-widest text-[#1C1917] transition hover:bg-[#1C1917] hover:text-[#F6F4EF] disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              {units === 0 ? 'Sold Out' : 'Select Size & Add'}
                            </button>
                          </article>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* FULL SCALABLE CATALOG GRID */}
                {gridProducts.length > 0 && (
                  <div className="mt-10">
                    {showEditorialSpotlight && (
                      <div className="mb-5 flex items-center justify-between border-b border-stone-300 pb-3">
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-amber-800">
                          Complete Collection Grid
                        </span>
                        <span className="text-xs text-stone-600">
                          Click any size pill to quick-add
                        </span>
                      </div>
                    )}

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {gridProducts.map((prod) => {
                        const units = totalUnitsForProduct(prod);
                        return (
                          <article
                            key={prod.id}
                            className="flex flex-col justify-between border border-stone-300 bg-white/80 p-6 transition hover:border-stone-500"
                          >
                            <div>
                              <div className="flex items-center justify-between text-[11px] uppercase tracking-widest text-stone-500">
                                <span>{prod.badge}</span>
                                <span className="font-semibold text-amber-800">
                                  {units} in stock
                                </span>
                              </div>

                              {prod.image ? (
                                <div className="my-4 h-48 w-full overflow-hidden border border-stone-200 bg-white">
                                  <img
                                    src={prod.image}
                                    alt={prod.name}
                                    className="h-full w-full object-cover object-center transition duration-300 hover:scale-105"
                                  />
                                </div>
                              ) : (
                                <div className="my-4 flex h-40 items-center justify-center border border-stone-200 bg-[#F6F4EF] px-4 text-center">
                                  <div>
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-amber-800">
                                      {prod.category}
                                    </p>
                                    <p className="mt-1.5 font-serif text-lg text-[#1C1917]">
                                      {prod.name}
                                    </p>
                                  </div>
                                </div>
                              )}

                              <div className="flex items-baseline justify-between gap-3">
                                <h3 className="font-serif text-lg text-[#1C1917]">{prod.name}</h3>
                                <span className="shrink-0 text-base font-bold text-[#1C1917]">
                                  ${Number(prod.price).toFixed(2)}
                                </span>
                              </div>
                              <p className="mt-1 text-[11px] uppercase tracking-wider text-stone-500">
                                {prod.category}
                              </p>
                              {prod.description && (
                                <p className="mt-1.5 text-xs text-stone-600">{prod.description}</p>
                              )}

                              {/* Live Per-Size Pills */}
                              <div className="mt-3.5 flex flex-wrap gap-1.5">
                                {['S', 'M', 'L', 'XL', '2XL'].map((sz) => {
                                  const qty = Number(prod.sizeStock?.[sz] || 0);
                                  const highlighted = storeSizeFilter === sz && qty > 0;
                                  return (
                                    <button
                                      key={sz}
                                      type="button"
                                      disabled={qty === 0}
                                      onClick={() => openQuickView(prod, sz)}
                                      className={`cursor-pointer border px-2 py-0.5 text-[10px] font-bold transition ${
                                        qty === 0
                                          ? 'cursor-not-allowed border-stone-200 bg-stone-100 text-stone-400 line-through'
                                          : highlighted
                                          ? 'border-amber-800 bg-amber-800 text-white'
                                          : 'border-stone-300 bg-[#F6F4EF] text-[#1C1917] hover:border-[#1C1917]'
                                      }`}
                                    >
                                      {sz}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            <button
                              type="button"
                              disabled={units === 0}
                              onClick={() => openQuickView(prod)}
                              className="mt-5 w-full cursor-pointer border border-[#1C1917] bg-[#1C1917] py-2.5 text-xs font-semibold uppercase tracking-widest text-[#F6F4EF] transition hover:border-amber-800 hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              {units === 0 ? 'Sold Out' : 'Select Size & Add'}
                            </button>
                          </article>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* PAGINATION CONTROLS */}
                {totalPages > 1 && (
                  <nav
                    aria-label="Catalog Pagination"
                    className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-stone-300 pt-6"
                  >
                    <button
                      type="button"
                      disabled={safeCurrentPage <= 1}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      className="inline-flex cursor-pointer items-center gap-1.5 border border-stone-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#1C1917] hover:border-[#1C1917] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </button>

                    <div className="flex flex-wrap items-center gap-1.5">
                      {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => (
                        <button
                          key={pageNum}
                          type="button"
                          onClick={() => setCurrentPage(pageNum)}
                          className={`h-9 w-9 cursor-pointer border text-xs font-bold transition ${
                            safeCurrentPage === pageNum
                              ? 'border-[#1C1917] bg-[#1C1917] text-[#F6F4EF]'
                              : 'border-stone-300 bg-white text-[#1C1917] hover:border-stone-500'
                          }`}
                        >
                          {pageNum}
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      disabled={safeCurrentPage >= totalPages}
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      className="inline-flex cursor-pointer items-center gap-1.5 border border-stone-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#1C1917] hover:border-[#1C1917] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </nav>
                )}
              </>
            )}
          </main>
        </>
      ) : (
        /* =====================================================================
           VIEW 2: BEHIND THE SCENES — TIER 03 EXECUTIVE CFO & OPERATIONS SUITE
           ===================================================================== */
        <main className="mx-auto max-w-6xl px-6 py-10">
          {storageWarning && (
            <div className="mb-5 flex items-center justify-between border border-rose-300 bg-rose-50 px-4 py-3 text-xs text-rose-800">
              <span>{storageWarning}</span>
              <button
                type="button"
                onClick={() => setStorageWarning('')}
                className="cursor-pointer font-bold underline"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* UNIVERSAL ADMIN OMNISEARCH BAR (Searches Everything Across Store & CFO Suite) */}
          <div className="relative mb-7 border-2 border-[#1C1917] bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-800">
                Global Site &amp; Operations Search (Storefront &bull; Orders &bull; Team &bull; Expenses &bull; Promos &bull; P&amp;L)
              </span>
              <span className="text-[11px] text-stone-500">Shortcut: Ctrl + K</span>
            </div>

            <div className="relative">
              <Search className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-stone-500" />
              <input
                ref={adminSearchRef}
                type="text"
                value={adminGlobalSearch}
                onFocus={() => setAdminSearchOpen(true)}
                onChange={(e) => {
                  setAdminGlobalSearch(e.target.value);
                  setAdminSearchOpen(true);
                }}
                placeholder="Search anything: hoodie, SG-2041, Jordan Taylor, Maya Lin, tracking #, promo code, vendor..."
                className="w-full border border-stone-300 bg-[#F6F4EF] py-2.5 pl-10 pr-24 text-sm text-[#1C1917] placeholder-stone-500 focus:border-[#1C1917] focus:bg-white focus:outline-none"
              />
              {adminGlobalSearch && (
                <button
                  type="button"
                  onClick={() => {
                    setAdminGlobalSearch('');
                    setAdminSearchOpen(false);
                    setHighlightedId('');
                  }}
                  className="absolute right-3 top-2.5 inline-flex cursor-pointer items-center gap-1 border border-stone-300 bg-white px-2 py-0.5 text-xs font-semibold text-stone-700 hover:border-[#1C1917]"
                >
                  <X className="h-3 w-3" />
                  Clear
                </button>
              )}
            </div>

            {/* LIVE CATEGORIZED OMNISEARCH DROPDOWN */}
            {adminSearchOpen && adminGlobalSearch.trim() !== '' && (
              <div className="mt-3 max-h-96 overflow-y-auto border border-stone-300 bg-[#F6F4EF] p-4 shadow-xl">
                <div className="mb-3 flex items-center justify-between border-b border-stone-300 pb-2 text-xs">
                  <span>
                    Found <strong>{adminOmnisearchResults.total}</strong> matches across store &amp; admin
                  </span>
                  <button
                    type="button"
                    onClick={() => setAdminSearchOpen(false)}
                    className="cursor-pointer font-semibold text-stone-600 hover:text-[#1C1917]"
                  >
                    Close Results
                  </button>
                </div>

                {adminOmnisearchResults.total === 0 ? (
                  <p className="py-4 text-center text-xs text-stone-600">
                    No matching products, orders, employees, expenses, or promo codes found for &ldquo;{adminGlobalSearch}&rdquo;.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {/* Matched Storefront & Inventory Products */}
                    {adminOmnisearchResults.products.length > 0 && (
                      <div>
                        <p className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-amber-800">
                          <Package className="h-3.5 w-3.5" />
                          Storefront &amp; Inventory SKUs ({adminOmnisearchResults.products.length})
                        </p>
                        <div className="space-y-1.5">
                          {adminOmnisearchResults.products.map((prod) => (
                            <div
                              key={prod.id}
                              className="flex flex-wrap items-center justify-between gap-2 border border-stone-300 bg-white px-3 py-2 text-xs"
                            >
                              <div>
                                <strong>{prod.name}</strong> &bull; {prod.category} &bull; $
                                {Number(prod.price).toFixed(2)} ({totalUnitsForProduct(prod)} in stock)
                              </div>
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() =>
                                    jumpToAdminRecord('inventory', prod.id, {
                                      inventorySearch: prod.name,
                                    })
                                  }
                                  className="cursor-pointer bg-[#1C1917] px-2.5 py-1 text-[11px] font-semibold text-[#F6F4EF] hover:bg-amber-800"
                                >
                                  Edit in Inventory
                                </button>
                                <button
                                  type="button"
                                  onClick={() => jumpToStoreProduct(prod.name)}
                                  className="inline-flex cursor-pointer items-center gap-1 border border-stone-400 bg-[#F6F4EF] px-2.5 py-1 text-[11px] font-semibold text-[#1C1917] hover:border-[#1C1917]"
                                >
                                  <span>View in Store</span>
                                  <ExternalLink className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Matched Orders */}
                    {adminOmnisearchResults.orders.length > 0 && (
                      <div>
                        <p className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-amber-800">
                          <Receipt className="h-3.5 w-3.5" />
                          Orders &amp; Customers ({adminOmnisearchResults.orders.length})
                        </p>
                        <div className="space-y-1.5">
                          {adminOmnisearchResults.orders.map((ord) => (
                            <div
                              key={ord.id}
                              className="flex flex-wrap items-center justify-between gap-2 border border-stone-300 bg-white px-3 py-2 text-xs"
                            >
                              <div>
                                <strong>{ord.id}</strong> &bull; {ord.customerName} ($
                                {Number(ord.total).toFixed(2)}) &bull;{' '}
                                <span className="font-semibold">
                                  {ord.fulfillmentStatus || 'Unfulfilled'}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() =>
                                  jumpToAdminRecord('orders', ord.id, { orderSearch: ord.id })
                                }
                                className="cursor-pointer bg-[#1C1917] px-2.5 py-1 text-[11px] font-semibold text-[#F6F4EF] hover:bg-amber-800"
                              >
                                Open Order
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Matched Employees */}
                    {adminOmnisearchResults.employees.length > 0 && (
                      <div>
                        <p className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-amber-800">
                          <Users className="h-3.5 w-3.5" />
                          Team &amp; Payroll ({adminOmnisearchResults.employees.length})
                        </p>
                        <div className="space-y-1.5">
                          {adminOmnisearchResults.employees.map((emp) => (
                            <div
                              key={emp.id}
                              className="flex flex-wrap items-center justify-between gap-2 border border-stone-300 bg-white px-3 py-2 text-xs"
                            >
                              <div>
                                <strong>{emp.name}</strong> &bull; {emp.role} ({emp.department})
                              </div>
                              <button
                                type="button"
                                onClick={() =>
                                  jumpToAdminRecord('employees', emp.id, {
                                    employeeSearch: emp.name,
                                  })
                                }
                                className="cursor-pointer bg-[#1C1917] px-2.5 py-1 text-[11px] font-semibold text-[#F6F4EF] hover:bg-amber-800"
                              >
                                Open Payroll Record
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Matched Expenses, Promos & P&L Adjustments */}
                    {(adminOmnisearchResults.expenses.length > 0 ||
                      adminOmnisearchResults.promos.length > 0 ||
                      adminOmnisearchResults.adjustments.length > 0) && (
                      <div>
                        <p className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-amber-800">
                          <Tag className="h-3.5 w-3.5" />
                          Expenses, Promos &amp; Ledger Entries
                        </p>
                        <div className="space-y-1.5">
                          {adminOmnisearchResults.expenses.map((ex) => (
                            <div
                              key={ex.id}
                              className="flex items-center justify-between border border-stone-300 bg-white px-3 py-2 text-xs"
                            >
                              <span>
                                <strong>Expense:</strong> {ex.vendor} ({ex.category}) &bull; -$
                                {Number(ex.amount).toFixed(2)}
                              </span>
                              <button
                                type="button"
                                onClick={() => jumpToAdminRecord('expenses', ex.id)}
                                className="cursor-pointer bg-[#1C1917] px-2.5 py-1 text-[11px] font-semibold text-[#F6F4EF]"
                              >
                                Go to Expenses
                              </button>
                            </div>
                          ))}
                          {adminOmnisearchResults.promos.map((pr) => (
                            <div
                              key={pr.id}
                              className="flex items-center justify-between border border-stone-300 bg-white px-3 py-2 text-xs"
                            >
                              <span>
                                <strong>Promo Code:</strong> {pr.code} (
                                {pr.type === 'percent' ? `${pr.value}% Off` : `$${pr.value} Off`})
                              </span>
                              <button
                                type="button"
                                onClick={() => jumpToAdminRecord('promos', pr.id)}
                                className="cursor-pointer bg-[#1C1917] px-2.5 py-1 text-[11px] font-semibold text-[#F6F4EF]"
                              >
                                Go to Promos
                              </button>
                            </div>
                          ))}
                          {adminOmnisearchResults.adjustments.map((adj) => (
                            <div
                              key={adj.id}
                              className="flex items-center justify-between border border-stone-300 bg-white px-3 py-2 text-xs"
                            >
                              <span>
                                <strong>P&amp;L Entry:</strong> {adj.title} ($
                                {Number(adj.amount).toFixed(2)})
                              </span>
                              <button
                                type="button"
                                onClick={() => jumpToAdminRecord('pnl', adj.id)}
                                className="cursor-pointer bg-[#1C1917] px-2.5 py-1 text-[11px] font-semibold text-[#F6F4EF]"
                              >
                                Go to P&amp;L
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-stone-300 pb-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-amber-800">
                Behind the Scenes &bull; Executive CFO, Team &amp; Operations Suite
              </span>
              <h1 className="mt-1 font-serif text-3xl font-normal text-[#1C1917]">
                Command Center: P&amp;L, Payroll &amp; Fulfillment
              </h1>
            </div>

            <button
              type="button"
              onClick={exportAccountingCSV}
              className="inline-flex cursor-pointer items-center gap-2 border border-[#1C1917] bg-white px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#1C1917] hover:bg-stone-100"
            >
              <Download className="h-4 w-4" />
              Export Full CPA CSV
            </button>
          </div>

          {/* 6 EXECUTIVE KPI CARDS */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
            <div className="border border-stone-300 bg-white/85 p-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                Gross Receipts
              </span>
              <p className="mt-1 text-xl font-bold text-[#1C1917]">${grossReceipts.toFixed(2)}</p>
              <p className="mt-1 text-[11px] text-stone-500">{state.orders.length} orders + pop-up</p>
            </div>

            <div className="border-2 border-amber-700 bg-white p-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                True Net Profit
              </span>
              <p className="mt-1 text-xl font-bold text-amber-800">${trueNetProfit.toFixed(2)}</p>
              <p className="mt-1 text-[11px] text-stone-600">{netMarginPct.toFixed(1)}% net margin</p>
            </div>

            <div className="border border-stone-300 bg-white/85 p-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                Active Payroll
              </span>
              <p className="mt-1 text-xl font-bold text-rose-700">${totalPayroll.toFixed(2)}</p>
              <p className="mt-1 text-[11px] text-stone-500">
                {laborPct.toFixed(1)}% of revenue ({activeEmployeeCount} staff)
              </p>
            </div>

            <div className="border border-stone-300 bg-white/85 p-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                COGS &amp; Overhead
              </span>
              <p className="mt-1 text-xl font-bold text-[#1C1917]">
                ${(totalCogs + totalLabels + totalFees + totalOverhead).toFixed(2)}
              </p>
              <p className="mt-1 text-[11px] text-stone-500">
                COGS ${totalCogs.toFixed(0)} &bull; Ops ${totalOverhead.toFixed(0)}
              </p>
            </div>

            <div className="border border-stone-300 bg-white/85 p-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                Stock Retail Value
              </span>
              <p className="mt-1 text-xl font-bold text-[#1C1917]">${stockRetailVal.toFixed(2)}</p>
              <p className="mt-1 text-[11px] text-stone-500">${stockCostVal.toFixed(2)} in blanks</p>
            </div>

            <div className="border border-stone-300 bg-white/85 p-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                Safe Owner Draw
              </span>
              <p className="mt-1 text-xl font-bold text-[#1C1917]">
                ${(Math.max(0, trueNetProfit) * (state.budgets.owner / 100)).toFixed(2)}
              </p>
              <p className="mt-1 text-[11px] text-stone-500">{state.budgets.owner}% Profit-First</p>
            </div>
          </div>

          {/* 6 COMMAND CENTER TABS */}
          <div className="mb-6 flex flex-wrap gap-2 border-b border-stone-300 pb-4">
            {[
              { id: 'pnl', label: 'P&L & Profit-First' },
              { id: 'employees', label: `Team & Payroll (${activeEmployeeCount} Active)` },
              {
                id: 'orders',
                label: `Orders & Fulfillment (${unfulfilledOrdersCount} Open)`,
              },
              { id: 'inventory', label: `Inventory & SKU Margins (${state.products.length})` },
              { id: 'expenses', label: `Expenses (${state.expenses.length})` },
              { id: 'promos', label: `Promo Codes (${promos.length})` },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setCfoTab(t.id)}
                className={`cursor-pointer px-4 py-2 text-xs font-semibold uppercase tracking-wider transition ${
                  cfoTab === t.id
                    ? 'bg-[#1C1917] text-[#F6F4EF]'
                    : 'border border-stone-300 bg-white/75 text-stone-700 hover:border-stone-500'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* =================================================================
              TAB 1: EDITABLE P&L + PROFIT-FIRST BUCKETS + BREAK-EVEN INSIGHT
             ================================================================= */}
          {cfoTab === 'pnl' && (
            <div className="grid gap-6 lg:grid-cols-12">
              <div className="border border-stone-300 bg-white/90 p-6 lg:col-span-7">
                <h2 className="font-serif text-xl font-normal text-[#1C1917]">
                  Editable Profit &amp; Loss (P&amp;L) Statement
                </h2>
                <table className="mt-4 w-full text-sm">
                  <tbody className="divide-y divide-stone-200">
                    <tr>
                      <td className="py-2.5">Online Store Merchandise Sales</td>
                      <td className="py-2.5 text-right font-semibold">${onlineMerch.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td className="py-2.5">(+) Off-Site / Pop-Up Revenue Adjustments</td>
                      <td className="py-2.5 text-right font-semibold text-amber-800">
                        +${manualRev.toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 text-rose-700">(&minus;) Promo Discounts</td>
                      <td className="py-2.5 text-right text-rose-700">-${discounts.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td className="py-2.5">(+) Shipping Collected</td>
                      <td className="py-2.5 text-right">${shipCollected.toFixed(2)}</td>
                    </tr>
                    <tr className="bg-stone-100 font-bold">
                      <td className="px-2 py-2.5">Total Gross Receipts</td>
                      <td className="px-2 py-2.5 text-right">${grossReceipts.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 text-rose-700">(&minus;) Cost of Goods Sold (COGS)</td>
                      <td className="py-2.5 text-right text-rose-700">-${totalCogs.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 text-rose-700">
                        (&minus;) Outbound Shipping Labels &amp; Processing Fees
                      </td>
                      <td className="py-2.5 text-right text-rose-700">
                        -${(totalLabels + totalFees).toFixed(2)}
                      </td>
                    </tr>
                    <tr className="bg-stone-100 font-bold">
                      <td className="px-2 py-2.5">Gross Profit</td>
                      <td className="px-2 py-2.5 text-right">${grossProfit.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 text-rose-700">
                        (&minus;) Team Payroll &amp; Shift Labor ({activeEmployeeCount} active)
                      </td>
                      <td className="py-2.5 text-right text-rose-700">
                        -${totalPayroll.toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 text-rose-700">
                        (&minus;) Operating &amp; Supply Expenses
                      </td>
                      <td className="py-2.5 text-right text-rose-700">
                        -${totalOverhead.toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 text-rose-700">(&minus;) Manual Refunds / Deductions</td>
                      <td className="py-2.5 text-right text-rose-700">-${manualDed.toFixed(2)}</td>
                    </tr>
                    <tr className="border-t-2 border-[#1C1917] text-base font-bold">
                      <td className="py-3">TRUE NET PROFIT</td>
                      <td className="py-3 text-right text-amber-800">${trueNetProfit.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newAdj.title || !newAdj.amount) return;
                    setState({
                      ...state,
                      pnlAdjustments: [
                        {
                          id: `adj-${Date.now()}`,
                          date: newAdj.date,
                          type: newAdj.type,
                          title: newAdj.title.trim(),
                          amount: parseFloat(newAdj.amount) || 0,
                        },
                        ...state.pnlAdjustments,
                      ],
                    });
                    setNewAdj({ ...newAdj, title: '', amount: '' });
                  }}
                  className="mt-5 grid gap-2 border border-stone-200 bg-[#F6F4EF] p-3.5 sm:grid-cols-4"
                >
                  <select
                    value={newAdj.type}
                    onChange={(e) => setNewAdj({ ...newAdj, type: e.target.value })}
                    className="border border-stone-300 bg-white px-2.5 py-2 text-xs font-semibold"
                  >
                    <option value="revenue">(+) Add Revenue</option>
                    <option value="deduction">(&minus;) Deduction</option>
                  </select>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pop-up cash sales"
                    value={newAdj.title}
                    onChange={(e) => setNewAdj({ ...newAdj, title: e.target.value })}
                    className="border border-stone-300 bg-white px-2.5 py-2 text-xs sm:col-span-2"
                  />
                  <div className="flex gap-1.5">
                    <input
                      type="number"
                      required
                      step="0.01"
                      placeholder="$"
                      value={newAdj.amount}
                      onChange={(e) => setNewAdj({ ...newAdj, amount: e.target.value })}
                      className="w-full border border-stone-300 bg-white px-2.5 py-2 text-xs"
                    />
                    <button
                      type="submit"
                      className="cursor-pointer bg-[#1C1917] px-3 text-xs font-semibold text-[#F6F4EF]"
                    >
                      Add
                    </button>
                  </div>
                </form>

                {state.pnlAdjustments.length > 0 && (
                  <div className="mt-3 space-y-1.5">
                    {state.pnlAdjustments.map((a) => (
                      <div
                        key={a.id}
                        className={`flex items-center justify-between border px-3 py-1.5 text-xs ${
                          highlightedId === a.id
                            ? 'border-amber-700 bg-amber-50'
                            : 'border-stone-200 bg-white'
                        }`}
                      >
                        <span>
                          <strong>{a.date}</strong> &bull; {a.title} (
                          <span
                            className={
                              a.type === 'revenue' ? 'text-amber-800' : 'text-rose-700'
                            }
                          >
                            {a.type === 'revenue' ? '+' : '-'}${Number(a.amount).toFixed(2)}
                          </span>
                          )
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setState({
                              ...state,
                              pnlAdjustments: state.pnlAdjustments.filter((x) => x.id !== a.id),
                            })
                          }
                          className="cursor-pointer text-rose-700"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-6 lg:col-span-5">
                <div className="border border-stone-300 bg-white/90 p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="font-serif text-xl font-normal text-[#1C1917]">
                      Profit-First Account Allocator
                    </h2>
                    <span
                      className={`border px-2 py-0.5 text-[11px] font-bold ${
                        budgetTotalPct === 100
                          ? 'border-amber-700/30 bg-amber-50 text-amber-900'
                          : 'border-rose-300 bg-rose-50 text-rose-700'
                      }`}
                    >
                      Total: {budgetTotalPct}%
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-stone-600">
                    Divides True Net Profit (${Math.max(0, trueNetProfit).toFixed(2)}) into dedicated bank vaults:
                  </p>

                  <div className="mt-5 space-y-3.5">
                    {[
                      {
                        key: 'restock',
                        label: 'Inventory & Blank Restock Vault',
                        color: 'bg-[#1C1917]',
                      },
                      { key: 'tax', label: 'Tax Reserve Vault', color: 'bg-amber-700' },
                      { key: 'owner', label: 'Owner Pay / Draw', color: 'bg-stone-600' },
                      { key: 'growth', label: 'Marketing & Growth Fund', color: 'bg-amber-500' },
                    ].map((b) => {
                      const pct = Number(state.budgets[b.key] || 0);
                      const amt = Math.max(0, trueNetProfit) * (pct / 100);
                      return (
                        <div key={b.key} className="border border-stone-200 bg-[#F6F4EF] p-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-semibold">
                              {b.label} ({pct}%)
                            </span>
                            <strong className="text-base">${amt.toFixed(2)}</strong>
                          </div>
                          <div className="mt-2 h-2 w-full overflow-hidden bg-stone-200">
                            <div
                              className={`h-full ${b.color}`}
                              style={{ width: `${Math.min(100, pct)}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-5 grid grid-cols-4 gap-2 border-t border-stone-200 pt-4">
                    {['restock', 'tax', 'owner', 'growth'].map((k) => (
                      <div key={k}>
                        <label className="block text-[10px] font-bold uppercase text-stone-500">
                          {k} %
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={state.budgets[k]}
                          onChange={(e) =>
                            setState({
                              ...state,
                              budgets: {
                                ...state.budgets,
                                [k]: Math.max(0, parseInt(e.target.value || '0', 10)),
                              },
                            })
                          }
                          className="mt-1 w-full border border-stone-300 bg-white py-1.5 text-center text-xs font-bold"
                        />
                      </div>
                    ))}
                  </div>

                  {budgetTotalPct !== 100 && (
                    <button
                      type="button"
                      onClick={normalizeBudgets}
                      className="mt-3 inline-flex w-full cursor-pointer items-center justify-center gap-1.5 border border-stone-800 bg-stone-100 py-2 text-xs font-bold uppercase tracking-wider text-[#1C1917] hover:bg-stone-200"
                    >
                      <Sliders className="h-3.5 w-3.5" />
                      Auto-Balance Buckets to 100%
                    </button>
                  )}
                </div>

                {/* Break-Even & Labor Ratio Executive Box */}
                <div className="border border-stone-300 bg-[#EFECE4] p-5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-900">
                    CFO Operating Telemetry
                  </span>
                  <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                    <div className="border border-stone-300 bg-white p-3">
                      <span className="block text-[11px] text-stone-500">Break-Even Sales</span>
                      <strong className="text-base font-bold text-[#1C1917]">
                        ${breakEvenRevenue.toFixed(2)}
                      </strong>
                    </div>
                    <div className="border border-stone-300 bg-white p-3">
                      <span className="block text-[11px] text-stone-500">Labor-to-Sales Ratio</span>
                      <strong className="text-base font-bold text-amber-800">
                        {laborPct.toFixed(1)}%
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =================================================================
              TAB 2: TEAM & PAYROLL (EMPLOYEES SECTION)
             ================================================================= */}
          {cfoTab === 'employees' && (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-4">
                <div className="border border-stone-300 bg-white/90 p-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                    Active Roster
                  </span>
                  <p className="mt-1 text-2xl font-bold text-[#1C1917]">
                    {activeEmployeeCount}{' '}
                    <span className="text-xs font-normal text-stone-500">
                      / {employees.length} total
                    </span>
                  </p>
                </div>
                <div className="border border-stone-300 bg-white/90 p-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                    Logged Shift Hours
                  </span>
                  <p className="mt-1 text-2xl font-bold text-[#1C1917]">{totalLoggedHours} hrs</p>
                </div>
                <div className="border border-stone-300 bg-white/90 p-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                    Period Payroll Expense
                  </span>
                  <p className="mt-1 text-2xl font-bold text-rose-700">${totalPayroll.toFixed(2)}</p>
                </div>
                <div className="border border-stone-300 bg-white/90 p-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                    Payroll % of Revenue
                  </span>
                  <p className="mt-1 text-2xl font-bold text-amber-800">{laborPct.toFixed(1)}%</p>
                </div>
              </div>

              <div className="border border-stone-300 bg-white/90 p-6">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <h2 className="inline-flex items-center gap-2 font-serif text-xl font-normal text-[#1C1917]">
                      <Users className="h-5 w-5 text-amber-800" />
                      Employees, Shift Hours &amp; Role Permissions
                    </h2>
                    <p className="mt-1 text-xs text-stone-600">
                      Add staff members, adjust hourly rates or shift hours with 1-click steppers, inspect pay stubs, or toggle Active / Off-Cycle status.
                    </p>
                  </div>

                  {/* Employee Search Input */}
                  <div className="relative w-full sm:w-64">
                    <Search className="pointer-events-none absolute left-3 top-2.5 h-3.5 w-3.5 text-stone-500" />
                    <input
                      type="text"
                      value={employeeSearch}
                      onChange={(e) => setEmployeeSearch(e.target.value)}
                      placeholder="Search employees or roles..."
                      className="w-full border border-stone-300 bg-[#F6F4EF] py-1.5 pl-8 pr-7 text-xs focus:border-[#1C1917] focus:outline-none"
                    />
                    {employeeSearch && (
                      <button
                        type="button"
                        onClick={() => setEmployeeSearch('')}
                        className="absolute right-2 top-2 cursor-pointer text-stone-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newEmp.name.trim() || !newEmp.role.trim() || !newEmp.rate) return;
                    setState({
                      ...state,
                      employees: [
                        ...employees,
                        {
                          id: `emp-${Date.now()}`,
                          name: newEmp.name.trim(),
                          role: newEmp.role.trim(),
                          department: newEmp.department,
                          accessLevel: newEmp.accessLevel,
                          payType: newEmp.payType,
                          rate: parseFloat(newEmp.rate) || 0,
                          hours: newEmp.payType === 'hourly' ? parseFloat(newEmp.hours) || 0 : 1,
                          active: true,
                        },
                      ],
                    });
                    setNewEmp({
                      name: '',
                      role: '',
                      department: 'Production & DTF',
                      accessLevel: 'Fulfillment & Stock',
                      payType: 'hourly',
                      rate: '',
                      hours: '8',
                    });
                  }}
                  className="mt-5 grid gap-2.5 border border-stone-200 bg-[#F6F4EF] p-4 sm:grid-cols-12"
                >
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={newEmp.name}
                    onChange={(e) => setNewEmp({ ...newEmp, name: e.target.value })}
                    className="border border-stone-300 bg-white px-3 py-2 text-xs sm:col-span-3"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Job Title (e.g. Print Tech)"
                    value={newEmp.role}
                    onChange={(e) => setNewEmp({ ...newEmp, role: e.target.value })}
                    className="border border-stone-300 bg-white px-3 py-2 text-xs sm:col-span-2"
                  />
                  <select
                    value={newEmp.department}
                    onChange={(e) => setNewEmp({ ...newEmp, department: e.target.value })}
                    className="border border-stone-300 bg-white px-2.5 py-2 text-xs sm:col-span-2"
                  >
                    <option>Production &amp; DTF</option>
                    <option>Fulfillment &amp; Ops</option>
                    <option>Retail &amp; Pop-Up</option>
                    <option>Creative &amp; Media</option>
                  </select>
                  <select
                    value={newEmp.payType}
                    onChange={(e) => setNewEmp({ ...newEmp, payType: e.target.value })}
                    className="border border-stone-300 bg-white px-2.5 py-2 text-xs font-semibold sm:col-span-2"
                  >
                    <option value="hourly">Hourly ($/hr)</option>
                    <option value="flat">Flat Stipend ($)</option>
                  </select>
                  <div className="flex gap-1.5 sm:col-span-2">
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.5"
                      placeholder={newEmp.payType === 'hourly' ? '$/hr' : 'Flat $'}
                      value={newEmp.rate}
                      onChange={(e) => setNewEmp({ ...newEmp, rate: e.target.value })}
                      className="w-full border border-stone-300 bg-white px-2.5 py-2 text-xs"
                    />
                    {newEmp.payType === 'hourly' && (
                      <input
                        type="number"
                        required
                        min="0"
                        step="0.5"
                        placeholder="Hrs"
                        value={newEmp.hours}
                        onChange={(e) => setNewEmp({ ...newEmp, hours: e.target.value })}
                        className="w-16 border border-stone-300 bg-white px-2 py-2 text-xs"
                      />
                    )}
                  </div>
                  <button
                    type="submit"
                    className="inline-flex cursor-pointer items-center justify-center gap-1 bg-[#1C1917] px-3 py-2 text-xs font-semibold uppercase tracking-wider text-[#F6F4EF] hover:bg-amber-800 sm:col-span-1"
                  >
                    <UserPlus className="h-3.5 w-3.5" />
                    Add
                  </button>
                </form>

                <div className="mt-6 space-y-3">
                  {filteredEmployees.map((emp) => {
                    const payout = getEmployeePayout(emp);
                    return (
                      <div
                        key={emp.id}
                        className={`flex flex-wrap items-center justify-between gap-4 border p-5 transition ${
                          highlightedId === emp.id
                            ? 'border-2 border-amber-700 bg-amber-50/50'
                            : 'border-stone-300 bg-white'
                        } ${!emp.active ? 'opacity-65' : ''}`}
                      >
                        <div className="min-w-[210px]">
                          <div className="flex flex-wrap items-center gap-2">
                            <strong className="text-base text-[#1C1917]">{emp.name}</strong>
                            <span className="border border-stone-300 bg-[#F6F4EF] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-stone-700">
                              {emp.department}
                            </span>
                            <span className="inline-flex items-center gap-1 text-[11px] text-stone-500">
                              <Briefcase className="h-3 w-3" />
                              {emp.accessLevel}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-stone-600">{emp.role}</p>
                        </div>

                        <div className="flex flex-wrap items-center gap-4">
                          <div>
                            <label className="block text-[10px] font-bold uppercase text-stone-500">
                              {emp.payType === 'hourly' ? 'Rate ($/hr)' : 'Flat ($)'}
                            </label>
                            <input
                              type="number"
                              min="0"
                              step="0.5"
                              value={emp.rate}
                              onChange={(e) =>
                                setState({
                                  ...state,
                                  employees: employees.map((item) =>
                                    item.id === emp.id
                                      ? { ...item, rate: parseFloat(e.target.value) || 0 }
                                      : item
                                  ),
                                })
                              }
                              className="mt-1 w-22 border border-stone-300 bg-[#F6F4EF] px-2.5 py-1 text-xs font-bold"
                            />
                          </div>

                          {emp.payType === 'hourly' ? (
                            <div>
                              <label className="block text-[10px] font-bold uppercase text-stone-500">
                                Shift Hours
                              </label>
                              <div className="mt-1 flex items-center border border-stone-300 bg-[#F6F4EF]">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setState({
                                      ...state,
                                      employees: employees.map((item) =>
                                        item.id === emp.id
                                          ? {
                                              ...item,
                                              hours: Math.max(0, Number(item.hours || 0) - 1),
                                            }
                                          : item
                                      ),
                                    })
                                  }
                                  className="cursor-pointer px-2 py-1 text-stone-700 hover:bg-stone-200"
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="min-w-10 text-center text-xs font-bold">
                                  {emp.hours}h
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setState({
                                      ...state,
                                      employees: employees.map((item) =>
                                        item.id === emp.id
                                          ? { ...item, hours: Number(item.hours || 0) + 1 }
                                          : item
                                      ),
                                    })
                                  }
                                  className="cursor-pointer px-2 py-1 text-stone-700 hover:bg-stone-200"
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="w-24">
                              <span className="block text-[10px] font-bold uppercase text-stone-500">
                                Schedule
                              </span>
                              <span className="mt-1.5 block text-xs font-semibold text-stone-600">
                                Per Project
                              </span>
                            </div>
                          )}

                          <div className="min-w-[85px] text-right">
                            <span className="block text-[10px] font-bold uppercase text-stone-500">
                              Period Pay
                            </span>
                            <strong className="text-sm font-bold text-rose-700">
                              -${payout.toFixed(2)}
                            </strong>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                setState({
                                  ...state,
                                  employees: employees.map((item) =>
                                    item.id === emp.id ? { ...item, active: !item.active } : item
                                  ),
                                })
                              }
                              className={`cursor-pointer border px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider ${
                                emp.active
                                  ? 'border-amber-700/40 bg-amber-50 text-amber-900'
                                  : 'border-stone-300 bg-stone-100 text-stone-600'
                              }`}
                            >
                              {emp.active ? 'Active' : 'Off-Cycle'}
                            </button>

                            <button
                              type="button"
                              onClick={() => setPayStubEmp(emp)}
                              className="cursor-pointer border border-stone-300 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-[#1C1917] hover:bg-stone-100"
                            >
                              Pay Stub
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                setState({
                                  ...state,
                                  employees: employees.filter((item) => item.id !== emp.id),
                                })
                              }
                              className="cursor-pointer p-1 text-stone-400 hover:text-rose-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* =================================================================
              TAB 3: ORDERS, FULFILLMENT & PACKING SLIPS
             ================================================================= */}
          {cfoTab === 'orders' && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                  {['All', 'Unfulfilled', 'Packing', 'Shipped', 'Delivered'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setOrderFilter(st)}
                      className={`cursor-pointer px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider ${
                        orderFilter === st
                          ? 'bg-[#1C1917] text-[#F6F4EF]'
                          : 'border border-stone-300 bg-white text-stone-700 hover:border-stone-500'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                {/* Order Search Input */}
                <div className="flex items-center gap-3">
                  <div className="relative w-64">
                    <Search className="pointer-events-none absolute left-3 top-2 h-3.5 w-3.5 text-stone-500" />
                    <input
                      type="text"
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      placeholder="Search order #, customer, tracking..."
                      className="w-full border border-stone-300 bg-white py-1.5 pl-8 pr-7 text-xs focus:border-[#1C1917] focus:outline-none"
                    />
                    {orderSearch && (
                      <button
                        type="button"
                        onClick={() => setOrderSearch('')}
                        className="absolute right-2 top-2 cursor-pointer text-stone-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                  <span className="text-xs text-stone-600">
                    {filteredOrders.length} of {state.orders.length}
                  </span>
                </div>
              </div>

              {filteredOrders.map((o) => {
                const netOrderProfit =
                  Number(o.total) - Number(o.cogs) - Number(o.labelCost) - Number(o.fee);
                return (
                  <div
                    key={o.id}
                    className={`border p-6 transition ${
                      highlightedId === o.id
                        ? 'border-2 border-amber-700 bg-amber-50/40'
                        : 'border-stone-300 bg-white/90'
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-stone-200 pb-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2.5">
                          <strong className="text-lg">{o.id}</strong>
                          <span className="border border-stone-300 bg-[#F6F4EF] px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-[#1C1917]">
                            {o.fulfillmentStatus || 'Unfulfilled'}
                          </span>
                          <span className="border border-amber-700/30 bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-900">
                            Net Profit: +${netOrderProfit.toFixed(2)}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-stone-600">
                          {o.date} &bull; <strong>{o.customerName}</strong> ({o.customerEmail}) &bull;{' '}
                          {o.address}
                        </p>
                      </div>
                      <div className="text-right">
                        <strong className="text-xl">${Number(o.total).toFixed(2)}</strong>
                        <p className="text-[11px] text-stone-500">
                          COGS ${Number(o.cogs).toFixed(2)} &bull; Label $
                          {Number(o.labelCost).toFixed(2)} &bull; Fee ${Number(o.fee).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <ul className="my-3 list-disc pl-5 text-sm text-stone-700">
                      {o.items.map((it, idx) => (
                        <li key={idx}>
                          <strong>{it.qty}x</strong> {it.name} &mdash; Size{' '}
                          <strong>{it.size}</strong> (${(it.price * it.qty).toFixed(2)})
                        </li>
                      ))}
                    </ul>

                    <div className="mt-4 grid gap-3 sm:grid-cols-4">
                      <select
                        value={o.carrier || 'USPS'}
                        onChange={(e) =>
                          setState({
                            ...state,
                            orders: state.orders.map((ord) =>
                              ord.id === o.id ? { ...ord, carrier: e.target.value } : ord
                            ),
                          })
                        }
                        className="border border-stone-300 bg-[#F6F4EF] px-3 py-2 text-xs font-semibold"
                      >
                        <option>USPS</option>
                        <option>UPS</option>
                        <option>FedEx</option>
                        <option>Local Pickup</option>
                      </select>

                      <input
                        type="text"
                        value={o.tracking || ''}
                        placeholder="Enter tracking #..."
                        onChange={(e) =>
                          setState({
                            ...state,
                            orders: state.orders.map((ord) =>
                              ord.id === o.id
                                ? {
                                    ...ord,
                                    tracking: e.target.value,
                                    fulfillmentStatus:
                                      e.target.value &&
                                      (ord.fulfillmentStatus || 'Unfulfilled') === 'Unfulfilled'
                                        ? 'Shipped'
                                        : ord.fulfillmentStatus || 'Unfulfilled',
                                  }
                                : ord
                            ),
                          })
                        }
                        className="border border-stone-300 bg-[#F6F4EF] px-3 py-2 text-xs"
                      />

                      <select
                        value={o.fulfillmentStatus || 'Unfulfilled'}
                        onChange={(e) =>
                          setState({
                            ...state,
                            orders: state.orders.map((ord) =>
                              ord.id === o.id
                                ? { ...ord, fulfillmentStatus: e.target.value }
                                : ord
                            ),
                          })
                        }
                        className="border border-stone-300 bg-[#F6F4EF] px-3 py-2 text-xs font-semibold"
                      >
                        <option>Unfulfilled</option>
                        <option>Packing</option>
                        <option>Shipped</option>
                        <option>Delivered</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => setSlipOrder(o)}
                        className="inline-flex cursor-pointer items-center justify-center gap-1.5 border border-[#1C1917] bg-white px-3 py-2 text-xs font-semibold uppercase tracking-wider text-[#1C1917] hover:bg-stone-100"
                      >
                        <Printer className="h-3.5 w-3.5" />
                        Packing Slip
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* =================================================================
              TAB 4: INVENTORY, PRODUCT IMAGE UPLOADS & SKU MARGINS
             ================================================================= */}
          {cfoTab === 'inventory' && (
            <div className="space-y-6">
              <div className="border border-stone-300 bg-white/90 p-6">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <h2 className="font-serif text-xl font-normal text-[#1C1917]">
                      SKU Profit Margin Leaderboard, Photos &amp; Live Size Stock
                    </h2>
                    <p className="mt-1 text-xs text-stone-600">
                      Upload or replace product photos, adjust retail prices and unit COGS, or update size quantities below. Storefront listings update immediately.
                    </p>
                  </div>

                  {/* Quick Admin Catalog Search & Category Filter */}
                  <div className="flex flex-wrap gap-2">
                    <div className="relative">
                      <Search className="pointer-events-none absolute left-3 top-2.5 h-3.5 w-3.5 text-stone-500" />
                      <input
                        type="text"
                        value={inventorySearch}
                        onChange={(e) => setInventorySearch(e.target.value)}
                        placeholder="Filter SKUs..."
                        className="border border-stone-300 bg-[#F6F4EF] py-1.5 pl-8 pr-7 text-xs focus:border-[#1C1917] focus:outline-none"
                      />
                      {inventorySearch && (
                        <button
                          type="button"
                          onClick={() => setInventorySearch('')}
                          className="absolute right-2 top-2 cursor-pointer text-stone-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                    <select
                      value={inventoryCatFilter}
                      onChange={(e) => setInventoryCatFilter(e.target.value)}
                      className="border border-stone-300 bg-[#F6F4EF] px-3 py-1.5 text-xs font-semibold"
                    >
                      {catalogCategories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat === 'All' ? 'All Categories' : cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-5 space-y-4">
                  {skuLeaderboard.map((p, rank) => {
                    const unitProfit = Number(p.price) - Number(p.unitCost);
                    const margin = p.price > 0 ? (unitProfit / p.price) * 100 : 0;
                    const units = totalUnitsForProduct(p);
                    return (
                      <div
                        key={p.id}
                        className={`border p-5 transition ${
                          highlightedId === p.id
                            ? 'border-2 border-amber-700 bg-amber-50/40'
                            : 'border-stone-300 bg-[#F6F4EF]'
                        }`}
                      >
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          {/* Product Photo Uploader + Title */}
                          <div className="flex items-start gap-4">
                            <div className="flex flex-col items-center gap-1.5">
                              <div className="flex h-20 w-20 items-center justify-center overflow-hidden border border-stone-300 bg-white">
                                {p.image ? (
                                  <img
                                    src={p.image}
                                    alt={p.name}
                                    className="h-full w-full object-cover object-center"
                                  />
                                ) : (
                                  <ImageIcon className="h-6 w-6 text-stone-400" />
                                )}
                              </div>
                              <label className="inline-flex cursor-pointer items-center gap-1 border border-stone-800 bg-white px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#1C1917] hover:bg-stone-100">
                                <Upload className="h-3 w-3" />
                                <span>{p.image ? 'Replace' : 'Upload'}</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    handleExistingProductImageUpload(p.id, file);
                                    e.target.value = '';
                                  }}
                                />
                              </label>
                              {p.image && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setState({
                                      ...state,
                                      products: state.products.map((item) =>
                                        item.id === p.id ? { ...item, image: '' } : item
                                      ),
                                    })
                                  }
                                  className="cursor-pointer text-[10px] font-semibold text-rose-700 hover:underline"
                                >
                                  Remove
                                </button>
                              )}
                            </div>

                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="bg-[#1C1917] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#F6F4EF]">
                                  #{rank + 1} Margin
                                </span>
                                <span className="text-xs uppercase tracking-wider text-stone-500">
                                  {p.category} &bull; {units} total units
                                </span>
                                <button
                                  type="button"
                                  onClick={() => jumpToStoreProduct(p.name)}
                                  className="inline-flex cursor-pointer items-center gap-1 text-[11px] font-semibold text-amber-800 hover:underline"
                                >
                                  <span>View in Storefront</span>
                                  <ExternalLink className="h-3 w-3" />
                                </button>
                              </div>
                              <h3 className="mt-1 font-serif text-lg text-[#1C1917]">{p.name}</h3>
                            </div>
                          </div>

                          {/* Retail Price, Unit COGS & Margin */}
                          <div className="flex flex-wrap items-center gap-4">
                            <div>
                              <label className="block text-[10px] font-bold uppercase text-stone-500">
                                Retail ($)
                              </label>
                              <input
                                type="number"
                                step="0.01"
                                value={p.price}
                                onChange={(e) =>
                                  setState({
                                    ...state,
                                    products: state.products.map((item) =>
                                      item.id === p.id
                                        ? { ...item, price: parseFloat(e.target.value) || 0 }
                                        : item
                                    ),
                                  })
                                }
                                className="mt-1 w-24 border border-stone-300 bg-white px-2.5 py-1 text-xs font-bold"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold uppercase text-stone-500">
                                Unit COGS ($)
                              </label>
                              <input
                                type="number"
                                step="0.01"
                                value={p.unitCost}
                                onChange={(e) =>
                                  setState({
                                    ...state,
                                    products: state.products.map((item) =>
                                      item.id === p.id
                                        ? { ...item, unitCost: parseFloat(e.target.value) || 0 }
                                        : item
                                    ),
                                  })
                                }
                                className="mt-1 w-24 border border-stone-300 bg-white px-2.5 py-1 text-xs font-bold"
                              />
                            </div>

                            <div className="min-w-[110px] text-right">
                              <span className="block text-[10px] font-bold uppercase text-stone-500">
                                Unit Profit
                              </span>
                              <strong className="text-sm font-bold text-amber-800">
                                +${unitProfit.toFixed(2)} ({margin.toFixed(1)}%)
                              </strong>
                            </div>
                          </div>
                        </div>

                        {/* Size-by-size live stock inputs */}
                        <div className="mt-4 grid grid-cols-5 gap-2 border-t border-stone-300 pt-3 sm:max-w-md">
                          {['S', 'M', 'L', 'XL', '2XL'].map((sz) => (
                            <div key={sz} className="text-center">
                              <label className="block text-[10px] font-bold text-stone-600">
                                {sz}
                              </label>
                              <input
                                type="number"
                                min="0"
                                value={p.sizeStock?.[sz] ?? 0}
                                onChange={(e) =>
                                  setState({
                                    ...state,
                                    products: state.products.map((item) =>
                                      item.id === p.id
                                        ? {
                                            ...item,
                                            sizeStock: {
                                              ...item.sizeStock,
                                              [sz]: Math.max(
                                                0,
                                                parseInt(e.target.value || '0', 10)
                                              ),
                                            },
                                          }
                                        : item
                                    ),
                                  })
                                }
                                className="mt-1 w-full border border-stone-300 bg-white py-1 text-center text-xs font-bold"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Publish New SKU Form with Image Upload */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newSku.name.trim()) return;
                  const created = {
                    id: `sg-${Date.now()}`,
                    name: newSku.name.trim(),
                    category: newSku.category,
                    badge: newSku.badge.trim() || 'Capsule Drop',
                    description: newSku.description.trim() || 'Limited capsule release.',
                    price: parseFloat(newSku.price) || 68,
                    unitCost: parseFloat(newSku.unitCost) || 20,
                    image: newSku.image || '',
                    sizeStock: {
                      S: Number(newSku.S) || 0,
                      M: Number(newSku.M) || 0,
                      L: Number(newSku.L) || 0,
                      XL: Number(newSku.XL) || 0,
                      '2XL': Number(newSku['2XL']) || 0,
                    },
                  };
                  setState({ ...state, products: [...state.products, created] });
                  setNewSku({
                    name: '',
                    category: 'Hoodies',
                    badge: 'Capsule Drop',
                    description: '',
                    price: '68',
                    unitCost: '21',
                    image: '',
                    S: 6,
                    M: 10,
                    L: 10,
                    XL: 6,
                    '2XL': 3,
                  });
                }}
                className="border border-stone-300 bg-white/90 p-6"
              >
                <h3 className="font-serif text-lg font-normal text-[#1C1917]">
                  Publish New Product SKU to Live Storefront
                </h3>

                <div className="mt-4 flex flex-wrap items-center gap-4 border border-stone-200 bg-[#F6F4EF] p-4">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden border border-stone-300 bg-white">
                    {newSku.image ? (
                      <img
                        src={newSku.image}
                        alt="New product preview"
                        className="h-full w-full object-cover object-center"
                      />
                    ) : (
                      <ImageIcon className="h-6 w-6 text-stone-400" />
                    )}
                  </div>
                  <div>
                    <label className="inline-flex cursor-pointer items-center gap-1.5 border border-[#1C1917] bg-white px-3.5 py-2 text-xs font-semibold uppercase tracking-wider text-[#1C1917] hover:bg-stone-100">
                      <Upload className="h-3.5 w-3.5" />
                      <span>{newSku.image ? 'Change Product Photo' : 'Upload Product Photo'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          handleNewSkuImageUpload(file);
                          e.target.value = '';
                        }}
                      />
                    </label>
                    {newSku.image && (
                      <button
                        type="button"
                        onClick={() => setNewSku((prev) => ({ ...prev, image: '' }))}
                        className="ml-3 cursor-pointer text-xs font-semibold text-rose-700 hover:underline"
                      >
                        Remove Photo
                      </button>
                    )}
                    <p className="mt-1.5 text-xs text-stone-500">
                      JPG, PNG, or WebP &bull; Automatically optimized for fast storefront loading
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-5">
                  <input
                    type="text"
                    required
                    placeholder="Product Name"
                    value={newSku.name}
                    onChange={(e) => setNewSku({ ...newSku, name: e.target.value })}
                    className="border border-stone-300 bg-[#F6F4EF] px-3 py-2 text-xs sm:col-span-2"
                  />
                  <select
                    value={newSku.category}
                    onChange={(e) => setNewSku({ ...newSku, category: e.target.value })}
                    className="border border-stone-300 bg-[#F6F4EF] px-3 py-2 text-xs"
                  >
                    <option>Hoodies</option>
                    <option>Tees</option>
                    <option>Bottoms</option>
                    <option>Outerwear</option>
                  </select>
                  <input
                    type="number"
                    required
                    step="0.01"
                    placeholder="Retail ($)"
                    value={newSku.price}
                    onChange={(e) => setNewSku({ ...newSku, price: e.target.value })}
                    className="border border-stone-300 bg-[#F6F4EF] px-3 py-2 text-xs"
                  />
                  <input
                    type="number"
                    required
                    step="0.01"
                    placeholder="Unit COGS ($)"
                    value={newSku.unitCost}
                    onChange={(e) => setNewSku({ ...newSku, unitCost: e.target.value })}
                    className="border border-stone-300 bg-[#F6F4EF] px-3 py-2 text-xs"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Fabric weight, fit & search keywords (e.g. 460 GSM heavyweight fleece)..."
                  value={newSku.description}
                  onChange={(e) => setNewSku({ ...newSku, description: e.target.value })}
                  className="mt-3 w-full border border-stone-300 bg-[#F6F4EF] px-3 py-2 text-xs"
                />
                <button
                  type="submit"
                  className="mt-4 inline-flex cursor-pointer items-center gap-1.5 bg-[#1C1917] px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#F6F4EF] hover:bg-amber-800"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Product to Storefront
                </button>
              </form>
            </div>
          )}

          {/* =================================================================
              TAB 5: EXPENSES & OVERHEAD LEDGER
             ================================================================= */}
          {cfoTab === 'expenses' && (
            <div className="grid gap-6 lg:grid-cols-12">
              <div className="border border-stone-300 bg-white/90 p-6 lg:col-span-8">
                <h2 className="font-serif text-xl font-normal text-[#1C1917]">
                  Business Expense &amp; Overhead Ledger
                </h2>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newExp.vendor || !newExp.amount) return;
                    setState({
                      ...state,
                      expenses: [
                        {
                          id: `exp-${Date.now()}`,
                          date: newExp.date,
                          category: newExp.category,
                          vendor: newExp.vendor.trim(),
                          amount: parseFloat(newExp.amount) || 0,
                        },
                        ...state.expenses,
                      ],
                    });
                    setNewExp({ ...newExp, vendor: '', amount: '' });
                  }}
                  className="mt-4 grid gap-3 border border-stone-200 bg-[#F6F4EF] p-4 sm:grid-cols-4"
                >
                  <select
                    value={newExp.category}
                    onChange={(e) => setNewExp({ ...newExp, category: e.target.value })}
                    className="border border-stone-300 bg-white px-3 py-2 text-xs font-semibold"
                  >
                    <option>Blank Apparel Restock</option>
                    <option>DTF Ink, Film &amp; Powder</option>
                    <option>Marketing &amp; Ads</option>
                    <option>Packaging &amp; Mailers</option>
                    <option>Software &amp; Hosting</option>
                    <option>Studio Rent &amp; Utilities</option>
                  </select>
                  <input
                    type="text"
                    required
                    placeholder="Vendor / Description"
                    value={newExp.vendor}
                    onChange={(e) => setNewExp({ ...newExp, vendor: e.target.value })}
                    className="border border-stone-300 bg-white px-3 py-2 text-xs sm:col-span-2"
                  />
                  <div className="flex gap-2">
                    <input
                      type="number"
                      required
                      step="0.01"
                      placeholder="Amount ($)"
                      value={newExp.amount}
                      onChange={(e) => setNewExp({ ...newExp, amount: e.target.value })}
                      className="w-full border border-stone-300 bg-white px-3 py-2 text-xs"
                    />
                    <button
                      type="submit"
                      className="cursor-pointer bg-[#1C1917] px-4 text-xs font-semibold text-[#F6F4EF]"
                    >
                      Log
                    </button>
                  </div>
                </form>

                <div className="mt-5 divide-y divide-stone-200">
                  {state.expenses.map((exp) => (
                    <div
                      key={exp.id}
                      className={`flex items-center justify-between px-2 py-3 text-sm ${
                        highlightedId === exp.id ? 'bg-amber-50' : ''
                      }`}
                    >
                      <div>
                        <strong>{exp.vendor}</strong>
                        <p className="text-xs text-stone-500">
                          {exp.date} &bull; {exp.category}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <strong className="text-rose-700">-${Number(exp.amount).toFixed(2)}</strong>
                        <button
                          type="button"
                          onClick={() =>
                            setState({
                              ...state,
                              expenses: state.expenses.filter((x) => x.id !== exp.id),
                            })
                          }
                          className="cursor-pointer text-stone-400 hover:text-rose-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border border-stone-300 bg-white/90 p-6 lg:col-span-4">
                <h3 className="font-serif text-lg font-normal text-[#1C1917]">
                  Spend by Category
                </h3>
                <div className="mt-4 space-y-3">
                  {Object.entries(expenseByCategory).map(([cat, amt]) => {
                    const share = totalOverhead > 0 ? (amt / totalOverhead) * 100 : 0;
                    return (
                      <div key={cat} className="border border-stone-200 bg-[#F6F4EF] p-3 text-xs">
                        <div className="flex justify-between font-semibold">
                          <span>{cat}</span>
                          <span>${amt.toFixed(2)}</span>
                        </div>
                        <div className="mt-1.5 h-1.5 w-full bg-stone-200">
                          <div
                            className="h-full bg-amber-800"
                            style={{ width: `${Math.min(100, share)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* =================================================================
              TAB 6: PROMO CODES & DISCOUNTS
             ================================================================= */}
          {cfoTab === 'promos' && (
            <div className="max-w-2xl space-y-6">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const code = newPromo.code.trim().toUpperCase();
                  if (!code) return;
                  setState({
                    ...state,
                    promos: [
                      {
                        id: `pr-${Date.now()}`,
                        code,
                        type: newPromo.type,
                        value: parseFloat(newPromo.value) || 10,
                        active: true,
                        uses: 0,
                      },
                      ...promos,
                    ],
                  });
                  setNewPromo({ code: '', type: 'percent', value: '15' });
                }}
                className="grid gap-3 border border-stone-300 bg-white p-5 sm:grid-cols-4"
              >
                <input
                  type="text"
                  required
                  placeholder="CODE (e.g. DROP25)"
                  value={newPromo.code}
                  onChange={(e) => setNewPromo({ ...newPromo, code: e.target.value })}
                  className="border border-stone-300 bg-[#F6F4EF] px-3 py-2 text-xs uppercase"
                />
                <select
                  value={newPromo.type}
                  onChange={(e) => setNewPromo({ ...newPromo, type: e.target.value })}
                  className="border border-stone-300 bg-[#F6F4EF] px-3 py-2 text-xs"
                >
                  <option value="percent">% Off</option>
                  <option value="fixed">$ Off</option>
                </select>
                <input
                  type="number"
                  required
                  min="1"
                  value={newPromo.value}
                  onChange={(e) => setNewPromo({ ...newPromo, value: e.target.value })}
                  className="border border-stone-300 bg-[#F6F4EF] px-3 py-2 text-xs"
                />
                <button
                  type="submit"
                  className="cursor-pointer bg-[#1C1917] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#F6F4EF] hover:bg-amber-800"
                >
                  Create Code
                </button>
              </form>

              <div className="space-y-3">
                {promos.map((pr) => (
                  <div
                    key={pr.id}
                    className={`flex items-center justify-between border p-5 ${
                      highlightedId === pr.id
                        ? 'border-2 border-amber-700 bg-amber-50/40'
                        : 'border-stone-300 bg-white'
                    }`}
                  >
                    <div>
                      <strong className="text-base">{pr.code}</strong>
                      <p className="text-xs text-stone-500">
                        {pr.type === 'percent' ? `${pr.value}% Off` : `$${pr.value} Off`} &bull; Used{' '}
                        {pr.uses} times
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setState({
                          ...state,
                          promos: promos.map((item) =>
                            item.id === pr.id ? { ...item, active: !item.active } : item
                          ),
                        })
                      }
                      className={`cursor-pointer border px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider ${
                        pr.active
                          ? 'border-amber-700/40 bg-amber-50 text-amber-900'
                          : 'border-stone-300 bg-stone-100 text-stone-600'
                      }`}
                    >
                      {pr.active ? 'Active' : 'Paused'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      )}

      {/* QUICK-VIEW SIZE MODAL */}
      {selectedProd && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/60 p-4"
          onClick={() => setSelectedProd(null)}
        >
          <div
            className="w-full max-w-md border border-stone-300 bg-[#F6F4EF] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-xl text-[#1C1917]">{selectedProd.name}</h3>
              <button type="button" onClick={() => setSelectedProd(null)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            {selectedProd.image && (
              <div className="mt-3 h-48 w-full overflow-hidden border border-stone-300 bg-white">
                <img
                  src={selectedProd.image}
                  alt={selectedProd.name}
                  className="h-full w-full object-cover object-center"
                />
              </div>
            )}
            <p className="mt-2 font-semibold text-amber-800">${selectedProd.price.toFixed(2)}</p>
            {selectedProd.description && (
              <p className="mt-1 text-xs text-stone-600">{selectedProd.description}</p>
            )}
            <div className="mt-4 grid grid-cols-5 gap-2">
              {['S', 'M', 'L', 'XL', '2XL'].map((sz) => {
                const count = Number(selectedProd.sizeStock?.[sz] || 0);
                return (
                  <button
                    key={sz}
                    type="button"
                    disabled={count === 0}
                    onClick={() => setSelectedSize(sz)}
                    className={`cursor-pointer border py-2 text-center text-xs font-bold ${
                      count === 0
                        ? 'border-stone-200 bg-stone-100 text-stone-400 line-through'
                        : selectedSize === sz
                        ? 'border-[#1C1917] bg-[#1C1917] text-[#F6F4EF]'
                        : 'border-stone-300 bg-white text-[#1C1917]'
                    }`}
                  >
                    <div>{sz}</div>
                    <div className="text-[10px] font-normal">{count} left</div>
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => {
                setCart([
                  ...cart,
                  {
                    id: selectedProd.id,
                    name: selectedProd.name,
                    price: selectedProd.price,
                    unitCost: selectedProd.unitCost,
                    image: selectedProd.image || '',
                    size: selectedSize,
                    qty: 1,
                  },
                ]);
                setSelectedProd(null);
                setCartOpen(true);
              }}
              className="mt-5 w-full cursor-pointer bg-amber-800 py-3 text-xs font-semibold uppercase tracking-widest text-white"
            >
              Add Size {selectedSize} to Bag
            </button>
          </div>
        </div>
      )}

      {/* CART & CHECKOUT DRAWER */}
      {cartOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-stone-950/60"
          onClick={() => setCartOpen(false)}
        >
          <div
            className="h-full w-full max-w-md overflow-y-auto bg-[#F6F4EF] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stone-300 pb-4">
              <h3 className="font-serif text-xl text-[#1C1917]">Flagship Checkout</h3>
              <button type="button" onClick={() => setCartOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>

            {orderBanner && (
              <div className="mt-4 flex items-start gap-2 border border-amber-700/30 bg-amber-50 p-4 text-xs text-stone-900">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-800" />
                <span>{orderBanner}</span>
              </div>
            )}

            {cart.length === 0 ? (
              <p className="mt-8 text-center text-sm text-stone-600">Bag is empty.</p>
            ) : (
              <form onSubmit={handleDemoPurchase} className="mt-4 space-y-4">
                {cart.map((c, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-3 border border-stone-200 bg-white p-3 text-sm"
                  >
                    <div className="flex items-center gap-3">
                      {c.image && (
                        <img
                          src={c.image}
                          alt={c.name}
                          className="h-11 w-11 shrink-0 border border-stone-200 object-cover"
                        />
                      )}
                      <span>
                        {c.name} (Size {c.size})
                      </span>
                    </div>
                    <strong>${c.price.toFixed(2)}</strong>
                  </div>
                ))}

                <div className="pt-1">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder="Promo code (try WELCOME10)"
                      className="w-full border border-stone-300 bg-white px-3 py-2 text-xs uppercase"
                    />
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      className="cursor-pointer bg-[#1C1917] px-4 py-2 text-xs font-semibold uppercase text-[#F6F4EF]"
                    >
                      Apply
                    </button>
                  </div>
                  {promoError && <p className="mt-1 text-xs text-rose-700">{promoError}</p>}
                  {appliedPromo && (
                    <p className="mt-1 text-xs font-bold text-amber-800">
                      Code {appliedPromo.code} applied (-${cartDiscount.toFixed(2)})
                    </p>
                  )}
                </div>

                <div className="space-y-1 border-t border-stone-300 pt-3 text-sm">
                  <div className="flex justify-between text-stone-600">
                    <span>Subtotal</span>
                    <span>${cartSubtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Shipping ($100+ Free)</span>
                    <span>{cartShipping === 0 ? 'FREE' : `$${cartShipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold">
                    <span>Total</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                </div>

                <input
                  type="text"
                  required
                  placeholder="Customer Name"
                  value={checkoutForm.name}
                  onChange={(e) => setCheckoutForm({ ...checkoutForm, name: e.target.value })}
                  className="w-full border border-stone-300 bg-white px-3 py-2 text-xs"
                />
                <input
                  type="email"
                  required
                  placeholder="Email Address"
                  value={checkoutForm.email}
                  onChange={(e) => setCheckoutForm({ ...checkoutForm, email: e.target.value })}
                  className="w-full border border-stone-300 bg-white px-3 py-2 text-xs"
                />
                <input
                  type="text"
                  required
                  placeholder="Shipping Address"
                  value={checkoutForm.address}
                  onChange={(e) => setCheckoutForm({ ...checkoutForm, address: e.target.value })}
                  className="w-full border border-stone-300 bg-white px-3 py-2 text-xs"
                />
                <button
                  type="submit"
                  className="w-full cursor-pointer bg-amber-800 py-3 text-xs font-semibold uppercase tracking-widest text-white"
                >
                  Complete Demo Order (${cartTotal.toFixed(2)})
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* PACKING SLIP MODAL */}
      {slipOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/60 p-4"
          onClick={() => setSlipOrder(null)}
        >
          <div
            className="w-full max-w-md border border-stone-300 bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <strong className="font-serif text-lg">Packing Slip &bull; {slipOrder.id}</strong>
              <button type="button" onClick={() => setSlipOrder(null)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="mt-3 text-xs text-stone-600">
              <strong>Date:</strong> {slipOrder.date} &bull; <strong>Carrier:</strong>{' '}
              {slipOrder.carrier || 'USPS'}
            </p>
            <p className="mt-2 text-sm">
              <strong>Ship To:</strong> {slipOrder.customerName} &mdash; {slipOrder.address}
            </p>
            <ul className="mt-3 space-y-1 border-y border-stone-200 py-3 text-sm">
              {slipOrder.items.map((it, i) => (
                <li key={i} className="flex justify-between">
                  <span>
                    {it.qty}x {it.name} (Size {it.size})
                  </span>
                  <strong>${(it.price * it.qty).toFixed(2)}</strong>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-right text-base font-bold">
              Order Total: ${Number(slipOrder.total).toFixed(2)}
            </p>
          </div>
        </div>
      )}

      {/* EMPLOYEE PAY STUB PREVIEW MODAL */}
      {payStubEmp && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/60 p-4"
          onClick={() => setPayStubEmp(null)}
        >
          <div
            className="w-full max-w-md border border-stone-300 bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-800">
                  Susquehanna Goods &bull; Payroll Statement
                </span>
                <h3 className="font-serif text-xl text-[#1C1917]">{payStubEmp.name}</h3>
              </div>
              <button type="button" onClick={() => setPayStubEmp(null)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-stone-600">Role / Department</span>
                <strong>
                  {payStubEmp.role} ({payStubEmp.department})
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600">Pay Basis</span>
                <strong>
                  {payStubEmp.payType === 'hourly'
                    ? `$${Number(payStubEmp.rate).toFixed(2)}/hr × ${payStubEmp.hours} hrs`
                    : `Flat Stipend ($${Number(payStubEmp.rate).toFixed(2)})`}
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600">Roster Status</span>
                <strong>
                  {payStubEmp.active ? 'Active (Included in P&L)' : 'Off-Cycle ($0.00)'}
                </strong>
              </div>
              <div className="flex justify-between border-t border-stone-300 pt-3 text-base font-bold">
                <span>Period Gross Payout</span>
                <span className="text-amber-800">
                  ${getEmployeePayout(payStubEmp).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}