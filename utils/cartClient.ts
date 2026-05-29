import useCartStore from "@/store/cartStore";

type CartItemInput = {
  id: string | number;
  productCode?: string;
  name: string;
  image: string;
  price: number;
  quantity?: number;
  availableQuantity?: number;
  weight?: string;
};

export function addCartItem(item: CartItemInput) {
  const store = useCartStore.getState();
  store.addToCart({
    id: item.id,
    name: item.name,
    image: item.image,
    price: item.price,
    qty: item.quantity ?? 1,
    weight: item.weight ?? "100 gm",
    availableQuantity: item.availableQuantity,
  });
}
