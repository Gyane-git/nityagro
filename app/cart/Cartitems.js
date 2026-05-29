"use client";

import Image from "next/image";
import Link from "next/link";
import useCartStore from "@/store/cartStore";
import useConfirmModalStore from "@/store/confirmModalStore";
import useToastStore from "@/store/toastStore";
import { clearCartInDb, removeCartFromDb, updateCartQtyInDb } from "@/utils/accountListApi";

// ─── Icons ───────────────────────────────────────────────────────────────────
const TrashIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);

const ChevronUpIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="18 15 12 9 6 15" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

// ─── Qty spinner ──────────────────────────────────────────────────────────────
function QtySpinner({ value, max, onChange }) {
  const safeMax = Number(max || 0);
  const canIncrease = safeMax <= 0 || value < safeMax;
  return (
    <div className="flex items-center border border-gray-200 rounded-md overflow-hidden bg-gray-50" style={{ width: "64px", height: "38px" }}>
      <span className="flex-1 text-center text-sm font-semibold text-gray-800 select-none">{value}</span>
      <div className="flex flex-col border-l border-gray-200 h-full">
        <button disabled={!canIncrease} onClick={() => onChange(safeMax > 0 ? Math.min(safeMax, value + 1) : value + 1)} className="flex-1 flex items-center justify-center hover:bg-gray-100 text-gray-900 transition-colors px-1.5 disabled:opacity-30 disabled:cursor-not-allowed">
          <ChevronUpIcon />
        </button>
        <button onClick={() => onChange(Math.max(1, value - 1))} className="flex-1 flex items-center justify-center hover:bg-gray-100 text-gray-900 transition-colors px-1.5 border-t border-gray-200">
          <ChevronDownIcon />
        </button>
      </div>
    </div>
  );
}

// ─── Desktop cart row (md+) ───────────────────────────────────────────────────
function isOutOfStock(item) {
  return Number(item.availableQuantity ?? item.stockQuantity ?? 0) <= 0;
}

function CartRowDesktop({ item, checked, onCheck, onQtyChange, onRemove }) {
  const subtotal = item.price * item.qty;
  const outOfStock = isOutOfStock(item);

  return (
    <>
      <div className={`hidden md:flex items-center gap-5 py-5 ${outOfStock ? "opacity-70" : ""}`}>
        <input type="checkbox" checked={checked} disabled={outOfStock} onChange={onCheck} className="w-4 h-4 rounded border-gray-300 flex-shrink-0 cursor-pointer disabled:cursor-not-allowed" style={{ accentColor: "#00462C" }} />

        <div className="relative flex-shrink-0 bg-gray-50 rounded-md border border-gray-100" style={{ width: "80px", height: "80px" }}>
          <Image src={item.image} alt={item.name} fill className="object-contain p-2" sizes="80px" />
        </div>

        <div className="flex flex-col gap-0.5 flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-800 truncate">{item.name}</p>
          <p className="text-xs text-gray-500">Weight: {item.weight}</p>
          {outOfStock ? <p className="text-xs font-semibold text-red-600">Out of stock. Cannot select for checkout.</p> : null}
        </div>

        <div className="w-28 text-center flex-shrink-0">
          <p className="text-sm text-gray-500 font-medium">NPR {item.price.toFixed(2)}</p>
        </div>

        <div className="w-20 flex justify-center flex-shrink-0">
          <QtySpinner value={item.qty} max={Number(item.availableQuantity ?? item.stockQuantity ?? 0)} onChange={(v) => onQtyChange(item.id, v)} />
        </div>

        <div className="w-32 text-right flex-shrink-0">
          <p className="font-bold" style={{ color: "#00462C", fontSize: "15px" }}>
            NPR {(subtotal).toLocaleString("en-NP", { minimumFractionDigits: 2 })}
          </p>
        </div>

        <button onClick={() => onRemove(item.id)} className="flex-shrink-0 ml-2 p-1 rounded hover:bg-red-50 transition-colors" aria-label="Remove item">
          <TrashIcon />
        </button>
      </div>

      {/* Row divider — desktop only */}
      <div className="hidden md:block border-t border-gray-100" />
    </>
  );
}

