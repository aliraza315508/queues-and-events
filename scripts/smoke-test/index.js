const { waitForAllServices } = require("./health-checks");
const { runEventFlowChecks } = require("./event-flow-checks");
const { runRabbitMqChecks } = require("./rabbitmq-checks");

async function main() {
    console.log("====================================");
    console.log("Starting CI smoke tests");
    console.log("====================================");

    try {
        await waitForAllServices();

        await runEventFlowChecks();

        await runRabbitMqChecks();

        console.log("====================================");
        console.log("Smoke tests passed successfully");
        console.log("====================================");

        process.exit(0);
    } catch (error) {
        console.error("====================================");
        console.error("Smoke tests failed");
        console.error("====================================");
        console.error(error.message || error);

        process.exit(1);
    }
}

main();