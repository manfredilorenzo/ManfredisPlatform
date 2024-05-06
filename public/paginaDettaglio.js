
const divDettaglio = document.getElementById("renderDettaglio");

window.onload = () => {
    const url = window.location.href;
    const arrayUrl = url.split('#');
    let id = arrayUrl[arrayUrl.length - 1];
    if (arrayUrl[0] === "#") {
        id = arrayUrl[arrayUrl.length - 1]; 
    }
    console.log("id pagina: " + id);
    divDettaglio.innerHTML = "";

    const idDaInviare = {
        "id": id
    };

    prendiAnnuncio(idDaInviare)
        .then((result) => {
            console.log("result ricevuto");
            console.log(result.annuncio);
            renderAnn(result.annuncio);
        });
};



const prendiAnnuncio = (ricerca) => {
    return new Promise((resolve, reject) => {
      fetch("/getAnnuncio", {
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
 
  <h1 style="font-size: 55px;">%NOME</h1>
  <div class="row">
    <div class="col">
      <img src="%IMMAGINE" alt="immagine annuncio" style="width: 700px; height: 700px; object-fit: cover;">
    </div>
    <div class="col">
      <p class="mt-4" style="text-align: justify;">%DESCRIZIONE</p>
      <hr class="bg-white"> 
      <div class="row">
        <div class="col" style="border-right: solid white 1px;">
          <h3>Prezzo: </h3>
          <p style="font-size: 25px;">%PREZZO</p>
        </div>
        <div class="col" style="border-right: solid white 1px;">
          <h3>Zona:</h3>
          <p style="font-size: 25px;">%ZONA</p>
        </div>
        <div class="col" >
          <h3>Stato:</h3>
          <p style="font-size: 25px;">%STATO</p>
        </div>
      </div>
      <button type="button" class="btn btn-primary" id="%IDBOTTONE" data-bs-toggle="modal" data-bs-target="#chat">Invia un messaggio</button>
    </div>
  </div>
  
        
  `;
  
  
  
  
  
  const renderAnn = (dati) => {
    for (let i = 0; i < dati.length; i++) {
  
      // Calcolo percorso immagine con path + nome annuncio
      // Calcolo URL pagina, CAPIRE COME FARE
      const cardHTML = templateCard
        .replace('%IMMAGINE', "immaginiCaricate/" + dati[i].nome + ".jpg")
        .replace('%NOME', dati[i].nome)
        .replace("%DESCRIZIONE", dati[i].descrizione)
        .replace('%PREZZO', dati[i].prezzo + " €")
        .replace('%ZONA', dati[i].zona)
        .replace('%STATO', dati[i].status)
        .replace('%IDBOTTONE',"chat" + dati[i].id);
  
        console.log(cardHTML);
      // Aggiungi il template al DOM
      divDettaglio.innerHTML += cardHTML;
    }
  };
  
  