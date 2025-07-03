import { ref, get, child, set } from "firebase/database";
import { database } from "./connection.js";

const dbRef = ref(database);

function getutenti() {
  return new Promise((resolve, reject) => {
    get(child(dbRef, "utenti"))
      .then((snapshot) => {
        if (snapshot.exists()) {
          resolve(snapshot.val());
        } else {
          resolve(null);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}
function getutentebynickname(nickname) {
  return new Promise((resolve, reject) => {
    get(child(dbRef, `utenti/${nickname}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          resolve(snapshot.val());
        } else {
          resolve(null);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function createutente(email, nome, cognome, password, nickname) {
  return new Promise((resolve, reject) => {
    const newUser = {
      email: email,
      nome: nome,
      cognome: cognome,
      password: password,
      nickname: nickname,
      immagine: "",
    };

    console.log("Dati che verranno salvati:", newUser);

    set(ref(database, `utenti/${nickname}`), newUser)
      .then(() => {
        resolve(newUser);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export { getutenti, getutentebynickname, createutente };
export async function getUtenteByEmail(email) {
  try {
    const snapshot = await get(child(dbRef, "utenti"));

    if (snapshot.exists()) {
      const utenti = snapshot.val();

      const utentiArray = Object.values(utenti);
      const utenteTrovato = utentiArray.find(
        (utente) => utente.email === email
      );

      return utenteTrovato || null;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Errore durante la ricerca dell'utente per email:", error);
    return null;
  }
}
