const divRisultati = document.getElementById("divRisultati");

const barraDiRicerca = document.getElementById("barraDiRicerca");
const invioBarraDiRicerca = document.getElementById("invioBarraDiRicerca");

const btnGoProfilo = document.getElementById("btnGoProfilo");

const formRicerca = document.getElementById("formRicerca");


console.log("id preso dalla sessione: ");
console.log(sessionStorage.getItem("idAccount"));


window.onload = () => {
  const ricercaOnLoad = {"ricerca": ""};
  sendRicerca(ricercaOnLoad).then((result) => {
    renderAnn(result);
    console.log("annunci trovati: ");
    console.log(result);
    console.log("----------------------------");
  });
}

formRicerca.addEventListener('submit', (event) => {
  event.preventDefault();

  divRisultati.innerHTML = "";
  const ricerca = {
    "ricerca": barraDiRicerca.value
  };

  sendRicerca(ricerca).then((result) => {
    renderAnn(result);
    console.log("annunci trovati: ");
    console.log(result);
    console.log("----------------------------");
  });
});

invioBarraDiRicerca.onclick = () => {
  divRisultati.innerHTML = "";
  const ricerca = {
    "ricerca": barraDiRicerca.value
  };

  sendRicerca(ricerca).then((result) => {
    renderAnn(result);
    console.log("annunci trovati: ");
    console.log(result);
    console.log("----------------------------");
  });
}


const sendRicerca = (ricerca) => {
  return new Promise((resolve, reject) => {
    fetch("/ricercaAnnunci", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ricerca),
    })
      .then((response) => response.json())
      .then((json) => {
        resolve(json);
      });
  });
};


const templateCard = `
<div class="col-3" style="margin-bottom: 50px; margin-top:50px">
  <div class="card h-100" style="width: 18rem;">
    <div style="height: 300px;"> 
      <img class="card-img-top" src="%PERCORSO" alt="Card image cap" style="object-fit: cover; width: 100%; height: 100%;"> 
    </div>
    <div class="card-body">
      <h4 class="card-title">%TITOLO</h4>
      <br> 
      <h5 class="card-text">%PREZZO</h5>
    </div>
    <div class="card-footer">
      <a href="%URLPAGINA" class="btn btn-primary"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
      <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/>
      <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
    </svg></a>
    </div>
  </div>
</div>
`;





const renderAnn = (dati) => {
  for (let i = 0; i < dati.length; i++) {

    const cardHTML = templateCard
      .replace('%PERCORSO', "immaginiCaricate/" + dati[i].nome + ".jpg")
      .replace('%TITOLO', dati[i].nome)
      .replace('%PREZZO', dati[i].prezzo + " €")
      .replace('%URLPAGINA', "paginaDettaglio.html" + "#" + dati[i].id + "-" + sessionStorage.getItem("idAccount") + "-" + dati[i].utenteId);     
    // Aggiungo il template al DOM
    divRisultati.innerHTML += cardHTML;
  }
};

