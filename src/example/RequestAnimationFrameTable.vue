<template>
  <div>
    <vue-table-optimization
      :columns-config='tableTitle'
      :data='result'
      render-type='ANIMATION'
      record-key='_id'
    ></vue-table-optimization>
  </div>
</template>

<script>
  import result from './data/schedule';
  import VueTableOptimization from '../components/VueTableOptimization.vue';

  const DESC = 'desc';
  const ASC = 'asc';
  const NO_MATCH_STOP = 'no matched';

  export default {
    name: 'RequestAnimationFrameTable',
    components: {VueTableOptimization},
    data () {
      return {
        result: result,
        tableTitle: [
          {
            title: 'Status',
            sortable: true,
            width: 118,
            disableDrag: true,
            getSortValue: function (a) {
              const statusMapping = {
                Normal: 1,
                Warning: 2,
                Urgent: 3,
              };
              return statusMapping[a];
            },
            key: 'status',
            noNeedVertical: true,
            enableEllipsis: true,
          },
          {
            title: 'From',
            sortable: true,
            key: 'from',
            enableEllipsis: true,
          },
          {
            title: 'Actual Departure',
            sortable: true,
            key: 'actualDeparture',
            enableEllipsis: true,
            index: 6,
          },
          {
            title: 'To',
            sortable: true,
            key: 'to',
            enableEllipsis: true,
          },
          {
            title: 'Estimate Arrival',
            sortable: true,
            enableEllipsis: true,
            key: 'planArrival',
            index: 8,
          },
          {
            title: 'Coastal Arrival',
            sortable: true,
            key: 'coastalArrival',
            enableEllipsis: true,
            index: 9,
          },
          {
            title: 'Actual Delay(Hrs)',
            sortable: true,
            key: 'actualDelay',
            index: 10,
            enableEllipsis: true,
          },
          {
            title: 'Predict Arrival',
            sortable: true,
            key: 'predictArrival',
            index: 12,
            enableEllipsis: true,
          },
          {
            title: 'Potential Delay(Hrs)',
            sortable: true,
            key: 'potentialDelay',
            index: 13,
            enableEllipsis: true,
          },
        ],
        defaultSortingFields: [
          {
            sortKey: 'actualDelay',
            key: 'actualDelay',
            dir: DESC,
          },
          {
            sortKey: item => this.getDeviationsValue(item['deviations'], DESC),
            key: 'deviations',
            dir: DESC,
          },
          {
            sortKey: 'ctEta',
            key: 'ctEta',
            dir: ASC,
          },
        ],
      };
    },
    methods: {
      getDeviationsValue: function (a, dir) {
        if (a === NO_MATCH_STOP) {
          return dir === DESC ? -Number.MAX_VALUE : Number.MAX_VALUE;
        }
        return a ? parseFloat(a) : null;
      },
    },
  };
</script>

<style scoped>

</style>
