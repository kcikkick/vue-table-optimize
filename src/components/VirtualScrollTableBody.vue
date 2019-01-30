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
  import {calDomItemsHeight} from './tableHelper/tableUtil';

  export default {
    name: 'VirtualScrollTableBody',
    components: {RenderBody},
    props: {
      columnsConfig: Array,
      data: Array,
      recordKey: String,
      itemHeight: Number,
      viewportHeight: Number,
    },
    watch: {
      data: {
        handler: function (val) {
          this.virtualData = _.cloneDeep(val);
          this.refreshRenderData();
        },
        immediate: true,
        deep: true,
      },
    },
    data () {
      const renderItems = Math.ceil(this.viewportHeight / this.itemHeight) + 2 * VIRTUAL_REMAIN_COUNT;
      return {
        virtualData: {},
        renderData: [],
        minItemKeyHeight: -1,
        maxItemKeyHeight: -1,
        remainHeight: VIRTUAL_REMAIN_COUNT * this.itemHeight,
        renderItems: renderItems,
        renderItemsHeight: renderItems * this.itemHeight,
      };
    },
    computed: {
      getRecordHeight: function () {
        return `${this.itemHeight}px`;
      },
      getBodyHeight: function () {
        return `${this.viewportHeight}px`;
      },
      getBodyWrapperStyle: function () {
        return {
          height: `${this.data.length * this.itemHeight}px`,
          position: 'relative',
        };
      },
    },
    methods: {
      getColumnStyle: function (column) {
        return {
          width: column.cWidth,
          height: `${this.itemHeight}px`,
        };
      },
      buildRenderData: function (minHeight, maxHeight) {
        const minItemKey = minHeight / this.itemHeight;
        const maxItemKey = maxHeight / this.itemHeight;
        const startIndex = minItemKey > 0 ? minItemKey : -1;
        const endIndex = maxItemKey > this.virtualData.length ? this.data.length : maxItemKey;
        const renderData = [];
        for (let index = startIndex + 1; index < endIndex; index++) {
          const item = this.virtualData[index];
          const recordIndexHight = `${index * this.itemHeight}`;
          item.__vkey = index;
          item.translateY = `${recordIndexHight}px`;
          renderData.push(item);
        }
        return renderData;
      },
      getBodyContainerStyle: function (record) {
        return {
          transform: `translateY(${record.translateY})`,
          height: `${this.itemHeight}px`,
        };
      },
      buildNewItems: function (newData) {
        const newItems = [];
        for (const newRecord of newData) {
          if (_.findIndex(this.renderData, {__vkey: newRecord.__vkey}) < 0) {
            newItems.push(newRecord);
          }
        }
        return newItems;
      },
      buildOutDateItems: function (newData) {
        const replaceItemsIndex = [];
        for (let index = 0; index < this.renderData.length; index++) {
          const record = this.renderData[index];
          if (_.findIndex(newData, {__vkey: record.__vkey}) < 0) {
            replaceItemsIndex.push(index);
          }
        }
        return replaceItemsIndex;
      },
      refreshVirtualItems: function (newItems, replaceItemsIndex) {
        if (newItems.length === this.renderData.length) {
          this.renderData = newItems;
          return;
        }
        for (let index = 0; index < newItems.length; index++) {
          if (index < replaceItemsIndex.length) {
            this.$set(this.renderData, replaceItemsIndex[index], newItems[index]);
            continue;
          }
          this.renderData.push(newItems[index]);
        }
      },
      updateRenderData: function (newData) {
        if (this.renderData.length === 0) {
          this.renderData = newData;
          return;
        }
        const newItems = this.buildNewItems(newData);
        const replaceItemsIndex = this.buildOutDateItems(newData);
        this.refreshVirtualItems(newItems, replaceItemsIndex);
      },
      refreshRenderData: function () {
        const virtualScrollBody = this.$refs.virtualScrollBody;
        const scrollTop = virtualScrollBody ? virtualScrollBody.scrollTop : 0;
        const [minItemHeight, maxItemHeight] = calDomItemsHeight(this.itemHeight, this.remainHeight, this.viewportHeight, this.renderItemsHeight, scrollTop);
        this.updateRenderData(this.buildRenderData(minItemHeight, maxItemHeight));
      },
      onVirtualScroll (e) {
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
