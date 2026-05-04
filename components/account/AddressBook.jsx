"use client";

import { BriefcaseBusiness, House, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

const INITIAL_ADDRESSES = [
  {
    id: 1,
    name: "Archie Rai",
    address: "Satdobato, Lalitpur - Main Road",
    postcode: "Bagamati Province - Kathmandu Metero 22 - Satdobato",
    phone: "+977 9860487514",
  },
  {
    id: 2,
    name: "Mandeep Magar",
    address: "Baneshwor Opposite Of AB Complex",
    postcode:
      "Bagamati Province - Kathmandu Metero 22 - New Baneswor Area Buddhanagar",
    phone: "+977 9864235170",
  },
];

function Header({ children }) {
  return (
    <div className="flex items-start justify-between">
      <div>
        <h2 className="text-xl font-bold text-[#2e5e2e]">Address Book</h2>
        <p className="text-[13px] text-gray-400 mt-0.5">
          Saved delivery locations for faster checkout.
        </p>
      </div>
      {children}
    </div>
  );
}
function Field({ label, placeholder, type = "text" }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[13px] text-gray-700 font-medium">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 bg-[#f9f6f0] rounded-md text-[13px] text-gray-600 placeholder-gray-400 outline-none focus:ring-1 focus:ring-[#DB8F00] transition-all"
      />
    </div>
  );
}

// Add & Edit form
function AddressForm({ onCancel, onSave }) {
  const [label, setLabel] = useState("Office");

  return (
    <div>
      <Header>
        <div className="flex items-center gap-3 mt-1">
          <button
            onClick={onCancel}
            className="text-[13.5px] text-gray-500 hover:text-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-6 py-2.5 bg-[#2e5e2e] text-white text-[13px] font-semibold rounded-md hover:opacity-90 transition-opacity"
          >
            Save Address
          </button>
        </div>
      </Header>

      <div className="border-t border-gray-100 mt-4 pt-5 grid grid-cols-2 gap-x-6 gap-y-4">
        <Field label="Full Name" placeholder="Enter your full name" />
        <Field label="Region" placeholder="Please choose your region" />
        <Field
          label="Phone Number"
          placeholder="Please enter your phone number"
          type="tel"
        />
        <Field label="City" placeholder="Please choose your city" />
        <Field
          label="Building / House No / Flour / Street"
          placeholder="Please enter"
        />
        <Field label="Area" placeholder="Please choose your area" />
        <Field
          label="Colony / Suburb / Locality / Landmark"
          placeholder="Please enter"
        />
        <Field label="Address" placeholder="Enter your address" />
        <Field
          label="Email Address"
          placeholder="Please enter your address"
          type="email"
        />

        {/* Delivery label */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] text-gray-700 font-medium">
            Select a label for effective delivery
          </label>
          <div className="flex gap-3">
            {["Office", "Home"].map((opt) => (
              <button
                key={opt}
                onClick={() => setLabel(opt)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-md text-[13px] font-medium border transition-all
                  ${
                    label === opt
                      ? "bg-[#2e5e2e] text-white border-[#2e5e2e]"
                      : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                  }`}
              >
                {opt === "Office" ? (
                  <BriefcaseBusiness size={16} />
                ) : (
                  <House size={16} />
                )}
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Address list
function AddressList({ addresses, onAddNew, onDelete }) {
  return (
    <div>
      <Header>
        <button
          onClick={onAddNew}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#2e5e2e] text-white text-[13px] font-semibold rounded-md hover:opacity-90 transition-opacity mt-1"
        >
          <Plus size={16} />
          Add New Address
        </button>
      </Header>

      {/* Table */}
      <div className="mt-5 border border-gray-100 rounded-lg overflow-hidden">
        {/* Head */}
        <div className="grid grid-cols-[1fr_2fr_2.5fr_1.5fr_56px] bg-[#fbf8f0] border-b border-gray-100">
          {["Full Name", "Address", "Postcode", "Phone Number", ""].map(
            (h, i) => (
              <div
                key={i}
                className="px-4 py-3 text-[12.5px] font-semibold text-gray-500"
              >
                {h}
              </div>
            ),
          )}
        </div>

        {/* Rows */}
        {addresses.length === 0 && (
          <div className="px-4 py-10 text-center text-[13px] text-gray-400">
            No saved addresses yet.
          </div>
        )}
        {addresses.map((addr, i) => (
          <div
            key={addr.id}
            className={`grid grid-cols-[1fr_2fr_2.5fr_1.5fr_56px] items-start ${
              i < addresses.length - 1 ? "border-b border-gray-100" : ""
            }`}
          >
            <div className="px-4 py-4 text-[13px] font-semibold text-gray-700">
              {addr.name}
            </div>
            <div className="px-4 py-4 text-[13px] text-gray-500 leading-relaxed">
              {addr.address}
            </div>
            <div className="px-4 py-4 text-[13px] text-gray-500 leading-relaxed">
              {addr.postcode}
            </div>
            <div className="px-4 py-4 text-[13px] text-gray-500">
              {addr.phone}
            </div>
            <div className="px-1 py-4 flex items-center gap-2">
              <button className="text-gray-400 hover:text-[#2e5e2e] transition-colors">
                <Pencil size={16} />
              </button>
              <button
                onClick={() => onDelete(addr.id)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="text-red-500" size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AddressBook() {
  const [addresses, setAddresses] = useState(INITIAL_ADDRESSES);
  const [showForm, setShowForm] = useState(false);

  return showForm ? (
    <AddressForm
      onCancel={() => setShowForm(false)}
      onSave={() => setShowForm(false)}
    />
  ) : (
    <AddressList
      addresses={addresses}
      onAddNew={() => setShowForm(true)}
      onDelete={(id) => setAddresses((prev) => prev.filter((a) => a.id !== id))}
    />
  );
}
