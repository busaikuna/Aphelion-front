const usernameInput = document.querySelector("#username") || document.createElement("input");
const emailInput = document.querySelector("#email");
const passInput = document.querySelector("#pass");
const pass1Input = document.querySelector("#pass1");
const signUpBtn = document.querySelector(".btns input[value='Cadastre-se']");
const errorMsg = document.querySelector("#error-msg");

signUpBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const username = usernameInput.value?.trim() || document.querySelector("#username")?.value?.trim() || "";
    const email = emailInput.value.trim();
    const password = passInput.value.trim();
    const passwordConfirm = pass1Input.value.trim();

    errorMsg.textContent = "";
    if (!username || !email || !password || !passwordConfirm) {
        errorMsg.textContent = "Preencha todos os campos!";
        errorMsg.classList.add("show");
        return;
    }

    if (password !== passwordConfirm) {
        errorMsg.textContent = "As senhas não coincidem!";
        errorMsg.classList.add("show");
        return;
    }

    try {
        const response = await fetch("http://localhost:8008/users/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();

        if (data.id) {
            localStorage.setItem("user", JSON.stringify({ id: data.id, username: data.username, email: data.email }));
            window.location.href = "feed.html";
        } else {
            errorMsg.textContent = data.error || "Erro ao cadastrar. Tente novamente.";
            errorMsg.classList.add("show");
        }
    } catch (err) {
        console.error(err);
        errorMsg.textContent = "Erro ao conectar com o servidor.";
        errorMsg.classList.add("show");
    }
});
