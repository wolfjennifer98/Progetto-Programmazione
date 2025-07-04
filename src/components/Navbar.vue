<template>
  <nav class="navbar bg-light fixed-top shadow-sm d-none d-lg-flex">
    <div class="container justify-content-between align-items-center">
      <button
        v-if="mostraFreccia"
        class="btn btn-outline-secondary me-3"
        @click="$router.back()"
        title="Torna indietro"
      >
        <i class="bi bi-arrow-left"></i>
      </button>

      <router-link
        class="navbar-brand d-flex align-items-center gap-2"
        to="/home"
      >
        <img
          src="@/assets/logo.png"
          alt="Logo PixelPedia"
          width="90"
          height="90"
        />
        <span>PixelPedia</span>
      </router-link>

      <div class="d-flex align-items-center gap-3">
        <router-link
          to="/home"
          class="nav-link px-3 py-1 text-dark link-navbar"
          :class="{ 'link-attivo': route.path === '/home' }"
        >
          Home
        </router-link>
        <router-link
          to="/favorites"
          class="nav-link px-3 py-1 text-dark link-navbar"
          :class="{ 'link-attivo': route.path === '/favorites' }"
        >
          Preferiti
        </router-link>
      </div>

      <form
        ref="filterBox"
        class="d-flex position-relative"
        role="search"
        @submit.prevent="handleSearch"
        @focusout="handleFocusOut"
      >
        <input
          class="form-control me-2"
          type="search"
          placeholder="Cerca un gioco"
          v-model="searchTerm"
          @focus="showFilter = true"
        />
        <button class="btn btn-danger">
          <i class="bi bi-search"></i>
        </button>

        <div
          v-if="showFilter"
          class="position-absolute bg-white border rounded p-2 mt-1 shadow"
          style="top: 100%; z-index: 10; width: 100%"
        >
          <strong class="d-block mb-2 text-muted">Filtra per genere</strong>
          <div class="form-check" v-for="genre in availableGenres" :key="genre">
            <input
              class="form-check-input"
              type="checkbox"
              :id="genre"
              :value="genre"
              v-model="selectedGenres"
              @mousedown="preventClose = true"
            />
            <label class="form-check-label text-muted" :for="genre">
              {{ genre }}
            </label>
          </div>
        </div>
      </form>

      <div class="d-flex flex-column align-items-center ms-2">
        <button
          class="btn btn-outline-dark rounded-circle"
          style="width: 48px; height: 48px"
          @click="$router.push('/profilo')"
        >
          <i class="bi bi-person-fill"></i>
        </button>
        <small class="text-muted mt-1">{{ utenteNome }}</small>
      </div>
    </div>
  </nav>

  <nav class="navbar bg-light fixed-top shadow-sm d-lg-none">
    <div
      class="container d-flex justify-content-between align-items-center px-3"
    >
      <!-- Colonna sinistra: freccia oppure spazio vuoto -->
      <div style="width: 40px">
        <button
          v-if="mostraFreccia"
          class="btn p-0"
          @click="$router.back()"
          title="Torna indietro"
        >
          <i class="bi bi-arrow-left fs-4"></i>
        </button>
      </div>

      <!-- Colonna centrale: logo -->
      <div class="text-center">
        <router-link
          class="navbar-brand fw-bold m-0 text-dark d-flex align-items-center gap-2"
          to="/home"
        >
          <img
            src="@/assets/logo.png"
            alt="Logo PixelPedia"
            width="50"
            height="50"
          />
          <span>PixelPedia</span>
        </router-link>
      </div>

      <!-- Colonna destra: hamburger -->
      <div style="width: 40px" class="text-end">
        <button
          class="btn p-0"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#mobileMenu"
          title="Menu"
        >
          <i class="bi bi-list fs-3"></i>
        </button>
      </div>
    </div>
  </nav>

  <div class="offcanvas offcanvas-end custom-blur" id="mobileMenu">
    <div class="offcanvas-header px-3">
      <div class="container d-flex justify-content-end">
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="offcanvas"
          aria-label="Chiudi"
        ></button>
      </div>
    </div>

    <div class="offcanvas-body px-0">
      <div class="container d-flex flex-column gap-3">
        <div class="input-group px-3">
          <input
            class="form-control"
            type="search"
            placeholder="Cerca..."
            v-model="searchTerm"
            @focus="showFilter = true"
            @focusout="handleFocusOut"
          />
          <button class="btn btn-danger" @click="handleSearch">
            <i class="bi bi-search"></i>
          </button>
        </div>

        <div
          v-if="showFilter"
          class="bg-white border rounded p-2 shadow px-3"
          style="z-index: 10"
        >
          <strong class="d-block mb-2">Filtra per genere</strong>
          <div class="form-check" v-for="genre in availableGenres" :key="genre">
            <input
              class="form-check-input"
              type="checkbox"
              :id="genre"
              :value="genre"
              v-model="selectedGenres"
              @mousedown="preventClose = true"
            />
            <label class="form-check-label" :for="genre">{{ genre }}</label>
          </div>
        </div>

        <div class="d-flex flex-column align-items-center">
          <button
            class="btn btn-outline-dark rounded-circle px-3"
            style="width: 48px; height: 48px"
            @click="chiudiMenuENaviga('/profilo')"
          >
            <i class="bi bi-person-fill"></i>
          </button>
          <small class="text-muted mt-1">{{ utenteNome }}</small>
        </div>

        <button
          class="btn btn-outline-secondary px-5"
          @click="chiudiMenuENaviga('/home')"
        >
          Home
        </button>

        <button
          class="btn btn-outline-secondary px-3"
          @click="chiudiMenuENaviga('/favorites')"
        >
          Preferiti
        </button>
        <button class="btn btn-outline-danger px-3" @click="logout">
          Logout
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Offcanvas } from "bootstrap";

