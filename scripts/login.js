function hashPassword(pass) {
    return CryptoJS.MD5(pass).toString();
}

function setInvalid(input, feedbackEl, msg) {
    input.classList.add("is-invalid");
    input.classList.remove("is-valid");
    if (feedbackEl) feedbackEl.textContent = msg;
    document.getElementById("errorMsg").textContent =
        "Proveri polja označena crveno.";
    return false;
}

function setValid(input) {
    input.classList.add("is-valid");
    input.classList.remove("is-invalid");
}

function clearState(input, feedbackEl) {
    input.classList.remove("is-valid", "is-invalid");
    if (feedbackEl) feedbackEl.textContent = "";
}

function validateBasic() {
    const emailEl = document.getElementById("loginUser");
    const passEl = document.getElementById("loginPass");

    const userFeedback = document.getElementById("userFeedback");
    const passFeedback = document.getElementById("passFeedback");
    const errorMsg = document.getElementById("errorMsg");

    const email = emailEl.value.trim();
    const pass = passEl.value;

    clearState(emailEl, userFeedback);
    clearState(passEl, passFeedback);
    errorMsg.textContent = "";

    if (email === "")
        return setInvalid(emailEl, userFeedback, "Email mora biti unet.");
    if (!email.includes("@"))
        return setInvalid(emailEl, userFeedback, "Email nije validan.");

    if (pass === "")
        return setInvalid(passEl, passFeedback, "Lozinka mora biti uneta.");
    if (pass.length < 3)
        return setInvalid(
            passEl,
            passFeedback,
            "Lozinka mora imati bar 3 karaktera.",
        );

    setValid(emailEl);
    setValid(passEl);
    return true;
}

async function handleSubmit(e) {
    e.preventDefault();

    if (!validateBasic()) return false;

    const emailEl = document.getElementById("loginUser");
    const passEl = document.getElementById("loginPass");
    const errorMsg = document.getElementById("errorMsg");

    const email = emailEl.value.trim();
    const pass = passEl.value;

    let data;
    try {
        const res = await fetch("users.json", { cache: "no-store" });
        data = await res.json();
    } catch (err) {
        errorMsg.textContent =
            "Ne mogu da učitam users.json. Pokreni preko Live Server-a.";
        return false;
    }

    const user = data.users.find((u) => u.email === email);

    if (!user) {
        return setInvalid(
            emailEl,
            document.getElementById("userFeedback"),
            "Korisnik ne postoji.",
        );
    }

    const inputHash = hashPassword(pass);

    if (inputHash !== user.passwordHash) {
        return setInvalid(
            passEl,
            document.getElementById("passFeedback"),
            "Pogrešna lozinka.",
        );
    }

    setValid(emailEl);
    setValid(passEl);
    errorMsg.classList.remove("text-danger");
    errorMsg.classList.add("text-success");
    errorMsg.textContent = "Login uspešan!";
    return false;
}

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm");
    const emailEl = document.getElementById("loginUser");
    const passEl = document.getElementById("loginPass");

    emailEl.addEventListener("input", validateBasic);
    passEl.addEventListener("input", validateBasic);

    form.addEventListener("submit", handleSubmit);
});
