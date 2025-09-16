const emailInput = document.getElementById("email");
const passInput = document.getElementById("pass");
const loginBtn = document.querySelector(".btns input[type='button']");
const errorMsg = document.createElement("p");
errorMsg.style.color = "red";
document.querySelector(".login fieldset").appendChild(errorMsg);

loginBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();
    const password = passInput.value.trim();
    errorMsg.textContent = "";

    if (!email || !password) {
        errorMsg.textContent = "Por favor, preencha todos os campos.";
        return;
    }

    try {
        const response = await fetch("http://localhost:8008/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (data.success) {
            localStorage.setItem("user", JSON.stringify(data.user));
            window.location.href = "html/feed.html";
        } else {
            errorMsg.textContent = data.message || "Login falhou, tente novamente.";
        }
    } catch (err) {
        errorMsg.textContent = "Erro ao conectar com o servidor.";
        console.error(err);
    }
});
