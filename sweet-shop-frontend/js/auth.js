async function login() {
    const username = document.getElementById("email").value; // using email field as username
    const password = document.getElementById("password").value;

    const res = await fetch(`${API_URL}/auth/login/`, {
        method: "POST",
        headers: {  
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (data.access) {
        // ✅ Save token
        localStorage.setItem("token", data.access);

        // ✅ Save username (🔥 this is the fix)
        localStorage.setItem("username", username);

        alert("Logged in!");
        window.location.href = "index.html";
    } else {
        alert(data.error || "Login failed");
    }
}