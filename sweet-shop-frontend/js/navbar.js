async function loadNavbar() {
    const res = await fetch("components/navbar.html");
    const html = await res.text();

    document.getElementById("navbar").innerHTML = html;

    setupNavbar();
}

async function setupNavbar() {
    const token = localStorage.getItem("token");

    const usernameSpan = document.getElementById("username");
    const loginLink = document.getElementById("login-link");
    const logoutBtn = document.getElementById("logout-btn");

    if (!token) {
        loginLink.classList.remove("hidden");
        logoutBtn.classList.add("hidden");
        usernameSpan.innerText = "";
        return;
    }

    loginLink.classList.add("hidden");
    logoutBtn.classList.remove("hidden");

    // ✅ show real username (no fallback fake "User")
    const name = localStorage.getItem("username");
    usernameSpan.innerText = name ? name : "";

    loadCartCount();
}


// 🛒 Cart Count
async function loadCartCount() {
    const token = localStorage.getItem("token");

    const el = document.getElementById("cart-count");
    if (!el) return;

    if (!token) {
        el.innerText = 0;
        return;
    }

    try {
        const res = await fetch(`${API_URL}/cart/`, {
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        if (res.status === 401) return;

        const data = await res.json();

        let count = 0;

        if (data.items) {
            data.items.forEach(item => {
                count += item.quantity;
            });
        }

        el.innerText = count;

    } catch (err) {
        console.log("Cart error:", err);
    }
}


// 🔓 Logout
function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username"); // ✅ clean logout
    window.location.href = "login.html";
}

loadNavbar();