const origin = document.querySelector('[name="9e88c78e"]');
const destination = document.querySelector('[name="b1abcc8d"]');
const weight = document.querySelector('[name="8309ee8b"]');
const width = document.querySelector('[name="e885f5b1"]');
const height = document.querySelector('[name="6b304310"]');
const length = document.querySelector('[name="fbe9528e"]');

origin.setAttribute("type", "number");
destination.setAttribute("type", "number");
weight.setAttribute("type", "number");
width.setAttribute("type", "number");
height.setAttribute("type", "number");
length.setAttribute("type", "number");

origin.setAttribute("oninput", "validateSizeCP(this)");
destination.setAttribute("oninput", "validateSizeCP(this)");
weight.setAttribute("oninput", "validateSizeDimensions(this)");
width.setAttribute("oninput", "validateSizeDimensions(this)");
height.setAttribute("oninput", "validateSizeDimensions(this)");
length.setAttribute("oninput", "validateSizeDimensions(this)");

function validateSizeCP(el) {
  if (el.value.length > 5) {
    el.value = el.value.slice(0, 5);
  }
}

function validateSizeDimensions(el) {
  if (el.value.length > 3) {
    el.value = el.value.slice(0, 3);
  }
}

const paqueteriaStyles = {
  dhl: {
    colors: "#FFC107",
    fontColors: "#e80000",
    borderColors: "#FFC107",
  },
  fedex: {
    colors: "#673AB7",
    fontColors: "#ffffff",
    borderColors: "#673AB7",
  },
  estafeta: {
    colors: "#dc3545",
    fontColors: "#ffffff",
    borderColors: "#dc3545",
  },
  jt: {
    colors: "#f5f5f5",
    fontColors: "#ff0606",
    borderColors: "#ff0606",
  },
  paquetexpress: {
    colors: "#000080",
    fontColors: "#ffffff",
    borderColors: "#000080",
  },
  odm: {
    colors: "#f5f5f5",
    fontColors: "#1e1e7c",
    borderColors: "#1e1e7c",
  },
  redpack: {
    colors: "#f5f5f5",
    fontColors: "#FF0000",
    borderColors: "#1e1e7c",
  },
};

function formJSON(nameForm) {
  var form = document.querySelector('[name="' + nameForm + '"]');
  var elements = form.querySelectorAll(
    'input:not([type="button"]), textarea, select'
  );
  var obj = {};

  elements.forEach(function (element) {
    var name = element.getAttribute("name");
    var value = element.value;

    switch (name) {
      case "9e88c78e":
        name = "origin";
        break;
      case "b1abcc8d":
        name = "destination";
        break;
      case "8309ee8b":
        name = "weight";
        break;
      case "e885f5b1":
        name = "width";
        break;
      case "6b304310":
        name = "height";
        break;
      case "fbe9528e":
        name = "length";
        break;
    }

    obj[name] = value;
  });

  return JSON.stringify(obj);
}

async function getToken() {
  const url = "https://marguzback.incpulses.com/?endpoint=user.login";
  const keys = {
    user: "PAGINA WEB MARGUZ",
    password: "PagWebMar23",
  };

  const body = JSON.stringify(keys);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body,
    });
    if (!response.ok) {
      throw new Error("Error en la solicitud");
    }
    const data = await response.json();
    return data.token;
  } catch (error) {
    return console.error("Error:", error);
  }
}

async function quoteParcel(token, form, parcel) {
  const url =
    "https://marguzback.incpulses.com/?endpoint=parcel." + parcel + ".quote";

  var form_data = JSON.parse(formJSON(form));
  form_data.deliveryType = "1";
  form_data.insurance = "0";
  form_data.client = "PAGINA WEB MARGUZ";

  var body = JSON.stringify({
    form_data,
  });

  console.log(body);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: body,
    });
    const data = await response.json();
    return data;
  } catch (error) {
    return console.error("Error:", error);
  }
}

