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
        <div class="col-md-3 text-center">
          <base-button :onClick="todayOverview" class="btn btn-primary btn-fill">Aujourd'hui</base-button>
        </div>
        <div class="col-md-3 text-center">
          <base-button :onClick="weekOverview" class="btn btn-primary btn-fill">Cette semaine</base-button>
        </div>
        <div class="col-md-3 text-center">
          <base-button :onClick="monthOverview" class="btn btn-primary btn-fill">Ce mois-ci</base-button>
        </div>
        <div class="col-md-3 text-center">
          <base-button :onClick="totalOverview" class="btn btn-primary btn-fill">Total</base-button>
        </div>
      </div>

      <div class="row">
        <div class="col-md-6">
          <div v-if="consumptionRatioByDeviceId.isLoaded">
            <!-- If user.name exists, display user.name -->
            <div v-if="consumptionRatioByDeviceId.series">
              <chart-card
                :width="consumptionRatioByDeviceId.chartOptions.chart.width"
                :type="consumptionRatioByDeviceId.chartOptions.chart.type"
                :options="consumptionRatioByDeviceId.chartOptions"
                :series="consumptionRatioByDeviceId.series"
              >
                <template slot="header">
                  <h4 class="card-title">Consommation totale</h4>
                </template>
              </chart-card>
            </div>
          </div>
        </div>
        <div class="col-md-6">
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
                  <h4 class="card-title">Auto-consommation et Exportation</h4>
                </template>
              </chart-card>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-md-12">
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
                  <h4 class="card-title">Production et auto-consommation du foyer</h4>
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
          yaxis: {
            title: {
              text: "Energie (W)"
            }
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
            name: "Consommation",
            data: []
          }
        ],
        isLoaded: false
      },
      consumptionRatioByDeviceId: {
        series: [],
        chartOptions: {
          chart: {
            type: "donut",
            width: 500
          },
          labels: []
        },
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
                margin: 15,
                size: "70%"
              },

              dataLabels: {
                showOn: "always",
                name: {
                  offsetY: -10,
                  show: true,
                  color: "#888",
                  fontSize: "13px"
                },
                value: {
                  color: "#111",
                  fontSize: "30px",
                  show: true
                }
              }
            }
          },
          stroke: {
            lineCap: "round"
          },
          labels: ["Autoconsommation"]
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
      }
    };
  },
  methods: {
    getPanelsOverviewConsumptionByDeviceId(time_period, device_id, chart) {
      chart.isLoaded = false;
      chart.chartOptions.labels = [];
      chart.series = [];

      axios
        .get(
          "http://localhost:3000/api/panels/overview/consumption/" +
            time_period +
            "/" +
            device_id
        )
        .then(response => {
          chart.isLoaded = true;

          let result = response.data.data.result;
          let tsConverted;

          chart.chartOptions.labels.push("Panneaux");
          chart.chartOptions.labels.push("Réseau");

          result.forEach(element => {
            chart.series.push(this.round(element.panels, 0));
            chart.series.push(this.round(element.grid, 0));
          });
        })
        .catch(error => {
          console.log(error);
        });
    },
    getFroniusOverviewConsumptionByDeviceId() {},
    getPanelsOverviewRatioByDeviceId(time_period, device_id, chart) {
      chart.isLoaded = false;
      chart.options.series = [];

      axios
        .get(
          "http://localhost:3000/api/panels/overview/ratio/" +
            time_period +
            "/" +
            device_id
        )
        .then(response => {
          chart.isLoaded = true;
          let result = response.data.data.result;

          result.forEach(element => {
            chart.options.series.push(this.round(element.ratio, 0));
          });
        })
        .catch(error => {
          console.log(error);
        });
    },
    getFroniusOverviewRatioByDeviceId(device_id, chart) {
      chart.isLoaded = false;
      chart.options.series = [];

      axios
        .get("http://localhost:3000/api/panels/overview/ratio/" + device_id)
        .then(response => {
          let ratio = response.data.data.ratio;

          chart.isLoaded = true;
          chart.options.series.push(this.round(ratio, 0));
        })
        .catch(error => {
          console.log(error);
        });
    },
    getPanelsOverviewProductionByDeviceId(time_period, device_id, chart) {
      chart.options.xaxis.categories = [];
      chart.series[0].data = [];
      chart.series[1].data = [];
      chart.isLoaded = false;

      axios
        .get(
          "http://localhost:3000/api/panels/overview/production/" +
            time_period +
            "/" +
            device_id
        )
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
    getFroniusOverviewProductionByDeviceId(device_id, chart) {
      chart.options.xaxis.categories = [];
      chart.series[0].data = [];
      chart.series[1].data = [];
      chart.isLoaded = false;
      axios
        .get(
          "http://localhost:3000/api/fronius/overview/production/" + device_id
        )
        .then(response => {
          let result = response.data.data.result;
          let tsConverted;

          chart.isLoaded = true;

          result.forEach(element => {
            tsConverted = new Date(
              Date.parse(element.timestamp)
            ).toLocaleTimeString();

            chart.options.xaxis.categories.push(tsConverted);
            let value = parseFloat(element.sum);

            if (element.source === "production") {
              chart.series[0].data.push(this.round(value, 2));
            } else {
              chart.series[1].data.push(this.round(value, 2));
            }
          });
        })
        .catch(error => {
          console.log(error);
        });
    },
    todayOverview() {
      this.getFroniusOverviewProductionByDeviceId(
        "8bbecc0a-ca23-41ca-95fd-5ce0eb145d9d",
        this.panelsByDeviceId
      );
      this.getFroniusOverviewRatioByDeviceId(
        "8bbecc0a-ca23-41ca-95fd-5ce0eb145d9d",
        this.panelsByDeviceId
      );
      this.getFroniusOverviewConsumptionByDeviceId(
        "8bbecc0a-ca23-41ca-95fd-5ce0eb145d9d",
        this.consumptionRatioByDeviceId
      );
    },
    weekOverview() {
      this.getPanelsOverviewProductionByDeviceId(
        "week",
        "8bbecc0a-ca23-41ca-95fd-5ce0eb145d9d",
        this.panelsByDeviceId
      );
      this.getPanelsOverviewRatioByDeviceId(
        "week",
        "8bbecc0a-ca23-41ca-95fd-5ce0eb145d9d",
        this.panelsRatioByDeviceId
      );
      this.getPanelsOverviewConsumptionByDeviceId(
        "week",
        "8bbecc0a-ca23-41ca-95fd-5ce0eb145d9d",
        this.consumptionRatioByDeviceId
      );
    },
    monthOverview() {
      this.getPanelsOverviewProductionByDeviceId(
        "month",
        "8bbecc0a-ca23-41ca-95fd-5ce0eb145d9d",
        this.panelsByDeviceId
      );
      this.getPanelsOverviewRatioByDeviceId(
        "month",
        "8bbecc0a-ca23-41ca-95fd-5ce0eb145d9d",
        this.panelsRatioByDeviceId
      );
      this.getPanelsOverviewConsumptionByDeviceId(
        "month",
        "8bbecc0a-ca23-41ca-95fd-5ce0eb145d9d",
        this.consumptionRatioByDeviceId
      );
    },
    totalOverview() {
      this.getPanelsOverviewProductionByDeviceId(
        "total",
        "8bbecc0a-ca23-41ca-95fd-5ce0eb145d9d",
        this.panelsByDeviceId
      );
      this.getPanelsOverviewRatioByDeviceId(
        "total",
        "8bbecc0a-ca23-41ca-95fd-5ce0eb145d9d",
        this.panelsRatioByDeviceId
      );
      this.getPanelsOverviewConsumptionByDeviceId(
        "total",
        "8bbecc0a-ca23-41ca-95fd-5ce0eb145d9d",
        this.consumptionRatioByDeviceId
      );
    },
    round(value, precision) {
      var multiplier = Math.pow(10, precision || 0);
      return Math.round(value * multiplier) / multiplier;
    }
  }
};
</script>
<style>
</style>
