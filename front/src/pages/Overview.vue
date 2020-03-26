<template>
  <div class="content">
    <div class="container-fluid">
      <!--<div class="row">
        <div class="col-xl-3 col-md-6">
          <stats-card>
            <div slot="header" class="icon-warning">
              <i class="nc-icon nc-chart text-warning"></i>
            </div>
            <div slot="content">
              <p class="card-category">Capacity</p>
              <h4 class="card-title">105GB</h4>
            </div>
            <div slot="footer">
              <i class="fa fa-refresh"></i>Updated now
            </div>
          </stats-card>
        </div>

        <div class="col-xl-3 col-md-6">
          <stats-card>
            <div slot="header" class="icon-success">
              <i class="nc-icon nc-light-3 text-success"></i>
            </div>
            <div slot="content">
              <p class="card-category">Revenue</p>
              <h4 class="card-title">$1,345</h4>
            </div>
            <div slot="footer">
              <i class="fa fa-calendar-o"></i>Last day
            </div>
          </stats-card>
        </div>

        <div class="col-xl-3 col-md-6">
          <stats-card>
            <div slot="header" class="icon-danger">
              <i class="nc-icon nc-vector text-danger"></i>
            </div>
            <div slot="content">
              <p class="card-category">Errors</p>
              <h4 class="card-title">23</h4>
            </div>
            <div slot="footer">
              <i class="fa fa-clock-o"></i>Last day
            </div>
          </stats-card>
        </div>

        <div class="col-xl-3 col-md-6">
          <stats-card>
            <div slot="header" class="icon-info">
              <i class="nc-icon nc-favourite-28 text-primary"></i>
            </div>
            <div slot="content">
              <p class="card-category">Followers</p>
              <h4 class="card-title">+45</h4>
            </div>
            <div slot="footer">
              <i class="fa fa-refresh"></i>Updated now
            </div>
          </stats-card>
        </div>
      </div>-->

      <!--<div class="row">
        <div id="app">
          {{ consumptionByDeviceId.options.xaxis.categories }}
          {{ consumptionByDeviceId.series[0].data }}
        </div>
      </div>-->

      <div class="row">
        <div class="col-md-8">
          <div v-if="panelsByDeviceId.isLoaded">
            <!-- If user.name exists, display user.name -->
            <div v-if="panelsByDeviceId.series[0].data">
              <chart-card
                :id="panelsByDeviceId.options.chart.id"
                :width="panelsByDeviceId.width"
                :height="panelsByDeviceId.height"
                :type="panelsByDeviceId.type"
                :options="panelsByDeviceId.options"
                :series="panelsByDeviceId.series"
              >
                <template slot="header">
                  <h4 class="card-title">Production et autoconsommation du foyer (Octobre 2019)</h4>
                  <p class="card-category">1 Month performance</p>
                </template>
              </chart-card>
            </div>
          </div>
        </div>

        <div class="col-md-4">
          <div v-if="panelsRatioByDeviceId.isLoaded">
            <!-- If user.name exists, display user.name -->
            <div v-if="panelsRatioByDeviceId.options.series">
              <chart-card
                :height="panelsRatioByDeviceId.options.chart.height"
                :type="panelsRatioByDeviceId.options.chart.type"
                :options="panelsRatioByDeviceId.options"
                :series="panelsRatioByDeviceId.options.series"
              >
                <template slot="header">
                  <h4 class="card-title">Indice de performance</h4>
                  <p class="card-category">3 Months performance</p>
                </template>
              </chart-card>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-md-6">
          <div v-if="productionByDeviceId.isLoaded">
            <!-- If user.name exists, display user.name -->
            <div v-if="productionByDeviceId.series[0].data">
              <chart-card
                :id="productionByDeviceId.options.chart.id"
                :width="productionByDeviceId.width"
                :height="productionByDeviceId.height"
                :type="productionByDeviceId.type"
                :options="productionByDeviceId.options"
                :series="productionByDeviceId.series"
              >
                <template slot="header">
                  <h4 class="card-title">Production du foyer par tranche horaire</h4>
                  <p class="card-category">24 Hours performance</p>
                </template>
                <template slot="footer">
                  <div class="legend">
                    <i class="fa fa-circle text-info"></i> Open
                    <i class="fa fa-circle text-danger"></i> Click
                    <i class="fa fa-circle text-warning"></i> Click Second Time
                  </div>
                  <hr />
                  <div class="stats">
                    <i class="fa fa-history"></i> Updated 3 minutes ago
                  </div>
                </template>
              </chart-card>
            </div>
          </div>
        </div>

        <div class="col-md-6">
          <div v-if="consumptionByDeviceId.isLoaded">
            <!-- If user.name exists, display user.name -->
            <div v-if="consumptionByDeviceId.series[0].data">
              <chart-card
                :id="consumptionByDeviceId.options.chart.id"
                :width="consumptionByDeviceId.width"
                :height="consumptionByDeviceId.height"
                :type="consumptionByDeviceId.type"
                :options="consumptionByDeviceId.options"
                :series="consumptionByDeviceId.series"
              >
                <template slot="header">
                  <h4 class="card-title">Consommation du foyer par tranche horaire</h4>
                  <p class="card-category">24 Hours performance</p>
                </template>
                <template slot="footer">
                  <div class="legend">
                    <i class="fa fa-circle text-info"></i> Open
                    <i class="fa fa-circle text-danger"></i> Click
                    <i class="fa fa-circle text-warning"></i> Click Second Time
                  </div>
                  <hr />
                  <div class="stats">
                    <i class="fa fa-history"></i> Updated 3 minutes ago
                  </div>
                </template>
              </chart-card>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ChartCard from "src/components/Cards/ChartCard.vue";
