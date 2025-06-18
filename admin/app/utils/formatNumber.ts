export const formatPrice = (price?: number) => {
 if (price === undefined || price === null) {
  return "-";
 }
 return new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
 }).format(price);
};
