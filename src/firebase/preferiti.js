import { ref, get, child, set } from "firebase/database";
import { database } from "./connection.js";

const dbRef = ref(database);

async function getPreferitibynickname(nickname) {
  const snapshot = await get(child(dbRef, "preferiti/" + nickname));
  const dati = snapshot.val();

  if (!dati) return [];

  if (Array.isArray(dati)) return dati;

  return Object.keys(dati);
}

async function createPreferiti(nickname, titoloGioco) {
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

async function removePreferiti(nickname, titoloGioco) {
  try {
    const snapshot = await get(child(dbRef, `preferiti/${nickname}`));

    if (!snapshot.exists()) {
      throw new Error("Nessun preferito trovato per l'utente.");
    }

    const lista = snapshot.val();

    if (typeof lista !== "object" || lista === null) {
      throw new Error("La lista dei preferiti non è valida.");
    }

    delete lista[titoloGioco];

    // Salva nuovamente la lista aggiornata
    await set(ref(database, `preferiti/${nickname}`), lista);

    return lista;
  } catch (error) {
    console.error("Errore durante la rimozione del preferito:", error);
    throw error;
  }
}

export { getPreferitibynickname, createPreferiti, removePreferiti };
