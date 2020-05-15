/* eslint-disable array-bracket-newline */
/* eslint-disable max-len */
/* eslint-disable array-element-newline */
import Vue from 'vue';
import VueRouter from 'vue-router';
import managerIndex from '../views/manager/index.vue';

Vue.use(VueRouter);

const routes = [
  {
    component: managerIndex,
    name: 'Manager/index',
    path: '/'
  }
];

const router = new VueRouter({
  mode: 'history',
  routes
});

export default router;
