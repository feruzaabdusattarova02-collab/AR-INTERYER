
const scene = document.querySelector("a-scene");

let tanlanganModel = "divan";
let tanlanganObyekt = null;

const modellar = {
    divan: "#divanModel",
    stul: "#stulModel",
    stol: "#stolModel"
};

// Holat matnini o'zgartirish
function holatYoz(matn) {
    document.getElementById("holat").textContent = matn;
}

// Mebel tanlash
function modelTanlash(nom) {
    tanlanganModel = nom;
    holatYoz(nom.toUpperCase() + " tanlandi. Endi AR ekraniga teging.");
}

// AR rejimini boshlash
document.getElementById("arButton").addEventListener("click", async () => {
    try {
        if (typeof scene.enterAR === "function") {
            await scene.enterAR();
            holatYoz("AR rejimi ishga tushdi. Polni aniqlang.");
        } else {
            holatYoz("Ushbu qurilmada AR rejimi qo'llab-quvvatlanmaydi.");
        }
    } catch (xato) {
        console.error("AR xatosi:", xato);
        holatYoz("AR ishga tushmadi. HTTPS va mos telefonni tekshiring.");
    }
});

// AR ekraniga teginganda mebel joylashtirish
scene.addEventListener("select", () => {
    const reticle = document.querySelector("#reticle");

    if (!reticle || !reticle.object3D.visible) {
        holatYoz("Avval polni aniqlang.");
        return;
    }

    const model = document.createElement("a-entity");

    model.setAttribute("gltf-model", modellar[tanlanganModel]);
    model.setAttribute("scale", "0.5 0.5 0.5");
    model.object3D.position.copy(reticle.object3D.position);
    model.object3D.rotation.copy(reticle.object3D.rotation);
    model.classList.add("mebel");

    model.addEventListener("model-error", () => {
        holatYoz("3D model topilmadi. GLB faylini tekshiring.");
    });

    model.addEventListener("model-loaded", () => {
        holatYoz("Mebel muvaffaqiyatli joylashtirildi.");
    });

    scene.appendChild(model);
    tanlanganObyekt = model;
});

// Mebelni burish
document.getElementById("rotateButton").addEventListener("click", () => {
    if (!tanlanganObyekt) {
        holatYoz("Avval mebel joylashtiring.");
        return;
    }

    const r = tanlanganObyekt.getAttribute("rotation");

    tanlanganObyekt.setAttribute("rotation", {
        x: r.x,
        y: r.y + 30,
        z: r.z
    });
});

// Mebelni kattalashtirish
document.getElementById("scaleButton").addEventListener("click", () => {
    if (!tanlanganObyekt) {
        holatYoz("Avval mebel joylashtiring.");
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

// Tanlangan mebelni o'chirish
document.getElementById("deleteButton").addEventListener("click", () => {
    if (tanlanganObyekt) {
        tanlanganObyekt.remove();
        tanlanganObyekt = null;
        holatYoz("Mebel o'chirildi.");
    } else {
        holatYoz("O'chirish uchun mebel tanlanmagan.");
    }
});

// Barcha mebellarni o'chirish
document.getElementById("clearButton").addEventListener("click", () => {
    document.querySelectorAll(".mebel").forEach(model => {
        model.remove();
    });

    tanlanganObyekt = null;
    holatYoz("Barcha mebellar o'chirildi.");
});
