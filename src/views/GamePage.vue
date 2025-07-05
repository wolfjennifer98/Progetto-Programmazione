<template>
  <Navbar :showBack="true" />
  <div class="container mt-5 pt-3">
    <!--Contenuto mostrato solo se sono stati caricati i dati di gioco-->
    <div v-if="game && game.genres" class="row gx-5 gy-4">
      <!-- Immagine e trailer -->
      <div class="col-12 col-lg-5 text-center">
        <img
          :src="game.image"
          :alt="game.title"
          class="img-fluid rounded w-100"
          style="max-height: 320px; object-fit: contain"
        />
        <a
          :href="game.trailer"
          target="_blank"
          class="d-flex flex-column align-items-center mt-3 text-decoration-none text-white"
        >
          <i class="bi bi-youtube fs-3"></i>
          <span class="fw-bold small">Guarda il trailer</span>
        </a>
      </div>

      <!-- Dettagli gioco -->
      <div class="col-12 col-lg-7 text-white">
        <div class="d-flex align-items-center flex-wrap gap-2 mb-3">
          <h1 class="titolo-gioco text-acqua m-0">{{ game.title }}</h1>
        </div>
        <p>
          <strong class="text-acqua">Genere:</strong>
          {{ game.genres.join(", ") }}
        </p>
        <p><strong class="text-acqua">Anno:</strong> {{ game.year }}</p>
        <p>
          <strong class="text-acqua">Developer:</strong> {{ game.developer }}
        </p>
        <p>
          <strong class="text-acqua">Piattaforme:</strong>
          {{ game.platforms.join(", ") }}
        </p>
        <p><strong class="text-acqua">Descrizione (No spoiler):</strong></p>
        <p style="white-space: pre-wrap">{{ game.description }}</p>

        <!-- Pulsante per mostrare/nascondere spoiler -->
        <div class="mt-3">
          <button
            class="btn btn-warning"
            @click="toggleSpoiler = !toggleSpoiler"
          >
            {{ toggleSpoiler ? "Nascondi Spoiler" : "Mostra Spoiler" }}
          </button>
          <transition name="fade">
            <p v-if="toggleSpoiler" class="mt-2" style="white-space: pre-wrap">
              {{ game.spoiler }}
            </p>
          </transition>
        </div>

        <!-- Voto e recensione -->
        <div class="mt-4">
          <img
            :src="votoImagePath"
            :alt="`Voto ${game.voto}`"
            style="height: 50px"
          />
          <div class="mt-3">
            <strong class="text-acqua">Recensione:</strong>
            <div v-if="Array.isArray(game.recensione)" class="mt-2">
              <div
                v-for="(voce, index) in game.recensione"
                :key="index"
                class="mb-2"
              >
                <strong>{{ voce.voce }}:</strong>
                <span>{{ voce.voto }}</span>
                <em v-if="voce.nota" class="text-acqua ms-2"
                  >({{ voce.nota }})</em
                >
              </div>
            </div>
            <p v-else>{{ game.recensione }}</p>
          </div>
        </div>

        <!-- Link alla guida -->
        <p class="overflow-hidden">
          <strong class="text-acqua" style="font-size: 1.2rem"
            >Non riesci ad andare avanti nel gioco? Eccoti un aiutino</strong
          >
          <a :href="game.guide" target="_blank" class="text-white">
            {{ game.guide }}
          </a>
        </p>

        <!-- Aggiunta/rimozione preferiti -->
        <button class="btn btn-outline-danger mt-3" @click="togglePreferito">
          <i
            :class="
              isPreferito
                ? 'bi bi-heartbreak-fill me-2'
                : 'bi bi-heart-fill me-2'
            "
          ></i>
          {{ isPreferito ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti" }}
        </button>
      </div>
    </div>

    <!-- Messaggio di caricamento o errore -->
    <div v-else class="text-center mt-5 text-white">
      <p>Caricamento in corso o gioco non trovato.</p>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import {
  createPreferiti,
  removePreferiti,
  getPreferitibynickname,
} from "@/firebase/preferiti";
import Navbar from "@/components/Navbar.vue";

const route = useRoute();
const game = ref({});
const toggleSpoiler = ref(false);
const votoImagePath = ref("");
const isPreferito = ref(false);

onMounted(async () => {
  const id = route.params.id;

  try {
    const response = await fetch(`http://localhost:5000/games/${id}`);
    if (!response.ok) throw new Error("Gioco non trovato");
    game.value = await response.json();

    votoImagePath.value = `/voti/${game.value.voto}.svg`;

    const nickname = localStorage.getItem("utenteNickname");
    if (nickname) {
      const lista = await getPreferitibynickname(nickname);
      isPreferito.value =
        Array.isArray(lista) && lista.includes(game.value.title);
    }
  } catch (error) {
    console.error("Errore nel recupero del gioco:", error);
  }
});

async function togglePreferito() {
  const nickname = localStorage.getItem("utenteNickname");
  if (!nickname) {
    alert("Effettua il login per salvare nei preferiti");
    return;
  }

  try {
    if (!isPreferito.value) {
      await createPreferiti(nickname, game.value.title);
      isPreferito.value = true;
    } else {
      await removePreferiti(nickname, game.value.title);
      isPreferito.value = false;
    }
  } catch (err) {
    console.error("Errore:", err);
    alert("Errore nella gestione dei preferiti. Riprova.");
  }
}
</script>

<style scoped>
.titolo-gioco {
  font-size: 5rem;
  font-weight: bold;
  letter-spacing: 1px;
  line-height: 1.2;
  word-break: break-word;
  text-align: center;
}

@media (max-width: 768px) {
  .titolo-gioco {
    font-size: 2rem;
    text-align: center;
  }

  img {
    max-height: 200px;
  }

  p {
    font-size: 1.2rem;
    word-break: break-word;
  }

  .btn {
    font-size: 1.2rem;
    padding: 0.45rem 1rem;
  }
}
</style>
