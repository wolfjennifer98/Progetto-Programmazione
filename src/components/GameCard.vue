<template>
  <div class="card pixel h-100">
    <img
      :src="game.image"
      alt="copertina"
      class="img-fluid rounded game-image"
      style="max-height: 150px"
    />

    <div
      class="card-body d-flex flex-column justify-content-around align-items-center bg-dark text-white"
    >
      <h2 class="card-title m-0 my-3 px-2 text-center">{{ game.title }}</h2>

      <div class="d-flex justify-content-center align-items-center gap-2 mt-3">
        <router-link
          :to="`/game/${game.id}`"
          class="btn-scopri text-decoration-none text-white"
        >
          Scopri
        </router-link>
        <button
          class="btn btn-outline-light p-2 d-flex align-items-center justify-content-center"
          @click.stop.prevent="togglePreferito"
          :title="
            isPreferito ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'
          "
          style="width: 38px; height: 38px"
        >
          <i
            :class="isPreferito ? 'bi bi-heartbreak-fill' : 'bi bi-heart-fill'"
            class="fs-5"
          ></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import {
  createPreferiti,
  removePreferiti,
  getPreferitibynickname,
} from "@/firebase/preferiti";

const props = defineProps({
  game: Object,
});

const isPreferito = ref(false);

onMounted(async () => {
  const nickname = localStorage.getItem("utenteNickname");
  if (nickname) {
    const lista = await getPreferitibynickname(nickname);
    isPreferito.value =
      Array.isArray(lista) && lista.includes(props.game.title);
  }
});

async function togglePreferito() {
  const nickname = localStorage.getItem("utenteNickname");
  if (!nickname) {
    alert("Effettua il login per usare i preferiti!");
    return;
  }

  try {
    if (!isPreferito.value) {
      await createPreferiti(nickname, props.game.title);
      isPreferito.value = true;
      alert(`"${props.game.title}" aggiunto ai preferiti!`);
    } else {
      await removePreferiti(nickname, props.game.title);
      isPreferito.value = false;
      alert(`"${props.game.title}" rimosso dai preferiti.`);
    }
  } catch (err) {
    console.error("Errore:", err);
    alert("Errore nella gestione dei preferiti.");
  }
}
</script>

<style scoped>
.card {
  transition: transform 0.3s ease;
}
.card:hover {
  transform: scale(1.05);
}

.btn-scopri {
  background-color: turquoise;
  border: none;
  padding: 0.4rem 1rem;
  border-radius: 8px;
  font-weight: bold;
  transition: background-color 0.3s;
}
.btn-scopri:hover {
  background-color: #00cccc;
  color: white;
}
.game-image {
  width: 100%;
  height: auto;
  object-fit: cover;
  aspect-ratio: 16 / 9;
  border-radius: 10px;
}
</style>
