<template>
  <div class='table-body-wrapper' :style='getBodyHeightStyle' id='tableee'>
    <div class='table'>
      <div class='table-col-group'>
        <div class='table-col' v-for='column in columnsRow' :style='getColumnGroup(column)'></div>
      </div>
      <div class='table-body'>
        <table-body-record
          v-for='record in newData'
          :key='record[recordKey]'
          :record='record'
          :column-height='columnHeight'
          :columns-row='columnsRow'
          :row-class-name='rowClassName'>
        </table-body-record>
      </div>
    </div>
  </div>
</template>

<script>
  import TableBodyRecord from './TableBodyRecord';
  import {
    DEFAULT_TABLE_HEIGHT,
    DEFAULT_TABLE_COLUMN_HEIGHT,
  } from './tableHelper/constant';

  export default {
    name: 'CTableBody',
    components: {TableBodyRecord},
    props: {
      columnsRow: {
        type: Array,
        default: [],
      },
      data: {
        type: Array,
        default: [],
      },
      recordKey: [
        Number,
        String,
      ],
      columnHeight: {
        type: Number,
        default: DEFAULT_TABLE_COLUMN_HEIGHT,
      },
      bodyHeight: {
        type: Number,
        default: DEFAULT_TABLE_HEIGHT,
      },
      enableAnimation: {
        type: Boolean,
        default: false,
      },
      rowClassName: {
        type: Function,
      },
    },
    data () {
      return {
        countOfRender: 0,
        loopCount: 0,
        addNumber: 20,
        newData: [],
      };
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
      getColumnGroup: function (column) {
        return {
          width: column.width ? `${column.cWidth}px` : column.cWidth,
        };
      },
      generateRecordFragment: function (records, columnsConfig) {
        const fragment = document.createDocumentFragment();
        for (const record of records) {
          const ul = document.createElement('ul');
          ul.className = 'table-row';
          for (const curHeader of columnsConfig) {
            const li = document.createElement('li');
            li.className = 'table-cell';
            li.style = this.getColumnStyle(curHeader);
            li.title = record[curHeader.key];
            const span = document.createElement('span');
            span.innerText = record[curHeader.key] ? record[curHeader.key] : '';
            li.appendChild(span);
            ul.appendChild(li);
          }
          fragment.appendChild(ul);
        }
        return fragment;
      },
      addRecord: function () {
        const beginIndex = this.countOfRender * this.addNumber;
        const endIndex = beginIndex + this.addNumber - 1;
        const records = this.filterResult.slice(beginIndex, endIndex);
        this.newData = this.newData.concat(records);
        this.countOfRender += 1;
        this.loopRender();
      },
      loopRender: function () {
        if (this.countOfRender < this.loopCount) {
          window.requestAnimationFrame(this.addRecord);
        }
      },
      removeAllAnimationRecord: function () {
        this.newData = [];
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

<style>
  .table-body-wrapper {
    width: 100%;
    overflow-y: scroll;
    border: 1px solid #dddddd;
  }

  .table {
    display: table;
    table-layout: fixed;
    border-collapse: collapse;
    width: 100%;
  }

  .table-col-group {
    display: table-column-group;
  }

  .table-body {
    display: table-row-group;
  }

  .table-col {
    display: table-column;
  }

  .table-row {
    display: table-row;
  }

  .table-cell {
    display: table-cell;
    padding-left: 6px;
    vertical-align: middle;
  }

  ul {
    margin: 0;
    border-bottom: 1px solid rgb(233, 234, 236);
  }
</style>