// ─── Mobile cart card (< md) ──────────────────────────────────────────────────
function CartRowMobile({ item, checked, onCheck, onQtyChange, onRemove }) {
  const subtotal = item.price * item.qty;
  const outOfStock = isOutOfStock(item);

  return (
    <div className={`md:hidden py-4 border-b border-gray-100 ${outOfStock ? "opacity-70" : ""}`}>
      <div className="flex gap-3">
        {/* Checkbox */}
        <input type="checkbox" checked={checked} disabled={outOfStock} onChange={onCheck} className="w-4 h-4 mt-1 rounded border-gray-300 cursor-pointer disabled:cursor-not-allowed flex-shrink-0" style={{ accentColor: "#00462C" }} />

        {/* Image */}
        <div className="relative flex-shrink-0 bg-gray-50 rounded-md border border-gray-100" style={{ width: "72px", height: "72px" }}>
          <Image src={item.image} alt={item.name} fill className="object-contain p-1.5" sizes="72px" />
        </div>

        {/* Info */}
        <div className="flex flex-col gap-1 flex-1 min-w-0">
          <div className="flex justify-between items-start gap-2">
            <p className="text-sm font-semibold text-gray-800 leading-tight">{item.name}</p>
            <button onClick={() => onRemove(item.id)} className="flex-shrink-0 p-1 rounded hover:bg-red-50 transition-colors" aria-label="Remove item">
              <TrashIcon />
            </button>
          </div>

          <p className="text-xs text-gray-500">Weight: {item.weight}</p>
          {outOfStock ? <p className="text-xs font-semibold text-red-600">Out of stock. Cannot select for checkout.</p> : null}

          <div className="flex items-center justify-between mt-2">
            <QtySpinner value={item.qty} max={Number(item.availableQuantity ?? item.stockQuantity ?? 0)} onChange={(v) => onQtyChange(item.id, v)} />
            <p className="font-bold text-sm" style={{ color: "#00462C" }}>
              NPR {(subtotal * 10).toLocaleString("en-NP", { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main CartItems component ─────────────────────────────────────────────────
export default function CartItems({ checkedIds, setCheckedIds }) {
  const items = useCartStore((state) => state.items);
  const updateQty = useCartStore((state) => state.updateQty);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const openConfirm = useConfirmModalStore((state) => state.open);
  const showToast = useToastStore((state) => state.showToast);

  const validCheckedIds = checkedIds.filter((id) => items.some((item) => item.id === id && !isOutOfStock(item)));
  const selectableItems = items.filter((item) => !isOutOfStock(item));

  const allChecked = selectableItems.length > 0 && validCheckedIds.length === selectableItems.length;

  const toggleSelectAll = () => {
    if (allChecked) setCheckedIds([]);
    else setCheckedIds(selectableItems.map((i) => i.id));
  };

  const toggleCheck = (id) => {
    const item = items.find((row) => row.id === id);
    if (item && isOutOfStock(item)) {
      showToast("Out of stock product cannot be selected for checkout");
      return;
    }
    setCheckedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleQtyChange = (id, qty) => {
    updateQty(id, qty);
    updateCartQtyInDb(id, qty).catch(() => null);
  };

  const handleRemove = (id) => {
    removeItem(id);
    removeCartFromDb(id).catch(() => null);
    setCheckedIds((prev) => prev.filter((x) => x !== id));
  };

  const handleClearCart = () => {
    openConfirm({
      title: "Clear Cart",
      message: "Are you sure you want to remove every product from your cart?",
      onConfirm: () => {
        clearCart();
        clearCartInDb().catch(() => null);
        setCheckedIds([]);
      },
    });
  };

  return (
    <div className="flex flex-col border border-gray-200 rounded-xl bg-white overflow-hidden w-full">
      {/* ── Select All header ── */}
      <div className="flex items-center gap-3 px-4 sm:px-6 pt-5 pb-4">
        <input type="checkbox" checked={allChecked} onChange={toggleSelectAll} className="w-4 h-4 rounded border-gray-300 cursor-pointer" style={{ accentColor: "#00462C" }} />
        <span className="text-sm font-medium text-gray-700">Select All</span>
      </div>

      {/* ── Column headers (desktop only) ── */}
      <div className="hidden md:flex items-center gap-5 px-6 py-2 border-t border-b border-gray-200 bg-gray-50">
        <div style={{ width: "16px" }} />
        <div style={{ width: "80px" }} />
        <p className="text-sm font-bold text-gray-800 flex-1">Product</p>
        <p className="text-sm font-bold text-gray-800 text-center w-28">Price</p>
        <p className="text-sm font-bold text-gray-800 text-center w-20">Qty</p>
        <p className="text-sm font-bold text-gray-800 text-right w-32">Sub Total</p>
        <div style={{ width: "34px" }} />
      </div>

      {/* ── Mobile divider ── */}
      <div className="md:hidden border-t border-gray-200" />

      {/* ── Cart rows ── */}
      <div className="flex flex-col px-4 sm:px-6">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <p className="text-gray-400 text-sm font-medium">Your cart is empty.</p>
            <Link href="/products" className="text-sm font-semibold underline" style={{ color: "#00462C" }}>
              Browse Products
            </Link>
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id}>
              {/* Desktop row */}
              <CartRowDesktop item={item} checked={validCheckedIds.includes(item.id)} onCheck={() => toggleCheck(item.id)} onQtyChange={handleQtyChange} onRemove={handleRemove} />
              {/* Mobile card */}
              <CartRowMobile item={item} checked={validCheckedIds.includes(item.id)} onCheck={() => toggleCheck(item.id)} onQtyChange={handleQtyChange} onRemove={handleRemove} />
            </div>
          ))
        )}
      </div>

      {/* ── Footer: Continue Shopping + Clear Cart ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-6 py-5 mt-2">
        <Link
          href="/products"
          className="inline-flex items-center justify-center border-2 rounded-lg font-semibold text-sm transition-all hover:bg-gray-50 w-full sm:w-[200px]"
          style={{
            borderColor: "#00462C",
            color: "#00462C",
            height: "44px",
          }}
        >
          Continue Shopping
        </Link>

        <button
          onClick={handleClearCart}
          className="inline-flex items-center justify-center border-2 rounded-lg font-semibold text-sm transition-all hover:bg-amber-50 w-full sm:w-[160px]"
          style={{
            borderColor: "#F5A623",
            color: "#F5A623",
            height: "44px",
          }}
        >
          Clear Cart
        </button>
      </div>
    </div>
  );
}
