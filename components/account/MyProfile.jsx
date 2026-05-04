"use client";

export default function MyProfile({ user }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-[#266A3F] mb-1">My Profile</h2>
      <p className="text-[13px] text-[#4C6759] mb-6 border-b border-gray-100 pb-4">
        Edit your personal details and login info.
      </p>

      {/* Personal Info */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] text-[#4C6759]">First name</label>
          <input
            type="text"
            defaultValue="Archie"
            className="w-full px-4 py-2.5 bg-[#f9f6f0] border border-transparent rounded-md text-[13.5px] text-gray-700 outline-none focus:border-[#DB8F00] transition-colors"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] text-[#4C6759]">Last name</label>
          <input
            type="text"
            defaultValue="Rai"
            className="w-full px-4 py-2.5 bg-[#f9f6f0] border border-transparent rounded-md text-[13.5px] text-gray-700 outline-none focus:border-[#DB8F00] transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="flex flex-col gap text-[#4C6759]-1.5">
          <label className="text-[13px] text-gray-600">Email</label>
          <input
            type="email"
            defaultValue={user.email}
            className="w-full px-4 py-2.5 bg-[#f9f6f0] border border-transparent rounded-md text-[13.5px] text-gray-700 outline-none focus:border-[#DB8F00] transition-colors"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] text-[#4C6759]">Phone no</label>
          <input
            type="text"
            defaultValue={user.phone}
            className="w-full px-4 py-2.5 bg-[#f9f6f0] border border-transparent rounded-md text-[13.5px] text-gray-700 outline-none focus:border-[#DB8F00] transition-colors"
          />
        </div>
      </div>

      {/* Password Changes */}
      <h3 className="text-[15px] font-semibold text-[#266A3F] mb-4">
        Password Changes
      </h3>

      <div className="flex flex-col gap-3 mb-8">
        <input
          type="password"
          placeholder="Current Password"
          className="w-full px-4 py-2.5 bg-[#f9f6f0] border border-transparent rounded-md text-[13.5px] text-gray-700 placeholder-gray-400 outline-none focus:border-[#DB8F00] transition-colors"
        />
        <input
          type="password"
          placeholder="New Password"
          className="w-full px-4 py-2.5 bg-[#f9f6f0] border border-transparent rounded-md text-[13.5px] text-gray-700 placeholder-gray-400 outline-none focus:border-[#DB8F00] transition-colors"
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          className="w-full px-4 py-2.5 bg-[#f9f6f0] border border-transparent rounded-md text-[13.5px] text-gray-700 placeholder-gray-400 outline-none focus:border-[#DB8F00] transition-colors"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <button className="px-6 py-2.5 text-[13.5px] hover:bg-[#F9F6F0] rounded-md text-[#0A0A0A] hover:text-gray-700 transition-colors">
          Cancel
        </button>
        <button className="px-7 py-2.5 bg-[#2e5e2e] text-white text-[13.5px] font-semibold rounded-md hover:opacity-90 transition-opacity">
          Send Changes
        </button>
      </div>
    </div>
  );
}
