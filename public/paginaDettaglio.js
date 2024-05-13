const socket = io();
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

      const allBottoniAdd = document.querySelectorAll('.bottoneDettaglio');

      allBottoniAdd.forEach(function (bottone) {
        bottone.addEventListener('click', function () {
          let idBottone = bottone.id;
          console.log("ID del bottone: " + idBottone);
          const idDef = idBottone.replace("chat", "");
          console.log("id definito bottone premuto: " + idDef);
          sessionStorage.setItem("idPagCorr", idDef);

          joinRoom(sessionStorage.getItem("idPagCorr"));

          const buttonInvio = document.getElementById("invioMessaggio");

          const usernameSession = sessionStorage.getItem("username");
          console.log("username sess: " + usernameSession);



          buttonInvio.onclick = () => {
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
            socket.emit("chat message", sessionStorage.getItem("idPagCorr"), {
              username: usernameSession,
              message: message,
              timestamp: timestamp,
            }); // Invia l'username e il messaggio
            messageInput.value="";
            console.log("finito");
          }
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
      <button type="button" class="btn btn-primary bottoneDettaglio" id="%IDBOTTONE" data-bs-toggle="modal" data-bs-target="#chat">Invia un messaggio</button>
    </div>
  </div>


  <div class="modal fade modal-bottom-up" id="chat" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title text-dark"  id="titoloRoom">%NOME</h5>
          <button type="button" class="btn btn-danger" data-bs-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div style="height: 500px;" id="" class="container">  
          <p>-- Rircodarti di portare sempre rispetto --</p>
          <ul id="messaggiChat" class="text-dark">
          </ul>
          </div>
        </div>
        <div class="modal-footer">
          
          <input type="text" class="form-control" id="inputMesaggio" style="width: 80%;" placeholder="scrivi il tuo messaggio...">
           <button type="submit" id="invioMessaggio" class="btn btn-primary "><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-arrow-right" viewBox="0 0 16 16" style="display: flex; align-items: center; justify-content: center; " >
            <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"/>
          </svg></button>
        </div>
      </div>
    </div>
  </div>       
  `;

const renderAnn = (dati) => {
  for (let i = 0; i < dati.length; i++) {

    // Calcolo percorso immagine con path + nome annuncio
    // Calcolo URL pagina, CAPIRE COME FARE
    const cardHTML = templateCard
      .replace('%IMMAGINE', "immaginiCaricate/" + dati[i].nome + ".jpg")
      .replaceAll('%NOME', dati[i].nome)
      .replace("%DESCRIZIONE", dati[i].descrizione)
      .replace('%PREZZO', dati[i].prezzo + " €")
      .replace('%ZONA', dati[i].zona)
      .replace('%STATO', dati[i].status)
      .replace('%IDBOTTONE', "chat" + dati[i].id);

    console.log(cardHTML);
    // Aggiungi il template al DOM
    divDettaglio.innerHTML += cardHTML;
  }
};


socket.on('chat message', (data) => {
  const messages = document.getElementById('messaggiChat');
  const li = document.createElement('li');
  li.textContent = "[" + data.timestamp + "]" + " " +  data.username + ": " + data.message;
  messages.appendChild(li); // Aggiunge il nuovo messaggio alla fine della lista
  window.scrollTo(0, document.body.scrollHeight); // Scorrimento automatico verso il basso per visualizzare il nuovo messaggio
  document.getElementById('inputMesaggio').value = ''; // Svuota l'input del messaggio dopo l'invio
});




const joinRoom = (idRoom) => {
  socket.emit("join room", idRoom);

}