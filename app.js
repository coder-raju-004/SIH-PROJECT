const URL = "model/";
let model, maxPredictions;

async function init() {
    try {
        model = await tmImage.load(URL + "model.json", URL + "metadata.json");
        maxPredictions = model.getTotalClasses();
        console.log("✅ Model loaded!");
    } catch (error) {
        console.error("❌ Model load error:", error);
    }
}

async function predict(image) {
    try {
        const prediction = await model.predict(image);
        const resultDiv = document.getElementById("result");
        resultDiv.innerHTML = "";

        let top = prediction.reduce((prev, curr) =>
            curr.probability > prev.probability ? curr : prev, prediction[0]);

        prediction.forEach(p => {
            const card = document.createElement("div");
            card.classList.add("prediction-card");
            if (p.className === top.className) {
                card.classList.add("top");
            }

            const nameEl = document.createElement("div");
            nameEl.classList.add("prediction-name");
            nameEl.innerText = p.className;

            const probEl = document.createElement("div");
            probEl.classList.add("prediction-prob");
            probEl.innerText = (p.probability * 100).toFixed(2) + "%";

            const barBg = document.createElement("div");
            barBg.classList.add("prediction-bar-bg");

            const barFill = document.createElement("div");
            barFill.classList.add("prediction-bar-fill");
            setTimeout(() => {
                barFill.style.width = (p.probability * 100) + "%";
            }, 50);

            barBg.appendChild(barFill);
            card.appendChild(nameEl);
            card.appendChild(probEl);
            card.appendChild(barBg);

            resultDiv.appendChild(card);
        });
    } catch (error) {
        console.error("Prediction error:", error);
    }
}

let uploadedImage = null;

document.getElementById("imageUpload").addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.getElementById("preview");
            img.src = e.target.result;
            img.style.display = "block";
            uploadedImage = img;
        };
        reader.readAsDataURL(file);
    }
});

// Start Prediction Button
document.getElementById("startBtn").addEventListener("click", () => {
    if (uploadedImage) {
        predict(uploadedImage);
    } else {
        alert("⚠️ Please upload an image first!");
    }
});

init();
