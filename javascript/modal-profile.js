import getAccessToken from "./getAccessToken.js";
import getDataProfile from "./api-request-profile.js"
const openModalButton = document.querySelector("#openModal")
const BannerInput = document.querySelector("#bannerPicture")
const profilePicture = document.querySelector("#profilePicture")
const bannerUpload = document.querySelector("#bannerUpload")
const saveBtn = document.querySelector("#saveBtn")
const profileUpload = document.querySelector("#profileUpload")
const closeModalBtn = document.querySelector("#closeModal")

openModalButton.addEventListener("click", ()=>{
    openModal()
})
BannerInput.addEventListener("change", (e) => {
    handleImageUpload(e.target, 'banner')
});
bannerUpload.addEventListener("click", ()=>{
    document.getElementById('bannerPicture').click()
})
saveBtn.addEventListener("click", ()=>{
    saveProfile()
})
profilePicture.addEventListener("change", (e) => {
    handleImageUpload(e.target, 'profile')
});
profileUpload.addEventListener("click", ()=>{
    document.getElementById('profilePicture').click()
})
closeModalBtn.addEventListener("click", ()=>{
    closeModal()
})


async function openModal() {
    document.getElementById('modalOverlay').classList.add('active');
    document.body.style.overflow = 'hidden';
    const token = await getAccessToken()
    const data = await getDataProfile(token)

    loadCurrentProfile(data);
}

function closeModal() {
    document.getElementById('modalOverlay').classList.remove('active');
    document.body.style.overflow = 'auto';
    clearForm();
}

document.getElementById('modalOverlay').addEventListener('click', function (e) {
    if (e.target === this) {
        closeModal();
    }
});

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});
function handleImageUpload(input, type) {
    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            input.dataset.base64 = e.target.result;

            const uploadArea = input.parentElement;
            const textElement = uploadArea.querySelector('.image-upload-text');
            textElement.textContent = `✓ ${file.name}`;
            uploadArea.style.borderColor = 'var(--ring)';
        };
        reader.readAsDataURL(file);
    }
}

function loadCurrentProfile(data) {
    document.getElementById('username').value = data.profile_username;
    document.getElementById('address').value = data.profile_address;
    document.getElementById('website').value = data.profile_website;
}

function clearForm() {
    document.getElementById('profileForm').reset();

    const uploadAreas = document.querySelectorAll('.image-upload');
    uploadAreas.forEach(area => {
        const textElement = area.querySelector('.image-upload-text');
        textElement.textContent = 'Clique para selecionar';
        area.style.borderColor = 'var(--border)';
    });

    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => {
        delete input.dataset.base64;
    });

    hideMessage();
}

function showMessage(text, type = 'success') {
    const messageEl = document.getElementById('message');
    messageEl.textContent = text;
    messageEl.className = `message ${type}`;
    messageEl.style.display = 'block';

    setTimeout(() => {
        hideMessage();
    }, 5000);
}

function hideMessage() {
    const messageEl = document.getElementById('message');
    messageEl.style.display = 'none';
}

async function saveProfile() {
    const saveBtn = document.getElementById('saveBtn');
    const saveText = document.getElementById('saveText');
    const loading = document.getElementById('loading');

    saveBtn.disabled = true;
    saveText.style.display = 'none';
    loading.style.display = 'inline-block';

    try {
        const formData = new FormData();
        formData.append("token", sessionStorage.getItem("accessToken"));
        formData.append("username", document.getElementById("username").value);
        formData.append("address", document.getElementById("address").value);
        formData.append("website", document.getElementById("website").value);

        const profileFile = document.getElementById("profilePicture").files[0];
        const bannerFile = document.getElementById("bannerPicture").files[0];

        if (profileFile) {
            formData.append("profile_picture", profileFile);
        }
        if (bannerFile) {
            formData.append("banner_picture", bannerFile);
        }

        const response = await fetch("http://localhost:8008/users/profile/edit", {
            method: "PUT",
            body: formData 
        });

        const result = await response.json();
        console.log("📡 Resposta backend:", result);

        if (response.ok && result.success) {
            showMessage("Perfil atualizado com sucesso!", "success");

            setTimeout(() => {
                closeModal();
                window.location.reload();
            }, 2000);
        } else {
            throw new Error(result.error || "Erro ao atualizar perfil");
        }

    } catch (error) {
        console.error("Error updating profile:", error);
        showMessage(error.message || "Erro ao atualizar perfil. Tente novamente.", "error");
    } finally {
        saveBtn.disabled = false;
        saveText.style.display = "inline";
        loading.style.display = "none";
    }
}


window.addEventListener('load', function () {
    const originalFetch = window.fetch;
    window.fetch = function (url, options) {
        if (url === '/api/users/profile/edit') {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve({
                        ok: true,
                        json: () => Promise.resolve({ success: true, user: {} })
                    });
                }, 1500);
            });
        }
        return originalFetch.apply(this, arguments);
    };
});