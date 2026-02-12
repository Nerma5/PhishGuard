function googleTranslateElementInit() {
    new google.translate.TranslateElement(
        {
            pageLanguage: "sr",
            includedLanguages: "sr,en",
            autoDisplay: false,
        },
        "google_translate_element",
    );
}

document.addEventListener("DOMContentLoaded", function () {
    const btn = document.getElementById("translateBtn");

    btn.addEventListener("click", function () {
        const select = document.querySelector("select.goog-te-combo");
        if (!select) return;

        // toggle SR <-> EN
        select.value = select.value === "en" ? "sr" : "en";
        select.dispatchEvent(new Event("change"));
    });
});
