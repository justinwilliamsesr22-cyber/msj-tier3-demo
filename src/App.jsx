import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  BarChart3,
  Eye,
  RotateCcw,
  Plus,
  Trash2,
  Download,
  X,
  ArrowLeft,
  DollarSign,
  TrendingUp,
  PieChart,
} from 'lucide-react';

const STORAGE_KEY = 'msj_tier3_demo_v1';

const INITIAL_DATA = {
  products: [
    {
      id: 'sg-1',
      name: 'Susquehanna Heavyweight Fleece Hoodie',
      category: 'Hoodies',
      price: 78,
      unitCost: 24,
      badge: 'Flagship Drop',
      sizeStock: { S: 6, M: 12, L: 14, XL: 8, '2XL': 4 },
    },
    {
      id: 'sg-2',
      name: 'Vintage Wash Box Graphic Tee',
      category: 'Tees',
      price: 42,
      unitCost: 11.5,
      badge: 'Best Seller',
      sizeStock: { S: 10, M: 18, L: 15, XL: 9, '2XL': 5 },
    },
    {
      id: 'sg-3',
      name: 'Technical Utility Cargo Pant',
      category: 'Bottoms',
      price: 92,
      unitCost: 28,
      badge: 'Limited Run',
      sizeStock: { S: 4, M: 7, L: 8, XL: 5, '2XL': 2 },
    },
  ],
  orders: [
    {
      id: 'SG-2041',
      date: '2026-11-20',
      customerName: 'Jordan Taylor',
      customerEmail: 'jtaylor@example.com',
      address: '215 State St, Harrisburg, PA 17101',
      items: [{ id: 'sg-1', name: 'Susquehanna Heavyweight Fleece Hoodie', size: 'L', qty: 2, price: 78, unitCost: 24 }],
      subtotal: 156,
      discount: 0,
      shippingCollected: 0,
      total: 156,
      cogs: 48,
      labelCost: 9.5,
      fee: 4.82,
      status: 'Shipped',
    },
    {
      id: 'SG-2040',
      date: '2026-11-18',
      customerName: 'Devon Carter',
      customerEmail: 'dcarter@example.com',
      address: '804 Walnut St, Lemoyne, PA 17043',
      items: [{ id: 'sg-2', name: 'Vintage Wash Box Graphic Tee', size: 'M', qty: 3, price: 42, unitCost: 11.5 }],
      subtotal: 126,
      discount: 12.6,
      shippingCollected: 0,
      total: 113.4,
      cogs: 34.5,
      labelCost: 6.2,
      fee: 3.59,
      status: 'Delivered',
    },
    {
      id: 'SG-2039',
      date: '2026-11-16',
      customerName: 'Taylor Reed',
      customerEmail: 'treed@example.com',
      address: '330 Derry St, Hershey, PA 17033',
      items: [{ id: 'sg-3', name: 'Technical Utility Cargo Pant', size: 'L', qty: 1, price: 92, unitCost: 28 }],
      subtotal: 92,
      discount: 0,
      shippingCollected: 8.95,
      total: 100.95,
      cogs: 28,
      labelCost: 7.4,
      fee: 3.23,
      status: 'Unfulfilled',
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
      amount: 185,
    },
    {
      id: 'exp-2',
      date: '2026-11-10',
      category: 'DTF Ink, Film & Powder',
      vendor: 'Commercial DTF Transfer Film Roll',
      amount: 64,
    },
    {
      id: 'exp-3',
      date: '2026-11-15',
      category: 'Marketing & Ads',
      vendor: 'Local Instagram Drop Campaign',
      amount: 45,
    },
  ],
  budgets: { restock: 35, tax: 25, owner: 25, growth: 15 },
};

