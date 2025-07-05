<template>
  <Navbar />
  <main class="container-fluid p-2 page-content pt-1 pt-lg-2 mt-5">
    <h2 class="text-center my-4">Entra nel mondo dei giochi pixel art!</h2>

    <div v-if="filteredGames.length === 0" class="text-center text-white mt-5">
      <h4>😢 Non abbiamo trovato nulla con le caratteristiche che cerchi.</h4>
    </div>

    <div class="row g-4" v-else>
      <div
        class="col-12 col-sm-6 col-md-4 col-lg-3"
        v-for="game in filteredGames"
        :key="game.id"
      >
        <router-link
          :to="`/game/${game.id}`"
          class="text-decoration-none text-dark"
        >
          <GameCard :game="game" />
        </router-link>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import GameCard from "@/components/GameCard.vue";
import Navbar from "@/components/Navbar.vue";

const route = useRoute();

const allGames = ref([]);
const searchTerm = ref(route.query.ricerca || "");
const selectedGenres = ref(
  route.query.generi ? route.query.generi.split(",") : []
);

watch(
  () => route.query,
  (newQuery) => {
    searchTerm.value = newQuery.ricerca || "";
    selectedGenres.value = newQuery.generi ? newQuery.generi.split(",") : [];
  }
);
const utenteNome = ref("");

onMounted(() => {
  utenteNome.value =
    localStorage.getItem("utenteNickname") || "utenteNome" || "Utente";
});

onMounted(async () => {
  try {
    const response = await fetch("http://localhost:5000/games");
    if (!response.ok) throw new Error("Errore nella chiamata API");
    const data = await response.json();
    allGames.value = data;
    console.log("Dati ricevuti dal DB:", data);
  } catch (error) {
    console.error("Errore nel collegamento al DB:", error);
  }
});

const filteredGames = computed(() => {
  return allGames.value.filter((game) => {
    const matchesTitle = game.title
      .toLowerCase()
      .includes(searchTerm.value.toLowerCase());
    const matchesGenre =
      selectedGenres.value.length === 0 ||
      selectedGenres.value.some((genre) => game.genres.includes(genre));
    return matchesTitle && matchesGenre;
  });
});
</script>
