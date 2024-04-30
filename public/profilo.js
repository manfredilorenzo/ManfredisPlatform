const fotoAnnuncio = document.getElementById("fotoAnnuncio");
const nomeAnnuncio = document.getElementById("nomeAnnuncio");
const descrizioneAnnuncio = document.getElementById("descrizioneAnnuncio");
const prezzoAnnuncio = document.getElementById("prezzoAnnuncio");
const zonaAnnuncio = document.getElementById("zonaAnnuncio");
const statoAnnuncio = document.getElementById("statoAnnuncio");

const pubblicaAnnuncio = document.getElementById("pubblicaAnnuncio");

const divAnnunci = document.getElementById("divAnnunci");

const nuovoUsername = document.getElementById("nuovoUsername");
const btnSalvaNuovoUsername = document.getElementById ("btnSalvaNuovoUsername");

btnSalvaNuovoUsername.onclick = () => {
  const nuovoUsernameVal = {"nuovoUser" : nuovoUsername.value};
  sendNewUsername(nuovoUsernameVal).then((result) => {
    if (result.result === "ok") {
      getAnnunci();

    } else {
        alert("Cambio username non riscito, riprovare tra poco");
    }
});


}

// Gestisci il caricamento del file quando l'utente seleziona un'immagine
fotoAnnuncio.addEventListener('change', function() {
    const file = this.files[0];
    const reader = new FileReader();

    reader.onload = function() {
        const imageUrl = reader.result;
        console.log(imageUrl);
    };

    if (file) {
        reader.readAsDataURL(file);
    }
});

// Gestisci la pubblicazione dell'annuncio quando si fa clic su "pubblicaAnnuncio"
pubblicaAnnuncio.onclick = () => {
    console.log("nome annuncio: "+ nomeAnnuncio.value);
    console.log("descrizione annuncio: " + descrizioneAnnuncio.value);
    console.log("prezzo annuncio: " + prezzoAnnuncio.value);
    console.log("zona annuncio: " + zonaAnnuncio.value);
    console.log("stato annuncio: " + statoAnnuncio.value);

    const infoAnnuncio = {
        //"foto": imageUrl,
        "nome": nomeAnnuncio.value,
        "descrizione": descrizioneAnnuncio.value,
        "prezzo": prezzoAnnuncio.value,
        "zona": zonaAnnuncio.value,
        "stato": statoAnnuncio.value
    };
    sendAnnuncio(infoAnnuncio).then((result) => {
        if (result.result === "ok") {
          getAnnunci();

        } else {
            alert("Pubblicazione non riuscita, riprovare tra poco");
        }
    });

}
  
  const sendAnnuncio = (info) => {
    return new Promise((resolve, reject) => {
      fetch("/sendAnnuncio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(info),
      })
        .then((response) => response.json())
        .then((json) => {
          resolve(json);
        });
    });
  };

  const sendNewUsername = (newUser) => {
    return new Promise((resolve, reject) => {
      fetch("/changeUsername", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      })
        .then((response) => response.json())
        .then((json) => {
          resolve(json);
        });
    });
  };



  //template annuncio 
  const templateAnnuncio = `
  <div class="border mt-5 " style="width: 100%; height: 250px; border-radius:5px">
  <div class="row">
      <div class="col-3">
          <div class="border" style="width: 200px; height: 200px; margin-top: 20px; margin-left: 20px;">
              <!--IMMAGINE annuncio-->
          </div>
      </div>
      <div class="col" style="margin-top: 20px;">
          <p class="text-white"><strong>Nome: </strong>%NOME</p>
          <p class="text-white"><strong>Descrizione: </strong>%DESCRIZIONE</p>
          <p class="text-white"><strong>Prezzo: </strong>%PREZZO €</p>
      </div>
      <div class="col" style="margin-top: 20px;">
          <p class="text-white"><strong>Zona: </strong>%ZONA</p>
          <p class="text-white"><strong>Stato: </strong>%STATO</p>
      </div>
  </div>
</div>
`;

const render = (annunci) => {
  // per tutti gli annunci prensenti
  annunci.forEach((annuncio) => {
    //faccio il replace delle info
      const annuncioRend = templateAnnuncio
          .replace("%NOME", annuncio.nome)
          .replace("%DESCRIZIONE", annuncio.descrizione)
          .replace("%PREZZO", annuncio.prezzo)
          .replace("%ZONA", annuncio.zona)
          .replace("%STATO", annuncio.status);

          //aggiungo al div
      divAnnunci.innerHTML += annuncioRend;
  });
}

const getAnnunci = () => {
  return fetch("/getAnnunciUtente")
    .then((response) => response.json())
    .then((json) => {
      
      console.log("Dati ricevuti:", json.annunci); // stampo in console
      render(json.annunci); // richiamo render con dati
    })
    .catch((error) => {
      console.error('Errore durante il recupero degli annunci:', error);
    });
}

window.onload = () =>{
  getAnnunci();
}