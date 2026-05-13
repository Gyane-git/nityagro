// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { User, Upload, Eye, EyeOff } from "lucide-react";
// import { useRouter } from "next/navigation";
// import toast from "react-hot-toast";

// function getAdminToken() {
//   if (typeof window === "undefined") return null;
//   const raw =
//     localStorage.getItem("admin_auth") ||
//     localStorage.getItem("admin_token") ||
//     sessionStorage.getItem("admin_token");

//   if (!raw) return null;

//   try {
//     const parsed = JSON.parse(raw);
//     return parsed?.token || parsed?.accessToken || parsed?.jwt || null;
//   } catch {
//     return raw;
//   }
// }

// function splitName(name = "") {
//   const parts = String(name).trim().split(/\s+/).filter(Boolean);
//   if (!parts.length) return { firstName: "", lastName: "" };
//   if (parts.length === 1) return { firstName: parts[0], lastName: "" };
//   return {
//     firstName: parts[0],
//     lastName: parts.slice(1).join(" "),
//   };
// }

// export default function ProfileEdit() {
//   const router = useRouter();

//   const [loading, setLoading] = useState(true);
//   const [savingProfile, setSavingProfile] = useState(false);
//   const [savingPassword, setSavingPassword] = useState(false);

//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     userType: "Admin",
//     currentPassword: "",
//     newPassword: "",
//     confirmPassword: "",
//   });

//   const [contactData, setContactData] = useState({
//     phone: "",
//     country: "",
//     address: "",
//   });

//   const [profileImage, setProfileImage] = useState(null);
//   const [showPassword, setShowPassword] = useState({
//     current: false,
//     new: false,
//     confirm: false,
//   });

//   useEffect(() => {
//     let mounted = true;

//     const loadProfile = async () => {
//       const token = getAdminToken();
//       if (!token) {
//         toast.error("Please login as admin");
//         router.replace("/login-admin");
//         return;
//       }

//       try {
//         const response = await fetch("/api/admin/profile", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         const payload = await response.json();

//         if (response.status === 401 || response.status === 403) {
//           toast.error("Admin session expired");
//           router.replace("/login-admin");
//           return;
//         }

//         if (!response.ok) {
//           throw new Error(payload?.message || "Failed to load profile");
//         }

//         if (!mounted) return;

//         const admin = payload?.data || {};
//         const { firstName, lastName } = splitName(admin.name || "");

//         setFormData((prev) => ({
//           ...prev,
//           firstName,
//           lastName,
//           email: admin.email || "",
//           userType: admin?.role?.name || "Admin",
//         }));

//         setContactData({
//           phone: admin.phone || "",
//           country: admin.country || "",
//           address: admin.address || "",
//         });
//       } catch (error) {
//         toast.error(error?.message || "Failed to load profile");
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     };

//     loadProfile();

//     return () => {
//       mounted = false;
//     };
//   }, [router]);

