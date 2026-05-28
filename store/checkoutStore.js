import { create } from "zustand";
import { persist } from "zustand/middleware";

function isLegacyDemoAddress(address) {
  return (
    Number(address?.id) === 1 &&
    String(address?.fullName || "").toLowerCase() === "archie rai"
  );
}

function normalizeAddressList(addresses = []) {
  return addresses
    .filter((address) => address && !isLegacyDemoAddress(address))
    .map((address, index) => ({
      ...address,
      id: Number(address.id),
      isDefault: index === 0,
    }));
}

const useCheckoutStore = create(
  persist(
    (set, get) => ({
      checkoutItem: null,
      checkoutItems: [],
      deliveryCharge: 0,
      addresses: [],
      selectedAddressId: null,

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
              addresses: [],
              selectedAddressId: null,
            };
          }

          const normalized = normalizeAddressList(addresses);

          if (normalized.length === 0) {
            return { addresses: [], selectedAddressId: null };
          }

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
              addresses: [],
              selectedAddressId: null,
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
        const selected =
          state.addresses.find((address) => address.id === state.selectedAddressId) ??
          state.addresses[0] ??
          null;

        if (!selected || isLegacyDemoAddress(selected)) return null;
        return selected;
      },
    }),
    {
      name: "nityagro-checkout",
      version: 2,
      migrate: (state) => ({
        ...state,
        addresses: normalizeAddressList(state?.addresses || []),
        selectedAddressId: normalizeAddressList(state?.addresses || [])[0]?.id ?? null,
      }),
    },
  ),
);

export default useCheckoutStore;