import StatsCard from "src/components/Cards/StatsCard.vue";
import LTable from "src/components/Table.vue";

const axios = require("axios");

export default {
  components: {
    LTable,
    ChartCard,
    StatsCard
  },
  data() {
    return {
      tableData: {
        data: [
          {
            title:
              'Sign contract for "What are conference organizers afraid of?"',
            checked: false
          },
          {
            title:
              "Lines From Great Russian Literature? Or E-mails From My Boss?",
            checked: true
          },
          {
            title:
              "Flooded: One year later, assessing what was lost and what was found when a ravaging rain swept through metro Detroit",
            checked: true
          },
          {
            title: "Create 4 Invisible User Experiences you Never Knew About",
            checked: false
          },
          { title: 'Read "Following makes Medium better"', checked: false },
          { title: "Unfollow 5 enemies from twitter", checked: false }
        ]
      },
      panelsByDeviceId: {
        height: 350,
        type: "area",
        options: {
          chart: {
            id: "panels-prod-by-device-id"
          },
          xaxis: {
            categories: []
          },
          stroke: {
            curve: "smooth"
          },
          dataLabels: {
            enabled: false
          }
        },
        series: [
          {
            name: "Production",
            data: []
          },
          {
            name: "Self-consumption",
            data: []
          }
        ],
        isLoaded: false
      },
      panelsRatioByDeviceId: {
        options: {
          series: [],
          chart: {
            height: 350,
            type: "radialBar"
          },
          plotOptions: {
            radialBar: {
              hollow: {
                size: "70%"
              }
            }
          },
          labels: ["Average self-consumption rate"]
        },
        isLoaded: false
      },
      productionByDeviceId: {
        type: "area",
        options: {
          chart: {
            id: "prod-by-device-id"
          },
          xaxis: {
            categories: []
          },
          stroke: {
            curve: "smooth"
          },
          dataLabels: {
            enabled: false
          }
        },
        series: [
          {
            name: "Production du foyer par tranche horaire",
            data: []
          }
        ],
        isLoaded: false
      },
      consumptionByDeviceId: {
        type: "area",
        options: {
          chart: {
            id: "conso-by-device-id"
          },
          xaxis: {
            categories: []
          },
          stroke: {
            curve: "smooth"
          },
          dataLabels: {
            enabled: false
          }
        },
        series: [
          {
            name: "Consommation du foyer par tranche horaire",
            data: []
          }
        ],
        isLoaded: false
      }
    };
  },
  mounted() {
    this.getPanelsByDeviceId(
      "8bbecc0a-ca23-41ca-95fd-5ce0eb145d9d",
      this.panelsByDeviceId
    ),
      this.getPanelsRatioByDeviceId(
        "8bbecc0a-ca23-41ca-95fd-5ce0eb145d9d",
        this.panelsRatioByDeviceId
      ),
      this.getFroniusByDeviceId(
        "8bbecc0a-ca23-41ca-95fd-5ce0eb145d9d",
        "FromGenToConsumer",
        this.consumptionByDeviceId
      );
    this.getFroniusByDeviceId(
      "8bbecc0a-ca23-41ca-95fd-5ce0eb145d9d",
      "production",
      this.productionByDeviceId
    );
  },
  methods: {
    round(value, precision) {
      var multiplier = Math.pow(10, precision || 0);
      return Math.round(value * multiplier) / multiplier;
    },
    getPanelsByDeviceId(device_id, chart) {
      axios
        .get("http://localhost:3000/api/panels/" + device_id)
        .then(response => {
          let result = response.data.data.result;
          let tsConverted;

          chart.isLoaded = true;

          result.forEach(element => {
            tsConverted = new Date(
              Date.parse(element.date)
            ).toLocaleDateString();

            chart.options.xaxis.categories.push(tsConverted);
            chart.series[0].data.push(this.round(element.production, 2));
            chart.series[1].data.push(this.round(element.selfConsumption, 2));
          });
        })
        .catch(error => {
          console.log(error);
        });
    },
    getPanelsRatioByDeviceId(device_id, chart) {
      axios
        .get("http://localhost:3000/api/panels/ratio/" + device_id)
        .then(response => {
          let ratio = response.data.data.ratio;

          chart.isLoaded = true;
          chart.options.series.push(this.round(ratio, 0));
        })
        .catch(error => {
          console.log(error);
        });
    },
    getFroniusByDeviceId(device_id, var_name, chart) {
      axios
        .get("http://localhost:3000/api/fronius/" + device_id + "/" + var_name)
        .then(response => {
          let result = response.data.data.result;
          let tsConverted;

          chart.isLoaded = true;

          result.forEach(element => {
            tsConverted = new Date(
              Date.parse(element.timestamp)
            ).toLocaleTimeString();

            chart.options.xaxis.categories.push(tsConverted);
            chart.series[0].data.push(this.round(element.value, 2));
          });
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>
<style>
</style>