export default function App() {
  const [mode, setMode] = useState('cfo'); // Start on CFO Suite or switch 1-click to Storefront
  const [cfoTab, setCfoTab] = useState('pnl'); // 'pnl' | 'orders' | 'inventory' | 'expenses'
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_DATA;
    } catch {
      return INITIAL_DATA;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Storefront state
  const [selectedProd, setSelectedProd] = useState(null);
  const [selectedSize, setSelectedSize] = useState('L');
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [custName, setCustName] = useState('');
  const [orderBanner, setOrderBanner] = useState('');

  // CFO inputs
  const [newAdj, setNewAdj] = useState({
    date: '2026-11-20',
    type: 'revenue',
    title: '',
    amount: '',
  });
  const [newExp, setNewExp] = useState({
    date: '2026-11-20',
    category: 'Blank Apparel Restock',
    vendor: '',
    amount: '',
  });

  const resetDemo = () => {
    localStorage.removeItem(STORAGE_KEY);
    setState(INITIAL_DATA);
    setCart([]);
    setOrderBanner('');
  };

  // Live P&L Math
  const onlineMerch = state.orders.reduce((s, o) => s + Number(o.subtotal || 0), 0);
  const manualRev = state.pnlAdjustments
    .filter((a) => a.type === 'revenue')
    .reduce((s, a) => s + Number(a.amount || 0), 0);
  const manualDed = state.pnlAdjustments
    .filter((a) => a.type === 'deduction')
    .reduce((s, a) => s + Number(a.amount || 0), 0);
  const discounts = state.orders.reduce((s, o) => s + Number(o.discount || 0), 0);
  const shipCollected = state.orders.reduce((s, o) => s + Number(o.shippingCollected || 0), 0);
  const grossReceipts = state.orders.reduce((s, o) => s + Number(o.total || 0), 0) + manualRev;

  const totalCogs = state.orders.reduce((s, o) => s + Number(o.cogs || 0), 0);
  const totalLabels = state.orders.reduce((s, o) => s + Number(o.labelCost || 0), 0);
  const totalFees = state.orders.reduce((s, o) => s + Number(o.fee || 0), 0);
  const grossProfit = grossReceipts - totalCogs - totalLabels - totalFees;

  const totalOverhead = state.expenses.reduce((s, e) => s + Number(e.amount || 0), 0);
  const trueNetProfit = grossProfit - totalOverhead - manualDed;
  const netMarginPct = grossReceipts > 0 ? (trueNetProfit / grossReceipts) * 100 : 0;

  const stockRetailVal = state.products.reduce((sum, p) => {
    const units = Object.values(p.sizeStock).reduce((a, b) => a + Number(b || 0), 0);
    return sum + units * Number(p.price || 0);
  }, 0);

  const stockCostVal = state.products.reduce((sum, p) => {
    const units = Object.values(p.sizeStock).reduce((a, b) => a + Number(b || 0), 0);
    return sum + units * Number(p.unitCost || 0);
  }, 0);

  const exportAccountingCSV = () => {
    const rows = [
      ['Order ID', 'Date', 'Customer', 'Total', 'COGS', 'Shipping Label', 'Fee', 'Net Order Profit'],
      ...state.orders.map((o) => [
        o.id,
        o.date,
        o.customerName,
        o.total.toFixed(2),
        o.cogs.toFixed(2),
        o.labelCost.toFixed(2),
        o.fee.toFixed(2),
        (o.total - o.cogs - o.labelCost - o.fee).toFixed(2),
      ]),
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'Tier3-CFO-Accounting-Export.csv';
    a.click();
  };

  const handleDemoPurchase = (e) => {
    e.preventDefault();
    if (cart.length === 0) return;
    const sub = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const cogs = cart.reduce((s, i) => s + i.unitCost * i.qty, 0);
    const ship = sub >= 100 ? 0 : 8.95;
    const total = sub + ship;
    const fee = Number((total * 0.029 + 0.3).toFixed(2));
    const id = `SG-${Math.floor(2042 + Math.random() * 899)}`;

    const newOrder = {
      id,
      date: new Date().toISOString().slice(0, 10),
      customerName: custName.trim() || 'Demo Shopper',
      customerEmail: 'buyer@example.com',
      address: 'Harrisburg, PA 17112',
      items: cart,
      subtotal: sub,
      discount: 0,
      shippingCollected: ship,
      total,
      cogs,
      labelCost: 6.5,
      fee,
      status: 'Unfulfilled',
    };

    const updatedProds = state.products.map((p) => {
      const ns = { ...p.sizeStock };
      cart.forEach((c) => {
        if (c.id === p.id) ns[c.size] = Math.max(0, (ns[c.size] || 0) - c.qty);
      });
      return { ...p, sizeStock: ns };
    });

    setState({
      ...state,
      products: updatedProds,
      orders: [newOrder, ...state.orders],
    });
    setCart([]);
    setCustName('');
    setOrderBanner(
      `Order ${id} ($${total.toFixed(2)}) added! Switch to "Behind the Scenes (CFO Suite)" to see Net Profit & P&L update live.`
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* 1-CLICK DEMO SWITCHER BAR */}
      <div className="sticky top-0 z-50 border-b border-emerald-500/30 bg-slate-950 px-4 py-2.5 text-white shadow-lg">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="rounded bg-emerald-500 px-2 py-0.5 text-[11px] font-extrabold uppercase tracking-wider text-slate-950">
              MSJ Cloud Tier 03 Flagship Demo
            </span>
            <span className="hidden text-xs text-slate-300 sm:inline">
              Storefront + Executive CFO Command Center ($2,250 Setup • $100/mo SLA)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMode('store')}
              className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                mode === 'store'
                  ? 'bg-white text-slate-950'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Eye className="h-3.5 w-3.5" />
              Customer Storefront
            </button>

            <button
              type="button"
              onClick={() => setMode('cfo')}
              className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                mode === 'cfo'
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-blue-600 text-white hover:bg-blue-500'
              }`}
            >
              <BarChart3 className="h-3.5 w-3.5" />
              Behind the Scenes (Owner + CFO Suite)
            </button>

            <button
              type="button"
              onClick={resetDemo}
              className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-slate-700 px-2.5 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-800"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Reset</span>
            </button>

            <a
              href="https://cloud.majorstylejunction.com/#contact"
              className="hidden items-center gap-1 rounded-lg border border-emerald-400/40 bg-emerald-950/60 px-3 py-1.5 text-xs font-bold text-emerald-300 hover:bg-emerald-900 lg:inline-flex"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to MSJ Cloud
            </a>
          </div>
        </div>
      </div>

      {/* =====================================================================
          VIEW 1: CUSTOMER STOREFRONT
         ===================================================================== */}
      {mode === 'store' ? (
        <>
          <header className="border-b border-slate-200 bg-white">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
              <span className="text-xl font-black tracking-tight">SUSQUEHANNA GOODS</span>
              <button
                type="button"
                onClick={() => setCartOpen(true)}
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-slate-950 px-4 py-2 text-sm font-bold text-white"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>Bag ({cart.reduce((s, i) => s + i.qty, 0)})</span>
              </button>
            </div>
          </header>

          <main className="mx-auto max-w-6xl px-6 py-12">
            <div className="mb-10 rounded-3xl bg-slate-950 p-8 text-white md:p-12">
              <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold uppercase text-emerald-300">
                Tier 03 Connected Commerce
              </span>
              <h1 className="mt-4 text-3xl font-extrabold sm:text-5xl">
                Flagship Apparel &amp; Live Profit Telemetry.
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-slate-300 sm:text-base">
                Place a sample order here, then click{' '}
                <strong className="text-emerald-400">Behind the Scenes (Owner + CFO Suite)</strong>{' '}
                to watch Gross Revenue, COGS, True Net Profit, and Profit-First tax/restock buckets calculate automatically.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {state.products.map((prod) => {
                const units = Object.values(prod.sizeStock).reduce((a, b) => a + Number(b || 0), 0);
                return (
                  <div
                    key={prod.id}
                    className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                  >
                    <div>
                      <div className="mb-4 flex h-44 items-center justify-center rounded-xl bg-slate-900 text-white">
                        <div className="text-center">
                          <span className="text-xs uppercase tracking-widest text-emerald-400">
                            {prod.badge}
                          </span>
                          <p className="mt-1 text-xl font-black">SUSQUEHANNA</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-700">{units} in stock</span>
                        <strong className="text-lg">${Number(prod.price).toFixed(2)}</strong>
                      </div>
                      <h2 className="mt-2 text-lg font-bold">{prod.name}</h2>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedSize('L');
                        setSelectedProd(prod);
                      }}
                      className="mt-5 w-full cursor-pointer rounded-xl bg-slate-950 py-3 text-sm font-bold text-white hover:bg-emerald-600 transition"
                    >
                      Select Size &amp; Add
                    </button>
                  </div>
                );
              })}
            </div>
          </main>
        </>
      ) : (
        /* =====================================================================
           VIEW 2: BEHIND THE SCENES — TIER 03 CFO COMMAND CENTER
           ===================================================================== */
        <main className="mx-auto max-w-6xl px-6 py-10">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700">
                Behind the Scenes • Executive CFO &amp; Store Suite
              </span>
              <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900">
                Real-Time Financial Health &amp; Unit Economics
              </h1>
            </div>

            <button
              type="button"
              onClick={exportAccountingCSV}
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-900 hover:border-slate-900"
            >
              <Download className="h-4 w-4" />
              Export Accounting CSV
            </button>
          </div>

          {/* 5 EXECUTIVE KPI CARDS */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <span className="text-[11px] font-bold uppercase text-slate-400">Gross Receipts</span>
              <p className="mt-1 text-2xl font-extrabold">${grossReceipts.toFixed(2)}</p>
              <p className="mt-1 text-xs text-slate-500">{state.orders.length} orders + pop-up</p>
            </div>

            <div className="rounded-2xl border-2 border-emerald-500 bg-white p-5">
              <span className="text-[11px] font-bold uppercase text-emerald-700">True Net Profit</span>
              <p className="mt-1 text-2xl font-extrabold text-emerald-600">
                ${trueNetProfit.toFixed(2)}
              </p>
              <p className="mt-1 text-xs text-slate-500">{netMarginPct.toFixed(1)}% net margin</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <span className="text-[11px] font-bold uppercase text-slate-400">COGS + Overhead</span>
              <p className="mt-1 text-2xl font-extrabold text-rose-600">
                ${(totalCogs + totalLabels + totalFees + totalOverhead).toFixed(2)}
              </p>
              <p className="mt-1 text-xs text-slate-500">COGS ${totalCogs.toFixed(0)} • Ops ${totalOverhead.toFixed(0)}</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <span className="text-[11px] font-bold uppercase text-slate-400">Stock Retail Value</span>
              <p className="mt-1 text-2xl font-extrabold">${stockRetailVal.toFixed(2)}</p>
              <p className="mt-1 text-xs text-slate-500">${stockCostVal.toFixed(2)} capital in blanks</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <span className="text-[11px] font-bold uppercase text-slate-400">Safe Owner Draw</span>
              <p className="mt-1 text-2xl font-extrabold text-blue-600">
                ${(Math.max(0, trueNetProfit) * (state.budgets.owner / 100)).toFixed(2)}
              </p>
              <p className="mt-1 text-xs text-slate-500">{state.budgets.owner}% Profit-First split</p>
            </div>
          </div>

          {/* CFO TABS */}
          <div className="mb-6 flex flex-wrap gap-2 border-b border-slate-200 pb-4">
            {[
              { id: 'pnl', label: 'Editable P&L & Profit-First Buckets' },
              { id: 'inventory', label: 'SKU Margins & Unit COGS' },
              { id: 'expenses', label: 'Expenses & Overhead Ledger' },
              { id: 'orders', label: 'Order Profit Breakdown' },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setCfoTab(t.id)}
                className={`cursor-pointer rounded-xl px-4 py-2 text-xs font-bold ${
                  cfoTab === t.id
                    ? 'bg-slate-950 text-white'
                    : 'border border-slate-200 bg-white text-slate-700'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* TAB 1: EDITABLE P&L + PROFIT-FIRST BUCKETS */}
          {cfoTab === 'pnl' && (
            <div className="grid gap-6 lg:grid-cols-12">
              {/* Editable P&L Waterfall */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-7">
                <h2 className="text-lg font-extrabold">Editable Profit &amp; Loss (P&amp;L) Statement</h2>
                <table className="mt-4 w-full text-sm">
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="py-2.5">Online Store Merchandise Sales</td>
                      <td className="py-2.5 text-right font-semibold">${onlineMerch.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td className="py-2.5">(+) Off-Site / Pop-Up Revenue Adjustments</td>
                      <td className="py-2.5 text-right font-semibold text-emerald-600">
                        +${manualRev.toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 text-rose-600">(−) Promo Discounts</td>
                      <td className="py-2.5 text-right text-rose-600">-${discounts.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td className="py-2.5">(+) Shipping Collected</td>
                      <td className="py-2.5 text-right">${shipCollected.toFixed(2)}</td>
                    </tr>
                    <tr className="bg-slate-50 font-bold">
                      <td className="px-2 py-2.5">Total Gross Receipts</td>
                      <td className="px-2 py-2.5 text-right">${grossReceipts.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 text-rose-600">(−) Cost of Goods Sold (COGS)</td>
                      <td className="py-2.5 text-right text-rose-600">-${totalCogs.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 text-rose-600">(−) Outbound Shipping Labels &amp; Fees</td>
                      <td className="py-2.5 text-right text-rose-600">
                        -${(totalLabels + totalFees).toFixed(2)}
                      </td>
                    </tr>
                    <tr className="bg-slate-50 font-bold">
                      <td className="px-2 py-2.5">Gross Profit</td>
                      <td className="px-2 py-2.5 text-right">${grossProfit.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 text-rose-600">(−) Operating &amp; Supply Expenses</td>
                      <td className="py-2.5 text-right text-rose-600">-${totalOverhead.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 text-rose-600">(−) Manual Refunds / Deductions</td>
                      <td className="py-2.5 text-right text-rose-600">-${manualDed.toFixed(2)}</td>
                    </tr>
                    <tr className="border-t-2 border-slate-950 text-base font-black">
                      <td className="py-3">TRUE NET PROFIT</td>
                      <td className="py-3 text-right text-emerald-600">${trueNetProfit.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>

                {/* Add Manual P&L Entry */}
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
                  className="mt-5 grid gap-2 rounded-xl bg-slate-50 p-3.5 sm:grid-cols-4"
                >
                  <select
                    value={newAdj.type}
                    onChange={(e) => setNewAdj({ ...newAdj, type: e.target.value })}
                    className="rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-xs font-semibold"
                  >
                    <option value="revenue">(+) Add Revenue</option>
                    <option value="deduction">(−) Deduction</option>
                  </select>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pop-up cash sales"
                    value={newAdj.title}
                    onChange={(e) => setNewAdj({ ...newAdj, title: e.target.value })}
                    className="rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-xs sm:col-span-2"
                  />
                  <div className="flex gap-1.5">
                    <input
                      type="number"
                      required
                      step="0.01"
                      placeholder="$"
                      value={newAdj.amount}
                      onChange={(e) => setNewAdj({ ...newAdj, amount: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-xs"
                    />
                    <button
                      type="submit"
                      className="cursor-pointer rounded-lg bg-slate-950 px-3 text-xs font-bold text-white"
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
                        className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-1.5 text-xs"
                      >
                        <span>
                          <strong>{a.date}</strong> • {a.title} (
                          <span className={a.type === 'revenue' ? 'text-emerald-600' : 'text-rose-600'}>
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
                          className="cursor-pointer text-rose-500"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Profit-First Money Allocation Buckets */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-5">
                <h2 className="text-lg font-extrabold">Profit-First Account Allocator</h2>
                <p className="mt-1 text-xs text-slate-500">
                  Divides True Net Profit (${Math.max(0, trueNetProfit).toFixed(2)}) into protected LLC buckets. Adjust percentages live:
                </p>

                <div className="mt-5 space-y-4">
                  {[
                    { key: 'restock', label: 'Inventory & Blank Restock Vault', color: 'bg-blue-600' },
                    { key: 'tax', label: 'LLC Tax Reserve Vault', color: 'bg-amber-500' },
                    { key: 'owner', label: 'Owner Pay / Draw', color: 'bg-emerald-500' },
                    { key: 'growth', label: 'Marketing & Growth Fund', color: 'bg-purple-600' },
                  ].map((b) => {
                    const pct = Number(state.budgets[b.key] || 0);
                    const amt = Math.max(0, trueNetProfit) * (pct / 100);
                    return (
                      <div key={b.key} className="rounded-xl border border-slate-100 bg-slate-50 p-3.5">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-bold">
                            {b.label} ({pct}%)
                          </span>
                          <strong className="text-base">${amt.toFixed(2)}</strong>
                        </div>
                        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                          <div
                            className={`h-full ${b.color}`}
                            style={{ width: `${Math.min(100, pct)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-5 grid grid-cols-4 gap-2 border-t pt-4">
                  {['restock', 'tax', 'owner', 'growth'].map((k) => (
                    <div key={k}>
                      <label className="block text-[10px] font-bold uppercase text-slate-500">
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
                        className="mt-1 w-full rounded-lg border border-slate-300 py-1.5 text-center text-xs font-bold"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SKU MARGINS & UNIT COGS */}
          {cfoTab === 'inventory' && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="text-lg font-extrabold">Unit Economics &amp; Editable COGS</h2>
              <p className="mt-1 text-xs text-slate-500">
                Edit any retail price or unit cost (COGS) below to watch unit profit margin recalculate in real time.
              </p>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                    <tr>
                      <th className="p-3">Product</th>
                      <th className="p-3">Retail Price ($)</th>
                      <th className="p-3">Unit COGS ($)</th>
                      <th className="p-3">Profit / Unit</th>
                      <th className="p-3">Margin %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {state.products.map((p) => {
                      const unitProfit = p.price - p.unitCost;
                      const margin = p.price > 0 ? (unitProfit / p.price) * 100 : 0;
                      return (
                        <tr key={p.id}>
                          <td className="p-3 font-bold">{p.name}</td>
                          <td className="p-3">
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
                              className="w-24 rounded-lg border border-slate-300 px-2.5 py-1 text-sm font-bold"
                            />
                          </td>
                          <td className="p-3">
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
                              className="w-24 rounded-lg border border-slate-300 px-2.5 py-1 text-sm font-bold"
                            />
                          </td>
                          <td className="p-3 font-bold text-emerald-600">+${unitProfit.toFixed(2)}</td>
                          <td className="p-3 font-bold">{margin.toFixed(1)}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: EXPENSES & OVERHEAD LEDGER */}
          {cfoTab === 'expenses' && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="text-lg font-extrabold">Business Expense &amp; Overhead Ledger</h2>
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
                className="mt-4 grid gap-3 rounded-xl bg-slate-50 p-4 sm:grid-cols-4"
              >
                <select
                  value={newExp.category}
                  onChange={(e) => setNewExp({ ...newExp, category: e.target.value })}
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold"
                >
                  <option>Blank Apparel Restock</option>
                  <option>DTF Ink, Film &amp; Powder</option>
                  <option>Marketing &amp; Ads</option>
                  <option>Packaging &amp; Mailers</option>
                  <option>Software &amp; Hosting</option>
                </select>
                <input
                  type="text"
                  required
                  placeholder="Vendor / Description"
                  value={newExp.vendor}
                  onChange={(e) => setNewExp({ ...newExp, vendor: e.target.value })}
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs sm:col-span-2"
                />
                <div className="flex gap-2">
                  <input
                    type="number"
                    required
                    step="0.01"
                    placeholder="Amount ($)"
                    value={newExp.amount}
                    onChange={(e) => setNewExp({ ...newExp, amount: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs"
                  />
                  <button
                    type="submit"
                    className="cursor-pointer rounded-xl bg-slate-950 px-4 text-xs font-bold text-white"
                  >
                    Log
                  </button>
                </div>
              </form>

              <div className="mt-5 divide-y divide-slate-100">
                {state.expenses.map((exp) => (
                  <div key={exp.id} className="flex items-center justify-between py-3 text-sm">
                    <div>
                      <strong>{exp.vendor}</strong>
                      <p className="text-xs text-slate-500">
                        {exp.date} • {exp.category}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <strong className="text-rose-600">-${Number(exp.amount).toFixed(2)}</strong>
                      <button
                        type="button"
                        onClick={() =>
                          setState({
                            ...state,
                            expenses: state.expenses.filter((x) => x.id !== exp.id),
                          })
                        }
                        className="cursor-pointer text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: ORDER PROFIT BREAKDOWN */}
          {cfoTab === 'orders' && (
            <div className="space-y-4">
              {state.orders.map((o) => {
                const netOrderProfit = o.total - o.cogs - o.labelCost - o.fee;
                return (
                  <div
                    key={o.id}
                    className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5"
                  >
                    <div>
                      <strong className="text-base">{o.id}</strong> •{' '}
                      <span className="text-sm font-semibold">{o.customerName}</span>
                      <p className="text-xs text-slate-500">
                        Collected: ${o.total.toFixed(2)} • COGS: ${o.cogs.toFixed(2)} • Label: $
                        {o.labelCost.toFixed(2)} • Fee: ${o.fee.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-extrabold text-emerald-800">
                        Net Order Profit: +${netOrderProfit.toFixed(2)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      )}

      {/* QUICK-VIEW MODAL */}
      {selectedProd && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4"
          onClick={() => setSelectedProd(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold">{selectedProd.name}</h3>
              <button type="button" onClick={() => setSelectedProd(null)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="mt-1 font-bold text-emerald-700">${selectedProd.price.toFixed(2)}</p>
            <div className="mt-4 grid grid-cols-5 gap-2">
              {['S', 'M', 'L', 'XL', '2XL'].map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setSelectedSize(sz)}
                  className={`cursor-pointer rounded-xl border py-2 text-xs font-bold ${
                    selectedSize === sz
                      ? 'border-slate-950 bg-slate-950 text-white'
                      : 'border-slate-200'
                  }`}
                >
                  {sz}
                </button>
              ))}
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
                    size: selectedSize,
                    qty: 1,
                  },
                ]);
                setSelectedProd(null);
                setCartOpen(true);
              }}
              className="mt-5 w-full cursor-pointer rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white"
            >
              Add Size {selectedSize} to Bag
            </button>
          </div>
        </div>
      )}

      {/* CART DRAWER */}
      {cartOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-slate-950/60"
          onClick={() => setCartOpen(false)}
        >
          <div
            className="h-full w-full max-w-md overflow-y-auto bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b pb-4">
              <h3 className="text-lg font-extrabold">Flagship Checkout</h3>
              <button type="button" onClick={() => setCartOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>

            {orderBanner && (
              <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-950">
                {orderBanner}
              </div>
            )}

            {cart.length === 0 ? (
              <p className="mt-8 text-center text-sm text-slate-500">Bag is empty.</p>
            ) : (
              <form onSubmit={handleDemoPurchase} className="mt-4 space-y-4">
                {cart.map((c, idx) => (
                  <div key={idx} className="flex justify-between rounded-xl bg-slate-50 p-3 text-sm">
                    <span>
                      {c.name} (Size {c.size})
                    </span>
                    <strong>${c.price.toFixed(2)}</strong>
                  </div>
                ))}
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  value={custName}
                  onChange={(e) => setCustName(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                />
                <button
                  type="submit"
                  className="w-full cursor-pointer rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white"
                >
                  Complete Demo Order (${cart.reduce((s, i) => s + i.price * i.qty, 0).toFixed(2)})
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}