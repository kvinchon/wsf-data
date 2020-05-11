<template>
  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-6">
          <div class="row">
            <div class="col-md-12">
              <card>
                <template slot="header">
                  <h4 class="card-title">Evolution de la production et consommation (W)</h4>
                  <base-select
                    class="filter-select"
                    :id="productionConsumption.options.chart.id"
                    :options="select.options.choices"
                    :selected="select.options.selected.default"
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
          </div>
        </div>

        <div class="col-md-6">
          <div class="row">
            <div class="col-md-12">
              <card>
                <template slot="header">
                  <h4 class="card-title">Auto-consommation et consommation réseau</h4>
                  <base-select
                    class="filter-select"
                    :id="consumptionRatio.chartOptions.chart.id"
                    :options="select.options.choices"
                    :selected="select.options.selected.default"
                    @changed="reloadConsumptionRatio"
                  ></base-select>
                </template>
                <div v-if="consumptionRatio.isLoaded">
                  <div id="chart">
                    <chart-card
                      :type="consumptionRatio.chartOptions.chart.type"
                      :height="consumptionRatio.chartOptions.chart.height"
                      :options="consumptionRatio.chartOptions"
                      :series="consumptionRatio.series"
                    ></chart-card>
                    <span class="consumption-self">Auto-consommation</span>
                    <span class="consumption-grid">Consommation réseau</span>
                  </div>
                </div>
              </card>
            </div>
          </div>

          <div class="row">
            <div class="col-md-12">
              <card>
                <template slot="header">
                  <h4 class="card-title">Auto-consommation et exportation</h4>
                  <base-select
                    class="filter-select"
                    :id="productionRatio.chartOptions.chart.id"
                    :options="select.options.choices"
                    :selected="select.options.selected.default"
                    @changed="reloadProductionRatio"
                  ></base-select>
                </template>
                <div v-if="productionRatio.isLoaded">
                  <div id="chart">
                    <chart-card
                      :type="productionRatio.chartOptions.chart.type"
                      :height="productionRatio.chartOptions.chart.height"
                      :options="productionRatio.chartOptions"
                      :series="productionRatio.series"
                    ></chart-card>
                    <span class="production-self">Auto-consommation</span>
                    <span class="production-export">Exportation</span>
                  </div>
                </div>
              </card>
            </div>
          </div>

          <div class="row">
            <div class="col-md-6">
              <card class="leads-card">
                <template slot="header">
                  <div class="leads-rectangle"></div>
                  <div class="leads-header">
                    <h4 class="card-title leads-title">Total des leads : {{this.leads.data.total}}</h4>
                    <p
                      class="card-category leads-category"
                      v-if="this.leads.data.new > 1"
                    >{{this.leads.data.new}} nouveaux leads ce mois-ci</p>
                    <p
                      class="card-category leads-category"
                      v-else
                    >{{this.leads.data.new}} nouveau lead ce mois-ci</p>
                  </div>
                </template>
              </card>
            </div>
            <div class="col-md-6">
              <card class="prospects-card">
                <template slot="header">
                  <div class="prospects-rectangle"></div>
                  <div class="prospects-header">
                    <h4
                      class="card-title prospects-title"
                    >Total des prospects : {{this.prospects.data.total}}</h4>
                    <p
                      class="card-category prospects-category"
                      v-if="this.prospects.data.new > 1"
                    >{{this.prospects.data.new}} nouveaux prospects ce mois-ci</p>
                    <p
                      class="card-category prospects-category"
                      v-else
                    >{{this.prospects.data.new}} nouveau prospect ce mois-ci</p>
                  </div>
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
      select: {
        options: {
          choices: [
            { text: "Aujourd'hui", key: 1, value: "today" },
            { text: "Semaine", key: 2, value: "week" },
            { text: "Mois", key: 3, value: "month" },
            { text: "Total", key: 4, value: "total" }
          ],
          selected: {
            default: "month",
            today: "today",
            week: "week",
            total: "total"
          }
        }
      },
      productionConsumption: {
        options: {
          chart: {
            id: "production-consumption",
            type: "line",
            height: 430,
            toolbar: {
              show: false
            }
          },
          xaxis: {
            categories: []
          },
          stroke: {
            curve: "straight"
          },
          dataLabels: {
            enabled: false
          },
          colors: ["#69AF23", "#F17E7F"]
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
            height: 80,
            stacked: true,
            stackType: "100%",
            toolbar: {
              show: false
            }
          },
          plotOptions: {
            bar: {
              horizontal: true,
              barHeight: "100%"
            }
          },
          stroke: {
            width: 1,
            colors: ["#fff"]
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
            enabled: false
          },
          fill: {
            opacity: 1
          },
          legend: {
            show: false,
            position: "top",
            horizontalAlign: "center"
          },
          grid: {
            show: false
          },
          colors: ["#69AF23", "#F17E7F"]
        },
        isLoaded: false
      },
      consumptionRatio: {
        series: [],
        chartOptions: {
          chart: {
            id: "cons-ratio",
            type: "bar",
            height: 80,
            stacked: true,
            stackType: "100%",
            toolbar: {
              show: false
            }
          },
          plotOptions: {
            bar: {
              horizontal: true,
              barHeight: "100%"
            }
          },
          stroke: {
            width: 1,
            colors: ["#fff"]
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
            enabled: false
          },
          fill: {
            opacity: 1
          },
          legend: {
            show: false,
            position: "bottom",
            horizontalAlign: "center"
          },
          grid: {
            show: false
          },
          colors: ["#69AF23", "#F17E7F"]
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
              element.equipment_ratio.toString().replace(".", ",") + "%";
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
              element.intervention_ratio.toString().replace(".", ",") + "%";
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
          var result = response.data.data.result;

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
<style scoped>
.filter-select {
  position: absolute;
  top: 18px;
  right: 15px;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 18px;
  letter-spacing: 0.01em;
  color: #6a707e;
}
.leads-rectangle,
.prospects-rectangle {
  position: absolute;
  top: 0;
  left: 0;
  width: 20px;
  height: 100%;
  box-shadow: 0px 0px 16px rgba(0, 0, 0, 0.14);
  border-radius: 4px 0 0 4px;
}
.leads-rectangle {
  background: #fbdb3c;
}
.prospects-rectangle {
  background: #910f7d;
}
.leads-header,
.prospects-header {
  padding-left: 20px;
}
.leads-category,
.prospects-category {
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 20px;
  color: #000000;
}
.leads-title,
.prospects-title {
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  color: #192a3e;
  margin-bottom: 10px;
}
.production-self,
.production-export,
.consumption-self,
.consumption-grid {
  position: relative;
  bottom: 20px;
  display: inline-block;
  width: 50%;
  font-size: 14px;
}
.production-self,
.consumption-self {
  text-align: left;
  padding-left: 30px;
}
.production-export,
.consumption-grid {
  text-align: right;
  padding-right: 10px;
}
</style>
<style>
.leads-card .card-header,
.prospects-card .card-header {
  padding: 10px;
}
</style>