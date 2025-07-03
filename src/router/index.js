import { createRouter, createWebHistory } from "vue-router";
import Login from "../components/Login.vue";
import SignIn from "../components/SignIn.vue";
import Home from "../views/Home.vue";
import GamePage from "../views/GamePage.vue";
import Profilo from "../components/Profilo.vue";
import Preferiti from "../views/Preferiti.vue";

const routes = [
  { path: "/", component: Login },
  { path: "/signin", component: SignIn },
  { path: "/home", component: Home },
  { path: "/game/:id", name: "GamePage", component: GamePage, props: true },
  { path: "/profilo", component: Profilo },
  { path: "/favorites", component: Preferiti },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
