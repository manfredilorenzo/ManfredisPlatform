const fs = require("fs");
const express = require("express");
const http = require("http");
const path = require("path");
const multer = require('multer');
const app = express();
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const conf = require("./conf.js");
const connection = mysql.createConnection(conf);


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '/public/immaginiCaricate'));
    },
    filename: (req, file, cb) => {

        const lastDotIndex = file.originalname.lastIndexOf('.');
        const fileExtension = file.originalname.substring(lastDotIndex + 1).toLowerCase();
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", express.static(path.join(__dirname, "public")));



const server = http.createServer(app);
server.listen(80, () => {
    console.log("- server running");
});

let usernameKeep = "";
let passwordKeep = "";
//---------------------------------------------------------------------------------------------------
//SERVIZI RICHIAMABILI

try {
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

    app.get("/getAnnunciUtente", (req, res) => {
        const username = usernameKeep; // Ottieni l'username conservato

        // Ottieni l'ID utente associato all'username
        getIdUtente(username)
            .then((response) => {
                const idUtente = response[0].id; // Ottieni l'ID utente dalla risposta
                console.log("ID utente:", idUtente);

                // Ora che abbiamo l'ID utente, possiamo ottenere gli annunci associati
                selectAnnunciUtente(idUtente)
                    .then((annunci) => {
                        console.log("Annunci dell'utente:", annunci);
                        // Invia gli annunci al client
                        res.json({ annunci: annunci });
                    })
                    .catch((error) => {
                        console.log("Errore nel recupero degli annunci:", error);
                        res.status(500).json({ error: "Errore nel recupero degli annunci" });
                    });
            })
            .catch((error) => {
                console.log("Errore nel recupero dell'ID utente:", error);
                res.status(500).json({ error: "Errore nel recupero dell'ID utente" });
            });
    });


    app.post("/changeUsername", (req, res) => {
        const username = usernameKeep; // Ottieni l'username conservato
        const nuovoUsername = req.body.nuovoUser; // Ottieni l'username ricevuto

        // Ottieni l'ID utente associato all'username
        getIdUtente(username)
            .then((response) => {
                const idUtente = response[0].id; // Ottieni l'ID utente dalla risposta
                console.log("ID utente:", idUtente);

                // Ora che abbiamo l'ID utente, possiamo cambiare l'username
                changeUsername(nuovoUsername, idUtente)
                    .then((result) => {
                        console.log("Username cambiato con successo");
                        res.json({ success: true });
                    })
                    .catch((error) => {
                        console.log("Errore nel cambio dell'username:", error);
                        res.status(500).json({ error: "Errore nel cambio dell'username" });
                    });
            })
            .catch((error) => {
                console.log("Errore nel recupero dell'ID utente:", error);
                res.status(500).json({ error: "Errore nel recupero dell'ID utente" });
            });
    });


    app.post("/changePassword", (req, res) => {
        const username = usernameKeep; // Ottieni l'username conservato
        const passwordAttuale = req.body.passwordAttuale; // Ottieni l'username ricevuto
        const password1 = req.body.password1;
        const password2 = req.body.password2;

        // Ottieni l'ID utente associato all'username
        getIdUtente(username)
            .then((response) => {
                const idUtente = response[0].id; // Ottieni l'ID utente dalla risposta
                console.log("ID utente:", idUtente);

                // Ora che abbiamo l'ID utente, possiamo cambiare l'username
                changePassword(idUtente, passwordAttuale, password1, password2)
                    .then((result) => {
                        console.log("Password cambiata con successo");
                        res.json({ success: true });
                    })
                    .catch((error) => {
                        console.log("Errore nel cambio della password:", error);
                        res.status(500).json({ error: "Errore nel cambio della password" });
                    });
            })
            .catch((error) => {
                console.log("Errore nel recupero dell'ID utente:", error);
                res.status(500).json({ error: "Errore nel recupero dell'ID utente" });
            });
    });
    

    app.post('/upload', upload.single('file'), (req, res) => {
        if (!req.file) {
            return res.status(400).send('Nessun file caricato.');
        }

        res.send('File caricato con successo.');
    });



    //---------------------------------------------------------------------------------------------------
    //FUNZIONI OPERAZIONI SU DB

    //FUNZIONE CONTROLLO SU DB delle credenziali
    const checkAccesso = (username, password) => {
        return new Promise((resolve, reject) => {
            //cerco nel db tutti gli utenti che abbiamo quell username e quella password
            //template della query
            const template = "SELECT * FROM NoteUtente WHERE username = '%USERNAME' AND password = '%PASSWORD'";
            //query finale
            const sql = template.replace("%USERNAME", username).replace("%PASSWORD", password);
            console.log("query creata: " + sql);

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

    //FUNZIONA
    const addRegistrazione = (nome, cognome, telefono, username, password) => {
        return new Promise((resolve, reject) => {
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

    //FUNZIONA
    const addAnnuncio = (nome, descrizione, prezzo, zona, stato) => {
        return new Promise((resolve, reject) => {
            const template = "INSERT INTO Annuncio (nome, descrizione, prezzo, zona, utenteId,  status) VALUES ('%NOME', '%DESCRIZIONE', '%PREZZO', '%ZONA', '%UTENTEID', '%STATO')";
            const sql = template.replace("%NOME", nome).replace("%DESCRIZIONE", descrizione).replace("%PREZZO", prezzo).replace("%ZONA", zona).replace("%UTENTEID", "1").replace("%STATO", stato);
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

    //FUNZIONA
    const selectAnnunciUtente = (idUt) => {
        const template = `
    SELECT * FROM Annuncio WHERE utenteId = '%UTENTEID';
       `;
        const sql = template.replace("%UTENTEID", idUt);
        console.log("query get annunci: " + sql);

        return executeQuery(sql);
    }

    //FUNZIONA
    const getIdUtente = (username) => {
        const template = `
    SELECT id FROM NoteUtente WHERE username = '%USERNAME';
       `;
        const sql = template.replace("%USERNAME", username);
        console.log("query get id con username: " + sql);

        return executeQuery(sql);
    }

    //FUNZIONA
    const changeUsername = (username, idUtente) => {
        const template = `
    UPDATE NoteUtente SET username = '%NUOVOUSER' WHERE id = '%UTENTEID';
       `;
        const sql = template.replace("%NUOVOUSER", username).replace("%UTENTEID", idUtente);
        console.log("query cambio username: " + sql);

        return executeQuery(sql);
    }

    //FUNZIONA
    const changePassword = (idUtente, passAttuale, pass1, pass2) => {

        // Passo 1: Seleziona la password attuale dal database
        const templateSelect = `SELECT password FROM NoteUtente WHERE id = '%IdUtente';`;
        const sqlSelect = templateSelect.replace("%IdUtente", idUtente);

        // Esegui la query per ottenere la password attuale
        return executeQuery(sqlSelect)
            .then((result) => {
                // Verifica se la query ha restituito un risultato
                if (result.length === 0) {
                    throw new Error("Utente non trovato");
                }

                const passwordFromDB = result[0].password;

                // Passo 2: verifico che la pass passata e quella sul db siano uguali 
                if (passAttuale !== passwordFromDB) {
                    throw new Error("La password attuale non è corretta");
                }

                // Passo 3: Verifico che le due pass nuove passate siano uguali
                if (pass1 !== pass2) {
                    throw new Error("Le nuove password non corrispondono");
                }

                // Passo 4: Cambio la password sul db
                const templateUpdate = `
                    UPDATE NoteUtente SET password = '%NUOVAPASSWORD' WHERE id = '%IdUtente';
                `;
                const sqlUpdate = templateUpdate.replace("%NUOVAPASSWORD", pass1).replace("%IdUtente", idUtente);
                return executeQuery(sqlUpdate);
            })
            .then(() => {
                return "Password cambiata con successo";
            })
            .catch((error) => {
                throw error;
            });
    }


    //NON PROVATA
    const ricercaAnnunci = (ricerca) => {
        return new Promise((resolve, reject) => {
            //template della query
            const template = "SELECT * FROM Annuncio WHERE nome LIKE '%$RICERCA%' OR descrizione LIKE '%$RICERCA%'";

            //query finale
            const sql = template.replaceAll("$RICERCA", ricerca);
            console.log("query ricerca annuncio: " + sql);


            // Esegui la query con i parametri del database
            executeQuery(sql)
                .then((result) => {
                    resolve(result);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    };
} catch (e) {
    console.log("Errore");
    console.log(e);
}

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

