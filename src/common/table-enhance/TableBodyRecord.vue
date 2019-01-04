<template>
  <ul class='c-table-body-wrapper__tr c-table-body-wrapper__ul'
      v-show='!record.isHidden'
      :style='getColumnHeightStyle'
      :class='rowClassName(record)'>
    <li
      class='c-table-body-wrapper__td'
      v-for='(column, index) in columnsRow'
      :key='index'
      :style='getColumnStyle(column)'
      :title='record[column.key]'>
      <span v-if='!column.render'>{{record[column.key]}}</span>
      <render-body v-else
                   :key='index'
                   :row='record'
                   :render='column.render'
                   :index='recordIndex'></render-body>
    </li>
  </ul>
</template>

<script>
  import RenderBody from './tableHelper/body';
  import {
    DEFAULT_TABLE_COLUMN_HEIGHT,
  } from './tableHelper/constant';

  export default {
    components: {RenderBody},
    props: {
      columnsRow: {
        type: Array,
        default: [],
      },
      record: {
        type: Object,
        default: {},
      },
      columnHeight: {
        type: Number,
        default: DEFAULT_TABLE_COLUMN_HEIGHT,
      },
      recordIndex: {
        type: Number,
        default: 0,
      },
      rowClassName: {
        type: Function,
      },
    },
    data () {
      return {};
    },
    methods: {
      getColumnStyle: function (column) {
        const style = {
          'overflow': 'hidden',
          'word-break': 'keep-all',
        };
        if (column.enableEllipsis) {
          style['word-break'] = 'break-all';
          style['text-overflow'] = 'ellipsis';
          style['white-space'] = 'nowrap';
        }
        return style;
      },
    },
    computed: {
      getColumnHeightStyle: function () {
        return {
          height: `${this.columnHeight}px`,
        };
      },
    },
  };
</script>

<style scoped>

</style>
