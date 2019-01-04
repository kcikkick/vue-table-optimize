<template>
  <article class='c-table-wrapper'>
    <section class='c-table-wrapper__header-wrapper'>
      <table-header
        :columns-config='columnsConfig'
      ></table-header>
    </section>
    <section class='c-table-wrapper__body-wrapper'>
      <table-body></table-body>
    </section>
  </article>
</template>

<script>
  import TableHeader from 'SingleTableHeader';
  import TableBody from 'SingleTableBody';

  export default {
    components: {TableHeader, TableBody},
    name: 'SingleTable',
    props: {
      columnsConfig: Array,
      data: Array
    },
    data() {
      return {};
    },
    computed: {},
    methods: {}
  };
</script>

<style scoped>

</style>
