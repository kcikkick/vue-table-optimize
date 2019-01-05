<template>
  <section class='c-table-wrapper__body-wrapper' ref='virtualScrollBody'
           :style='{height: getBodyHeight}'>
    <div :style='getBodyContainerStyle'>
      <div class='c-table-body-container'
           v-for='record in renderData'
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
    </div>
  </section>
</template>

<script>
import RenderBody from './tableHelper/expand';
import {VIRTUAL_REMAIN_COUNT} from './tableHelper/constant';

export default {
  name: 'VirtualScrollTableBody',
  components: {RenderBody},
  props: {
    columnsConfig: Array,
    data: Array,
    recordKey: String,
    recordHeight: Number,
    bodyHeight: Number,
  },
  watch: {
    data: {
      handler: function (val) {
        this.virtualData = this.convertVirtualData(val);
        this.renderData = this.buildRenderData();
      },
      immediate: true,
      deep: true,
    },
  },
  data () {
    return {
      virtualData: {},
      renderData: [],
    };
  },
  computed: {
    getRecordHeight: function () {
      return `${this.recordHeight}px`;
    },
    getBodyHeight: function () {
      return `${this.bodyHeight}px`;
    },
    getBodyContainerStyle: function () {
      return {
        height: `${this.data.length * this.recordHeight}px`,
      };
    },
  },
  methods: {
    getColumnStyle: function (column) {
      return {
        width: column.cWidth,
        height: `${this.recordHeight}px`,
      };
    },
    convertVirtualData: function (data) {
      const virtualData = {};
      for (let index = 0; index < data.length; index++) {
        const recordKey = `${index * this.recordHeight}`;
        virtualData[recordKey] = data[index];
      }
      return virtualData;
    },
    buildRenderData: function () {
      const virtualScrollBody = this.$refs.virtualScrollBody;
      const scrollTop = virtualScrollBody ? virtualScrollBody.scrollTop : 0;
      const remainHeight = VIRTUAL_REMAIN_COUNT * this.recordHeight;
      const minHeight = scrollTop - remainHeight;
      const maxHeight = scrollTop + this.bodyHeight + remainHeight;
      const renderData = [];
      for (const key in this.virtualData) {
        const validateInclude = key >= minHeight && key <= maxHeight;
        const validateBoundaryStart = key <= minHeight && minHeight <= key + this.recordHeight;
        const validateBoundaryEnd = key <= maxHeight && maxHeight <= key + this.recordHeight;
        if (validateInclude || validateBoundaryStart || validateBoundaryEnd) {
          renderData.push(this.virtualData[key]);
        }
      }
      return renderData;
    },
  },
};
</script>

<style scoped>
  .c-table-wrapper__body-wrapper {
    display: inherit;
  }
</style>
