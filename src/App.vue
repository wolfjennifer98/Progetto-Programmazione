<script setup>
import { RouterView } from "vue-router";
</script>

<template>
  <div>
    <main class="py-5">
      <!-- visualizzata la view corrispondente alla route attiva -->
      <RouterView />
    </main>
  </div>
</template>
