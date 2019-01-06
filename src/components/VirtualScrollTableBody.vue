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
      minHeight: -1,
      maxHeight: -1,
      minRecordKeyHeight: 0,
      maxRecordKeyHeight: 0,
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
    buildRenderData: function (minHeight, maxHeight) {
      const renderData = [];
      const renderKeys = [];
      for (const key in this.virtualData) {
        const recordIndexHeigh = parseInt(key);
        const validateInclude = recordIndexHeigh >= minHeight && recordIndexHeigh <= maxHeight;
        const validateBoundaryStart = recordIndexHeigh <= minHeight && minHeight <= recordIndexHeigh + this.recordHeight;
        const validateBoundaryEnd = recordIndexHeigh <= maxHeight && maxHeight <= recordIndexHeigh + this.recordHeight;
        if (validateInclude || validateBoundaryStart || validateBoundaryEnd) {
          renderData.push(this.virtualData[key]);
          renderKeys.push(recordIndexHeigh);
        }
      }
      this.minRecordKeyHeight = _.min(renderKeys);
      this.maxRecordKeyHeight = _.max(renderKeys);
      return renderData;
    },
    getBodyContainerStyle: function (record) {
      return {
        transform: `translateY(${record.translateY})`,
        height: `${this.recordHeight}px`,
      };
    },
    needRefresh: function (scrollTop) {
      const viewPortStart = scrollTop;
      const viewPortEnd = scrollTop + this.bodyHeight;
      return !(this.minRecordKeyHeight < viewPortStart && viewPortEnd < this.maxRecordKeyHeight);
    },
    updateRenderData: function (newData) {
      if (this.renderData.length === 0) {
        this.renderData = newData;
        return;
      }
      const newItems = [];
      for (const newRecord of newData) {
        if (_.findIndex(this.renderData, {[this.recordKey]: newRecord[this.recordKey]}) < 0) {
          newItems.push(newRecord);
        }
      }
      const replaceItemsIndex = [];
      for (let index = 0; index < this.renderData.length; index++) {
        const record = this.renderData[index];
        if (_.findIndex(newData, {[this.recordKey]: record[this.recordKey]}) < 0) {
          replaceItemsIndex.push(index);
        }
      }
      for (let index = 0; index < newItems.length; index++) {
        if (index < replaceItemsIndex.length) {
          this.$set(this.renderData, replaceItemsIndex[index], newItems[index]);
          continue;
        }
        this.renderData.push(newItems[index]);
      }
    },
    refreshRenderData: function () {
      const virtualScrollBody = this.$refs.virtualScrollBody;
      const scrollTop = virtualScrollBody ? virtualScrollBody.scrollTop : 0;
      const remainHeight = VIRTUAL_REMAIN_COUNT * this.recordHeight;
      const minHeight = scrollTop - remainHeight;
      const maxHeight = scrollTop + this.bodyHeight + remainHeight;
      if (this.needRefresh(scrollTop)) {
        this.updateRenderData(this.buildRenderData(minHeight, maxHeight));
      }
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
