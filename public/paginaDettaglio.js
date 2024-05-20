const socket = io();
const divDettaglio = document.getElementById("renderDettaglio");

window.onload = () => {

  const url = window.location.href;
  const hashIndex = url.indexOf('#');
  const hashString = hashIndex !== -1 ? url.substring(hashIndex + 1) : ''; // Ottieni la stringa dopo il carattere '#'

  const idValues = {};
  const idArray = hashString.split('-');
  idValues.idAnnuncio = idArray[0];
  idValues.idAcquirente = idArray[1];
  idValues.idProprietario = idArray[2];

  console.log("Dizionario degli ID: ", idValues);

  divDettaglio.innerHTML = "";

  const idDaInviare = {
    "id": idValues.idAnnuncio
  };

  prendiAnnuncio(idDaInviare)
    .then((result) => {
      console.log("result ricevuto");
      console.log(result.annuncio);
      renderAnn(result.annuncio);

      const allBottoniAdd = document.querySelectorAll('.bottoneDettaglio');

      allBottoniAdd.forEach(function (bottone) {
        bottone.addEventListener('click', function () {
          let idBottone = bottone.id;
          console.log("ID del bottone: " + idBottone);
          const idDef = idBottone.replace("chat", "");
          console.log("id definito bottone premuto: " + idDef);
          sessionStorage.setItem("idPagCorr", idDef);

          const idRoomComposta = idValues.idAnnuncio + "-" + idValues.idAcquirente + "-" + idValues.idProprietario;
          joinRoom(idRoomComposta);
          idValues.idComposto = idRoomComposta;
          saveChat(idValues);

          const buttonInvio = document.getElementById("invioMessaggio");

          const usernameSession = sessionStorage.getItem("username");
          console.log("username sess: " + usernameSession);



          const form = document.getElementById('formInput');

          form.addEventListener('submit', (event) => {
            // Prevenire il comportamento predefinito del form
            event.preventDefault();

            console.log("entrato");
            const timestamp = new Date().toLocaleString("it-IT", {
              year: "2-digit",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            });
            const messageInput = document.getElementById('inputMesaggio');
            const message = messageInput.value;

            // Supponendo che idRoomComposta e usernameSession siano già definiti
            socket.emit("chat message", idRoomComposta, {
              username: usernameSession,
              message: message,
              timestamp: timestamp,
            });

            // Svuotare il campo di input
            messageInput.value = "";
            console.log("finito");
          });
        });
      });
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

const saveChat = (infoChat) => {
  return new Promise((resolve, reject) => {
    fetch("/saveChat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(infoChat),
    })
      .then((response) => response.json())
      .then((json) => {
        resolve(json);
      });
  });
};


//bottoneDettaglio
const templateCard = `
<h1 class="display-3 text-center my-4" style="font-size: 55px;">%NOME</h1>

<div class="row">
  <div class="col-md-6">
    <div class="card shadow-sm">
      <img src="%IMMAGINE" alt="immagine annuncio" class="card-img-top img-fluid rounded" style="height: 700px; object-fit: cover;">
    </div>
  </div>
  <div class="col-md-6">
    <div class="card shadow-sm p-4">
      <p class="mt-4" style="text-align: justify;">%DESCRIZIONE</p>
      <hr>
      <div class="row text-center">
        <div class="col-md-4" style="border-right: solid white 1px;">
          <h3>Prezzo:</h3>
          <p style="font-size: 25px;">%PREZZO </p>
        </div>
        <div class="col-md-4" style="border-right: solid white 1px;">
          <h3>Zona:</h3>
          <p style="font-size: 25px;">%ZONA</p>
        </div>
        <div class="col-md-4">
          <h3>Stato:</h3>
          <p style="font-size: 25px;">%STATO</p>
        </div>
      </div>
      <div class="text-center mt-4">
        <button type="button" class="btn btn-primary btn-lg bottoneDettaglio" id="%IDBOTTONE" data-bs-toggle="modal" data-bs-target="#chat">Invia un messaggio</button>
      </div>
    </div>
  </div>
</div>
<div class="modal fade modal-bottom-up" id="chat" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title text-dark" id="titoloRoom">%NOME</h5>
        <button type="button" class="btn btn-danger" data-bs-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <div style="height: 500px;" id="" class="container">
          <p>-- Ricordati di portare sempre rispetto --</p>
          <ul id="messaggiChat" class="text-dark">
          </ul>
        </div>
      </div>
      <div class="modal-footer">
        <form id="formInput" style="width: 100%;">
          <div class="row" style="width: 100%; display: flex;">
            <div class="col" style="flex-grow: 1;">
              <input type="text" class="form-control" id="inputMesaggio" style="width: 100%;" placeholder="scrivi il tuo messaggio...">
            </div>
          <div class="col-auto">
              <button type="submit" id="invioMessaggio" class="btn btn-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-arrow-right" viewBox="0 0 16 16" style="display: flex; align-items: center; justify-content: center;">
                  <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"/>
                </svg>
              </button>
          </div>
        </div>
      </form>
      </div>
    </div>
  </div>
</div>

  `;

const renderAnn = (dati) => {
  for (let i = 0; i < dati.length; i++) {

    const cardHTML = templateCard
      .replace('%IMMAGINE', "immaginiCaricate/" + dati[i].nome + ".jpg")
      .replaceAll('%NOME', dati[i].nome)
      .replace("%DESCRIZIONE", dati[i].descrizione)
      .replace('%PREZZO', dati[i].prezzo + " €")
      .replace('%ZONA', dati[i].zona)
      .replace('%STATO', dati[i].status)
      .replace('%IDBOTTONE', "chat" + dati[i].id);

    console.log(cardHTML);
    // Aggiungo il template al DOM
    divDettaglio.innerHTML += cardHTML;
  }
};


socket.on('chat message', (data) => {
  const messages = document.getElementById('messaggiChat');
  const li = document.createElement('li');
  li.textContent = "[" + data.timestamp + "]" + " " + data.username + ": " + data.message;
  messages.appendChild(li);
  window.scrollTo(0, document.body.scrollHeight);
  document.getElementById('inputMesaggio').value = '';
});

const joinRoom = (idRoom) => {
  socket.emit("join room", idRoom);
}