export const formatPrice = (price: number): string => {
    return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
};