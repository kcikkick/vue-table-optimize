<template>
  <article>
    <div class='table-wrapper'>
      <section class='table-wrapper__header-wrapper'>
        <table-header :table-title='tableTitle'
                      :title-height='titleHeight'
        ></table-header>
      </section>
      <section class='table-wrapper__body-wrapper' :style='{height: getBodyHeight}' id='bodyULContainer'>
        <table-body v-for='item in filterResult' :key='item[recordKey]'
                    :table-title='tableTitle'
                    :column-height='columnHeight'
                    :record='item'></table-body>
      </section>
    </div>
  </article>
</template>

<script>
import TableHeader from './TableHeader';
import TableBody from './TableBody';
import _ from 'lodash';
import {
  getDefaultSortingDirs,
  getDefaultSortingFields,
  getOwnerDefinedSortingDirs,
  getOwnerDefinedSortingFields,
} from './tableHelper/sortingHelper';
import {
  DEFAULT_TABLE_TITLE_HEIGHT,
  DEFAULT_TABLE_HEIGHT,
  DEFAULT_TABLE_BODY_HEIGHT,
} from './tableHelper/constant';
import {NO_SORTING} from '../../../utilities/constant';
import {extendAjustColumnWidth} from './tableHelper/widthAdjustExtend';

export default {
  components: {TableBody, TableHeader},
  props: {
    data: {
      type: Array,
      default: [],
    },
    filter: {
      type: Array,
      default: [],
    },
    tableTitle: {
      type: Array,
      default: [],
    },
    height: {
      type: Number,
      default: DEFAULT_TABLE_HEIGHT,
    },
    columnHeight: {
      type: Number,
      default: DEFAULT_TABLE_TITLE_HEIGHT,
    },
    recordKey: {
      type: String,
      default: '_id',
      required: true,
    },
  },
  watch: {
    data: {
      handler: function (val) {
        const existSort = this.getActiveSort();
        this.filterResult = _.orderBy(val, getDefaultSortingFields(), getDefaultSortingDirs());
        if (existSort) {
          const index = _.findIndex(this.tableTitle, {key: existSort.key});
          this.handleSort(index, existSort._sortType);
        }
      },
      immediate: true,
    },
    filter: {
      handler: function (val) {
        const newFilterResult = _.cloneDeep(this.filterResult);
        for (const record of newFilterResult) {
          if ((this.filterResult.length === val.length) || (!_.isEmpty(_.find(val, {[this.recordKey]: record[this.recordKey]})))) {
            record.isHidden = false;
            continue;
          }
          record.isHidden = true;
        }
        this.filterResult = newFilterResult;
      },
      immediate: true,
    },
    columnHeight: {
      handler: function (val) {
        this.titleHeight = val;
      },
      immediate: true,
    },
    height: {
      handler: function (val) {
        let tableHeight = val;
        if (val === 0) {
          tableHeight = DEFAULT_TABLE_HEIGHT;
        }
        this.bodyHeight = tableHeight - this.titleHeight;
      },
      immediate: true,
    },
  },
  mounted () {
    const headerULContainer = document.getElementById('headerULContainer');
    const bodyULContainer = document.getElementById('bodyULContainer');
    this.$nextTick(function () {
      extendAjustColumnWidth(headerULContainer, bodyULContainer, this.tableTitle);
    });
  },
  computed: {
    getBodyHeight: function () {
      return `${this.bodyHeight}px`;
    },
  },
  data () {
    return {
      titleHeight: DEFAULT_TABLE_TITLE_HEIGHT,
      bodyHeight: DEFAULT_TABLE_BODY_HEIGHT,
      filterResult: [],
    };
  },
  methods: {
    getActiveSort: function () {
      if (this.tableTitle) {
        for (const column of this.tableTitle) {
          if (column.hasOwnProperty('_sortType') && column._sortType !== NO_SORTING) {
            return column;
          }
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
    handleSort: function (index, type) {
      const col = this.tableTitle[index];
      if (type === NO_SORTING) {
        this.filterResult = _.orderBy(this.filterResult, getDefaultSortingFields(), getDefaultSortingDirs());
        return;
      }
      const sorting = {
        sortKey: item => this.getSortedElement(item, col, type),
        key: col.key,
        dir: type,
      };
      this.filterResult = _.orderBy(this.filterResult, getOwnerDefinedSortingFields(sorting), getOwnerDefinedSortingDirs(sorting));
    },
  },
};
</script>

<style>
</style>