//   const fullName = useMemo(() => {
//     return `${formData.firstName} ${formData.lastName}`.trim();
//   }, [formData.firstName, formData.lastName]);

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleContactChange = (e) => {
//     setContactData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const handleImageUpload = (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setProfileImage(reader.result);
//       toast("Image preview updated. API upload not enabled yet.", {
//         icon: "ℹ️",
//       });
//     };
//     reader.readAsDataURL(file);
//   };

//   const togglePasswordVisibility = (field) => {
//     setShowPassword((prev) => ({
//       ...prev,
//       [field]: !prev[field],
//     }));
//   };

//   const saveProfile = async () => {
//     const token = getAdminToken();
//     if (!token) {
//       toast.error("Please login as admin");
//       router.replace("/login-admin");
//       return;
//     }

//     if (!formData.firstName.trim() || !formData.email.trim()) {
//       toast.error("First name and email are required");
//       return;
//     }

//     try {
//       setSavingProfile(true);

//       const response = await fetch("/api/admin/profile", {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           name: `${formData.firstName} ${formData.lastName}`.trim(),
//           email: formData.email,
//           phone: contactData.phone,
//           country: contactData.country,
//           address: contactData.address,
//         }),
//       });

//       const payload = await response.json();

//       if (!response.ok) {
//         throw new Error(payload?.message || "Failed to update profile");
//       }

//       toast.success("Profile updated successfully");
//     } catch (error) {
//       toast.error(error?.message || "Failed to update profile");
//     } finally {
//       setSavingProfile(false);
//     }
//   };

//   const changePassword = async () => {
//     const token = getAdminToken();
//     if (!token) {
//       toast.error("Please login as admin");
//       router.replace("/login-admin");
//       return;
//     }

//     const { currentPassword, newPassword, confirmPassword } = formData;

//     if (!currentPassword || !newPassword || !confirmPassword) {
//       toast.error("Please fill all password fields");
//       return;
//     }

//     if (newPassword !== confirmPassword) {
//       toast.error("New passwords do not match");
//       return;
//     }

//     if (newPassword.length < 6) {
//       toast.error("New password must be at least 6 characters");
//       return;
//     }

//     try {
//       setSavingPassword(true);

//       const response = await fetch("/api/admin/profile/password", {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           currentPassword,
//           newPassword,
//           confirmPassword,
//         }),
//       });

//       const payload = await response.json();

//       if (!response.ok) {
//         throw new Error(payload?.message || "Failed to change password");
//       }

//       setFormData((prev) => ({
//         ...prev,
//         currentPassword: "",
//         newPassword: "",
//         confirmPassword: "",
//       }));

//       toast.success("Password changed successfully");
//     } catch (error) {
//       toast.error(error?.message || "Failed to change password");
//     } finally {
//       setSavingPassword(false);
//     }
//   };

//   if (loading) {
//     return <div className="p-8 text-sm text-gray-500">Loading profile...</div>;
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4 md:p-8">
//       <div className="max-w-6xl mx-auto">
//         <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//           <div className="flex flex-col md:flex-row">
//             <div className="w-full md:w-80 bg-gradient-to-b from-purple-100 to-pink-100 p-8 flex flex-col items-center justify-center">
//               <div className="relative group">
//                 <div className="w-32 h-32 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center overflow-hidden mb-4 shadow-lg">
//                   {profileImage ? (
//                     <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
//                   ) : (
//                     <User className="w-20 h-20 text-white" />
//                   )}
//                 </div>
//                 <label className="absolute bottom-4 right-0 bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-full cursor-pointer shadow-lg transition transform hover:scale-110">
//                   <Upload className="w-5 h-5" />
//                   <input
//                     type="file"
//                     accept="image/*"
//                     onChange={handleImageUpload}
//                     className="hidden"
//                   />
//                 </label>
//               </div>
//               <h2 className="text-2xl font-bold text-gray-800 mb-1">{fullName || "Admin"}</h2>
//               <p className="text-gray-600 mb-1">{formData.email}</p>
//               <span className="mt-2 px-4 py-1 bg-orange-500 text-white text-sm rounded-full">{formData.userType}</span>
//             </div>

//             <div className="flex-1 p-8">
//               <div className="space-y-6">
//                 <div className="bg-gray-50 p-6 rounded-lg">
//                   <h3 className="text-lg font-semibold text-gray-700 mb-4">Personal Information</h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-600 mb-2">First Name</label>
//                       <input
//                         type="text"
//                         name="firstName"
//                         value={formData.firstName}
//                         onChange={handleChange}
//                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
//                         placeholder="First Name"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-600 mb-2">Last Name</label>
//                       <input
//                         type="text"
//                         name="lastName"
//                         value={formData.lastName}
//                         onChange={handleChange}
//                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
//                         placeholder="Last Name"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-600 mb-2">Email</label>
//                       <input
//                         type="email"
//                         name="email"
//                         value={formData.email}
//                         onChange={handleChange}
//                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
//                         placeholder="Email"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-600 mb-2">Phone</label>
//                       <input
//                         type="text"
//                         name="phone"
//                         value={contactData.phone}
//                         onChange={handleContactChange}
//                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
//                         placeholder="Phone"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-600 mb-2">Country</label>
//                       <input
//                         type="text"
//                         name="country"
//                         value={contactData.country}
//                         onChange={handleContactChange}
//                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
//                         placeholder="Country"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-600 mb-2">Address</label>
//                       <input
//                         type="text"
//                         name="address"
//                         value={contactData.address}
//                         onChange={handleContactChange}
//                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
//                         placeholder="Address"
//                       />
//                     </div>
//                   </div>
//                   <div className="mt-6 flex justify-end">
//                     <button
//                       onClick={saveProfile}
//                       disabled={savingProfile}
//                       className="px-8 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-orange-600 transition shadow-md hover:shadow-lg disabled:opacity-60"
//                     >
//                       {savingProfile ? "Saving..." : "Save Profile"}
//                     </button>
//                   </div>
//                 </div>

//                 <div className="bg-gray-50 p-6 rounded-lg">
//                   <h3 className="text-lg font-semibold text-gray-700 mb-4">Change Password</h3>
//                   <div className="space-y-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-600 mb-2">Current Password</label>
//                       <div className="relative">
//                         <input
//                           type={showPassword.current ? "text" : "password"}
//                           name="currentPassword"
//                           value={formData.currentPassword}
//                           onChange={handleChange}
//                           className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition pr-12"
//                           placeholder="Enter current password"
//                         />
//                         <button
//                           type="button"
//                           onClick={() => togglePasswordVisibility("current")}
//                           className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
//                         >
//                           {showPassword.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//                         </button>
//                       </div>
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-600 mb-2">New Password</label>
//                       <div className="relative">
//                         <input
//                           type={showPassword.new ? "text" : "password"}
//                           name="newPassword"
//                           value={formData.newPassword}
//                           onChange={handleChange}
//                           className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition pr-12"
//                           placeholder="Enter new password"
//                         />
//                         <button
//                           type="button"
//                           onClick={() => togglePasswordVisibility("new")}
//                           className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
//                         >
//                           {showPassword.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//                         </button>
//                       </div>
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-600 mb-2">Confirm New Password</label>
//                       <div className="relative">
//                         <input
//                           type={showPassword.confirm ? "text" : "password"}
//                           name="confirmPassword"
//                           value={formData.confirmPassword}
//                           onChange={handleChange}
//                           className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition pr-12"
//                           placeholder="Confirm new password"
//                         />
//                         <button
//                           type="button"
//                           onClick={() => togglePasswordVisibility("confirm")}
//                           className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
//                         >
//                           {showPassword.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//                         </button>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="mt-6 flex justify-end">
//                     <button
//                       onClick={changePassword}
//                       disabled={savingPassword}
//                       className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition shadow-md hover:shadow-lg disabled:opacity-60"
//                     >
//                       {savingPassword ? "Updating..." : "Update Password"}
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
import React from "react";
import OrderTracking from "@/components/account/OrderTracking";

const OrderTrackingPage = () => {
  return <OrderTracking />;
};

export default OrderTrackingPage;
