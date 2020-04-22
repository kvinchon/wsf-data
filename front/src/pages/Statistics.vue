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
        <div class="col-md-3">
          <card>
            <template slot="header">
              <h4 class="card-title">Auto-consommation et exportation</h4>
              <base-select :id="productionRatio.options.chart.id" @changed="reloadProductionRatio"></base-select>
            </template>
            <div v-if="productionRatio.isLoaded">
              <!-- If user.name exists, display user.name -->
              <div v-if="productionRatio.options.series">
                <chart-card
                  :id="productionRatio.options.chart.id"
                  :height="productionRatio.options.chart.height"
                  :type="productionRatio.options.chart.type"
                  :options="productionRatio.options"
                  :series="productionRatio.options.series"
                ></chart-card>
              </div>
            </div>
          </card>
        </div>
        <div class="col-md-3">
          <card>
            <template slot="header">
              <h4 class="card-title">Auto-consommation et consommation réseau</h4>
              <base-select
                :id="consumptionRatio.options.chart.id"
                @changed="reloadConsumptionRatio"
              ></base-select>
            </template>
            <div v-if="consumptionRatio.isLoaded">
              <!-- If user.name exists, display user.name -->
              <div v-if="consumptionRatio.options.series">
                <chart-card
                  :id="consumptionRatio.options.chart.id"
                  :height="consumptionRatio.options.chart.height"
                  :type="consumptionRatio.options.chart.type"
                  :options="consumptionRatio.options"
                  :series="consumptionRatio.options.series"
                ></chart-card>
              </div>
            </div>
          </card>
        </div>
        <div class="col-md-6">
          <card>
            <template slot="header">
              <h4 class="card-title">Consommation par appareil</h4>
            </template>
          </card>
        </div>
      </div>

      <div class="row">
        <div class="col-md-3">
          <card>
            <template slot="header">
              <h4 class="card-title">Total des leads : {{this.leads.data.total}}</h4>
              <p class="card-category" v-if="this.leads.data.month > 1">{{this.leads.data.month}} nouveaux leads ce mois-ci</p>
              <p class="card-category" v-else>{{this.leads.data.month}} nouveau lead ce mois-ci</p>
            </template>
          </card>
        </div>
        <div class="col-md-3">
          <card>
          <template slot="header">
            <h4 class="card-title">Total des prospects : {{this.prospects.data.total}}</h4>
            <p class="card-category" v-if="this.prospects.data.month > 1">{{this.prospects.data.month}} nouveaux prospects ce mois-ci</p>
              <p class="card-category" v-else>{{this.prospects.data.month}} nouveau prospect ce mois-ci</p>
          </template>
          </card>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Card from "src/components/Cards/Card.vue";
import ChartCard from "src/components/Cards/ChartCard.vue";
import BaseSelect from "src/components/Inputs/BaseSelect.vue";

const axios = require("axios");

export default {
  components: {
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
        options: {
          chart: {
            id: "prod-ratio",
            height: 350,
            type: "radialBar"
          },
          series: [],
          colors: ["#008ffa"],
          plotOptions: {
            radialBar: {
              startAngle: -90,
              endAngle: 90,
              track: {
                background: "#333",
                startAngle: -90,
                endAngle: 90
              },
              dataLabels: {
                name: {
                  color: "#000",
                  show: true
                },
                value: {
                  fontSize: "30px",
                  show: true
                }
              }
            }
          },
          labels: ["Auto-consommation"]
        },
        isLoaded: false
      },
      consumptionRatio: {
        options: {
          chart: {
            id: "cons-ratio",
            height: 350,
            type: "radialBar"
          },
          series: [],
          colors: ["#008ffa"],
          plotOptions: {
            radialBar: {
              startAngle: -90,
              endAngle: 90,
              track: {
                background: "#333",
                startAngle: -90,
                endAngle: 90
              },
              dataLabels: {
                name: {
                  color: "#000",
                  show: true
                },
                value: {
                  fontSize: "30px",
                  show: true
                }
              }
            }
          },
          labels: ["Auto-consommation"]
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
      chart.options.series = [];

      axios
        .get("http://localhost:3000/api/panels/production/ratio/" + time_period)
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
    getPanelsConsumptionRatio(time_period, chart) {
      chart.isLoaded = false;
      chart.options.series = [];

      axios
        .get(
          "http://localhost:3000/api/panels/consumption/ratio/" + time_period
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
    this.getUsersByStatus("lead", this.leads);
    this.getUsersByStatus("prospect", this.prospects);
  }
};
</script>