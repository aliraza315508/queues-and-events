const config = require("./config");

async function runRabbitMqChecks() {
    console.log("Running RabbitMQ checks...");

    const queueUrl = `${config.rabbitmq.managementUrl}/api/queues/%2F/${config.rabbitmq.queueName}`;

    const response = await fetch(queueUrl, {
        headers: {
            Authorization: basicAuthHeader(
                config.rabbitmq.username,
                config.rabbitmq.password
            )
        }
    });

    if (!response.ok) {
        throw new Error(`RabbitMQ queue check failed with status ${response.status}`);
    }

    const queue = await response.json();

    if (queue.name !== config.rabbitmq.queueName) {
        throw new Error(`Expected queue ${config.rabbitmq.queueName} but found ${queue.name}`);
    }

    console.log(`RabbitMQ queue exists: ${queue.name}`);
}

function basicAuthHeader(username, password) {
    const token = Buffer.from(`${username}:${password}`).toString("base64");
    return `Basic ${token}`;
}

module.exports = {
    runRabbitMqChecks
};
