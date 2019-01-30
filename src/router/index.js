import Vue from 'vue';
import Router from 'vue-router';
import CommonTable from '@/example/CommonTable.vue';
import RequestAnimationFrameTable from '@/example/requestAnimationFrameTable.vue';
import VirtualScrollTable from '@/example/virtualScrollTable.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Common Table',
      component: CommonTable,
    },
    {
      path: '/requestAnimationFrame',
      name: 'Request Animation Frame Table',
      component: RequestAnimationFrameTable,
    },
    {
      path: '/virtualScroll',
      name: 'Virtual Scroll Table',
      component: VirtualScrollTable,
    },
  ],
});
