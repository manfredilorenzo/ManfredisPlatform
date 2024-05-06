const divRisultati = document.getElementById("divRisultati");

const barraDiRicerca = document.getElementById("barraDiRicerca");
const invioBarraDiRicerca = document.getElementById("invioBarraDiRicerca");

const btnGoProfilo = document.getElementById("btnGoProfilo");



invioBarraDiRicerca.onclick = () => {
  divRisultati.innerHTML=" ";
  const ricerca = {
    "ricerca": barraDiRicerca.value
  };
  sendRicerca(ricerca).then((result) => {
    renderAnn(result);
    console.log("annunci trovati: ");
    console.log(result);
    console.log("----------------------------");
  })
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
<div class="col " style="margin-bottom: 50px; margin-top:50px">
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
      <a href="%URLPAGINA" class="btn btn-primary">Visualizza</a>
    </div>
  </div>
</div>
`;





const renderAnn = (dati) => {
  for (let i = 0; i < dati.length; i++) {

    // Calcolo percorso immagine con path + nome annuncio
    // Calcolo URL pagina, CAPIRE COME FARE
    const cardHTML = templateCard
      .replace('%PERCORSO', "immaginiCaricate/" + dati[i].nome + ".jpg")
      .replace('%TITOLO', dati[i].nome)
      .replace('%PREZZO', dati[i].prezzo + " €")
      .replace('%URLPAGINA', "paginaDettaglio.html" + "#" + dati[i].id);

    // Aggiungi il template al DOM
    divRisultati.innerHTML += cardHTML;
  }
};

