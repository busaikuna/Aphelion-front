class ProfileModal {
  constructor() {
    this.modal = document.getElementById("modalOverlay")
    this.openBtn = document.getElementById("openModal")
    this.closeBtns = document.querySelectorAll("#closeModal")
    this.saveBtn = document.getElementById("saveBtn")
    this.form = document.getElementById("profileForm")
    this.message = document.getElementById("message")
    this.profileUpload = document.getElementById("profileUpload")
    this.bannerUpload = document.getElementById("bannerUpload")
    this.profileInput = document.getElementById("profilePicture")
    this.bannerInput = document.getElementById("bannerPicture")
    this.profilePreview = document.getElementById("profilePreviewImg")
    this.bannerPreview = document.getElementById("bannerPreviewImg")
    this.removeProfileBtn = document.getElementById("removeProfile")
    this.removeBannerBtn = document.getElementById("removeBanner")

    this.descriptionField = document.getElementById("description")
    this.charCounter = document.getElementById("charCount")

    this.init()
  }

  init() {
    this.bindEvents()
    this.setupImagePreviews()
    this.setupCharCounter()
  }

  bindEvents() {
    this.openBtn?.addEventListener("click", () => this.openModal())
    this.closeBtns.forEach((btn) => {
      btn.addEventListener("click", () => this.closeModal())
    })

    this.modal?.addEventListener("click", (e) => {
      if (e.target === this.modal) {
        this.closeModal()
      }
    })

    this.saveBtn?.addEventListener("click", () => this.saveProfile())

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.modal?.classList.contains("active")) {
        this.closeModal()
      }
    })
  }

  setupImagePreviews() {
    this.profileUpload?.addEventListener("click", () => {
      this.profileInput?.click()
    })

    this.profileInput?.addEventListener("change", (e) => {
      this.handleImagePreview(e.target.files[0], "profile")
    })

    this.removeProfileBtn?.addEventListener("click", (e) => {
      e.stopPropagation()
      this.removeImage("profile")
    })

    this.bannerUpload?.addEventListener("click", () => {
      this.bannerInput?.click()
    })

    this.bannerInput?.addEventListener("change", (e) => {
      this.handleImagePreview(e.target.files[0], "banner")
    })

    this.removeBannerBtn?.addEventListener("click", (e) => {
      e.stopPropagation()
      this.removeImage("banner")
    })
  }

  setupCharCounter() {
    this.descriptionField?.addEventListener("input", (e) => {
      const length = e.target.value.length
      const maxLength = 160

      this.charCounter.textContent = length

      const counter = this.charCounter.parentElement
      counter.classList.remove("warning", "danger")

      if (length > maxLength * 0.8) {
        counter.classList.add("warning")
      }
      if (length > maxLength * 0.95) {
        counter.classList.add("danger")
      }
    })
  }

  handleImagePreview(file, type) {
    if (!file) return

    if (!file.type.startsWith("image/")) {
      this.showMessage("Por favor, selecione apenas arquivos de imagem.", "error")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      this.showMessage("A imagem deve ter no máximo 5MB.", "error")
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      if (type === "profile") {
        this.profilePreview.src = e.target.result
        this.profilePreview.style.display = "block"
        this.removeProfileBtn.style.display = "block"
        this.profileUpload.querySelector(".preview-placeholder").style.display = "none"
      } else if (type === "banner") {
        this.bannerPreview.src = e.target.result
        this.bannerPreview.style.display = "block"
        this.removeBannerBtn.style.display = "block"
        this.bannerUpload.querySelector(".preview-placeholder").style.display = "none"
      }
    }
    reader.readAsDataURL(file)
  }

  removeImage(type) {
    if (type === "profile") {
      this.profileInput.value = ""
      this.profilePreview.style.display = "none"
      this.removeProfileBtn.style.display = "none"
      this.profileUpload.querySelector(".preview-placeholder").style.display = "flex"
    } else if (type === "banner") {
      this.bannerInput.value = ""
      this.bannerPreview.style.display = "none"
      this.removeBannerBtn.style.display = "none"
      this.bannerUpload.querySelector(".preview-placeholder").style.display = "flex"
    }
  }

  openModal() {
    this.modal?.classList.add("active")
    document.body.style.overflow = "hidden"
    this.loadCurrentData()
  }

  closeModal() {
    this.modal?.classList.remove("active")
    document.body.style.overflow = ""
    this.resetForm()
  }

  loadCurrentData() {
    const username = document.querySelector(".profile-name-section h1")?.textContent || ""
    const address = document.getElementById("addressInfo")?.textContent || ""
    const website = document.getElementById("siteInf")?.href || ""
    const bio = document.querySelector(".profile-bio p")?.textContent || ""

    document.getElementById("username").value = username
    document.getElementById("address").value = address
    document.getElementById("website").value = website
    document.getElementById("description").value = bio

    this.charCounter.textContent = bio.length
  }

  async saveProfile() {
    const saveText = document.getElementById("saveText")
    const loading = document.getElementById("loading")

    saveText.style.display = "none"
    loading.style.display = "inline-block"
    this.saveBtn.disabled = true

    try {
      const formData = new FormData()

      formData.append("token", sessionStorage.getItem("accessToken"))
      formData.append("username", document.getElementById("username").value)
      formData.append("address", document.getElementById("address").value)
      formData.append("website", document.getElementById("website").value)
      formData.append("description", document.getElementById("description").value)

      if (this.profileInput.files[0]) {
        formData.append("profile_picture", this.profileInput.files[0])
      }
      if (this.bannerInput.files[0]) {
        formData.append("banner_picture", this.bannerInput.files[0])
      }
      const response = await fetch("http://localhost:8008/users/profile/edit", {
        method: "PUT",
        body: formData,
      })

      const result = await response.json()

      if (response.ok) {
        this.showMessage("Perfil atualizado com sucesso!", "success")
        setTimeout(() => {
          this.closeModal()
          window.location.reload()
        }, 1500)
      } else {
        throw new Error(result.message || "Erro ao atualizar perfil")
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      this.showMessage(error.message || "Erro ao atualizar perfil. Tente novamente.", "error")
    } finally {
      saveText.style.display = "inline"
      loading.style.display = "none"
      this.saveBtn.disabled = false
    }
  }

  showMessage(text, type) {
    this.message.textContent = text
    this.message.className = `message ${type}`
    this.message.style.display = "block"

    setTimeout(() => {
      this.message.style.display = "none"
    }, 5000)
  }

  resetForm() {
    this.form?.reset()
    this.removeImage("profile")
    this.removeImage("banner")
    this.message.style.display = "none"
    this.charCounter.textContent = "0"
    this.charCounter.parentElement.classList.remove("warning", "danger")
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new ProfileModal()
})
