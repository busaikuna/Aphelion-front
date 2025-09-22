import getAccessToken from "./getAccessToken.js";
const followBtn = document.getElementById("follow");

followBtn.addEventListener("click", async () => {
    const token = getAccessToken()
    const targetTag = localStorage.getItem("profile_tag");
    toggleFollow(targetTag);
});



async function toggleFollow(targetTag) {
    const token = await getAccessToken();
    console.log(token)
    if (!token) return;
    try {
        const res = await fetch("http://localhost:8008/follows", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ targetTag })
        });

        const data = await res.json();

        if (!res.ok) {
            console.error("Erro:", data.error);
            return null;
        }

        checkFollow(targetTag)
        return data;
    } catch (err) {
        console.error("Falha na requisição:", err);
        return null;
    }
}

export async function checkFollow() {
    const token = await getAccessToken();
    if (!token) return;

    const targetTag = localStorage.getItem("profile_tag");

    const res = await fetch(`http://localhost:8008/follows/check?targetTag=${encodeURIComponent(targetTag)}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    const data = await res.json();

    if (data.follows) {
        followBtn.textContent = "Deixar de seguir";
        document.documentElement.style.setProperty("--gradient-primary", `linear-gradient(135deg, #3d3d3dff, #202020ff)`);
    } else {
        followBtn.textContent = "Seguir";
        document.documentElement.style.setProperty("--gradient-primary", `linear-gradient(135deg, #8b5cf6, #a855f7)`);
    }
}

export async function infoFollowing() {
    const token = await getAccessToken();
    if (!token) return;

    const targetTag = localStorage.getItem("profile_tag");

    try {
        const res = await fetch(`http://localhost:8008/follows/infoFollows?userTag=${encodeURIComponent(targetTag)}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!res.ok) {
            console.error("Erro ao buscar infoFollows:", res.status);
            return null;
        }

        const data = await res.json();
        return data;
    } catch (err) {
        console.error("Falha na requisição infoFollows:", err);
        return null;
    }
}
