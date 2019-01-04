<template>
  <div class='table-header-container'>
    <ul id='headerULContainer' class='table-record table-header-record' :style='{height: getHeaderHeight}'>
      <li class='table-record__column table-header-record__column'
          v-for='(column, index) in tableTitle'
          :key='index' :columnKey='column.key'
          :title='column.titleName'
          :style='{width: column.width ? column.width : defaultWidth}'>
        <div v-if='column.sortable' class='ivu-table-sort'>
          <i class='ivu-icon ivu-icon-arrow-up-b' :style='{color:getSortedActiveColor(index,"asc")}' @click.stop='sortByArrowIcon(index,column,"asc")'></i>
          <i class='ivu-icon ivu-icon-arrow-down-b' :style='{color:getSortedActiveColor(index,"desc")}' @click.stop='sortByArrowIcon(index,column,"desc")'></i>
        </div>
        <div class='text-overflow table-header-record__column--hight'>
          <span v-if='!column.renderHeader'>{{column.titleName}}</span>
          <render-header v-else :render='column.renderHeader' :column='column' :index='index'></render-header>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  import RenderHeader from './tableHelper/header';
  import {ASC, DESC, NO_SORTING} from './tableHelper/constant';

  export default {
    components: {RenderHeader},
    props: {
      tableTitle: {type: Array},
      titleHeight: {type: Number},
    },
    computed: {
      getHeaderHeight: function () {
        return `${this.titleHeight}px`;
      },
      defaultWidth: function () {
        return this.tableTitle.length > 0 ? `${(100 / this.tableTitle.length).toFixed(2)}%` : '100%';
      },
    },
    methods: {
      getSortedActiveColor: function (index, sortType) {
        const column = this.tableTitle[index];
        if (column._sortType === sortType) {
          return '#297ea3';
        }
        return '';
      },
      sortByColumn: function (column, sortColumnIndex) {
        this.resetOtherColumnsSorting(sortColumnIndex);
        switch (column._sortType) {
          case ASC:
            this.$set(column, '_sortType', DESC);
            break;
          case DESC:
            this.$set(column, '_sortType', NO_SORTING);
            break;
          case NO_SORTING:
            this.$set(column, '_sortType', ASC);
            break;
          default:
            this.$set(column, '_sortType', ASC);
        }
        this.$parent.handleSort(sortColumnIndex, column._sortType);
      },
      sortByArrowIcon: function (index, column, sortType) {
        this.resetOtherColumnsSorting(index);
        this.$set(column, '_sortType', sortType);
        this.$parent.handleSort(index, column._sortType);
      },
      resetOtherColumnsSorting: function (index) {
        this.tableTitle.forEach((column, i) => {
          if (index !== i) {
            this.$set(column, '_sortType', NO_SORTING);
          }
        });
      },
    },
    data () {
      return {};
    },
  };
</script>

<style scoped>
  .ivu-table-sort {
    margin-top: 7px;
    margin-right: 2px;
  }

  .ivu-table-sort i .on {
    color: #297ea3;
  }
</style>
