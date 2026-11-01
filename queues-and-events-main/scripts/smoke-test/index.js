const { waitForAllServices } = require("./health-checks");
const { runEventFlowChecks } = require("./event-flow-checks");
const { runRabbitMqChecks } = require("./rabbitmq-checks");

async function main() {
    console.log("====================================");
    console.log("Starting CI smoke tests");
    console.log("====================================");

    try {
        await waitForAllServices();

        console.log("Starting event flow checks...");
        await runEventFlowChecks();

        console.log("Starting RabbitMQ checks...");
        await runRabbitMqChecks();

        console.log("====================================");
        console.log("CI smoke tests passed");
        console.log("====================================");

        process.exit(0);
    } catch (error) {
        console.error("====================================");
        console.error("CI smoke tests failed");
        console.error("====================================");
        console.error(error.stack || error.message || error);

        process.exit(1);
    }
}

main();