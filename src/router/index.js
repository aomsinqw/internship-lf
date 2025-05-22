import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Pokemon from '../views/Pokemon.vue';
import Register from '@/views/members/Register.vue';
import MemberList from '@/views/members/MemberList.vue';

const routes = [
  { path: '/home', name: 'Home', component: Home },
  { path: '/pokemon', name: 'Pokemon', component: Pokemon },
  { path: '/register', name: 'Register', component: Register },
  { path: '/memberlist', name:'MemberList', component: MemberList }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;



