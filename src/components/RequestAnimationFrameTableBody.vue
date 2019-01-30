<template>
  <section class='c-table-wrapper__body-wrapper' :style='{height: getBodyHeight}'>
    <div class='c-table-body-container'
         v-for='record in animationResult'
         :key='record[recordKey]'>
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
  </section>
</template>

<script>
  import RenderBody from './tableHelper/expand';

  export default {
    name: 'RequestAnimationFrameTableBody',
    components: {RenderBody},
    props: {
      columnsConfig: Array,
      data: Array,
      recordKey: String,
      recordHeight: Number,
      bodyHeight: Number,
    },
    data () {
      return {
        countOfRender: 0,
        loopCount: 0,
        addNumber: 20,
        animationResult: [],
      };
    },
    computed: {
      getRecordHeight: function () {
        return `${this.recordHeight}px`;
      },
      getBodyHeight: function () {
        return `${this.bodyHeight}px`;
      },
      filterResult: function () {
        return this.data.filter(record => {
          return !record.isHidden;
        });
      },
    },
    methods: {
      getColumnStyle: function (column) {
        return {
          width: column.cWidth,
          height: `${this.recordHeight}px`,
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