function getQuote(form) {
  let token;
  let quote;

  let arrayParcels = [
    "dhl",
    "fedex",
    "estafeta",
    "jt",
    "paquetexpress",
    "odm",
    "redpack",
  ];

  if (
    origin.value === "" ||
    destination.value === "" ||
    weight.value === "" ||
    width.value === "" ||
    height.value === "" ||
    length.value === ""
  ) {
    alert("Por favor, complete todos los campos.");
    return false;
  }

  if (origin.value.length < 5 || destination.value.length < 5) {
    alert("Por favor, ingrese un código postal válido.");
    return false;
  }

  if (
    weight.value <= 0 ||
    width.value <= 0 ||
    height.value <= 0 ||
    length.value <= 0
  ) {
    alert("Por favor, ingrese valores mayores a 0.");
    return false;
  }

  getToken().then((t) => {
    token = t;
    console.log("Token:", token);

    createModal();

    arrayParcels.forEach((parcel) => {
      preDisplayQuoteInModal(parcel);
      quoteParcel(token, form, parcel).then((quote) => {
        console.log("Quote:", quote);
        displayQuoteInModal(quote, parcel);
      });
    });
  });
  return false;
}

function createModal() {
  const modal = document.createElement("div");
  modal.id = "modal";
  modal.style.display = "block";
  modal.style.position = "fixed";
  modal.style.top = "0";
  modal.style.left = "0";
  modal.style.width = "100%";
  modal.style.height = "100%";
  modal.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  modal.style.overflow = "auto";
  modal.style.zIndex = "999";
  modal.style.color = "#000";
  document.body.appendChild(modal);

  const headerContainer = document.createElement("div");
  headerContainer.style.display = "flex";
  headerContainer.style.justifyContent = "space-between";
  headerContainer.style.alignItems = "center";
  headerContainer.style.backgroundColor = "#e82014";
  headerContainer.style.padding = "10px";
  headerContainer.style.color = "#fff";
  headerContainer.style.fontWeight = "bold";
  headerContainer.style.fontSize = "30px";
  headerContainer.textContent = "Cotizaciones";
  modal.appendChild(headerContainer);

  const closeBtn = document.createElement("button");
  closeBtn.textContent = "Cerrar";
  closeBtn.style.backgroundColor = "#ff5252";
  closeBtn.style.border = "none";
  closeBtn.style.borderRadius = "8px";
  closeBtn.style.cursor = "pointer";
  closeBtn.style.color = "#fff";
  closeBtn.style.fontWeight = "bold";
  closeBtn.style.fontSize = "16px";
  closeBtn.style.transition = "background-color 0.3s";
  headerContainer.appendChild(closeBtn);

  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
    document.body.removeChild(modal);
  });

  closeBtn.addEventListener("mouseover", () => {
    closeBtn.style.backgroundColor = "#d50000";
  });

  closeBtn.addEventListener("mouseout", () => {
    closeBtn.style.backgroundColor = "#ff5252";
  });

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
      document.body.removeChild(modal);
    }
  });

  return false;
}

