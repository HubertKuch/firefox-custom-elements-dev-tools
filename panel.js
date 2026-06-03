// panel.js
const go = new Go();

// Funkcja, która zostanie wstrzyknięta i wykonana bezpośrednio na OGLĄDANEJ STRONIE
// Musi zwracać prosty string (np. JSON), żeby nie było problemów z przesyłaniem obiektów
function getWebComponentsFromPage() {
  // Szukamy wszystkich elementów na stronie, które mają myślnik w nazwie (Custom Elements)
  const allElements = Array.from(document.querySelectorAll('*'));
  const customElements = allElements
    .map(el => el.tagName.toLowerCase())
    .filter(name => name.includes('-'));

  // Usuwamy duplikaty
  const uniqueComponents = [...new Set(customElements)];

  // Zwracamy jako JSON string
  return JSON.stringify({
    url: window.location.href,
    components: uniqueComponents
  });
}

async function initWasm() {
  try {
    // 1. Ładowanie i uruchomienie WASM
    const result = await WebAssembly.instantiateStreaming(fetch("main.wasm"), go.importObject);
    go.run(result.instance);

    // 2. Pobieramy dane z oglądanej strony za pomocą interfejsu DevTools
    browser.devtools.inspectedWindow.eval(`(${getWebComponentsFromPage})()`, (pageData, isException) => {
      if (isException) {
        document.getElementById("output").innerText = "Błąd pobierania danych ze strony";
        return;
      }

      // 3. Przekazujemy surowe dane z losowej strony prosto do Twojego silnika w Go!
      const outputFromGo = window.analyzeComponentInGo(pageData);

      // 4. Wyświetlamy wynik działania Go na ekranie
      document.getElementById("output").innerText = outputFromGo;
    });

  } catch (err) {
    console.error("Błąd:", err);
    document.getElementById("output").innerText = "Błąd: " + err.message;
  }
}

initWasm();
