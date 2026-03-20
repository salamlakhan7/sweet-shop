function getProductId() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
}

async function loadProduct() {
    const id = getProductId();

    try {
        const res = await fetch(`${API_URL}/products/`);
        const products = await res.json();

        const product = products.find(p => p.id == id);

        const container = document.getElementById("product-detail");

        if (!container) {
            console.error("product-detail div missing");
            return;
        }

        const imageUrl = product.image
            ? `http://127.0.0.1:8000${product.image}`
            : "https://via.placeholder.com/300";

        container.innerHTML = `
            <div class="bg-white p-6 rounded shadow max-w-xl mx-auto">

                <img src="${imageUrl}" 
                     class="w-full h-60 object-cover rounded mb-4"/>

                <h2 class="text-2xl font-bold">${product.name}</h2>
                <p class="text-gray-600">${product.description}</p>

                <p class="text-xl font-bold mt-2">Rs ${product.price}</p>

                <button onclick="addToCart(${product.id})"
                    class="bg-pink-500 text-white px-4 py-2 rounded mt-3">
                    Add to Cart
                </button>

            </div>
        `;
    } catch (err) {
        console.error("Error loading product:", err);
    }
}

loadProduct();


async function addToCart(productId) {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("Please login first");
        return;
    }

    await fetch(`${API_URL}/cart/add/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({
            product_id: productId,
            quantity: 1
        })
    });

    alert("Added to cart!");

    // safe call
    if (typeof loadCartCount === "function") {
        loadCartCount();
    }
}