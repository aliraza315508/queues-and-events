const testRunId = Date.now();

const testData = {
customer: {
    fullName: `CI Test Customer ${testRunId}`,
    email: `ci-test-${testRunId}@example.com`,
    phone: "1234567890"
},

product: {
    sku: `CI-SKU-${testRunId}`,
    name: `CI Test Product ${testRunId}`,
    description: "Product created during CI smoke test",
    price: 99.99
},

    inventory: {
        quantity: 10
    },

    order: {
        quantity: 1
    }
};

module.exports = testData;