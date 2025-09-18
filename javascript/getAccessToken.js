export default async function getAccessToken() {
    let token = sessionStorage.getItem("accessToken");

    const isValid = async (token) => {
        if (!token) return false;
        try {
            const res = await fetch("http://localhost:8008/users/verifyToken", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            return data.valid;
        } catch {
            return false;
        }
    };
    if (!await isValid(token)) {
        try {
            const res = await fetch("http://localhost:8008/users/refresh", {
                method: "POST",
                credentials: "include"
            });

            if (res.ok) {
                const data = await res.json();
                token = data.accessToken;
                sessionStorage.setItem("accessToken", token);
            } else {
                sessionStorage.removeItem("accessToken");
                window.location.href = "./index.html";
                return null;
            }
        } catch (err) {
            console.error("Erro no refresh:", err);
            sessionStorage.removeItem("accessToken");
            window.location.href = "./index.html";
            return null;
        }
    }

    return token;
}
