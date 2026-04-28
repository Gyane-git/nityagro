"use client";

const NAV = [
  {
    heading: "Manage My Account",
    links: [
      { label: "My Profile",         href: "/account/profile" },
      { label: "Address Book",       href: "/checkout",        active: true },
      { label: "My Payment Options", href: "/account/payment" },
    ],
  },
  {
    heading: "My Orders",
    links: [
      { label: "My Returns",       href: "/account/returns" },
      { label: "My Cancellations", href: "/account/cancellations" },
    ],
  },
];

export default function AccountSidebar() {
  return (
    <aside
      className="flex flex-col border border-gray-200 rounded-xl bg-white overflow-hidden"
      style={{ width: "240px", flexShrink: 0, alignSelf: "flex-start" }}
    >
      {NAV.map((section, si) => (
        <div key={section.heading}>
          {/* Section header */}
          <div className="px-5 pt-5 pb-2">
            <h3 className="font-bold text-gray-800" style={{ fontSize: "15px" }}>
              {section.heading}
            </h3>
            {/* Green underline */}
            <div
              className="mt-1.5"
              style={{
                width: "40px",
                height: "2px",
                background: "#00462C",
                borderRadius: "2px",
              }}
            />
          </div>

          {/* Links */}
          <div className="flex flex-col px-5 pb-4 gap-1">
            {section.links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="py-2 text-sm transition-colors hover:text-[#00462C]"
                style={{
                  color:      link.active ? "#00462C" : "#6B7280",
                  fontWeight: link.active ? "600"     : "400",
                }}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Divider between sections */}
          {si < NAV.length - 1 && (
            <div className="border-t border-gray-200 mx-5 mb-2" />
          )}
        </div>
      ))}
    </aside>
  );
}