// components/Breadcrumb.tsx

const ChevronRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const crumbs = [
  { label: "Home",         href: "/",        active: false },
  { label: "Cart",         href: "/cart",    active: false },
  { label: "Address Book", href: "/checkout", active: true  },
];

export default function Breadcrumb() {
  return (
    <nav className="flex items-center gap-1.5 text-sm">
      {crumbs.map((crumb, i) => (
        <span key={crumb.label} className="flex items-center gap-1.5">
          {i > 0 && <ChevronRight />}
          <a
            href={crumb.href}
            className="transition-colors"
            style={{
              color:      crumb.active ? "#00462C" : "#6B7280",
              fontWeight: crumb.active ? "600"     : "400",
            }}
          >
            {crumb.label}
          </a>
        </span>
      ))}
    </nav>
  );
}