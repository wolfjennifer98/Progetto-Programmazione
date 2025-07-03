<template>
  <Navbar />
  <div
    class="main-wrapper d-flex justify-content-center align-items-center min-vh-100 px-3"
  >
    <div class="container py-5">
      <h2 class="text-center mb-4 margin-top:1.5rem">Profilo Utente</h2>
      <div class="row justify-content-center">
        <div class="col-12 col-md-8 col-lg-6">
          <div class="card p-4 shadow-sm">
            <div v-if="!loading">
              <div class="d-flex flex-column align-items-center mb-3">
                <input
                  type="file"
                  id="uploadImg"
                  accept="image/*"
                  class="d-none"
                  @change="handleImageUpload"
                />
                <img
                  v-if="immagine"
                  :src="immagine"
                  alt="Foto profilo"
                  class="rounded-circle shadow m-2 d-block"
                  style="width: 100px; height: 100px; object-fit: cover"
                />
                <div
                  v-else
                  class="rounded-circle d-flex align-items-center justify-content-center m-2 profilo-placeholder"
                  style="width: 100px; height: 100px"
                >
                  <i class="bi bi-person-fill" style="font-size: 70px"></i>
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label">Nickname</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="nickname"
                  disabled
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Nome</label>
                <input type="text" class="form-control" v-model="nome" />
              </div>
              <div class="mb-3">
                <label class="form-label">Cognome</label>
                <input type="text" class="form-control" v-model="cognome" />
              </div>
              <div class="mb-3">
                <label class="form-label">Email</label>
                <input type="email" class="form-control" v-model="email" />
              </div>
              <div class="mb-3">
                <label class="form-label">Password</label>
                <input
                  type="password"
                  class="form-control"
                  v-model="password"
                />
              </div>
            </div>
            <div v-else class="text-center text-muted">
              Caricamento dati utente...
            </div>
            <button class="btn btn-success w-100 mt-3" @click="salvaModifiche">
              Salva modifiche
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="custom-actions d-flex flex-column align-items-center gap-2 mt-3">
    <button
      class="btn btn-outline-secondary"
      @click="$router.push('/favorites')"
    >
      Giochi preferiti: {{ numeroPreferiti }}
    </button>

    <button class="btn btn-outline-danger" @click="confermaLogout">
      Logout
    </button>

    <button class="btn btn-danger" @click="confermaEliminaAccount">
      Elimina account
    </button>
  </div>
</template>

<script setup>
import Navbar from "@/components/Navbar.vue";

import { ref, onMounted } from "vue";
import { getutentebynickname } from "@/firebase/utenti.js";
import { getPreferitibynickname } from "@/firebase/preferiti";
import { getDatabase, ref as dbRef, update, remove } from "firebase/database";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { useRouter } from "vue-router";

const nickname = ref("");
const nome = ref("");
const cognome = ref("");
const email = ref("");
const password = ref("");
const immagine = ref("");

const loading = ref(true);

const db = getDatabase();
const storage = getStorage();

const numeroPreferiti = ref(0);

const router = useRouter();

onMounted(async () => {
  const storedNickname = localStorage.getItem("utenteNickname");
  if (!storedNickname) {
    alert("Utente non loggato!");
    return;
  }

  try {
    const utente = await getutentebynickname(storedNickname);
    if (utente) {
      nickname.value = utente.nickname;
      nome.value = utente.nome;
      cognome.value = utente.cognome;
      email.value = utente.email;
      password.value = utente.password;
      immagine.value = utente.immagine || "";
      const lista = await getPreferitibynickname(storedNickname);
      numeroPreferiti.value = lista.length;
    }
  } catch (err) {
    console.error("Errore nel recupero dei dati utente:", err);
  } finally {
    loading.value = false;
  }
});

async function salvaModifiche() {
  const utenteKey = localStorage.getItem("utenteNickname");
  if (!utenteKey) {
    alert("Utente non loggato.");
    return;
  }

  const aggiorna = {
    nome: nome.value,
    cognome: cognome.value,
    email: email.value,
    password: password.value,
  };

  try {
    await update(dbRef(db, `utenti/${utenteKey}`), aggiorna);
    alert("Dati aggiornati con successo!");
    localStorage.setItem("utenteNickname", aggiorna.nickname);
  } catch (error) {
    console.error("Errore aggiornamento:", error);
    alert("Errore durante il salvataggio.");
  }
  if (!utenteKey) {
    alert("Utente non loggato.");
    return;
  }
}

async function handleImageUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const utenteKey = localStorage.getItem("utenteNickname");
  if (!utenteKey) {
    alert("Utente non loggato");
    return;
  }

  try {
    const fileRef = storageRef(storage, `immagini-profilo/${utenteKey}`);
    await uploadBytes(fileRef, file);

    const downloadURL = await getDownloadURL(fileRef);
    immagine.value = downloadURL;
    await update(dbRef(db, `utenti/${utenteKey}`), {
      immagine: downloadURL,
    });

    alert("Immagine aggiornata con successo!");
  } catch (error) {
    console.error("Errore nel caricamento immagine:", error);
    alert("Errore durante il caricamento dell'immagine.");
  }
}

function confermaLogout() {
  if (confirm("Sei sicuro di voler uscire dall'account?")) {
    localStorage.removeItem("utenteNickname");
    router.push("/");
  }
}

async function confermaEliminaAccount() {
  const utenteKey = localStorage.getItem("utenteNickname");

  if (!utenteKey) {
    alert("Utente non loggato.");
    return;
  }

  const conferma = confirm(
    "Sei sicuro di voler ELIMINARE il tuo account? Questa azione è irreversibile."
  );

  if (!conferma) return;

  try {
    await remove(dbRef(db, `utenti/${utenteKey}`));

    await remove(dbRef(db, `preferiti/${utenteKey}`));

    localStorage.removeItem("utenteNickname");
    alert("Account eliminato con successo.");
    router.push("/");
  } catch (error) {
    console.error("Errore durante l'eliminazione dell'account:", error);
    alert("Errore durante l'eliminazione. Riprova.");
  }

  if (!utenteKey) {
    alert("Utente non loggato.");
    return;
  }
}
</script>

<style scoped>
.profilo-placeholder {
  background-color: #333; /* o il colore che vuoi per lo sfondo */
}

.profilo-placeholder i {
  color: white !important;
}
.custom-actions {
  margin-top: 1rem;
}

.custom-actions button {
  margin-top: 0.25rem;
}
</style>
