<template>
  <div class="chart-card">
    <div class="chart-card-header" v-if="$slots.header">
      <slot name="header">
      </slot>
    </div>
    <div class="chart-card-body">
      <div :id="options.chart.id" class="apex-chart">
        <apexcharts
          :width="width"
          :height="height"
          :type="type"
          :options="options"
          :series="series"
        ></apexcharts>
      </div>
    </div>
    <div class="chart-card-footer" v-if="$slots.footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>
<script>
import VueApexCharts from "vue-apexcharts";

export default {
  name: "chart-card",
  components: {
    apexcharts: VueApexCharts
  },
  props: {
    width: Number,
    height: Number,
    type: String,
    options: Object,
    series: Array
  }
};
</script>
<style>
</style>
