const postSection = document.querySelector(".post-section");

async function getAccessToken() {
    let token = sessionStorage.getItem("accessToken");

    if (!token) {
        try {
            const res = await fetch("http://localhost:8008/refresh", {
                method: "POST",
                credentials: "include"
            });

            if (res.ok) {
                const data = await res.json();
                token = data.accessToken;
                sessionStorage.setItem("accessToken", token);
            } else {
                window.location.href = "./index.html";
                return null;
            }
        } catch (err) {
            console.error("Erro no refresh:", err);
            window.location.href = "./index.html";
            return null;
        }
    }

    return token;
}




function formatDate(dateStr) {
    const dateHJ = new Date()
    let date_hj = dateHJ.toLocaleDateString();
    const date = new Date(dateStr);
    if (date_hj == date.toLocaleDateString()) {
        return "Hoje"
    }
    else {
        return date.toLocaleDateString();
    }
}

async function loadPosts() {
    try {
        const token = await getAccessToken();
        if (!token) return;

        const response = await fetch("http://localhost:8008/posts", {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!response.ok) throw new Error("Erro ao buscar posts: " + response.status);
        const posts = await response.json();
        console.log("Posts recebidos:", posts);
        document.body.style.visibility = "visible"

        postSection.innerHTML = "";

        if (!posts.length) {
            postSection.textContent = "Nenhum post encontrado.";
            return;
        }

        posts.forEach(post => {
            const postDiv = document.createElement("div");
            postDiv.className = "post";

            const postHeader = document.createElement("div");
            postHeader.className = "post-header";
            postHeader.innerHTML = `
                <div class="post-profile">
                    <div class="post-profile-image">
                        <img src="http://localhost:8008/img/${post.author_id}.png" alt="avatar">
                    </div>
                    <div class="post-profile-info">
                        <h3>${post.username}</h3>
                        <p>@${post.username}</p>
                    </div>
                </div>
            `;
            postDiv.appendChild(postHeader);

            const postContent = document.createElement("div");
            postContent.className = "post-content";

            const p = document.createElement("p");
            p.textContent = post.description || post.content;
            postContent.appendChild(p);

            if (post.picture) {
                const mediaDiv = document.createElement("div");
                mediaDiv.className = "media-content";
                const img = document.createElement("img");
                img.src = post.picture;
                mediaDiv.appendChild(img);
                postContent.appendChild(mediaDiv);
            } else if (/const|let|var|function|=>/.test(post.content)) {
                const mediaDiv = document.createElement("div");
                mediaDiv.className = "media-content";
                const pre = document.createElement("pre");
                const code = document.createElement("code");
                code.textContent = post.content;
                pre.appendChild(code);
                mediaDiv.appendChild(pre);
                postContent.appendChild(mediaDiv);
            }

            postDiv.appendChild(postContent);

            const postActions = document.createElement("div");
            postActions.className = "post-actions";
            postActions.innerHTML = `
                <div class="actions">
                    <img src="../icons/like.png" alt="like">
                    <img src="../icons/comentActive.png" alt="comment">
                </div>
                <div class="post-time">${formatDate(post.created_at)}</div>
            `;
            postDiv.appendChild(postActions);

            postSection.appendChild(postDiv);
        });
    } catch (err) {
        console.error("Erro ao carregar posts:", err);
        postSection.textContent = "Erro ao carregar posts.";
    }
}

document.addEventListener("DOMContentLoaded", loadPosts);