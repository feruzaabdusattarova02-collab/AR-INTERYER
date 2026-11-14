
const scene = document.querySelector("a-scene");

let tanlanganModel = "divan";
let tanlanganObyekt = null;

const modellar = {
    divan: "#divanModel",
    stul: "#stulModel",
    stol: "#stolModel"
};

// Model tanlash
function modelTanlash(nom) {
    tanlanganModel = nom;

    document.getElementById("holat").textContent =
        nom.toUpperCase() + " tanlandi. Endi ekranga teging.";

}

// AR rejimini boshlash
document.getElementById("arButton").addEventListener("click", async () => {
    try {
        await scene.enterVR();

        document.getElementById("holat").textContent =
            "AR rejimi ishga tushdi. Polni aniqlashni kuting.";

    } catch (xato) {
        document.getElementById("holat").textContent =
            "AR ishga tushmadi. HTTPS va mos qurilmani tekshiring.";
        console.error(xato);
    }
});

// Ekranga teginganda model joylashtirish
scene.addEventListener("select", () => {
    const reticle = document.querySelector("#reticle");

    if (!reticle || !reticle.object3D.visible) {
        return;
    }

    const model = document.createElement("a-entity");

    model.setAttribute("gltf-model", modellar[tanlanganModel]);
    model.setAttribute("scale", "0.5 0.5 0.5");
    model.setAttribute("position",
        reticle.object3D.position);
    model.setAttribute("rotation",
        reticle.object3D.rotation);

    model.setAttribute("class", "mebel");

    model.addEventListener("click", () => {
        tanlanganObyekt = model;
    });

    scene.appendChild(model);
    tanlanganObyekt = model;

    document.getElementById("holat").textContent =
        "Mebel sahnaga joylashtirildi.";
});

// Tanlangan modelni burish
document.getElementById("rotateButton").addEventListener("click", () => {
    if (tanlanganObyekt) {
        const rotation = tanlanganObyekt.getAttribute("rotation");
        tanlanganObyekt.setAttribute("rotation", {
            x: rotation.x,
            y: rotation.y + 30,
            z: rotation.z
        });
    }
});

// Modelni kattalashtirish
document.getElementById("scaleButton").addEventListener("click", () => {
    if (tanlanganObyekt) {
        const scale = tanlanganObyekt.getAttribute("scale");

        const yangi = Math.min(scale.x + 0.1, 2);

        tanlanganObyekt.setAttribute("scale", {
            x: yangi,
            y: yangi,
            z: yangi
        });
    }
});

// Modelni o‘chirish
document.getElementById("deleteButton").addEventListener("click", () => {
    if (tanlanganObyekt) {
        tanlanganObyekt.remove();
        tanlanganObyekt = null;
    }
});

// Barcha modellarni o‘chirish
document.getElementById("clearButton").addEventListener("click", () => {
    document.querySelectorAll(".mebel").forEach(model => {
        model.remove();
    });

    tanlanganObyekt = null;

    document.getElementById("holat").textContent =
        "Sahna tozalandi.";
});
