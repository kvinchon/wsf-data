<template>
  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-6">
          <card>
            <template slot="header">
              <h4 class="card-title">Evolution de la production (W)</h4>
              <base-select :id="production.options.chart.id" @changed="reloadProduction"></base-select>
            </template>
            <div v-if="production.isLoaded">
              <!-- If user.name exists, display user.name -->
              <div v-if="production.options.series[0].data">
                <chart-card
                  :id="production.options.chart.id"
                  :height="production.options.chart.height"
                  :type="production.options.chart.type"
                  :options="production.options"
                  :series="production.options.series"
                ></chart-card>
              </div>
            </div>
          </card>
        </div>
        <div class="col-md-6">
          <card>
            <template slot="header">
              <h4 class="card-title">Evolution de la consommation (W)</h4>
              <base-select :id="consumption.options.chart.id" @changed="reloadConsumption"></base-select>
            </template>
            <div v-if="consumption.isLoaded">
              <!-- If user.name exists, display user.name -->
              <div v-if="consumption.options.series[0].data">
                <chart-card
                  :id="consumption.options.chart.id"
                  :height="consumption.options.chart.height"
                  :type="consumption.options.chart.type"
                  :options="consumption.options"
                  :series="consumption.options.series"
                ></chart-card>
              </div>
            </div>
          </card>
        </div>
      </div>

      <div class="row">
        <div class="col-md-6">
          <div class="row">
            <div class="col-md-12">
              <card
                class="table-striped-with-hover"
                body-classes="table-full-width table-responsive"
              >
                <template slot="header">
                  <h4 class="card-title">Consommation par appareil</h4>
                </template>
                <l-table
                  class="table-hover table-striped"
                  :columns="equipmentRatio.columns"
                  :data="equipmentRatio.data"
                  :clickable="false"
                ></l-table>
              </card>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6">
              <card>
                <template slot="header">
                  <h4 class="card-title">Total des leads : {{this.leads.data.total}}</h4>
                  <p
                    class="card-category"
                    v-if="this.leads.data.month > 1"
                  >{{this.leads.data.month}} nouveaux leads ce mois-ci</p>
                  <p class="card-category" v-else>{{this.leads.data.month}} nouveau lead ce mois-ci</p>
                </template>
              </card>
            </div>
            <div class="col-md-6">
              <card>
                <template slot="header">
                  <h4 class="card-title">Total des prospects : {{this.prospects.data.total}}</h4>
                  <p
                    class="card-category"
                    v-if="this.prospects.data.month > 1"
                  >{{this.prospects.data.month}} nouveaux prospects ce mois-ci</p>
                  <p
                    class="card-category"
                    v-else
                  >{{this.prospects.data.month}} nouveau prospect ce mois-ci</p>
                </template>
              </card>
            </div>
          </div>
        </div>

        <div class="col-md-6">
          <div class="row">
            <div class="col-md-12">
              <base-select
                :id="consumptionRatio.chartOptions.chart.id"
                @changed="reloadConsumptionRatio"
              ></base-select>
              <div v-if="consumptionRatio.isLoaded">
                <div id="chart">
                  <chart-card
                    :type="consumptionRatio.chartOptions.chart.type"
                    :height="consumptionRatio.chartOptions.chart.height"
                    :options="consumptionRatio.chartOptions"
                    :series="consumptionRatio.series"
                  ></chart-card>
                </div>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-md-12">
              <base-select
                :id="productionRatio.chartOptions.chart.id"
                @changed="reloadProductionRatio"
              ></base-select>
              <div v-if="productionRatio.isLoaded">
                <div id="chart">
                  <chart-card
                    :type="productionRatio.chartOptions.chart.type"
                    :height="productionRatio.chartOptions.chart.height"
                    :options="productionRatio.chartOptions"
                    :series="productionRatio.series"
                  ></chart-card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import LTable from "src/components/Table.vue";
import Card from "src/components/Cards/Card.vue";
import ChartCard from "src/components/Cards/ChartCard.vue";
import BaseSelect from "src/components/Inputs/BaseSelect.vue";

const axios = require("axios");

