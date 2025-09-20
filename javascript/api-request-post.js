import getAccessToken from "./getAccessToken.js";
import getDataProfile from "./api-request-profile.js";
import closeLoading from "./loading.js";
const postSection = document.querySelector(".post-section");
const username = document.querySelector("#username");
const picsProfile = document.querySelectorAll(".image-profile")

window.addEventListener("load", async () => {
    const token = await getAccessToken();
    const data = await getDataProfile(token)
    dataRefresh(data)
});


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
        document.body.style.visibility = "visible"
        closeLoading()

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
                        <img src=${post.profile_picture} alt="avatar">
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
            postContent.innerHTML = verifyCode(post.description || post.content);

            if (post.picture) {
                const mediaDiv = document.createElement("div");
                mediaDiv.className = "media-content";
                const img = document.createElement("img");
                img.src = post.picture;
                mediaDiv.appendChild(img);
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

function dataRefresh(data) {
    picsProfile[0].src = data.profile_picture
    picsProfile[1].src = data.profile_picture
    username.textContent = data.profile_username
}

function verifyCode(input) {
    if (!input) return "";

    const escapeHTML = (str) =>
        str.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");

    const regex = /<([^<>]+)>/g;

    let lastIndex = 0;
    let result = "";
    let match;

    while ((match = regex.exec(input)) !== null) {
        const textBefore = input.slice(lastIndex, match.index);
        if (textBefore.trim()) {
            result += `<p>${escapeHTML(textBefore)}</p>`;
        }

        const codeContent = match[1];
        result += `
            <div class="media-content">
                <pre><code>${escapeHTML(codeContent)}</code></pre>
            </div>
        `;

        lastIndex = regex.lastIndex;
    }

    const remainingText = input.slice(lastIndex);
    if (remainingText.trim()) {
        result += `<p>${escapeHTML(remainingText)}</p>`;
    }

    return result;
}

document.addEventListener("DOMContentLoaded", loadPosts);