const route = useRoute();
const router = useRouter();
const giochi = ref([]);

const searchTerm = ref("");
const selectedGenres = ref([]);
const showFilter = ref(false);
const preventClose = ref(false);
const utenteNome = ref("Utente");
const mostraFreccia = ref(false);

watch(
  () => route.path,
  (newPath) => {
    const isNotHome = newPath !== "/" && newPath !== "/home";
    mostraFreccia.value = isNotHome && window.history.length > 1;
  },
  { immediate: true }
);

onMounted(async () => {
  utenteNome.value = localStorage.getItem("utenteNickname") || "Utente";

  try {
    const res = await fetch("http://localhost:5000/games");
    if (!res.ok) throw new Error("Errore nel recupero giochi");
    giochi.value = await res.json();
  } catch (err) {
    console.error("Errore nel caricamento dei giochi:", err);
  }

  const offcanvasEl = document.getElementById("mobileMenu");
  if (offcanvasEl) {
    offcanvasEl.addEventListener("hidden.bs.offcanvas", () => {
      offcanvasEl.classList.remove("custom-blur");
      document.body.style.backdropFilter = "none";
      document.body.classList.remove("offcanvas-backdrop");
    });

    offcanvasEl.addEventListener("show.bs.offcanvas", () => {
      offcanvasEl.classList.add("custom-blur");
    });
  }
});

const availableGenres = computed(() => {
  const set = new Set();
  giochi.value.forEach((game) => {
    game.genres.forEach((genre) => set.add(genre));
  });
  return Array.from(set);
});

function handleFocusOut() {
  setTimeout(() => {
    if (preventClose.value) {
      preventClose.value = false;
      return;
    }
    showFilter.value = false;
  }, 100);
}

function handleSearch() {
  const currentPath = router.currentRoute.value.path;
  router.push({
    path: currentPath === "/favorites" ? "/favorites" : "/home",
    query: {
      ricerca: searchTerm.value,
      generi: selectedGenres.value.join(","),
    },
  });
}

function chiudiMenuENaviga(percorso) {
  const offcanvasEl = document.getElementById("mobileMenu");
  if (offcanvasEl) {
    const offcanvas =
      Offcanvas.getInstance(offcanvasEl) || new Offcanvas(offcanvasEl);
    offcanvas.hide();
    offcanvasEl.classList.remove("custom-blur");
    document.body.style.backdropFilter = "none";
    document.body.classList.remove("offcanvas-backdrop");
  }
  setTimeout(() => router.push(percorso), 200);
}
function logout() {
  localStorage.removeItem("utenteNickname");
  router.push("/");
}
</script>