export default {
  components: {
    LTable,
    Card,
    ChartCard
  },
  data() {
    return {
      production: {
        options: {
          series: [
            {
              name: "Evolution de la production (W)",
              data: []
            }
          ],
          chart: {
            id: "production",
            type: "area",
            height: 270,
            zoom: {
              autoScaleYaxis: true
            }
          },
          dataLabels: {
            enabled: false
          },
          xaxis: {
            categories: []
          },
          stroke: {
            curve: "smooth"
          }
        },
        isLoaded: false
      },
      productionRatio: {
        series: [],
        chartOptions: {
          chart: {
            id: "prod-ratio",
            type: "bar",
            height: 130,
            stacked: true,
            stackType: "100%"
          },
          plotOptions: {
            bar: {
              horizontal: true
            }
          },
          stroke: {
            width: 1,
            colors: ["#fff"]
          },
          title: {
            text: "Auto-consommation et exportation"
          },
          xaxis: {
            categories: [],
            labels: {
              show: false
            },
            axisBorder: {
              show: false
            },
            axisTicks: {
              show: false
            },
            crosshairs: {
              show: false
            }
          },
          yaxis: {
            show: false
          },
          tooltip: {
            y: {
              formatter: function(val) {
                return val + "K";
              }
            }
          },
          fill: {
            opacity: 1
          },
          legend: {
            position: "bottom",
            horizontalAlign: "center"
          },
          grid: {
            show: false
          }
        },
        isLoaded: false
      },
      consumptionRatio: {
        series: [],
        chartOptions: {
          chart: {
            id: "cons-ratio",
            type: "bar",
            height: 130,
            stacked: true,
            stackType: "100%"
          },
          plotOptions: {
            bar: {
              horizontal: true
            }
          },
          stroke: {
            width: 1,
            colors: ["#fff"]
          },
          title: {
            text: "Auto-consommation et consommation réseau"
          },
          xaxis: {
            categories: [],
            labels: {
              show: false
            },
            axisBorder: {
              show: false
            },
            axisTicks: {
              show: false
            },
            crosshairs: {
              show: false
            }
          },
          yaxis: {
            show: false
          },
          tooltip: {
            y: {
              formatter: function(val) {
                return val + "K";
              }
            }
          },
          fill: {
            opacity: 1
          },
          legend: {
            position: "bottom",
            horizontalAlign: "center"
          },
          grid: {
            show: false
          }
        },
        isLoaded: false
      },
      consumption: {
        options: {
          series: [
            {
              name: "Evolution de la consommation (W)",
              data: []
            }
          ],
          chart: {
            id: "consumption",
            type: "area",
            height: 270,
            zoom: {
              autoScaleYaxis: true
            }
          },
          dataLabels: {
            enabled: false
          },
          xaxis: {
            categories: []
          },
          stroke: {
            curve: "smooth"
          }
        },
        isLoaded: false
      },
      equipmentRatio: {
        columns: [],
        data: [],
        isLoaded: false
      },
      leads: {
        data: {},
        isLoaded: false
      },
      prospects: {
        data: {},
        isLoaded: false
      }
    };
  },
  methods: {
    reloadProduction(value) {
      switch (value) {
        case "today":
          this.getFroniusProduction(this.production);
          break;
        default:
          this.getPanelsProduction(value, this.production);
          break;
      }
    },
    reloadProductionRatio(value) {
      this.getPanelsProductionRatio(value, this.productionRatio);
    },
    reloadConsumptionRatio(value) {
      this.getPanelsConsumptionRatio(value, this.consumptionRatio);
    },
    reloadConsumption(value) {
      switch (value) {
        case "today":
          this.getFroniusConsumption(this.consumption);
          break;
        default:
          this.getPanelsConsumption(value, this.consumption);
          break;
      }
    },
    getPanelsProduction(time_period, chart) {
      chart.options.xaxis.categories = [];
      chart.options.series[0].data = [];
      chart.isLoaded = false;

      axios
        .get("http://localhost:3000/api/panels/production/" + time_period)
        .then(response => {
          let result = response.data.data.result;
          let tsConverted;

          chart.isLoaded = true;

          result.forEach(element => {
            tsConverted = new Date(
              Date.parse(element.date)
            ).toLocaleDateString();

            chart.options.xaxis.categories.push(tsConverted);
            chart.options.series[0].data.push(
              this.round(element.production, 2)
            );
          });
        })
        .catch(error => {
          console.log(error);
        });
    },
    getFroniusProduction(chart) {
      chart.options.xaxis.categories = [];
      chart.options.series[0].data = [];
      chart.isLoaded = false;

      axios
        .get("http://localhost:3000/api/fronius/production")
        .then(response => {
          let result = response.data.data.result;
          let tsConverted;

          chart.isLoaded = true;

          result.forEach(element => {
            tsConverted = new Date(
              Date.parse(element.timestamp)
            ).toLocaleTimeString();

            chart.options.xaxis.categories.push(tsConverted);
            chart.options.series[0].data.push(
              this.round(element.production, 2)
            );
          });
        })
        .catch(error => {
          console.log(error);
        });
    },
    getPanelsProductionRatio(time_period, chart) {
      chart.isLoaded = false;
      chart.series = [];

      axios
        .get("http://localhost:3000/api/panels/production/ratio/" + time_period)
        .then(response => {
          chart.isLoaded = true;
          var result = response.data.data.result;

          result.forEach(element => {
            element.selfconsumption = this.round(element.selfconsumption, 0);
            element.export = this.round(element.export, 0);

            chart.series.push(
              { name: "Auto-consommation", data: [element.selfconsumption] },
              { name: "Exportation", data: [element.export] }
            );
          });
        })
        .catch(error => {
          console.log(error);
        });
    },
    getPanelsConsumptionRatio(time_period, chart) {
      chart.isLoaded = false;
      chart.series = [];

      axios
        .get(
          "http://localhost:3000/api/panels/consumption/ratio/" + time_period
        )
        .then(response => {
          chart.isLoaded = true;
          var result = response.data.data.result;

          result.forEach(element => {
            element.selfconsumption = this.round(element.selfconsumption, 0);
            element.grid = this.round(element.grid, 0);

            chart.series.push(
              { name: "Auto-consommation", data: [element.selfconsumption] },
              { name: "Consommation réseau", data: [element.grid] }
            );
          });
        })
        .catch(error => {
          console.log(error);
        });
    },
    getPanelsConsumption(time_period, chart) {
      chart.options.xaxis.categories = [];
      chart.options.series[0].data = [];
      chart.isLoaded = false;

      axios
        .get("http://localhost:3000/api/panels/consumption/" + time_period)
        .then(response => {
          let result = response.data.data.result;
          let tsConverted;

          chart.isLoaded = true;

          result.forEach(element => {
            tsConverted = new Date(
              Date.parse(element.date)
            ).toLocaleDateString();

            chart.options.xaxis.categories.push(tsConverted);
            chart.options.series[0].data.push(
              this.round(element.consumption, 2)
            );
          });
        })
        .catch(error => {
          console.log(error);
        });
    },
    getFroniusConsumption(chart) {
      chart.options.xaxis.categories = [];
      chart.options.series[0].data = [];
      chart.isLoaded = false;

      axios
        .get("http://localhost:3000/api/fronius/consumption")
        .then(response => {
          let result = response.data.data.result;
          let tsConverted;

          chart.isLoaded = true;

          result.forEach(element => {
            tsConverted = new Date(
              Date.parse(element.timestamp)
            ).toLocaleTimeString();

            chart.options.xaxis.categories.push(tsConverted);
            chart.options.series[0].data.push(
              this.round(element.consumption, 2)
            );
          });
        })
        .catch(error => {
          console.log(error);
        });
    },
    getEquipmentRatio(table) {
      table.isLoaded = false;
      table.data = [];

      axios
        .get("http://localhost:3000/api/equipment/ratio")
        .then(response => {
          var result = response.data.data.result;
          var columns = Object.keys(result[0]);

          table.isLoaded = true;

          columns.forEach(column => {
            table.columns.push(column);
          });

          result.forEach(element => {
            element.equipment_type = this.capitalizeFirstLetter(
              element.equipment_type
            );
            element.consumption = element.consumption.toString() + " kWh";
            element.equipment_ratio =
              element.equipment_ratio.toString().replace(".", ",") + " %";
            table.data.push(element);
          });
        })
        .catch(error => {
          console.log(error);
        });
    },
    getUsersByStatus(status, card) {
      card.isLoaded = false;
      card.data = {};

      axios
        .get("http://localhost:3000/api/users/status/" + status)
        .then(response => {
          let result = response.data.data.result;

          card.isLoaded = true;

          result.forEach(element => {
            card.data = element;
          });
        })
        .catch(error => {
          console.log(error);
        });
    },
    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    round(value, precision) {
      var multiplier = Math.pow(10, precision || 0);
      return Math.round(value * multiplier) / multiplier;
    }
  },
  mounted() {
    this.getPanelsProduction("month", this.production);
    this.getPanelsProductionRatio("month", this.productionRatio);
    this.getPanelsConsumptionRatio("month", this.consumptionRatio);
    this.getPanelsConsumption("month", this.consumption);
    this.getEquipmentRatio(this.equipmentRatio);
    this.getUsersByStatus("lead", this.leads);
    this.getUsersByStatus("prospect", this.prospects);
  }
};
</script>