document.getElementById("activityImage").addEventListener("change", function (event) {
    const file = event.target.files[0];
    const previewContainer = document.getElementById("imagePreview");

    // Clear previous image (if any)
    previewContainer.innerHTML = "";

    if (file) {
        const img = document.createElement("img");
        img.src = URL.createObjectURL(file);
        img.style.width = "200px"; // 🔹 Smaller preview
        img.style.borderRadius = "10px";
        img.style.marginTop = "10px";
        img.classList.add("img-thumbnail");

        previewContainer.appendChild(img);
    }
});