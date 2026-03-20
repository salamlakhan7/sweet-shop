const API_URL = "http://127.0.0.1:8000/api";

async function loadProducts() {
    console.log("🔥 Loading products...");

    try {
        const res = await fetch(`${API_URL}/products/`);
        const products = await res.json();

        console.log("✅ Products:", products);

        const container = document.getElementById("products");

        if (!container) {
            console.error("❌ products div not found");
            return;
        }

        container.innerHTML = "";

        if (!Array.isArray(products)) {
            console.error("❌ Products is not array:", products);
            container.innerHTML = "<p>Error loading products</p>";
            return;
        }

        if (products.length === 0) {
            container.innerHTML = "<p>No products found</p>";
            return;
        }

        products.forEach(product => {
            const imageUrl = product.image
                ? `http://127.0.0.1:8000${product.image}`
                : "https://via.placeholder.com/300";

            const card = `
                <div class="bg-white p-4 rounded shadow hover:shadow-lg transition cursor-pointer"
                     onclick="goToProduct(${product.id})">

                    <img src="${imageUrl}" 
                         class="w-full h-40 object-cover rounded mb-2"
                         onerror="this.src='https://via.placeholder.com/300'"/>

                    <h2 class="text-lg font-bold">${product.name}</h2>
                    <p class="text-gray-600 mb-2">Rs ${product.price}</p>

                    <button onclick="event.stopPropagation(); addToCart(${product.id})"
                        class="bg-pink-500 text-white px-4 py-1 rounded">
                        Add to Cart
                    </button>

                </div>
            `;

            container.innerHTML += card;
        });

    } catch (error) {
        console.error("❌ Error loading products:", error);

        document.getElementById("products").innerHTML =
            "<p class='text-red-500'>Failed to load products</p>";
    }
}

loadProducts();


async function addToCart(productId) {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/cart/add/`, {
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

    if (typeof loadCartCount === "function") {
        loadCartCount();
    }
}

function goToProduct(id) {
    window.location.href = `product.html?id=${id}`;
}