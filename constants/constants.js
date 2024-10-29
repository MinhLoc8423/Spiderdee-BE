// Define order status
const OrderStatus = {
    PENDING: 'Pending',
    AWAITING_PAYMENT: 'Awaiting Payment',
    CONFIRMED: 'Confirmed',
    PROCESSING: 'Processing',
    SHIPPED: 'Shipped',
    DELIVERED: 'Delivered',
    CANCELLED: 'Cancelled'
};

// Define payment methods
const PaymentMethod = {
    ZALOPAY: 'ZaloPay',
    CASH: 'Cash'
};

module.exports = { OrderStatus, PaymentMethod };
