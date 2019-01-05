<template>
  <article class='c-table-wrapper'>
    <section class='c-table-wrapper__header-wrapper'>
      <table-header
        :columns-config='columnsConfig'
        :height='headerHeight'
      ></table-header>
    </section>
    <table-body v-if='showRender("COMMON")'
                :data='data'
                :record-key='recordKey'
                :columns-config='columnsConfig'
                :record-height='recordHeight'
                :body-height='bodyHeight'>
    </table-body>
    <virtual-scroll-table-body v-if='showRender("VIRTUAL")'
                :data='data'
                :record-key='recordKey'
                :columns-config='columnsConfig'
                :record-height='recordHeight'
                :body-height='bodyHeight'>
    </virtual-scroll-table-body>
  </article>
</template>

<script>
import TableHeader from './SingleTableHeader';
import TableBody from './SingleTableBody';
import VirtualScrollTableBody from './VirtualScrollTableBody';

export default {
  components: {TableHeader, TableBody, VirtualScrollTableBody},
  name: 'SingleTable',
  props: {
    columnsConfig: Array,
    data: Array,
    recordKey: String,
    headerHeight: Number,
    bodyHeight: Number,
    recordHeight: Number,
    renderType: String,
  },
  data () {
    return {};
  },
  computed: {
  },
  methods: {
    showRender: function (type) {
      return this.renderType === type;
    },
  },
};
</script>

<style>
  ul {
    padding-left: 0;
    margin: 0;
  }

  ul > li {
    padding-left: 0;
    margin: 0;
    list-style: none;
  }

  .c-table-wrapper {
    width: inherit;
    overflow: hidden;
    font-size: 12px;
  }

  .c-table-wrapper__header-wrapper {
    width: 100%;
    border: 1px solid #dddddd;
    border-bottom: 0;
  }

  .c-table-wrapper__body-wrapper {
    overflow-y: scroll;
    width: 100%;
    border: 1px solid #dddddd;
  }

  .c-table-wrapper__header-wrapper,
  .c-table-wrapper__body-wrapper {
    display: flex;
    flex-direction: column;
  }

  .c-table-header__record,
  .c-table-body__record {
    display: flex;
  }

  .c-table-header__record {
    padding-right: 17px;
  }

  .c-table-header-column,
  .c-table-body-column {
    display: flex;
    align-items: center;
    border-right: 1px solid #dddddd;
    padding-left: 6px;
    overflow: hidden;
    white-space: nowrap;
  }

  .c-table-header-column__container,
  .c-table-body-column__container {
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .c-table-body__record {
    border-bottom: 1px solid #dddddd;
  }

  .c-table-body-container:last-child .c-table-body__record {
    border-bottom: 0;
  }
</style>
