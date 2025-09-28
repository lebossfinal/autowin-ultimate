import Toast from "./Toast";

export function initWS() {
    if (window.ws) return;
    let wsUrl;

    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    wsUrl = 'ws://localhost:8081';  // Pour usage local avec le .exe backend
    } else {
    wsUrl = 'wss://autowin-ultimate.onrender.com';  // Pour Render (online)
    }

const ws = new WebSocket(wsUrl);
    ws.onopen = function () {
    };

    ws.onmessage = function (e) {
        try {
            const json = JSON.parse(e.data);
            if (!json.hb) {
                console.log(json);
                if (json.error) {
                    Toast.show({message: json.data || "Unknown error", intent: "danger"});
                } else if (Array.isArray(json)) {
                    const [key, value] = json;
                    if (key === "accounts") window.setAccounts(value);
                } else if (json.resource) {
                    const {resource, key, value} = json;
                    if (resource === "accounts") {
                        window.accounts[key] = value;
                        window.setAccounts({...window.accounts});
                    }
                }
                if (json.id) {
                    window.map[json.id]?.(json.data)
                }
            }
        } catch (e) {
            console.log(e);
        }
    };

    ws.onerror = function () {
    };

    ws.onclose = function () {
        delete window.ws;
        setTimeout(initWS, 5000);
    };

    window.ws = ws;
}

