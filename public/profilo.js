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
// Gestione pubblicazione dell'annuncio quando si fa clic su "pubblicaAnnuncio"
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

  const updateStatus = (newPass) => {
    return new Promise((resolve, reject) => {
      fetch("/changeStatus", {
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
  <div class="border mt-5" style="width: 100%; height: 250px; border-radius:5px">
    <div class="row">
        <div class="col-3">
            <div class="border" style="width: 200px; height: 200px; margin-top: 20px; margin-left: 20px;">
                <img src="%PERCORSO" style="width: 200px; height: 200px;">
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
            <div class="form-group">
                <label for="status" class="text-white"><strong>Modifica stato:</strong></label>
                <div class="row">
                    <div class="col-8">
                        <select class="form-control" id="%INPUTUPD">
                            <option value="disponibile">Disponibile</option>
                            <option value="venduto">Venduto</option>
                            <option value="in_sospeso">In sospeso</option>
                        </select>
                    </div>
                    <div class="col-4">
                        <button type="submit" class="btn btn-primary btnUpdate" id="%UPDATE">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-clockwise" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"/>
                                <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
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
      .replace("%STATO", annuncio.status)
      .replace("%UPDATE", "update" + annuncio.id)
      .replace("%INPUTUPD", "inputUpdate" + annuncio.id);

    try {
     //provo con jpg
      annuncioRend = annuncioRend.replace("%PERCORSO", "immaginiCaricate/" + annuncio.nome + ".jpg");
    } catch (errore) {
      //altrimenti provo con png
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

      const allBottoniAdd = document.querySelectorAll('.btnUpdate');

    allBottoniAdd.forEach(function (bottone) {
      bottone.addEventListener('click', function () {
        let idBottone = bottone.id;
        console.log("ID del bottone: " + idBottone);
        const idUpdate = idBottone.replace("update", "");
        console.log("id definito bottone premuto cambio stato: " + idUpdate);
        const inputStato = document.getElementById("inputUpdate"+ idUpdate);
        const info = {
          "idAnnuncio": idUpdate,
          "nuovoStatus": inputStato.value 
        }
        updateStatus(info);
        window.location.reload()
        inputStato.value="";
        
      });
    });
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

