<template>
  <div class='c-table-body-container'>
    <ul class='c-table-body__record'
        :style='{height: getRecordHeight}'>
      <li class='c-table-body-column'
          v-for='(column, index) in columnsConfig'
          :key='index'
          :columnKey='column.key' :title='record[column.key]'
          :style='getColumnStyle(column)'>
        <div class='c-table-body-column__container'>
          <span v-if='!column.render'>{{record[column.key]}}</span>
          <render-body v-else :key='column.key' :row='record' :render='column.render' :index='index'></render-body>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import RenderBody from './tableHelper/expand';

export default {
  name: 'SingleTableBody',
  components: {RenderBody},
  props: {
    columnsConfig: Array,
    record: Object,
    recordHeight: Number,
  },
  data () {
    return {};
  },
  computed: {
    getRecordHeight: function () {
      return `${this.recordHeight}px`;
    },
  },
  methods: {
    getColumnStyle: function (column) {
      return {
        width: column.cWidth,
        height: `${this.recordHeight}px`,
      };
    },
  },
};
</script>

<style scoped>

</style>
