const proxyUrl = "https://api.allorigins.win/get?url=";
const apiUrl = encodeURIComponent("https://api.phishstats.info/api/phishing");

fetch(`${proxyUrl}${apiUrl}`)
    .then((response) => {
        if (response.ok) return response.json();
        throw new Error("Mrežni odgovor nije bio u redu.");
    })
    .then((wrapper) => {
        // allorigins proxy pakuje originalni odgovor u string unutar "contents" polja
        const data = JSON.parse(wrapper.contents);

        prikaziKartice(data.slice(0, 15));
        prikaziTabelu(data.slice(0, 10));
    })
    .catch((error) => {
        prikaziGresku();
        console.error("Greška pri povlačenju API podataka:", error);
    });

function prikaziKartice(podaci) {
    const container = document.getElementById("apiData");
    container.innerHTML = "";

    podaci.forEach((item) => {
        const card = document.createElement("div");
        card.className = "card mb-3";

        card.innerHTML = `
      <div class="card-body">
        <h5 class="card-title">${item.url}</h5>
        <p class="card-text">
          <strong>IP:</strong> ${item.ip || "—"}<br>
          <strong>Country:</strong> ${item.countrycode || "—"}<br>
          <strong>Date:</strong> ${item.date || "—"}
        </p>
      </div>
    `;

        container.appendChild(card);
    });
}

function prikaziTabelu(podaci) {
    const tbody = document.getElementById("apiRows");
    tbody.innerHTML = "";

    podaci.forEach((item) => {
        const row = document.createElement("tr");

        row.innerHTML = `
      <td>${item.date || "—"}</td>
      <td>
        <a href="${item.url}" target="_blank" class="text-decoration-none">
          ${item.url}
        </a>
      </td>
      <td>${item.title || "Unknown brand"}</td>
      <td>${item.countrycode || "—"}</td>
    `;

        tbody.appendChild(row);
    });
}

function prikaziGresku() {
    document.getElementById("apiData").innerHTML =
        "<p class='text-danger'>Failed to load API data.</p>";

    document.getElementById("apiRows").innerHTML = `
    <tr>
      <td colspan="4" class="text-danger text-center">
        Failed to load API data.
      </td>
    </tr>
  `;
}
