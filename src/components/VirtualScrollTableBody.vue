<template>
  <section class='c-table-wrapper__body-wrapper c-table-body-wrapper__virtual'
           ref='virtualScrollBody'
           @scroll.passive='onVirtualScroll'
           :style='{height: getBodyHeight}'>
    <div :style='getBodyWrapperStyle'>
      <div class='c-table-body-container c-table-body-container__virtual'
           v-for='record in renderData'
           :key='record[recordKey]'
           :style='getBodyContainerStyle(record)'
      >
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
import _ from 'lodash';

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
        this.refreshRenderData();
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
    getBodyWrapperStyle: function () {
      return {
        height: `${this.data.length * this.recordHeight}px`,
        position: 'relative',
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
        const recordIndexHight = `${index * this.recordHeight}`;
        const record = _.cloneDeep(data[index]);
        record.translateY = `${recordIndexHight}px`;
        virtualData[recordIndexHight] = record;
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
        const recordIndexHeigh = parseInt(key);
        const validateInclude = recordIndexHeigh >= minHeight && recordIndexHeigh <= maxHeight;
        const validateBoundaryStart = recordIndexHeigh <= minHeight && minHeight <= recordIndexHeigh + this.recordHeight;
        const validateBoundaryEnd = recordIndexHeigh <= maxHeight && maxHeight <= recordIndexHeigh + this.recordHeight;
        if (validateInclude || validateBoundaryStart || validateBoundaryEnd) {
          renderData.push(this.virtualData[key]);
        }
      }
      return renderData;
    },
    getBodyContainerStyle: function (record) {
      return {
        transform: `translateY(${record.translateY})`,
        height: `${this.recordHeight}px`,
      };
    },
    refreshRenderData: function () {
      this.renderData = this.buildRenderData();
    },
    onVirtualScroll: function (e) {
      window.requestAnimationFrame(this.refreshRenderData);
    },
  },
};
</script>

<style scoped>
  .c-table-body-wrapper__virtual {
    display: inherit;
  }

  .c-table-body-container__virtual {
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    will-change: transform;
  }
</style>
