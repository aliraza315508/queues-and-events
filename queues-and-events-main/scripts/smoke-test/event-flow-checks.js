const config = require("./config");
const { get, post } = require("./http-client");
const { waitFor } = require("./wait");
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
        availableQuantity: testData.inventory.quantity
    }
);

const order = await post(
    `${config.services.orderService}/orders`,
    {
        customerId: customer.id,
        productId: product.id,
        quantity: testData.order.quantity,
        unitPrice: product.price
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


 await waitFor(
     async () => {
         const notifications = await get(
             `${config.services.notificationService}/api/notifications/order/${order.id}`
         );

         if (!Array.isArray(notifications) || notifications.length === 0) {
             throw new Error("Notification was not created");
         }

         const sentNotification = notifications.find(
             notification => notification.status === "SENT"
         );

         if (!sentNotification) {
             const statuses = notifications
                 .map(notification => notification.status)
                 .join(", ");

             throw new Error(
                 `Notification has not reached SENT status. Current statuses: ${statuses}`
             );
         }
     },
     {
         timeoutMs: 120000,
         retryDelayMs: 5000,
         description: "notification to reach SENT status"
     }
 );

    console.log("Event flow checks passed");
}

module.exports = {
    runEventFlowChecks
};



