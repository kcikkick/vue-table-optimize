<template>
  <div class='c_table-wrapper'>
    <div class='c_table-wrapper__header-wrapper'>
      <div class='c_table-header__container'
           ref='CTableHeaderRef'
           :style='headerLeftStyle'>
        <table-header
          :columns-config='cloneColumnsConfig'
          :columns-row='cloneColumnsRow'
          :header-height='headerHeight'
          ref='headerLeftRef'
        ></table-header>
      </div>
    </div>
    <div class='c_table-wrapper__body-wrapper' @scroll='handleBodyScroll'
         ref='CTableBody'
         :style='getBodyHeightStyle'>
      <table-body
        v-if='!enableAnimation'
        :columns-row='cloneColumnsRow'
        :data='filterResult'
        :record-key='recordKey'
        :body-height='bodyHeight'
        :column-height='columnHeight'
        :no-data-text='noDataText'
        :row-class-name='rowClassName'
        :loading='loading'
      ></table-body>
      <table-body-animation
        v-else
        :columns-row='cloneColumnsRow'
        :data='filterResult'
        :record-key='recordKey'
        :body-height='bodyHeight'
        :column-height='columnHeight'
        :no-data-text='noDataText'
        :row-class-name='rowClassName'
        :loading='loading'
      ></table-body-animation>
    </div>
  </div>
</template>

<script>
import TableHeader from './TableHeader';
import TableBody from './TableBody';
import TableBodyAnimation from './TableBodyAnimation';
import {
  calculateColAndRowSpan,
  convertColumnsConfigToRow,
  getRandomStr,
  deepCopy,
} from './tableHelper/tableUtil';
import {
  DEFAULT_TABLE_COLUMN_HEIGHT,
  DEFAULT_TABLE_HEIGHT,
  DEFAULT_TABLE_HEADER_HEIGHT,
  DEFAULT_TABLE_BODY_HEIGHT,
  NO_SORTING,
  C_SCROLL_WIDTH,
  C_ID_NAME,
  C_SORT_NAME,
} from './tableHelper/constant';
import _ from 'lodash';
import {
  getDefaultSortingDirs,
  getDefaultSortingFields,
  getOwnerDefinedSortingDirs,
  getOwnerDefinedSortingFields,
} from './tableHelper/sortingHelper';
import {dragColumn} from './tableHelper/widthAdjustExtend';
import './tableHelper/requestAnimationFrameUtil';

