// Define order status with updated values
const OrderStatus = {
    PENDING: 'Đặt hàng thành công',
    AWAITING_PAYMENT: 'Chờ thanh toán',
    PAYMENT_CONFIRMED: 'Đã xác nhận thanh toán',
    PROCESSING: 'Đang xử lý đơn hàng',
    SHIPPING: 'Đang vận chuyển',
    DELIVERED: 'Đã giao hàng',     
    CANCELLED: 'Đã hủy'
};

// Define payment methods with updated values
const PaymentMethod = {
    ZALOPAY: 'ZaloPay',
    CASH: 'Tiền mặt'
};

module.exports = { OrderStatus, PaymentMethod };
