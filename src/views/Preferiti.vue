<template>
  <Navbar />
  <main class="container-fluid p-3" style="padding-top: 100px">
    <main class="container mt-5 pt-5">
      <h2 class="text-center mb-4">I tuoi giochi preferiti</h2>
    </main>

    <div v-if="filteredGames.length > 0" class="row g-4">
      <div
        class="col-12 col-sm-6 col-md-4 col-lg-3"
        v-for="game in filteredGames"
        :key="game.id"
      >
        <GameCard :game="game" @rimuovi="rimuoviPreferito" />
      </div>
    </div>

    <div v-else class="text-center mt-5">
      <p>Non hai ancora aggiunto nessun gioco ai preferiti.</p>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import Navbar from "@/components/Navbar.vue";
import GameCard from "@/components/GameCard.vue";
import { getPreferitibynickname } from "@/firebase/preferiti.js";

const route = useRoute();
const allGames = ref([]);
const giochiPreferiti = ref([]);
const filteredGames = ref([]);
const utente = localStorage.getItem("utenteNickname");
const searchTerm = ref(route.query.ricerca || "");
const selectedGenres = ref(
  route.query.generi ? route.query.generi.split(",") : []
);

function aggiornaFilteredGames() {
  filteredGames.value = giochiPreferiti.value.filter((game) => {
    const matchesTitle = game.title
      .toLowerCase()
      .includes(searchTerm.value.toLowerCase());

    const matchesGenre =
      selectedGenres.value.length === 0 ||
      selectedGenres.value.some((genre) => game.genres.includes(genre));

    return matchesTitle && matchesGenre;
  });
}

function rimuoviPreferito(titoloGioco) {
  giochiPreferiti.value = giochiPreferiti.value.filter(
    (g) => g.title !== titoloGioco
  );
  aggiornaFilteredGames();
}

onMounted(async () => {
  if (!utente) {
    alert("Utente non loggato.");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/games");
    const data = await res.json();
    allGames.value = data;

    const preferiti = await getPreferitibynickname(utente);
    giochiPreferiti.value = allGames.value.filter((game) =>
      preferiti.includes(game.title)
    );

    aggiornaFilteredGames();
  } catch (error) {
    console.error("Errore nel caricamento preferiti:", error);
  }
});

watch(
  () => route.query,
  (newQuery) => {
    searchTerm.value = newQuery.ricerca || "";
    selectedGenres.value = newQuery.generi ? newQuery.generi.split(",") : [];
    aggiornaFilteredGames();
  }
);
</script>

<style scoped>
.active-link {
  font-weight: bold;
  text-decoration: underline;
}
</style>
