const config = require("./config");
const { get } = require("./http-client");
const { waitFor } = require("./wait");

async function waitForAllServices() {
    console.log("Checking service health...");

    const services = config.services;

    await waitFor(
        async () => {
            await checkServiceHealth("customer-service", services.customerService);
            await checkServiceHealth("order-service", services.orderService);
            await checkServiceHealth("product-service", services.productService);
            await checkServiceHealth("inventory-service", services.inventoryService);
            await checkServiceHealth("payment-service", services.paymentService);
            await checkServiceHealth("notification-service", services.notificationService);
        },
        {
            timeoutMs: config.timeout.serviceStartupMs,
            retryDelayMs: config.timeout.retryDelayMs,
            description: "all Spring Boot services"
        }
    );
}

async function checkServiceHealth(serviceName, baseUrl) {
    const health = await get(`${baseUrl}/actuator/health`);

    if (health.status !== "UP") {
        throw new Error(`${serviceName} is not UP`);
    }

    console.log(`${serviceName} is UP`);
}

module.exports = {
    waitForAllServices
};