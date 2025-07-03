<script setup>
import { RouterView } from "vue-router";
</script>

<template>
  <div>
    <main class="main-content py-5">
      <RouterView />
    </main>
  </div>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap");

html,
body,
#app {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  box-sizing: border-box;
  background: #1b1b2f;
}

*,
*::before,
*::after {
  box-sizing: inherit;
}

.header {
  width: 100%;
  background: #151522;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  border-bottom: 2px solid #42b983;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo {
  height: 48px;
}

.title {
  color: #42b983;
  font-size: 0.7rem;
  white-space: nowrap;
}

.nav-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-top: 0.5rem;
}

.nav-bar a {
  color: #42b983;
  text-decoration: none;
  font-size: 0.6rem;
}

.nav-bar a.router-link-exact-active {
  text-decoration: underline;
}

.main-content {
  flex: 1;
  padding: 0;
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .logo-section {
    justify-content: center;
  }

  .nav-bar {
    justify-content: center;
    gap: 1rem;
    margin-top: 1rem;
  }
}
</style>
