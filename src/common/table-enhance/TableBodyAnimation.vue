<template>
  <div class='c-table-body-wrapper'>
    <div class='c-table-body-wrapper__colgroup' ref='CTableBodyColGroup'>
      <div class='c-table-body-wrapper__col' v-for='column in columnsRow' :columnKey='column[cIdKey]' :style='getColumnGroup(column)'></div>
    </div>
    <div class='c-table-body-wrapper__tbody' v-if='data.length > 0'>
      <table-body-record
        v-for='(record, index) in animationResult' :key='record[recordKey]'
        :record='record'
        :record-index='index'
        :column-height='columnHeight'
        :columns-row='columnsRow'
        :row-class-name='rowClassName'
      >
      </table-body-record>
    </div>
    <div class='c-table-body-wrapper__tbody' v-else-if='!loading'>
      <ul class='c-table-body-wrapper__tr c-table-body-wrapper__ul' :style='getColumnHeightStyle' style='border-bottom: 0;'>
        <li class='c-table-body-wrapper__td c-table-body-wrapper__td--no-data'>
          <span>{{noDataText}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import TableBodyRecord from './TableBodyRecord';
  import {
    DEFAULT_TABLE_HEIGHT,
    DEFAULT_TABLE_COLUMN_HEIGHT,
    C_ID_NAME,
  } from './tableHelper/constant';

  export default {
    name: 'CTableBodyAnimation',
    components: {TableBodyRecord},
    props: {
      columnsRow: {
        type: Array,
        default () {
          return [];
        },
      },
      data: {
        type: Array,
        default () {
          return [];
        },
      },
      recordKey: [
        Number,
        String,
      ],
      columnHeight: {
        type: Number,
        default () {
          return DEFAULT_TABLE_COLUMN_HEIGHT;
        },
      },
      bodyHeight: {
        type: Number,
        default () {
          return DEFAULT_TABLE_HEIGHT;
        },
      },
      noDataText: {
        type: String,
      },
      rowClassName: {
        type: Function,
      },
      loading: {
        type: Boolean,
      },
    },
    data () {
      return {
        countOfRender: 0,
        loopCount: 0,
        addNumber: 20,
        animationResult: [],
        cIdKey: C_ID_NAME,
      };
    },
    methods: {
      getColumnGroup: function (column) {
        return {
          width: column.width ? `${column.cWidth}px` : column.cWidth,
        };
      },
      addRecord: function () {
        const beginIndex = this.countOfRender * this.addNumber;
        const endIndex = beginIndex + this.addNumber - 1;
        const records = this.filterResult.slice(beginIndex, endIndex);
        this.animationResult = this.animationResult.concat(records);
        this.countOfRender += 1;
        this.loopRender();
      },
      loopRender: function () {
        if (this.countOfRender < this.loopCount) {
          window.requestAnimationFrame(this.addRecord);
        }
      },
      removeAllAnimationRecord: function () {
        this.animationResult = [];
      },
      generateRecords: function () {
        this.countOfRender = 0;
        const total = this.filterResult.length;
        this.loopCount = total / this.addNumber;
        this.removeAllAnimationRecord();
        this.addRecord();
      },
    },
    computed: {
      getColumnHeightStyle: function () {
        return {
          height: `${this.columnHeight}px`,
        };
      },
      getBodyHeightStyle: function () {
        return {
          height: `${this.bodyHeight}px`,
        };
      },
      filterResult: function () {
        return this.data.filter(record => {
          return !record.isHidden;
        });
      },
    },
    watch: {
      data: {
        handler: function (val) {
          this.generateRecords();
        },
        immediate: true,
      },
    },
  };
</script>

<style scoped>
</style>
