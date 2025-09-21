export function closeLoading() {
    document.querySelector("#loading").style.display = "none"
    document.body.style.overflow = "auto"
}

export function fullscreen(){
    const imgsPosts = document.querySelectorAll(".media-content img")
    const fullscreenDiv = document.querySelector("#fullscreen")
    const fullscreenImg = document.querySelector("#fullscreen img")
    const closeFullscreen = document.querySelector("#fullscreen span")

    imgsPosts.forEach((img) =>{
        img.addEventListener("click", ()=>{
            fullscreenImg.src = img.src
            fullscreenDiv.style.display = "flex"
        })
    })

    closeFullscreen.addEventListener("click", ()=>{
        fullscreenDiv.style.display = "none"
    })

}
