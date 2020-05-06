<template>
  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-6">
          <card>
            <template slot="header">
              <h4 class="card-title">Evolution de la production et consommation (W)</h4>
              <base-select
                :id="productionConsumption.options.chart.id"
                @changed="reloadProductionConsumption"
              ></base-select>
            </template>
            <div v-if="productionConsumption.isLoaded">
              <!-- If user.name exists, display user.name -->
              <div v-if="productionConsumption.series[0].data">
                <chart-card
                  :id="productionConsumption.options.chart.id"
                  :height="productionConsumption.options.chart.height"
                  :type="productionConsumption.options.chart.type"
                  :options="productionConsumption.options"
                  :series="productionConsumption.series"
                ></chart-card>
              </div>
            </div>
          </card>
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
        </div>

        <div class="col-md-6">
          <div class="row">
            <div class="col-md-12">
              <card
                class="table-striped-with-hover"
                body-classes="table-full-width table-responsive"
              >
                <template slot="header">
                  <h4 class="card-title">Pannes et maintenance</h4>
                </template>
                <l-table
                  class="table-hover table-striped"
                  :columns="interventionsRatio.columns"
                  :data="interventionsRatio.data"
                  :clickable="false"
                ></l-table>
              </card>
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
      productionConsumption: {
        options: {
          chart: {
            id: "production-consumption",
            type: "area",
            height: 350
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
            name: "Consommation",
            data: []
          }
        ],
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
      equipmentRatio: {
        columns: [],
        data: [],
        isLoaded: false
      },
      interventionsRatio: {
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
    reloadProductionConsumption(value) {
      switch (value) {
        case "today":
          this.getFronius(this.productionConsumption);
          break;
        default:
          this.getPanels(value, this.productionConsumption);
          break;
      }
    },
    reloadProductionRatio(value) {
      this.getPanelsProductionRatio(value, this.productionRatio);
    },
    reloadConsumptionRatio(value) {
      this.getPanelsConsumptionRatio(value, this.consumptionRatio);
    },
    getPanels(time_period, chart) {
      chart.options.xaxis.categories = [];
      chart.series[0].data = [];
      chart.series[1].data = [];
      chart.isLoaded = false;

      axios
        .get("http://localhost:3000/api/panels/" + time_period)
        .then(response => {
          var result = response.data.data.result;
          var tsConverted;

          chart.isLoaded = true;

          result.forEach(element => {
            tsConverted = new Date(
              Date.parse(element.date)
            ).toLocaleDateString();

            chart.options.xaxis.categories.push(tsConverted);
            chart.series[0].data.push(element.production);
            chart.series[1].data.push(element.consumption);
          });
        })
        .catch(error => {
          console.log(error);
        });
    },
    getFronius(chart) {
      chart.options.xaxis.categories = [];
      chart.series[0].data = [];
      chart.series[1].data = [];
      chart.isLoaded = false;

      axios
        .get("http://localhost:3000/api/fronius")
        .then(response => {
          var result = response.data.data.result;
          var tsConverted;

          chart.isLoaded = true;

          result.forEach(element => {
            tsConverted = new Date(
              Date.parse(element.timestamp)
            ).toLocaleTimeString();

            if (element.source === "production") {
              tsConverted = new Date(
                Date.parse(element.timestamp)
              ).toLocaleTimeString();

              chart.options.xaxis.categories.push(tsConverted);
              chart.series[0].data.push(element.value);
            } else {
              chart.series[1].data.push(element.value);
            }
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
    getInterventionsRatio(table) {
      table.isLoaded = false;
      table.data = [];

      axios
        .get("http://localhost:3000/api/interventions/ratio")
        .then(response => {
          var result = response.data.data.result;
          var columns = Object.keys(result[0]);

          table.isLoaded = true;

          columns.forEach(column => {
            table.columns.push(column);
          });

          result.forEach(element => {
            element.intervention_type = this.capitalizeFirstLetter(
              element.intervention_type
            );
            element.category = this.capitalizeFirstLetter(element.category);
            element.intervention_ratio =
              element.intervention_ratio.toString().replace(".", ",") + " %";
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
    }
  },
  mounted() {
    this.getPanels("month", this.productionConsumption);
    this.getPanelsProductionRatio("month", this.productionRatio);
    this.getPanelsConsumptionRatio("month", this.consumptionRatio);
    this.getEquipmentRatio(this.equipmentRatio);
    this.getInterventionsRatio(this.interventionsRatio);
    this.getUsersByStatus("lead", this.leads);
    this.getUsersByStatus("prospect", this.prospects);
  }
};
</script>