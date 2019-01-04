<template>
  <div></div>
</template>

<script>
  import result from './data/schedule';

  const DESC = 'desc';
  const ASC = 'asc';
  const NO_MATCH_STOP = 'no matched stop';

  export default {
    name: 'commonTable',
    data() {
      return {
        result: result,
        tableTitle: [
          {
            title: 'Schedule Status',
            sortable: true,
            width: 118,
            disableDrag: true,
            getSortValue: function (a) {
              const statusMapping = {
                Normal: 1,
                Warning: 2,
                Urgent: 3
              };
              return statusMapping[a];
            },
            key: 'vesselStatus',
            noNeedVertical: true,
            enableEllipsis: true
          },
          {
            title: 'Service-Vessel-Voyage',
            sortable: true,
            disableDrag: true,
            width: 118,
            key: 'svvd',
            enableEllipsis: true
          },
          {
            title: 'VesselName',
            sortable: true,
            key: 'vesselName',
            enableEllipsis: true
          },
          {
            title: 'Operator',
            sortable: true,
            key: 'operator',
            enableEllipsis: true
          },
          {
            title: 'Trade',
            sortable: true,
            key: 'tradeCode',
            enableEllipsis: true
          },
          {
            title: 'From',
            sortable: true,
            key: 'from',
            enableEllipsis: true,
            index: 5
          },
          {
            title: 'ATD',
            sortable: true,
            key: 'atd',
            enableEllipsis: true,
            index: 6
          },
          {
            title: 'To',
            sortable: true,
            key: 'to',
            enableEllipsis: true,
            index: 7
          },
          {
            title: 'Long Term ETA',
            sortable: true,
            enableEllipsis: true,
            key: 'ltEta',
            index: 8
          },
          {
            title: 'Coastal ETA',
            sortable: true,
            key: 'ctEta',
            enableEllipsis: true,
            index: 9
          },
          {
            title: 'Actual Delay(Hrs)',
            sortable: true,
            key: 'actualDelay',
            index: 10,
            enableEllipsis: true
          },
          {
            title: 'Recovery Plan Deviation(Hrs)',
            sortable: true,
            key: 'deviations',
            index: 11,
            getSortValue: this.getDeviationsValue,
            enableEllipsis: true
          },
          {
            title: 'CargoSmart ETA',
            sortable: true,
            key: 'csEta',
            index: 12,
            enableEllipsis: true
          },
          {
            title: 'Potential Delay(Hrs)',
            sortable: true,
            key: 'potentialDelay',
            index: 13,
            enableEllipsis: true
          }
        ],
        defaultSortingFields: [
          {
            sortKey: 'actualDelay',
            key: 'actualDelay',
            dir: DESC
          },
          {
            sortKey: item => this.getDeviationsValue(item['deviations'], DESC),
            key: 'deviations',
            dir: DESC
          },
          {
            sortKey: 'ctEta',
            key: 'ctEta',
            dir: ASC
          }
        ]
      };
    },
    methods: {
      getDeviationsValue: function (a, dir) {
        if (a === NO_MATCH_STOP) {
          return dir === DESC ? -Number.MAX_VALUE : Number.MAX_VALUE;
        }
        return a ? parseFloat(a) : null;
      }
    }
  };
</script>

<style scoped>

</style>
