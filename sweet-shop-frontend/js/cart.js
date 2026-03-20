// const API_URL = "http://127.0.0.1:8000/api";

async function loadCart() {
    const token = localStorage.getItem("token");

    // 🔒 Not logged in
    if (!token) {
        alert("Please login first");
        window.location.href = "login.html";
        return;
    }

    const res = await fetch(`${API_URL}/cart/`, {
        headers: {
            "Authorization": "Bearer " + token
        }
    });

    // 🔒 Token expired / invalid
    if (res.status === 401) {
        alert("Session expired. Login again.");
        localStorage.removeItem("token");
        window.location.href = "login.html";
        return;
    }

    const data = await res.json();

    const container = document.getElementById("cart-items");
    container.innerHTML = "";

    let total = 0;

    // 🧠 Handle empty cart safely
    if (!data.items || data.items.length === 0) {
        container.innerHTML = "<p class='text-center text-gray-500'>Your cart is empty</p>";
        document.getElementById("total").innerText = "";
        return;
    }

    data.items.forEach(item => {
        total += item.product.price * item.quantity;

        container.innerHTML += `
            <div class="bg-white p-4 mb-3 rounded shadow flex justify-between items-center">
                
                <div>
                    <h2 class="font-bold">${item.product.name}</h2>
                    <p>Rs ${item.product.price}</p>

                    <input 
                        type="number" 
                        value="${item.quantity}" 
                        min="1"
                        onchange="updateQuantity(${item.id}, this.value)"
                        class="border px-2 py-1 mt-2 w-20"
                    >
                </div>

                <button onclick="removeItem(${item.id})"
                    class="bg-red-500 text-white px-3 py-1 rounded">
                    Remove
                </button>
            </div>
        `;
    });

    document.getElementById("total").innerText = "Total: Rs " + total;
}

loadCart();


// ❌ REMOVE ITEM
async function removeItem(itemId) {
    const token = localStorage.getItem("token");

    await fetch(`${API_URL}/cart/remove/`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({ item_id: itemId })
    });

    loadCart();
}


// 🔥 UPDATE QUANTITY
async function updateQuantity(itemId, quantity) {
    const token = localStorage.getItem("token");

    if (quantity < 1) {
        alert("Quantity must be at least 1");
        return;
    }

    await fetch(`${API_URL}/cart/update/`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({
            item_id: itemId,
            quantity: parseInt(quantity)
        })
    });

    loadCart();
}


// 💳 CHECKOUT
async function checkout() {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/orders/create/`, {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + token
        }
    });

    // 🔒 Handle expired session
    if (res.status === 401) {
        alert("Session expired. Login again.");
        localStorage.removeItem("token");
        window.location.href = "login.html";
        return;
    }

    await res.json();

    alert("Order placed!");
    loadCart();
}