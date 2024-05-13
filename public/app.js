//DOM
const usernameAccedi = document.getElementById("usernameAccedi");
const passwordAccedi = document.getElementById("passwordAccedi");

const nomeRegistrati = document.getElementById("nomeRegistrati");
const cognomeRegistrati = document.getElementById("cognomeRegistrati");
const telefonoRegistrati = document.getElementById("telefonoRegistrati");
const usernameRegistrati = document.getElementById("usernameRegistrati");
const passwordRegistrati = document.getElementById("passwordRegistrati");
const passwordConfRegistrati = document.getElementById("passwordConfRegistrati");

const btnAccedi = document.getElementById("btnDivAccedi");
const btnRegistrati = document.getElementById("btnDivRegistrati");


//------------------------------------------------------------------------------------------

//Richiamo della funzione 
btnAccedi.onclick = () => {
    const credenziali = {
      "username": usernameAccedi.value,
      "password": passwordAccedi.value,
    };
    console.log(credenziali);
    sendAccedi(credenziali).then((result) => {
      if (result.result === "ok") {
        console.log("Accesso riuscito");
        window.location.href = "home.html";
        sessionStorage.setItem("username", credenziali.username);
        sessionStorage.setItem("password", credenziali.password);
      } else {
        alert("Credenziali errate");
      }
    });
  };


btnRegistrati.onclick = () => {

  if (passwordRegistrati.value == passwordConfRegistrati.value ) {

    const credenziali = {
      "nome": nomeRegistrati.value,
      "cognome": cognomeRegistrati.value,
      "telefono": telefonoRegistrati.value,
      "username": usernameRegistrati.value,
      "password": passwordRegistrati.value
  };
  console.log(credenziali);
  sendRegistrati(credenziali).then((result) => {
      if (result.result === "ok") {
        console.log("Accesso riuscito");
        window.location.href = "home.html";
        sessionStorage.setItem("username", credenziali.username);
        sessionStorage.setItem("password", credenziali.password);
      } else {
          alert("Registrazione non riuscita, riprovare tra poco");
      }
  });

  } else {
    alert("Controlla le due password, non sono uguali");
  }
    
}
//------------------------------------------------------------------------------------------
//Funzione per mandare credenziali al server
const sendAccedi = (credenziali) => {
    return new Promise((resolve, reject) => {
      fetch("/accedi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credenziali),
      })
        .then((response) => response.json())
        .then((json) => {
          resolve(json);
        });
    });
  };

  const sendRegistrati = (credenziali) => {
    return new Promise((resolve, reject) => {
      fetch("/registrati", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credenziali),
      })
        .then((response) => response.json())
        .then((json) => {
          resolve(json);
        });
    });
  };

//------------------------------------------------------------------------------------------
