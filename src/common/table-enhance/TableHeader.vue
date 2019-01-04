<template>
  <table class='c_table-header-wrapper'>
    <colgroup ref='CTableTheadColGroup'>
      <col v-for='column in columnsRow' :width='column.cWidth' :columnKey='column[cIdKey]'/>
    </colgroup>
    <thead ref='CTableThead'>
      <tr v-for='rowConfig in columnsConfig' :style='getHeaderHeight'>
        <th class='c_table-header-wrapper__th'
          v-for='(column, index) in rowConfig'
            :key='column[cIdKey]'
            :columnKey='column[cIdKey]'
            :style='getColumnStyle(column)'
            :colspan='column.colSpan'
            :title='column.title'
            :rowSpan='column.rowSpan'>
            <span v-if='column.sortable' class='ivu-table-sort'>
              <i class='ivu-icon ivu-icon-arrow-up-b'
                 :style='{color: getSortedActiveColor(column,"asc")}'
                 @click.stop='sortByArrowIcon(column,"asc")'
              ></i>
              <i class='ivu-icon ivu-icon-arrow-down-b'
                 :style='{color: getSortedActiveColor(column,"desc")}'
                 @click.stop='sortByArrowIcon(column,"desc")'
              ></i>
            </span>
          <span v-if='!column.renderHeader'>{{column.title}}</span>
          <render-header v-else :render='column.renderHeader' :column='column' :index='index'></render-header>
        </th>
      </tr>
    </thead>
  </table>
</template>

<script>
  import {
    C_ID_NAME,
    C_SORT_NAME,
    DEFAULT_TABLE_HEADER_HEIGHT,
    NO_SORTING,
  } from './tableHelper/constant';
  import RenderHeader from './tableHelper/header';

  export default {
    name: 'CTableHeader',
    components: {RenderHeader},
    props: {
      columnsConfig: {
        type: Array,
        default () {
          return [];
        },
      },
      columnsRow: {
        type: Array,
        default () {
          return [];
        },
      },
      headerHeight: {
        type: Number,
        default () {
          return DEFAULT_TABLE_HEADER_HEIGHT;
        },
      },
    },
    data () {
      return {
        cIdKey: C_ID_NAME,
      };
    },
    methods: {
      getSortedActiveColor: function (column, sortType) {
        if (column[C_SORT_NAME] === sortType) {
          return '#297ea3';
        }
        return '';
      },
      getColumnStyle: function (column) {
        const style = {
          'overflow': 'hidden',
          'word-break': 'keep-all',
          'text-align': 'left',
        };
        if (column.enableEllipsis) {
          style['word-break'] = 'break-all';
          style['text-overflow'] = 'ellipsis';
          style['white-space'] = 'nowrap';
        }
        if (column.align) {
          style['text-align'] = column.align;
        }
        return style;
      },
      sortByArrowIcon: function (column, sortType) {
        this.resetRowOtherColumnsSorting(column[C_ID_NAME], sortType);
        this.resetConfigOtherColumnsSorting(column[C_ID_NAME], sortType);
        this.$parent.handleSort(column[C_ID_NAME], column[C_SORT_NAME]);
      },
      resetRowOtherColumnsSorting: function (cId, sortType) {
        for (const column of this.columnsRow) {
          if (column[C_ID_NAME] !== cId) {
            column[C_SORT_NAME] = NO_SORTING;
            continue;
          }
          column[C_SORT_NAME] = sortType;
        }
      },
      resetConfigOtherColumnsSorting: function (cId, sortType) {
        for (const rowConfig of this.columnsConfig) {
          for (const column of rowConfig) {
            this.$set(column, C_SORT_NAME, column[C_ID_NAME] === cId ? sortType : NO_SORTING);
          }
        }
      },
    },
    computed: {
      getHeaderHeight: function () {
        return {
          height: `${this.headerHeight}px`,
        };
      },
      sortedActiveColor: function () {
        return this.getSortedActiveColor;
      },
    },
  };
</script>

<style scoped>

</style>
