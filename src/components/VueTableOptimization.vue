<template>
  <div>
    <single-table v-if='!isMultHeaderRows'
                  :data='filterResult'
                  :columns-config='columnsConfig'
    ></single-table>
  </div>
</template>

<script>
  import SingleTable from 'SingleTable';
  import _ from 'lodash';
  import {ID_NAME} from './tableHelper/constant';
  import {calculateColAndRowSpan, convertColumnsConfigToRow, getRandomStr} from './tableHelper/tableUtil';

  export default {
    components: {SingleTable},
    name: 'VueTableOptimization',
    props: {
      columnsConfig: {
        type: Array,
        default() {
          return [];
        }
      },
      data: {
        type: Array,
        default() {
          return [];
        }
      },
      filters: {
        type: Array,
        default() {
          return [];
        }
      },
      recordKey: {
        type: String,
        required: true
      }
    },
    watch: {
      columnsConfig: {
        handler: function () {
          const columnConfigWithCid = this.buildColumnUUID(this.columnConfig);
          if (this.isMultHeaderRows) {
            this.cloneColumnsConfig = calculateColAndRowSpan(columnConfigWithCid);
            this.cloneColumnsRow = convertColumnsConfigToRow(columnConfigWithCid);
          }
        },
        immediate: true,
        deep: true
      },
      data: {
        handler: function (val) {
          this.filterResult = _.cloneDeep(val);
        },
        immediate: true,
        deep: true,
      },
    },
    data() {
      return {
        filterResult: [],
        cloneColumnsConfig: [],
        cloneColumnsRow: []
      };
    },
    computed: {
      isMultHeaderRows: function () {
        return _.find(this.columnsConfig, function (column) {
          return column.children !== null;
        });
      }
    },
    methods: {
      buildColumnUUID: function (columnsConfig) {
        return columnsConfig.map(item => {
          if ('children' in item) this.buildColumnUUID(item.children);
          if (!item[ID_NAME]) {
            item[ID_NAME] = getRandomStr(6);
          }
          return item;
        });
      }
    }
  };
</script>

<style>

</style>
