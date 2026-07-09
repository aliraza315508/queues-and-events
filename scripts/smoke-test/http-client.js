async function get(url) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`GET ${url} failed with status ${response.status}`);
    }

    return response.json();
}

async function post(url, body) {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        const responseText = await response.text();
        throw new Error(`POST ${url} failed with status ${response.status}: ${responseText}`);
    }

    return response.json();
}

module.exports = {
    get,
    post
};