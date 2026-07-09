const config = require("./config");
const { get, post } = require("./http-client");
const { waitFor, sleep } = require("./wait");
const testData = require("./test-data");

async function runEventFlowChecks() {
    console.log("Running event flow checks...");

    const customer = await post(
        `${config.services.customerService}/customers`,
        testData.customer
    );

    const product = await post(
        `${config.services.productService}/products`,
        testData.product
    );

    await post(
        `${config.services.inventoryService}/inventory`,
        {
            productId: product.id,
            quantity: testData.inventory.quantity
        }
    );

    const order = await post(
        `${config.services.orderService}/orders`,
        {
            customerId: customer.id,
            productId: product.id,
            quantity: testData.order.quantity
        }
    );

    await waitFor(
        async () => {
            const updatedOrder = await get(
                `${config.services.orderService}/orders/${order.id}`
            );

            if (updatedOrder.status !== "CONFIRMED") {
                throw new Error(`Order status is ${updatedOrder.status}`);
            }
        },
        {
            timeoutMs: 120000,
            retryDelayMs: 5000,
            description: "order to become CONFIRMED"
        }
    );

    await sleep(5000);

    await waitFor(
        async () => {
            const notifications = await get(
`${config.services.notificationService}/api/notifications/order/${order.id}`            );

            if (!Array.isArray(notifications) || notifications.length === 0) {
                throw new Error("Notification was not created");
            }
        },
        {
            timeoutMs: 120000,
            retryDelayMs: 5000,
            description: "notification to be created"
        }
    );

    console.log("Event flow checks passed");
}

module.exports = {
    runEventFlowChecks
};



//testing