function preDisplayQuoteInModal(parcel) {
  const modal = document.getElementById("modal");

  let contentContainer;
  if (!document.getElementById("content-container")) {
    contentContainer = document.createElement("div");
    contentContainer.id = "content-container";
    contentContainer.style.padding = "20px";
    contentContainer.style.borderRadius = "8px";
    contentContainer.style.backgroundColor = "#f9f9f9";
    contentContainer.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.1)";
    contentContainer.style.margin = "5% auto";
    contentContainer.style.width = "70%";
    contentContainer.style.maxHeight = "70%";
    contentContainer.style.overflowY = "auto";
  } else {
    contentContainer = document.getElementById("content-container");
  }

  modal.appendChild(contentContainer);

  if (contentContainer.children.length === 0) {
    const h1 = document.createElement("h1");
    h1.style.color = "#252850";
    h1.textContent = "Envía hoy mismo desde:";
    h1.style.marginBottom = "10px";
    h1.style.marginLeft = "10px";
    h1.style.fontWeight = "bold";
    h1.id = "title";

    contentContainer.appendChild(h1);
  }

  const arrayServices = ["terrestre", "express"];

  arrayServices.forEach((service) => {
    const quoteContainer = document.createElement("div");
    quoteContainer.style.marginBottom = "10px";
    quoteContainer.style.padding = "15px";
    quoteContainer.id = parcel + "-" + service;

    const paragraph = document.createElement("label");
    paragraph.style.color = "#333333";
    paragraph.style.fontWeight = "bold";
    paragraph.style.fontSize = "20px";

    const paqueteriaStyle = paqueteriaStyles[parcel];
    if (paqueteriaStyle) {
      paragraph.style.padding = "10px";
      paragraph.style.paddingTop = "5px";
      paragraph.style.paddingBottom = "5px";
      paragraph.style.borderRadius = "8px";
      paragraph.style.color = paqueteriaStyle.fontColors;
      paragraph.style.backgroundColor = paqueteriaStyle.colors;
      paragraph.style.borderColor = paqueteriaStyle.borderColors;
      paragraph.style.borderWidth = "1px";
      paragraph.style.borderStyle = "solid";
    }

    if (parcel === "jt") parcel = "J&T Express";
    paragraph.textContent = parcel.toUpperCase();
    if (parcel === "J&T Express") parcel = "jt";

    quoteContainer.appendChild(paragraph);
    const br1 = document.createElement("br");
    const br2 = document.createElement("br");
    quoteContainer.appendChild(br1);
    quoteContainer.appendChild(br2);

    const loader = document.createElement("div");
    loader.className = "loader";
    loader.style.margin = "auto";
    loader.style.border = "4px solid rgba(255, 255, 255, 0.3)";
    loader.style.borderTop = "4px solid #e82014";
    loader.style.borderRadius = "50%";
    loader.style.width = "100px";
    loader.style.height = "100px";
    loader.style.animation = "spin 1s linear infinite";
    loader.id = parcel + "-" + service + "-loader";

    const keyframes = document.createElement("style");
    keyframes.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    `;

    document.head.appendChild(keyframes);

    quoteContainer.appendChild(loader);

    contentContainer.appendChild(quoteContainer);
  });
}

function displayQuoteInModal(quoteData, parcel) {
  const contentContainer = document.getElementById("content-container");
  const relativeServices = ["terrestre", "express"];

  var translatedParcel = parcel;
  if (translatedParcel === "j&texpress") translatedParcel = "jt";

  relativeServices.forEach((service) => {
    if (!quoteData[0].message) {
      const quote = quoteData.find(
        (quote) => quote.service.toLowerCase() === service
      );
      if (!quote) {
        const quoteContainer = document.getElementById(
          translatedParcel + "-" + service
        );
        contentContainer.removeChild(quoteContainer);
      }
    }
  });

  if (quoteData[0].message) {
    let quoteContainer = document.getElementById(
      translatedParcel + "-terrestre"
    );

    let loader = document.getElementById(
      translatedParcel + "-terrestre-loader"
    );

    const messageLoader = loader.cloneNode(true);
    messageLoader.id = translatedParcel + "-message-loader";
    quoteContainer.removeChild(loader);

    const messageContainer = quoteContainer.cloneNode(true);
    messageContainer.id = translatedParcel + "-message";
    contentContainer.appendChild(messageContainer);
    messageContainer.appendChild(messageLoader);

    contentContainer.removeChild(quoteContainer);

    quoteContainer = document.getElementById(translatedParcel + "-express");
    contentContainer.removeChild(quoteContainer);
  }

  quoteData.forEach((quote) => {
    let loader;
    let quoteContainer;

    if (quote.message) {
      loader = document.getElementById(translatedParcel + "-message-loader");
      loader.style.display = "none";

      quoteContainer = document.getElementById(translatedParcel + "-message");
    } else {
      loader = document.getElementById(
        parcel + "-" + quote.service.toLowerCase() + "-loader"
      );
      loader.style.display = "none";

      quoteContainer = document.getElementById(
        parcel + "-" + quote.service.toLowerCase()
      );
    }

    const keysToDisplay = ["service", "deliveryDate", "total"];
    const TitlesToDisplay = ["Servicio:", "Entrega Estimada:", "Total:"];

    let displayedMessage = false;

    keysToDisplay.forEach((key) => {
      const paragraph = document.createElement("label");
      paragraph.style.color = "#333333";
      paragraph.style.fontWeight = "bold";
      const index = keysToDisplay.indexOf(key);
      if (index !== -1) {
        var title = TitlesToDisplay[index];
        const titleParagraph = document.createElement("label");
        titleParagraph.style.fontWeight = "bold";
        titleParagraph.style.fontSize = "20px";
        titleParagraph.style.marginBottom = "5px";
        if (title !== "") titleParagraph.style.marginRight = "5px";
        titleParagraph.style.color = "#8C8C8C";
        quoteContainer.appendChild(titleParagraph);
        if (quote[key]) paragraph.textContent = `${quote[key].toUpperCase()}`;
        paragraph.style.fontSize = "20px";

        if (quote["message"] && key !== "parcel") {
          if (!displayedMessage) {
            title = "Nota:";
            displayedMessage = true;
            const message = quote["message"].toUpperCase();
            paragraph.textContent = message + ".";
          } else {
            titleParagraph.textContent = "";
            titleParagraph.style.display = "none";
          }
        }

        if (key === "service" && quote[key]) {
          const service = quote[key].toLowerCase();
          paragraph.style.padding = "5px";
          paragraph.style.borderRadius = "8px";
          if (service === "terrestre") {
            paragraph.style.color = "#FFFFFF";
            paragraph.style.backgroundColor = "gray";
          } else {
            paragraph.style.color = "#00000";
            paragraph.style.backgroundColor = "#FFAE42";
          }
        }

        if (key === "total" && quote[key]) {
          paragraph.style.color = "#252850";
          paragraph.style.fontSize = "30px";
        } else {
          titleParagraph.textContent = title;
        }

        if (key === "total" && quote[key]) {
          paragraph.style.marginRight = "10px";
          const paragraphPreviousTotal = document.createElement("label");
          const priceValue = quote[key].substring(1);
          const priceValueFloat = parseFloat(priceValue);
          const previousTotal = priceValueFloat + priceValueFloat * 0.15;
          const formattedTotal = `$${previousTotal.toFixed(2)}`;
          paragraphPreviousTotal.textContent = formattedTotal;
          paragraphPreviousTotal.style.textDecoration = "line-through";
          paragraphPreviousTotal.style.opacity = "0.5";
          paragraphPreviousTotal.style.color = "orange";
          paragraphPreviousTotal.style.fontSize = "25px";
          quoteContainer.appendChild(paragraph);
          quoteContainer.appendChild(paragraphPreviousTotal);
        } else if (!displayedMessage) {
          quoteContainer.appendChild(paragraph);
          const br1 = document.createElement("br");
          const br2 = document.createElement("br");
          quoteContainer.appendChild(br1);
          quoteContainer.appendChild(br2);
        } else {
          quoteContainer.appendChild(paragraph);
        }
      } else {
        paragraph.textContent = `${quote[key].toUpperCase()}`;
      }
    });
    
    contentContainer.insertBefore(quoteContainer, contentContainer.firstChild);

    const title = document.getElementById("title");
    contentContainer.insertBefore(title, contentContainer.firstChild);
  });
  return false;
}

const form = document.querySelector('[name="uagb-form-f250cdbc"]');

if (form) {
  form.removeAttribute("method");
  form.setAttribute("novalidate", true);
  form.setAttribute("onsubmit", 'return getQuote("uagb-form-f250cdbc")');
}

const button = document.querySelector(".uagb-forms-main-submit-button");

if (button) {
  button.addEventListener("click", function (event) {
    event.preventDefault();

    getQuote("uagb-form-f250cdbc");
  });
}

console.log("Hola");
