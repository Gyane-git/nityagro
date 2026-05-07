import { create } from "zustand";
import { persist } from "zustand/middleware";

const useWishlistStore = create(
  persist(
    (set) => ({
      items: [],
      addToWishlist: (product) =>
        set((state) => {
          const exists = state.items.some((item) => item.id === product.id);
          if (exists) return state;
          return {
            items: [
              ...state.items,
              {
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
              },
            ],
          };
        }),
      removeFromWishlist: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: "nityagro-wishlist",
    },
  ),
);

export default useWishlistStore;

