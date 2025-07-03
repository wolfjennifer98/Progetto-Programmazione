import { ref, get, child, set } from "firebase/database";
import { database } from "./connection.js";

const dbRef = ref(database);

export async function getPreferitibynickname(nickname) {
  const snapshot = await get(child(dbRef, "preferiti/" + nickname));
  const dati = snapshot.val();

  if (!dati) return [];

  if (Array.isArray(dati)) return dati;

  return Object.keys(dati);
}

export async function createPreferiti(nickname, titoloGioco) {
  try {
    const preferitiSnapshot = await get(child(dbRef, "preferiti/" + nickname));
    const preferitiCorrenti = preferitiSnapshot.exists()
      ? preferitiSnapshot.val()
      : {};

    preferitiCorrenti[titoloGioco] = true;

    await set(ref(database, "preferiti/" + nickname), preferitiCorrenti);
    return preferitiCorrenti;
  } catch (error) {
    console.error("Errore durante il salvataggio del preferito", error);
    throw error;
  }
}
export async function removePreferiti(nickname, titoloGioco) {
  return new Promise((resolve, reject) => {
    get(ref(database, "preferiti/" + nickname))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const lista = snapshot.val();

          if (typeof lista !== "object") {
            return reject("La lista dei preferiti non è un array.");
          }

          delete lista[titoloGioco];
          set(ref(database, "preferiti/" + nickname), lista)
            .then(resolve)
            .catch(reject);
        } else {
          reject("Nessun preferito trovato per l'utente.");
        }
      })
      .catch((error) => reject(error));
  });
}
