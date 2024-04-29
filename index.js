const fs = require("fs");
const express = require("express");
const http = require("http");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");
const mysql = require("mysql");
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
try{
  //SERVIZIO DI LOGIN e di ACCESSO
app.post("/accedi", (req, res) => {
    //preno credenziali da richiesta
    const username = req.body.username;
    const password = req.body.password;
    console.log(username + " - " + password);
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
    //richiamo metodo che controlla
    checkLogin(nome, cognome, telefono, username, password)
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
//---------------------------------------------------------------------------------------------------

//FUNZIONE CONTROLLO SU DB delle credenziali
const checkAccesso = (username, password) => {
    return new Promise((resolve, reject) => {
        //cerco nel db tutti gli utenti che abbiamo quell username e quella password
        //template della query
        const template = "SELECT * FROM NoteUtente WHERE username = '%USERNAME' AND password = '%PASSWORD'";
        //query finale
        const sql = template.replace("%USERNAME", username).replace("%PASSWORD", password);

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
        const template = "INSERT INTO NoteUtente ('username', 'nome', 'cognome',  'password', 'telefono') VALUES ('%USERNAME', '%NOME', '%COGNOME', '%PASSWORD', '%TELEFONO')";
        const sql = template.replace("%USERNAME", username).replace("%NOME", nome).replace("%COGNOME", cognome).replace("%PASSWORD", password).replace("%TELEFONO", telefono);

        return executeQuery(sql);
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