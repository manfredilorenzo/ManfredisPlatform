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

const passwordattuale = document.getElementById("passwordAttuale");
const nuovaPassword1 = document.getElementById("nuovaPassword1");
const nuovaPassword2 = document.getElementById("nuovaPassword1");
const btnSalvaNuovaPassword = document.getElementById("btnSalvaNuovaPassword");


btnSalvaNuovaPassword.onclick = () => {
  const nuovePass = {
    "passwordAttuale" : passwordattuale.value,
    "password1" : nuovaPassword1.value,
    "password2" : nuovaPassword2.value
  }
  sendNewPass(nuovePass).then((result) => {
    if (result.success) {
      alert("Password cambiata con successo.")
      document.getElementById("divCambioPassword").classList.remove("mostra");
      document.getElementById("divCambioPassword").classList.add("nascondi");

    } else {
        alert("Cambio username non riscito, riprovare tra poco");
    }
});
}

btnSalvaNuovoUsername.onclick = () => {
  const nuovoUsernameVal = {"nuovoUser" : nuovoUsername.value};
  sendNewUsername(nuovoUsernameVal).then((result) => {
    if (result.success) {
      alert("Username cambiato con successo.")
      document.getElementById("divCambioUsername").classList.remove("mostra");
      document.getElementById("divCambioUsername").classList.add("nascondi");

    } else {
        alert("Cambio username non riscito, riprovare tra poco");
    }
});


}
// Gestisci la pubblicazione dell'annuncio quando si fa clic su "pubblicaAnnuncio"
pubblicaAnnuncio.onclick = () => {

    caricaFile();
    console.log("nome annuncio: "+ nomeAnnuncio.value);
    console.log("descrizione annuncio: " + descrizioneAnnuncio.value);
    console.log("prezzo annuncio: " + prezzoAnnuncio.value);
    console.log("zona annuncio: " + zonaAnnuncio.value);
    console.log("stato annuncio: " + statoAnnuncio.value);

    const infoAnnuncio = {
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


  const sendNewPass = (newPass) => {
    return new Promise((resolve, reject) => {
      fetch("/changePassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPass),
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
              <img src="%PERCORSO" style="width:200px; height:200px">
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
  annunci.forEach((annuncio) => {
    //faccio il replace delle info
    let annuncioRend = templateAnnuncio
      .replace("%NOME", annuncio.nome)
      .replace("%DESCRIZIONE", annuncio.descrizione)
      .replace("%PREZZO", annuncio.prezzo)
      .replace("%ZONA", annuncio.zona)
      .replace("%STATO", annuncio.status);

    try {
     //provo con png
      annuncioRend = annuncioRend.replace("%PERCORSO", "immaginiCaricate/" + annuncio.nome + ".jpg");
    } catch (errore) {
      //altrimenti provo con jpg
      annuncioRend = annuncioRend.replace("%PERCORSO", "immaginiCaricate/" + annuncio.nome + ".png");
    }

    console.log(annuncioRend);
    //stampo
    divAnnunci.innerHTML += annuncioRend;
  });
};

const getAnnunci = () => {
  return fetch("/getAnnunciUtente")
    .then((response) => response.json())
    .then((json) => {
      
      console.log("Dati ricevuti:", json.annunci); // stampo in console
      divAnnunci.innerHTML = " ";
      render(json.annunci); // richiamo render con dati
    })
    .catch((error) => {
      console.error('Errore durante il recupero degli annunci:', error);
    });
}

window.onload = () =>{
  getAnnunci();
}

function caricaFile() {
  const fileInput = document.getElementById('fotoAnnuncio');
  
  //controllo che non sia vuoto
  if (fileInput.files.length === 0) {
    alert('Nessun file selezionato.');
    return;
  }

  //prendo il file caricato
  const file = fileInput.files[0];

  //Verifico l'estensione SOLO PNG O JPG
  //const allowedExtensions = ['jpg']; // Estensioni ok
  /*
  const fileExtension = file.name.split('.').pop().toLowerCase(); // prendo solo i caratteri dopo il .
  if (!allowedExtensions.includes(fileExtension)) { //se l'estensione del file caricato non è nell' array
    alert('Puoi caricare solo file di tipo JPG.');// avviso
    return;
  }
  */

  //creo oggetto formData (della libreria multer)
  const formData = new FormData();
  formData.append('file', file, nomeAnnuncio.value + ".jpg"); //metto il nome immagine come il nome annuncio, per recupero in render
  
  //invio al servizio
  fetch('/upload', {
    method: 'POST',
    body: formData
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Errore durante il caricamento del file.');
    }
    return response.text(); 
  })
  .then(data => {
    console.log('Risposta del server:', data);
    alert('File caricato con successo.');
  })
  .catch(error => {
    console.error('Errore:', error);
    alert('Si è verificato un errore durante il caricamento del file.');
  });
}
