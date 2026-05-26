import { create } from "zustand";
import { persist } from "zustand/middleware";

const INITIAL_ADDRESS = {
  id: 1,
  fullName: "Archie Rai",
  phone: "+977 9860487514",
  email: "archie@example.com",
  region: "Bagmati",
  city: "Kathmandu",
  area: "Satdobato",
  building: "Main Road",
  colony: "Ward 22",
  address: "Satdobato, Lalitpur - Main Road",
  label: "Home",
  isDefault: true,
};

const useCheckoutStore = create(
  persist(
    (set, get) => ({
      checkoutItem: null,
      checkoutItems: [],
      deliveryCharge: 0,
      addresses: [INITIAL_ADDRESS],
      selectedAddressId: INITIAL_ADDRESS.id,

      setCheckoutItem: (item) => set({ checkoutItem: item, checkoutItems: item ? [item] : [] }),
      setCheckoutItems: (items) => set({ checkoutItems: items, checkoutItem: items?.[0] ?? null }),
      clearCheckoutItem: () => set({ checkoutItem: null, checkoutItems: [] }),
      setDeliveryCharge: (deliveryCharge) =>
        set({ deliveryCharge: Number(deliveryCharge || 0) }),

      setSelectedAddress: (id) => set({ selectedAddressId: id }),
      setAddressesFromServer: (addresses) =>
        set((state) => {
          if (!Array.isArray(addresses) || addresses.length === 0) {
            return {
              addresses: [INITIAL_ADDRESS],
              selectedAddressId: INITIAL_ADDRESS.id,
            };
          }

          const normalized = addresses.map((address, index) => ({
            ...address,
            id: Number(address.id),
            isDefault: index === 0,
          }));

          const selectedExists = normalized.some(
            (address) => address.id === state.selectedAddressId,
          );
          const nextSelectedId = selectedExists
            ? state.selectedAddressId
            : normalized[0].id;

          return {
            addresses: normalized.map((address) => ({
              ...address,
              isDefault: address.id === nextSelectedId,
            })),
            selectedAddressId: nextSelectedId,
          };
        }),

      saveAddress: (addressInput) =>
        set((state) => {
          const currentId = addressInput.id ?? Date.now();
          const normalized = {
            ...addressInput,
            id: currentId,
            isDefault: true,
          };

          const nextAddresses = state.addresses
            .filter((address) => address.id !== currentId)
            .map((address) => ({ ...address, isDefault: false }));

          return {
            addresses: [normalized, ...nextAddresses],
            selectedAddressId: currentId,
          };
        }),

      removeAddress: (id) =>
        set((state) => {
          const remaining = state.addresses.filter((address) => address.id !== id);
          if (remaining.length === 0) {
            return {
              addresses: [INITIAL_ADDRESS],
              selectedAddressId: INITIAL_ADDRESS.id,
            };
          }

          const selectedId = state.selectedAddressId === id ? remaining[0].id : state.selectedAddressId;
          return {
            addresses: remaining.map((address, index) => ({
              ...address,
              isDefault: address.id === selectedId || (state.selectedAddressId === id && index === 0),
            })),
            selectedAddressId: selectedId,
          };
        }),

      getSelectedAddress: () => {
        const state = get();
        return (
          state.addresses.find((address) => address.id === state.selectedAddressId) ??
          state.addresses[0] ??
          INITIAL_ADDRESS
        );
      },
    }),
    {
      name: "nityagro-checkout",
    },
  ),
);

export default useCheckoutStore;
