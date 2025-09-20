const avatarProfile = document.querySelector("#img-profile")
const bannerProfile = document.querySelector("#cover-img")
const picHeader = document.querySelector("#pic-header")
const addressInf = document.querySelector("#addressInfo")
const siteInf = document.querySelector("#siteInf")
const createdsInf = document.querySelector("#createdInf")
const metaLink = document.querySelector(".meta-link")
const description = document.querySelector(".profile-bio p")
import getAccessToken from "./getAccessToken.js";
import getDataProfile from "./api-request-profile.js";

window.addEventListener("load", async () => {
    const token = await getAccessToken();
    const data = await getDataProfile(token)
    dataRefresh(data)
});

function dataRefresh(data) {
    console.log(data)
    document.querySelector(".profile-name-section h1").textContent = data.profile_username
    picHeader.src = data.profile_picture
    avatarProfile.src = data.profile_picture
    bannerProfile.src = data.profile_banner
    addressInf.innerHTML = data.profile_address
    siteInf.textContent = data.profile_website
    metaLink.href = formatURL(data.profile_website);
    createdsInf.textContent = data.profile_createdAt
    description.textContent = ((data.profile_description ? data.profile_description : "Sem bio ainda"))
}

    function formatURL(url) {
        if (!url) return "#";
        url = url.trim();    
        if (!/^https?:\/\//i.test(url)) {
            url = "https://" + url;
        }
        return url;
    }