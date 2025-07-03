import { ref, get, child, set } from "firebase/database";
import { database } from "./connection.js";

const dbRef = ref(database);

function getconsigli() {
  return new Promise((resolve, reject) => {
    get(child(dbRef, "consigli"))
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
function createconsigli(email, anno_di_uscita, nome_gioco) {
  return new Promise((resolve, reject) => {
    const nuovoconsiglio = {
      email,
      anno_di_uscita,
      nome_gioco,
    };

    const consigliRef = ref(database, "consigli/" + nome_gioco);
    set(consigliRef, nuovoconsiglio)
      .then(() => {
        resolve(nuovoconsiglio);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export { getconsigli, createconsigli };
