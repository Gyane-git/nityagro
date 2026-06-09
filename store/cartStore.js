import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      currentUserId: null,
      cartsByUser: {},
      setCartUser: (userId) =>
        set((state) => {
          const nextUserId = userId ? String(userId) : null;
          return {
            currentUserId: nextUserId,
            items: nextUserId ? state.cartsByUser[nextUserId] || [] : [],
          };
        }),
      setCartItems: (items) =>
        set((state) => ({
          items: Array.isArray(items) ? items : [],
          cartsByUser: state.currentUserId
            ? { ...state.cartsByUser, [state.currentUserId]: Array.isArray(items) ? items : [] }
            : state.cartsByUser,
        })),
      addToCart: (product) =>
        set((state) => {
          const userId = state.currentUserId;
          if (!userId) return state;
          const existing = state.items.find((item) => item.id === product.id);

          if (existing) {
            const items = state.items.map((item) =>
              item.id === product.id
                ? {
                    ...item,
                    qty: item.qty + (product.qty ?? 1),
                    availableQuantity:
                      product.availableQuantity ?? item.availableQuantity,
                    stockQuantity: product.stockQuantity ?? item.stockQuantity,
                  }
                : item
            );
            return {
              items,
              cartsByUser: { ...state.cartsByUser, [userId]: items },
            };
          }

          const items = [
            ...state.items,
            {
              id: product.id,
              name: product.name,
              price: product.price,
              image: product.image,
              weight: product.weight ?? "100 gm",
              qty: product.qty ?? 1,
              availableQuantity: product.availableQuantity,
              stockQuantity: product.stockQuantity,
            },
          ];

          return {
            items,
            cartsByUser: { ...state.cartsByUser, [userId]: items },
          };
        }),
      updateQty: (id, qty) =>
        set((state) => {
          const items = state.items.map((item) =>
            item.id === id ? { ...item, qty: Math.max(1, qty) } : item
          );
          return {
            items,
            cartsByUser: state.currentUserId
              ? { ...state.cartsByUser, [state.currentUserId]: items }
              : state.cartsByUser,
          };
        }),
      removeItem: (id) =>
        set((state) => {
          const items = state.items.filter((item) => item.id !== id);
          return {
            items,
            cartsByUser: state.currentUserId
              ? { ...state.cartsByUser, [state.currentUserId]: items }
              : state.cartsByUser,
          };
        }),
      removeItems: (ids) =>
        set((state) => {
          const items = state.items.filter((item) => !ids.includes(item.id));
          return {
            items,
            cartsByUser: state.currentUserId
              ? { ...state.cartsByUser, [state.currentUserId]: items }
              : state.cartsByUser,
          };
        }),
      clearCart: () =>
        set((state) => ({
          items: [],
          cartsByUser: state.currentUserId
            ? { ...state.cartsByUser, [state.currentUserId]: [] }
            : state.cartsByUser,
        })),
      clearAllCartState: () => set({ items: [], currentUserId: null, cartsByUser: {} }),
    }),
    {
      name: "nityagro-cart",
    }
  )
);

export default useCartStore;
