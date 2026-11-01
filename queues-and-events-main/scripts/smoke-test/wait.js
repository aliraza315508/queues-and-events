async function waitFor(checkFunction, options) {
    const timeoutMs = options.timeoutMs;
    const retryDelayMs = options.retryDelayMs;
    const description = options.description || "condition";

    const startTime = Date.now();

    while (Date.now() - startTime < timeoutMs) {
        try {
            await checkFunction();
            console.log(`Ready: ${description}`);
            return;
        } catch (error) {
            console.log(`Waiting for ${description}...`);
            await sleep(retryDelayMs);
        }
    }

    throw new Error(`Timed out waiting for ${description}`);
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = {
    waitFor,
    sleep
};