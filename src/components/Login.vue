<template>
  <div
    class="container-fluid vh-100 d-flex justify-content-center align-items-center"
  >
    <div
      class="row w-100 justify-content-center align-items-center"
      style="max-width: 900px"
    >
      <div class="col-12 col-md-6 text-center text-white p-4">
        <img
          src="@/assets/logo.png"
          alt="PixelPedia Logo"
          class="mb-4"
          style="max-width: 150px"
        />
        <h2>Entra nel mondo di <span class="text-acqua">PixelPedia</span></h2>
      </div>

      <div class="col-12 col-md-6 d-flex justify-content-center">
        <div class="card p-4 shadow w-100" style="max-width: 400px">
          <h3 class="text-center mb-4">Login</h3>

          <form @submit.prevent="handleLogin">
            <div class="mb-3">
              <label class="form-label">Mail</label>
              <input
                type="email"
                v-model="email"
                :class="['form-control', { 'is-invalid': emailError }]"
                required
              />
              <div v-if="emailError" class="invalid-feedback">
                Account inesistente
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label">Password</label>
              <input
                type="password"
                v-model="password"
                :class="['form-control', { 'is-invalid': passwordError }]"
                required
              />
              <div v-if="passwordError" class="invalid-feedback">
                Password errata
              </div>
            </div>

            <button class="btn btn-primary w-100" type="submit">Login</button>
          </form>

          <div class="text-center mt-3">
            <span>
              Non hai un account?
              <router-link to="/signin">Registrati</router-link>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { getUtenteByEmail } from "@/firebase/utenti";

const email = ref("");
const emailError = ref(false);
const password = ref("");
const router = useRouter();
const passwordError = ref(false);

async function handleLogin() {
  const utente = await getUtenteByEmail(email.value);

  if (!utente) {
    emailError.value = true;
    return;
  } else {
    emailError.value = false;
  }

  if (utente.password !== password.value) {
    passwordError.value = true;
    return;
  }

  localStorage.setItem("utenteNickname", utente.nickname);

  router.push("/home");
}

watch(email, () => {
  emailError.value = false;
});

watch(password, () => {
  passwordError.value = false;
});
</script>

<style scoped>
input.form-control {
  font-size: 1.1rem;
}
</style>
