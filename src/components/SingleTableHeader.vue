<template>
  <section class='c-table-header-container'>
    <ul class='c-table-record c-table-header-record' :style='{height: getHeaderHeight}'>
      <li class='c-table-record__column c-table-header-record__column'
          v-for='(column, index) in tableTitle'
          :key='column[cIdKey]'
          :columnKey='column[cIdKey]'
          :title='column.titleName'
          :style='{width: column.width ? column.width : defaultWidth}'
      >
        <span v-if='!column.renderHeader'>{{column.titleName}}</span>
        <render-header v-else :render='column.renderHeader' :column='column' :index='index'></render-header>
      </li>
    </ul>
  </section>
</template>

<script>
  import RenderHeader from './tableHelper/expand'
  import {DEFAULT_TABLE_HEADER_HEIGHT} from '../common/table-enhance/tableHelper/constant'

  export default {
    name: 'SingleTableHeader',
    components: {RenderHeader},
    props: {
      columnsConfig: Array,
      height: {
        type: Number,
        default: function () {
          return DEFAULT_TABLE_HEADER_HEIGHT
        }
      }
    },
    data() {
      return {}
    },
    computed: {
      getHeaderHeight: function () {
        return {
          height: `${this.height}px`
        }
      }
    },
    methods: {}
  }
</script>

<style scoped>

</style>
