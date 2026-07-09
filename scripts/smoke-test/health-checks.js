const config = require("./config");
const { get } = require("./http-client");
const { waitFor } = require("./wait");

async function waitForAllServices() {
    console.log("Checking service health...");

    for (const service of config.healthCheckServices) {
        await waitForService(service.name, service.baseUrl);
    }

    console.log("All service health checks passed");
}

async function waitForService(serviceName, baseUrl) {
    console.log(`Checking ${serviceName} at ${baseUrl}/actuator/health`);

    await waitFor(
        async () => {
            const health = await get(`${baseUrl}/actuator/health`);

            if (health.status !== "UP") {
                throw new Error(`${serviceName} health status is ${health.status}`);
            }
        },
        {
            timeoutMs: config.timeout.serviceStartupMs,
            retryDelayMs: config.timeout.retryDelayMs,
            description: `${serviceName} health`
        }
    );

    console.log(`${serviceName} health passed`);
}

module.exports = {
    waitForAllServices
};