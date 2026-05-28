const DEFAULT_LANG = "sr";
let lang = localStorage.getItem("lang") || DEFAULT_LANG;
let dict = {};

function getValue(obj, path) {
    return path.split(".").reduce((o, k) => (o ? o[k] : null), obj);
}

function applyTranslations() {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
        const key = el.getAttribute("data-i18n");
        const value = getValue(dict, key);
        if (value !== null && value !== undefined) el.textContent = value;
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
        const key = el.getAttribute("data-i18n-placeholder");
        const value = getValue(dict, key);
        if (value !== null && value !== undefined)
            el.setAttribute("placeholder", value);
    });
}

async function loadLang(nextLang) {
    try {
        const res = await fetch(`i18n/${nextLang}.json`);
        dict = await res.json();
        lang = nextLang;
        localStorage.setItem("lang", lang);
        applyTranslations();
    } catch (e) {
        console.error("i18n load error:", e);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("translateBtn");
    if (btn) {
        btn.addEventListener("click", () => {
            loadLang(lang === "sr" ? "en" : "sr");
        });
    }
    loadLang(lang);
});
