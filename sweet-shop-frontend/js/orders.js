async function loadOrders() {
    const token = localStorage.getItem("token");

    // 🔒 Not logged in
    if (!token) {
        alert("Please login first");
        window.location.href = "login.html";
        return;
    }

    const res = await fetch(`${API_URL}/orders/`, {
        headers: {
            "Authorization": "Bearer " + token
        }
    });

    // 🔒 Token expired
    if (res.status === 401) {
        alert("Session expired. Login again.");
        localStorage.removeItem("token");
        window.location.href = "login.html";
        return;
    }

    const orders = await res.json();

    const container = document.getElementById("orders");
    container.innerHTML = "";

    // 🧠 Safe empty handling
    if (!orders || orders.length === 0) {
        container.innerHTML = `
            <p class="text-center text-gray-600">No orders yet.</p>
        `;
        return;
    }

    orders.forEach(order => {

        let statusColor = "bg-gray-200";

        if (order.status === "pending") statusColor = "bg-yellow-200";
        if (order.status === "shipped") statusColor = "bg-blue-200";
        if (order.status === "delivered") statusColor = "bg-green-200";

        let itemsHTML = "";

        if (order.items) {
            order.items.forEach(item => {
                itemsHTML += `
                    <li class="text-sm">
                        ${item.product.name} × ${item.quantity}
                    </li>
                `;
            });
        }

        container.innerHTML += `
            <div class="bg-white p-4 mb-4 rounded shadow">

                <div class="flex justify-between mb-2">
                    <h2 class="font-bold">Order #${order.id}</h2>
                    <span class="text-sm px-2 py-1 rounded ${statusColor}">
                        ${order.status}
                    </span>
                </div>

                <ul class="mb-2">
                    ${itemsHTML}
                </ul>

                <p class="font-bold">Total: Rs ${order.total_price}</p>
            </div>
        `;
    });
}

loadOrders();