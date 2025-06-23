export const formatPrice = (price?: number) => {
 if (!price) return "Liên hệ";
 return new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
 }).format(price);
};
