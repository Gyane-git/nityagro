export default function OrderTracking() {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-1">Order Tracking</h2>
      <p className="text-[13px] text-gray-400 mb-8 border-b border-gray-100 pb-4">
        Track the status of your current orders.
      </p>
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <svg
          width="52"
          height="52"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#ccc"
          strokeWidth="1.5"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
        </svg>
        <p className="text-[14px] text-gray-400">No active orders to track.</p>
      </div>
    </div>
  );
}
