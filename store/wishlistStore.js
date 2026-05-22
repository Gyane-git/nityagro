import { create } from "zustand";
import { persist } from "zustand/middleware";

const useWishlistStore = create(
  persist(
    (set) => ({
      items: [],
      currentUserId: null,
      wishlistsByUser: {},
      setWishlistUser: (userId) =>
        set((state) => {
          const nextUserId = userId ? String(userId) : null;
          return {
            currentUserId: nextUserId,
            items: nextUserId ? state.wishlistsByUser[nextUserId] || [] : [],
          };
        }),
      setWishlistItems: (items) =>
        set((state) => ({
          items: Array.isArray(items) ? items : [],
          wishlistsByUser: state.currentUserId
            ? {
                ...state.wishlistsByUser,
                [state.currentUserId]: Array.isArray(items) ? items : [],
              }
            : state.wishlistsByUser,
        })),
      addToWishlist: (product) =>
        set((state) => {
          const userId = state.currentUserId;
          if (!userId) return state;
          const exists = state.items.some((item) => item.id === product.id);
          if (exists) return state;
          const items = [
            ...state.items,
            {
              id: product.id,
              name: product.name,
              price: product.price,
              image: product.image,
            },
          ];
          return {
            items,
            wishlistsByUser: { ...state.wishlistsByUser, [userId]: items },
          };
        }),
      removeFromWishlist: (id) =>
        set((state) => {
          const items = state.items.filter((item) => item.id !== id);
          return {
            items,
            wishlistsByUser: state.currentUserId
              ? { ...state.wishlistsByUser, [state.currentUserId]: items }
              : state.wishlistsByUser,
          };
        }),
      clearWishlist: () =>
        set((state) => ({
          items: [],
          wishlistsByUser: state.currentUserId
            ? { ...state.wishlistsByUser, [state.currentUserId]: [] }
            : state.wishlistsByUser,
        })),
      clearAllWishlistState: () =>
        set({ items: [], currentUserId: null, wishlistsByUser: {} }),
    }),
    {
      name: "nityagro-wishlist",
    },
  ),
);

export default useWishlistStore;
