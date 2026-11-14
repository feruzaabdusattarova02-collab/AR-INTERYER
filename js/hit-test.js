
const scene = document.querySelector("a-scene");
const holat = document.getElementById("holat");

let tanlanganModel = "divan";
let tanlanganObyekt = null;

const modellar = {
    divan: "#divanModel",
    stul: "#stulModel",
    stol: "#stolModel"
};

function xabar(matn) {
    holat.textContent = matn;
}

// Mebel tanlash
function modelTanlash(nom) {
    tanlanganModel = nom;
    xabar(nom.toUpperCase() + " tanlandi. AR ekraniga teging.");
}

// AR rejimini boshlash
document.getElementById("arButton").addEventListener("click", async () => {
    xabar("AR qurilmasi tekshirilmoqda...");

    try {
        if (!navigator.xr) {
            xabar("Bu brauzer WebXR AR ni qo'llab-quvvatlamaydi.");
            return;
        }

        const mavjud = await navigator.xr.isSessionSupported("immersive-ar");

        if (!mavjud) {
            xabar("Telefoningiz immersive AR rejimini qo'llab-quvvatlamaydi.");
            return;
        }

        const session = await navigator.xr.requestSession("immersive-ar", {
            requiredFeatures: ["hit-test"],
            optionalFeatures: ["local-floor", "dom-overlay"],
            domOverlay: { root: document.body }
        });

        await scene.enterVR();

        xabar("AR rejimi ishga tushdi. Polni aniqlang.");

    } catch (xato) {
        console.error(xato);
        xabar("AR xatosi: " + xato.message);
    }
});

// Ekranga teginganda mebel joylashtirish
scene.addEventListener("select", () => {
    const reticle = document.querySelector("#reticle");

    if (!reticle || !reticle.object3D.visible) {
        xabar("Pol aniqlanmadi. Telefonni polga qarating.");
        return;
    }

    const model = document.createElement("a-entity");

    model.setAttribute("gltf-model", modellar[tanlanganModel]);
    model.setAttribute("scale", "0.5 0.5 0.5");
    model.object3D.position.copy(reticle.object3D.position);
    model.object3D.quaternion.copy(reticle.object3D.quaternion);
    model.classList.add("mebel");

    model.addEventListener("model-loaded", () => {
        xabar("Mebel joylashtirildi.");
    });

    model.addEventListener("model-error", () => {
        xabar("3D model topilmadi. GLB fayllarini tekshiring.");
    });

    scene.appendChild(model);
    tanlanganObyekt = model;
});

// Mebelni burish
document.getElementById("rotateButton").addEventListener("click", () => {
    if (!tanlanganObyekt) {
        xabar("Avval mebel joylashtiring.");
        return;
    }

    const r = tanlanganObyekt.getAttribute("rotation");

    tanlanganObyekt.setAttribute("rotation", {
        x: r.x,
        y: r.y + 30,
        z: r.z
    });
});

// Kattalashtirish
document.getElementById("scaleButton").addEventListener("click", () => {
    if (!tanlanganObyekt) {
        xabar("Avval mebel joylashtiring.");
        return;
    }

    const s = tanlanganObyekt.getAttribute("scale");
    const yangi = Math.min(s.x + 0.1, 2);

    tanlanganObyekt.setAttribute("scale", {
        x: yangi,
        y: yangi,
        z: yangi
    });
});

// Mebelni o'chirish
document.getElementById("deleteButton").addEventListener("click", () => {
    if (tanlanganObyekt) {
        tanlanganObyekt.remove();
        tanlanganObyekt = null;
        xabar("Mebel o'chirildi.");
    }
});

// Sahna tozalash
document.getElementById("clearButton").addEventListener("click", () => {
    document.querySelectorAll(".mebel").forEach(model => model.remove());
    tanlanganObyekt = null;
    xabar("Barcha mebellar o'chirildi.");
});
