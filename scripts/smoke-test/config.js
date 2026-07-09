const config = {
    services: {
        customerService: "http://localhost:8080",
        orderService: "http://localhost:8081",
        productService: "http://localhost:8082",
        inventoryService: "http://localhost:8083",
        paymentService: "http://localhost:8084",
        notificationService: "http://localhost:8085"
    },

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