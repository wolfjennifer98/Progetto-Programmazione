<template>
  <div
    class="container-fluid min-vh-100 d-flex align-items-center justify-content-center px-3"
  >
    <div class="row w-100 justify-content-center align-items-center">
      <div class="col-12 col-md-6 text-center text-white mb-4 mb-md-0">
        <img
          src="@/assets/logo.png"
          alt="PixelPedia Logo"
          style="max-width: 150px"
          class="mb-4"
        />
        <h2 class="fw-bold">
          Benvenuti su <span class="text-acqua">PixelPedia</span>
        </h2>
        <p class="px-3">
          Scopri, salva e approfondisci le tue conoscenze dei tuoi giochi pixel
          preferiti!
        </p>
      </div>

      <div class="col-12 col-md-6">
        <div
          class="card p-4 shadow"
          style="width: 100%; max-width: 500px; margin: 0 auto"
        >
          <h3 class="text-center mb-4">Registrati</h3>
          <form @submit.prevent="handleSignIn">
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Nome</label>
                <input
                  type="text"
                  v-model="nome"
                  class="form-control"
                  required
                />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Cognome</label>
                <input
                  type="text"
                  v-model="cognome"
                  class="form-control"
                  required
                />
              </div>
            </div>

            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Email</label>
                <input
                  type="email"
                  v-model="email"
                  class="form-control"
                  required
                />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Password</label>
                <input
                  type="password"
                  v-model="password"
                  class="form-control"
                  required
                />
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label">Conferma Password</label>
              <input
                type="password"
                v-model="confirmPassword"
                class="form-control"
                required
              />
            </div>

            <div class="mb-3">
              <label class="form-label">Nickname</label>
              <input
                type="text"
                v-model="nickname"
                class="form-control"
                required
              />
            </div>

            <button class="btn btn-primary w-100" type="submit">
              Conferma
            </button>
          </form>

          <div class="text-center mt-3">
            <span>
              Hai già un account?
              <router-link to="/">Accedi</router-link>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { createutente } from "@/firebase/utenti";

const nome = ref("");
const cognome = ref("");
const email = ref("");
const password = ref("");
const nickname = ref("");
const confirmPassword = ref("");
const router = useRouter();

async function handleSignIn() {
  if (password.value !== confirmPassword.value) {
    alert("Le password non coincidono!");
    return;
  }
  try {
    await createutente(
      email.value,
      nome.value,
      cognome.value,
      password.value,
      nickname.value
    );
    alert("Utente salvato nel database!");
    router.push("/Home");
  } catch (error) {
    console.error("Errore nella registrazione:", error);
  }
  localStorage.setItem("utenteNickname", nickname.value);
}
</script>
