const fs = require("fs");
const express = require("express");
const http = require("http");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const conf = require("./conf.js");
const connection = mysql.createConnection(conf);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", express.static(path.join(__dirname, "public")));

const server = http.createServer(app);
server.listen(80, () => {
    console.log("- server running");
});
//---------------------------------------------------------------------------------------------------
let usernameKeep = "";
let passwordKeep = "";

try{
  //SERVIZIO DI LOGIN e di ACCESSO
app.post("/accedi", (req, res) => {
    //preno credenziali da richiesta
    const username = req.body.username;
    const password = req.body.password;
    console.log(username + " - " + password);
    usernameKeep = username;
    passwordKeep = password;
    //richiamo metodo che controlla
    checkAccesso(username, password)
        //se esiste, restituisco ok altrimenti blocco
        .then((result) => {
            if (result === true) {
                res.json({ result: "ok" });
            } else {
                res.status(401).json({ result: "Unauthorized" });
            }
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ result: "Internal Server Error" });
        });
});

app.post("/registrati", (req, res) => {
    const nome = req.body.nome;
    const cognome = req.body.cognome;
    const telefono = req.body.telefono;
    const username = req.body.username;
    const password = req.body.password;
    console.log(username + " - " + password);
    usernameKeep = username;
    passwordKeep = password;
    //richiamo metodo che controlla
    addRegistrazione(nome, cognome, telefono, username, password)
        //se esiste, restituisco ok altrimenti blocco
        .then((result) => {
            if (result === true) {
                res.json({ result: "ok" });
            } else {
                res.status(401).json({ result: "Unauthorized" });
            }
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ result: "Internal Server Error" });
        });
});

app.post("/ricercaAnnunci", (req, res) => {
    // Prendi la ricerca dalla richiesta
    const ricerca = req.body.ricerca;
    
    console.log("Ricerca effettuata: " + ricerca);
    
    // Esegui la ricerca degli annunci
    ricercaAnnunci(ricerca)
        .then((result) => {
            // Invia i risultati al client
            res.json(result);
        })
        .catch((error) => {
            // Gestisci eventuali errori
            console.error("Errore durante la ricerca degli annunci:", error);
            res.status(500).send("Errore durante la ricerca degli annunci");
        });
});


app.post("/sendAnnuncio", (req, res) => {
    //const foto = req.body.foto;
    const nome = req.body.nome;
    const descrizione = req.body.descrizione;
    const prezzo = req.body.prezzo;
    const zona = req.body.zona;
    const stato = req.body.stato;
    console.log(nome + "-" + descrizione + "-" + prezzo + "-" + zona + "-" + stato);
    //richiamo metodo che controlla
    addAnnuncio(nome, descrizione, prezzo, zona, stato)
        //se esiste, restituisco ok altrimenti blocco
        .then((result) => {
            if (result === true) {
                res.json({ result: "ok" });
            } else {
                res.status(401).json({ result: "Unauthorized" });
            }
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ result: "Internal Server Error" });
        });
});
//---------------------------------------------------------------------------------------------------

//FUNZIONE CONTROLLO SU DB delle credenziali
const checkAccesso = (username, password) => {
    return new Promise((resolve, reject) => {
        //cerco nel db tutti gli utenti che abbiamo quell username e quella password
        //template della query
        const template = "SELECT * FROM NoteUtente WHERE username = '%USERNAME' AND password = '%PASSWORD'";
        //query finale
        const sql = template.replace("%USERNAME", username).replace("%PASSWORD", password);
        console.log("query creata: "+ sql);

        //eseguo e controllo
        executeQuery(sql)
            .then((result) => {
                //se maggiore di 0, QUINDI ESISTE UN UTENTE CON QUELLE CREDENZIALI, restituisco true
                if (result.length > 0) {
                    resolve(true); // Utente esistente
                } else {
                    //altrime FALSE, non esiste
                    resolve(false); // Credenziali non valide
                }
            })
            .catch((error) => {
                console.error(error);
                reject(error);
            });
    });
};

const addRegistrazione = (nome, cognome, telefono, username, password) => {  
    return new Promise ((resolve,reject) => {
        const template = "INSERT INTO NoteUtente (username, nome, cognome, password, telefono) VALUES ('%USERNAME', '%NOME', '%COGNOME', '%PASSWORD', '%TELEFONO')";
        const sql = template.replace("%USERNAME", username).replace("%NOME", nome).replace("%COGNOME", cognome).replace("%PASSWORD", password).replace("%TELEFONO", telefono);
        console.log("query creata: " + sql)
        return executeQuery(sql)
        .then((result) => {
            //se maggiore di 0, ha inserito il nuovo utente
            if (result.affectedRows > 0) {
                resolve(true); 
            } else {
                //altrime FALSE, non lo ha inserito per qualche motivo
                resolve(false); 
            }
        })
        .catch((error) => {
            console.error(error);
            reject(error);
        });
    })        
};


const addAnnuncio = (nome, descrizione, prezzo, zona, stato) => {  
    return new Promise ((resolve,reject) => {
        const template = "INSERT INTO Annuncio (nome, descrizione, prezzo, zona, utenteId,  status) VALUES ('%NOME', '%DESCRIZIONE', '%PREZZO', '%ZONA', '%UTENTEID', '%STATO')";
        const sql = template.replace("%NOME", nome).replace("%DESCRIZIONE", descrizione).replace("%PREZZO", prezzo).replace("%ZONA", zona).replace("%UTENTEID","1").replace("%STATO", stato);
        console.log("query creata: " + sql)
        return executeQuery(sql)
        .then((result) => {
            //se maggiore di 0, ha inserito il nuovo utente
            if (result.affectedRows > 0) {
                resolve(true); 
            } else {
                //altrime FALSE, non lo ha inserito per qualche motivo
                resolve(false); 
            }
        })
        .catch((error) => {
            console.error(error);
            reject(error);
        });
    })        
};
//---------------------------------------------------------------------------------------------------

//FUNZIONE PER ESEGUIRE QUERY SU DB
const executeQuery = (sql) => {
    return new Promise((resolve, reject) => {
        connection.query(sql, function (err, result) {
            if (err) {
                console.error(err);
                reject();
            }
            //se funziona stampo messaggio 
            console.log('done');
            resolve(result);
        });
    })
}
//---------------------------------------------------------------------------------------------------

const ricercaAnnunci = (ricerca) => {
    return new Promise((resolve, reject) => {
        //template della query
        const template ="SELECT * FROM Annunci WHERE nome LIKE '%$RICERCA%' OR descrizione LIKE '%$RICERCA%'";
        
        //query finale
        const sql = template.replaceAll("$RICERCA", ricerca);
       
        // Esegui la query con i parametri del database
        executeQuery(template, values)
            .then((result) => {
                resolve(result);
            })
            .catch((error) => {
                reject(error);
            });
    });
};
}catch(e){
  console.log("Errore");
  console.log(e);
}