export default {
  components: {
    TableHeader,
    TableBody,
    TableBodyAnimation,
  },
  props: {
    columnConfig: {
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
    filters: {
      type: Array,
      default () {
        return [];
      },
    },
    recordKey: {
      type: String,
      required: true,
    },
    height: {
      type: Number,
      default () {
        return DEFAULT_TABLE_HEIGHT;
      },
    },
    columnHeight: {
      type: Number,
      default () {
        return DEFAULT_TABLE_COLUMN_HEIGHT;
      },
    },
    headerHeight: {
      type: Number,
      default () {
        return DEFAULT_TABLE_HEADER_HEIGHT;
      },
    },
    enableAnimation: {
      type: Boolean,
      default () {
        return false;
      },
    },
    defaultSortingFields: {
      type: Array,
      default () {
        return [];
      },
    },
    enableDragColumn: {
      type: Boolean,
      default () {
        return true;
      },
    },
    noDataText: {
      type: String,
      default () {
        return 'No Data.';
      },
    },
    rowClassName: {
      type: Function,
      default () {
        return '';
      },
    },
    loading: {
      type: Boolean,
      default () {
        return false;
      },
    },
  },
  name: 'CTable',
  data () {
    return {
      cloneColumnsConfig: [],
      cloneColumnsRow: [],
      cloneFilters: [],
      bodyHeight: DEFAULT_TABLE_BODY_HEIGHT,
      filterResult: Object.freeze([]),
      headerLeftScrollLeft: 0,
    };
  },
  mounted () {
    this.handleResize(this.cloneColumnsRow);
    const headerRefs = this.$children[0].$refs.CTableThead;
    const headerColGroupRefs = this.$children[0].$refs.CTableTheadColGroup;
    const bodyColGroupRefs = this.$children[1].$refs.CTableBodyColGroup;
    this.$nextTick(function () {
      dragColumn(headerRefs, headerColGroupRefs, bodyColGroupRefs, this.cloneColumnsRow);
    });
  },
  watch: {
    columnConfig: {
      handler: function (val) {
        const columnConfigWithCid = this.buildColumnUUID(this.columnConfig);
        this.cloneColumnsConfig = this.makeColumnsConfig(columnConfigWithCid);
        this.cloneColumnsRow = this.makeColumnsRow(columnConfigWithCid);
      },
      immediate: true,
    },
    data: {
      handler: function (val) {
        const existSort = this.getActiveSort();
        this.filterResult = Object.freeze(_.orderBy(val, getDefaultSortingFields(this.defaultSortingFields), getDefaultSortingDirs(this.defaultSortingFields)));
        if (existSort) {
          const index = _.findIndex(this.cloneColumnsConfig, {key: existSort.key});
          this.handleSort(index, existSort[C_SORT_NAME]);
        }
      },
      immediate: true,
      deep: true,
    },
    height: {
      handler: function (val) {
        let tableHeight = val;
        if (val === 0) {
          tableHeight = DEFAULT_TABLE_HEIGHT;
        }
        const bodyHeight = tableHeight - this.headerHeight;
        this.bodyHeight = bodyHeight <= this.headerHeight ? DEFAULT_TABLE_BODY_HEIGHT : bodyHeight;
      },
      immediate: true,
    },
    filters: {
      handler: function (val) {
        const newFilterResult = deepCopy(this.filterResult);
        for (const record of newFilterResult) {
          const showRecord = (this.filterResult.length === val.length) || (!_.isEmpty(_.find(val, {[this.recordKey]: record[this.recordKey]})));
          record.isHidden = !showRecord;
        }
        this.filterResult = Object.freeze(newFilterResult);
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    buildColumnUUID: function (columnsConfig) {
      return columnsConfig.map(item => {
        if ('children' in item) this.buildColumnUUID(item.children);
        item[C_ID_NAME] = getRandomStr(6);
        return item;
      });
    },
    makeColumnsConfig: function (columnsConfig) {
      return calculateColAndRowSpan(columnsConfig);
    },
    makeColumnsRow: function (columnsConfig) {
      return convertColumnsConfigToRow(columnsConfig);
    },
    handleResize: function () {
      const cloneColumnsRow = deepCopy(this.cloneColumnsRow);
      const tableWidth = this.$el.offsetWidth - C_SCROLL_WIDTH;
      let width = 0;
      let widthCount = 0;
      for (const column of cloneColumnsRow) {
        if (column.width) {
          width += column.width;
          widthCount++;
        }
      }
      const autoWidth = (tableWidth - width) / (cloneColumnsRow.length - widthCount);
      for (const column of cloneColumnsRow) {
        column.cWidth = column.width ? column.width : `${autoWidth}%`;
      }
      this.cloneColumnsRow = cloneColumnsRow;
    },
    getActiveSort: function () {
      for (const column of this.cloneColumnsRow) {
        if (column.hasOwnProperty(C_SORT_NAME) && column[C_SORT_NAME] !== NO_SORTING) {
          return column;
        }
      }
      return null;
    },
    getSortedElement: function (item, col, dir) {
      if (col.getSortValue) {
        return col.getSortValue(item[col.key], dir);
      }
      return item[col.key];
    },
    handleSort: function (cId, type) {
      if (type === NO_SORTING) {
        this.filterResult = _.orderBy(this.filterResult, getDefaultSortingFields(this.defaultSortingFields), getDefaultSortingDirs(this.defaultSortingFields));
        return;
      }
      const col = _.find(this.cloneColumnsRow, {[C_ID_NAME]: cId});
      if (col) {
        const sorting = {
          sortKey: item => this.getSortedElement(item, col, type),
          key: col.key,
          dir: type,
        };
        this.filterResult = _.orderBy(this.filterResult, getOwnerDefinedSortingFields(sorting, this.defaultSortingFields), getOwnerDefinedSortingDirs(sorting, this.defaultSortingFields));
      }
    },
    handleBodyScroll: function (event) {
      this.headerLeftScrollLeft = event.target.scrollLeft;
    },
  },
  computed: {
    getBodyHeightStyle: function () {
      return {
        height: `${this.bodyHeight}px`,
      };
    },
    headerLeftStyle: function () {
      return {
        left: `-${this.headerLeftScrollLeft}px`,
      };
    },
  },
};
</script>

<style>
  @import "./scss/table.scss";
</style>
