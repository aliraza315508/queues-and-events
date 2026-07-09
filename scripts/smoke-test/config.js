const services = {
    orderService: "http://localhost:8081",
    customerService: "http://localhost:8082",
    productService: "http://localhost:8083",
    inventoryService: "http://localhost:8084",
    paymentService: "http://localhost:8085",
    notificationService: "http://localhost:8086"
};

const config = {
    services,

    healthCheckServices: [
        { name: "order-service", baseUrl: services.orderService },
        { name: "customer-service", baseUrl: services.customerService },
        { name: "product-service", baseUrl: services.productService },
        { name: "inventory-service", baseUrl: services.inventoryService },
        { name: "payment-service", baseUrl: services.paymentService },
        { name: "notification-service", baseUrl: services.notificationService }
    ],

    rabbitmq: {
        managementUrl: "http://localhost:15672",
        username: "guest",
        password: "guest",
        queueName: "notification.queue"
    },

    timeout: {
        serviceStartupMs: 180000,
        retryDelayMs: 5000
    }
};

module.exports = config;