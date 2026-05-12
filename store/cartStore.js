import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCartStore = create(
  persist(
    (set) => ({
      items: [],
      addToCart: (product) =>
        set((state) => {
          const existing = state.items.find((item) => item.id === product.id);

          if (existing) {
            return {
              items: state.items.map((item) =>
                item.id === product.id ? { ...item, qty: item.qty + (product.qty ?? 1) } : item
              ),
            };
          }

          return {
            items: [
              ...state.items,
              {
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                weight: product.weight ?? "100 gm",
                qty: product.qty ?? 1,
              },
            ],
          };
        }),
      updateQty: (id, qty) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, qty: Math.max(1, qty) } : item
          ),
        })),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
      removeItems: (ids) =>
        set((state) => ({
          items: state.items.filter((item) => !ids.includes(item.id)),
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "nityagro-cart",
    }
  )
);

export default useCartStore;
