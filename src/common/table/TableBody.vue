<template>
  <div :style='recordStyle'>
    <ul class='table-record' :style='{height: getRecordHeight}'>
      <li class='table-record__column table-body-record__column'
          v-for='(column, index) in tableTitle' :key='index'
          :columnKey='column.key' :title='record[column.key]'
          :style='{width: initColumnWidth(column.width, index)}'>
        <div class='text-overflow' v-if='column.noNeedVertical'>
          <render-body :key='column.key' :row='record' :render='column.render' :index='index'></render-body>
        </div>
        <div v-else class='text-overflow table-record__column--vertical'>
          <span v-if='!column.render'>{{record[column.key]}}</span>
          <render-body v-else :key='column.key' :row='record' :render='column.render' :index='index'></render-body>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  import RenderBody from './tableHelper/body';

  export default {
    components: {RenderBody},
    props: {
      tableTitle: {type: Array},
      record: {type: Object},
      columnHeight: {type: Number}
    },
    computed: {
      defaultWidth: function () {
        return this.tableTitle.length > 0 ? `${(100 / this.tableTitle.length).toFixed(2)}%` : '100%';
      },
      getRecordHeight: function () {
        return `${this.columnHeight}px`;
      }
    },
    watch: {
      record: {
        handler: function (val) {
          this.recordStyle = {
            display: val.isHidden ? 'none' : ''
          };
        },
        immediate: true,
        deep: true
      }
    },
    methods: {
      initColumnWidth: function (columnWidth, index) {
        if (index === this.tableTitle.length - 1) {
          return `${100 / this.tableTitle.length}%`;
        }
        return columnWidth || this.defaultWidth;
      }
    },
    data() {
      return {
        recordStyle: {}
      };
    }
  };
</script>

<style scoped>
</style>
