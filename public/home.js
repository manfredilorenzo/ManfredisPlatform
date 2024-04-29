const divRisultati = document.getElementById("divRisultati");

const barraDiRicerca = document.getElementById("barraDiRicerca");
const invioBarraDiRicerca = document.getElementById("invioBarraDiRicerca");

invioBarraDiRicerca.onclick = () => {
  const ricerca = {
    "ricerca" : barraDiRicerca.value
  };
sendRicerca(ricerca).then ((result) => {
  render(result);
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
<div class="col mt-2 mb-2">
<div class="card" style="width: 18rem;">
  <img class="card-img-top" src="%PERCORSO" alt="Card image cap">
  <div class="card-body">
    <h4 class="card-title">%TITOLO</h4>
    <p class="card-text">%DESCRIZIONE</p>
    <h5 class="card-text">%PREZZO</h5>
    <a href="%URLPAGINA" class="btn btn-primary">Visualizza</a>
  </div>
</div>
</div>
`;


const render = (dati) => {
    for(let i = 0; i < dati.length; i++) {

      //calcolo percorso immagine con path + nome annuncio
      //Calcolo url pagina, CAPIRE COME FARE
      const cardHTML = templateCard
        .replace('%PERCORSO', percorso)
        .replace('%TITOLO', dati.titolo)
        .replace('%DESCRIZIONE', dati.descrizione)
        .replace('%PREZZO', dati.prezzo)
        .replace('%URLPAGINA', urlPagina);
    }

    // Aggiungi il template al DOM
    divRisultati.innerHTML += cardHTML;
};
