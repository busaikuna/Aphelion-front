const avatarProfile = document.querySelector("#img-profile")
const bannerProfile = document.querySelector("#cover-img")
const picHeader = document.querySelector("#pic-header")
const addressInf = document.querySelector("#addressInfo")
const siteInf = document.querySelector("#siteInf")
const createdsInf = document.querySelector("#createdInf")
const metaLink = document.querySelector(".meta-link")
const description = document.querySelector(".profile-bio p")

import getAccessToken from "./getAccessToken.js";
import { getDataProfile, getUserProfile } from "./api-request-profile.js";
import closeLoading from "./loading.js"

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
            anotherUser = true
        } else {
            data = await getDataProfile(token);
        }
    } else {
        data = await getDataProfile(token);
    }

    dataRefresh(data);
});


function dataRefresh(data) {
    if (anotherUser) {
        picHeader.src = localStorage.getItem("userPicture")
    } else {
        picHeader.src = data.profile_picture
    }
    console.log(data)
    document.querySelector(".profile-name-section h1").textContent = data.profile_username
    avatarProfile.src = data.profile_picture
    bannerProfile.src = data.profile_banner
    addressInf.innerHTML = data.profile_address
    siteInf.textContent = data.profile_website
    metaLink.href = formatURL(data.profile_website);
    createdsInf.textContent = data.profile_createdAt
    description.textContent = ((data.profile_description ? data.profile_description : "Sem bio ainda"))
    closeLoading()
}

function formatURL(url) {
    if (!url) return "#";
    url = url.trim();
    if (!/^https?:\/\//i.test(url)) {
        url = "https://" + url;
    }
    return url;
}
