<template>
  <ul class='c-table-header__record' :style='{height: getHeaderHeight}'>
    <li class='c-table-header-column'
        v-for='(column, index) in columnsConfig'
        :key='column[cIdKey]'
        :columnKey='column[cIdKey]'
        :title='column.title'
        :style='getColumnStyle(column)'
    >
      <div class='c-table-header-column__container'>
        <span v-if='!column.renderHeader'>{{column.title}}</span>
        <render-header v-else :render='column.renderHeader' :column='column' :index='index'></render-header>
      </div>
    </li>
  </ul>
</template>

<script>
  import RenderHeader from './tableHelper/expand';
  import {ID_NAME} from './tableHelper/constant';

  export default {
    name: 'SingleTableHeader',
    components: {RenderHeader},
    props: {
      columnsConfig: Array,
      height: Number,
    },
    data () {
      return {
        cIdKey: ID_NAME,
      };
    },
    computed: {
      getHeaderHeight: function () {
        return {
          height: `${this.height}px`,
        };
      },
    },
    methods: {
      getColumnStyle: function (column) {
        return {
          width: column.cWidth,
          height: `${this.height}px`,
        };
      },
    },
  };
</script>

<style scoped>

</style>
