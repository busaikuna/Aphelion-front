        function toggleMobileMenu() {
            const sidebar = document.getElementById('sidebar');
            const overlay = document.querySelector('.sidebar-overlay');
            
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
        }
        
        function closeMobileMenu() {
            const sidebar = document.getElementById('sidebar');
            const overlay = document.querySelector('.sidebar-overlay');
            
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
        }
        
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                closeMobileMenu();
            }
        });
        
        function openModal() {
            document.getElementById('newPostModal').style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
        
        function closeModal() {
            document.getElementById('newPostModal').style.display = 'none';
            document.body.style.overflow = 'auto';
            document.getElementById('newPostForm').reset();
            document.getElementById('imagePreview').innerHTML = '';
        }
        
        function previewImage(event) {
            const file = event.target.files[0];
            const preview = document.getElementById('imagePreview');
            
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    preview.innerHTML = `
                        <div class="preview-container">
                            <img src="${e.target.result}" alt="Preview">
                            <button type="button" class="remove-image" onclick="removeImage()">×</button>
                        </div>
                    `;
                };
                reader.readAsDataURL(file);
            }
        }
        
        function removeImage() {
            document.getElementById('postImage').value = '';
            document.getElementById('imagePreview').innerHTML = '';
        }
        
        window.onclick = function(event) {
            const modal = document.getElementById('newPostModal');
            if (event.target === modal) {
                closeModal();
            }
        }