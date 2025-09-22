const avatarProfile = document.querySelector("#img-profile")
const bannerProfile = document.querySelector("#cover-img")
const picHeader = document.querySelector(".user-avatar img")
const addressInf = document.querySelector("#addressInfo")
const siteInf = document.querySelector("#siteInf")
const createdsInf = document.querySelector("#createdInf")
const metaLink = document.querySelector(".meta-link")
const description = document.querySelector(".profile-bio p")
const buttonModal = document.querySelector("#openModal")
const buttonFollow = document.querySelector("#follow")
const userTag = document.querySelector(".username")
const followers = document.querySelector("#followers")
const following = document.querySelector("#following")

import getAccessToken from "./getAccessToken.js";
import { getDataProfile, getUserProfile } from "./api-request-profile.js";
import { closeLoading } from "./geral.js"
import { checkFollow, infoFollowing } from "./follows.js"

let anotherUser = false

window.addEventListener("load", async () => {
    const token = await getAccessToken();
    const urlParams = new URLSearchParams(window.location.search);
    const userTagParam = urlParams.get("tag");

    let data;
    if (userTagParam) {
        const match = userTagParam.match(/(\D+)(\d{4})$/);
        if (match) {
            const username = match[1];
            const number = match[2];
            const userTag = `${username}#${number}`;
            data = await getUserProfile(userTag, token);
        } else {
            data = await getDataProfile(token);
        }
    } else {
        data = await getDataProfile(token);
    }

    dataRefresh(data);
});


async function dataRefresh(data) {
    localStorage.setItem("profile_tag", data.profile_tag)
    postsUser()
    if (localStorage.getItem("myUsertag") !== data.profile_tag) {
        anotherUser = true
    }
    if (anotherUser) {
        picHeader.src = localStorage.getItem("userPicture")
        buttonModal.remove()
    } else {
        buttonFollow.remove()
        picHeader.src = data.profile_picture
    }
    console.log(data)
    const info = await infoFollowing()
    followers.textContent = info.followersCount
    following.textContent = info.followingCount
    document.querySelector(".profile-name-section h1").textContent = data.profile_username
    userTag.textContent = data.profile_tag
    avatarProfile.src = data.profile_picture
    bannerProfile.src = data.profile_banner
    addressInf.innerHTML = data.profile_address
    siteInf.textContent = data.profile_website
    metaLink.href = formatURL(data.profile_website);
    createdsInf.textContent = data.profile_createdAt
    description.textContent = ((data.profile_description ? data.profile_description : "Sem bio ainda"))
    closeLoading()
    checkFollow(data.profile_tag)
}

async function postsUser() {
    const postSection = document.querySelector(".post-section")
    const numberPosts = document.querySelector("#numberPosts")
    const targetTag = localStorage.getItem("profile_tag")
    const res = await fetch(`http://localhost:8008/posts/${encodeURIComponent(targetTag)}`);
    const posts = await res.json();

    postSection.innerHTML = "";

    if (!posts.length) {
        postSection.textContent = "Nenhum post encontrado.";
        return;
    }
    numberPosts.textContent = posts.length
    posts.forEach(post => {
        const postDiv = document.createElement("div");
        postDiv.className = "post";

        const postHeader = document.createElement("div");
        postHeader.className = "post-header";

        const userTag = post.user_tag;
        const cleanTag = userTag.replace("#", "");
        postHeader.innerHTML = `
                <div class="post-profile">
                    <div class="post-profile-image">
                        <a href="profile.html?tag=${cleanTag}"><img src=${post.profile_picture} alt="avatar"></a>
                    </div>
                    <div class="post-profile-info">
                        <a href="profile.html?tag=${cleanTag}">
                            <h3>${post.username}</h3>
                        </a>
                        <a href="profile.html?tag=${cleanTag}">
                            <p>@${post.user_tag}</p>
                        </a>
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

function formatURL(url) {
    if (!url) return "#";
    url = url.trim();
    if (!/^https?:\/\//i.test(url)) {
        url = "https://" + url;
    }
    return url;
}
