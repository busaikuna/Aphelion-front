document.getElementById('newPostForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const content = document.getElementById('postContent').value;
    const imageFile = document.getElementById('postImage').files[0];
    const token = sessionStorage.getItem("accessToken");

    if (!token || !content) {
        alert("Você precisa estar logado e preencher o conteúdo!");
        return;
    }

    const formData = new FormData();
    formData.append("token", token);
    formData.append("content", content);
    formData.append("description", "");
    if (imageFile) formData.append("picture", imageFile);

    try {
        const response = await fetch('http://localhost:8008/posts', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            closeModal();
            location.reload();
        } else {
            const errData = await response.json();
            alert(errData.error || 'Erro ao criar post');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Erro ao criar post. Tente novamente.');
    }
});
