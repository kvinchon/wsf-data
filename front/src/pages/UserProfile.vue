<template>
  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-6">
          <card>
            <template slot="header">
              <h4 class="card-title">Informations client</h4>
            </template>
            <div class="row">
              <div class="col-md-6">
                <p>Nom : {{ this.userInfo.data.last_name }}</p>
              </div>
              <div class="col-md-6">
                <p>Identifiant : {{this.userInfo.data.id}}</p>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <p>Prénom : {{ this.userInfo.data.first_name }}</p>
              </div>
              <div class="col-md-6">
                <p>Typologie : {{ this.userInfo.data.typology }}</p>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <p>Code postal : {{ this.userInfo.data.zipcode }} ({{ this.userInfo.data.city }})</p>
              </div>
              <div class="col-md-6">
                <p>Email : {{this.userInfo.data.email}}</p>
              </div>
            </div>
          </card>
        </div>
        <div class="col-md-6">
          <card>
            <template slot="header">
              <h4 class="card-title">Notifications</h4>
            </template>
            <div class="row">
              <div class="col-md-12">
                <card>
                  <template slot="header">
                    <h4 class="card-title">Baisse de la production</h4>
                    <div class="row">
                      <div class="col-md-12">
                        <p>Nous constatons une baisse importante de la production dûe à l’installation. Une maintenance ou un remplacement de panneau est peut-être nécessaire.</p>
                      </div>
                    </div>
                  </template>
                </card>
              </div>
            </div>
          </card>
        </div>
      </div>

      <div class="row">
        <div class="col-md-6">
          <card>
            <template slot="header">
              <h4 class="card-title">Evolution de la production (W)</h4>
              <base-select
                :id="productionByUserId.options.chart.id"
                @changed="reloadProductionByUserId"
              ></base-select>
            </template>
            <div v-if="productionByUserId.isLoaded">
              <!-- If user.name exists, display user.name -->
              <div v-if="productionByUserId.options.series[0].data">
                <chart-card
                  :id="productionByUserId.options.chart.id"
                  :height="productionByUserId.options.chart.height"
                  :type="productionByUserId.options.chart.type"
                  :options="productionByUserId.options"
                  :series="productionByUserId.options.series"
                ></chart-card>
              </div>
            </div>
          </card>
        </div>
        <div class="col-md-3">
          <card>
            <template slot="header">
              <h4 class="card-title">Auto-consommation et exportation</h4>
              <base-select :id="productionRatioByUserId.options.chart.id" @changed="reloadProductionRatioByUserId"></base-select>
            </template>
            <div v-if="productionRatioByUserId.isLoaded">
              <!-- If user.name exists, display user.name -->
              <div v-if="productionRatioByUserId.options.series">
                <chart-card
                  :id="productionRatioByUserId.options.chart.id"
                  :height="productionRatioByUserId.options.chart.height"
                  :type="productionRatioByUserId.options.chart.type"
                  :options="productionRatioByUserId.options"
                  :series="productionRatioByUserId.options.series"
                ></chart-card>
              </div>
            </div>
          </card>
        </div>

        <div class="col-md-3">
          <card>
            <template slot="header">
              <h4 class="card-title">Auto-consommation et consommation réseau</h4>
              <base-select :id="consumptionRatioByUserId.options.chart.id" @changed="reloadConsumptionRatioByUserId"></base-select>
            </template>
            <div v-if="consumptionRatioByUserId.isLoaded">
              <!-- If user.name exists, display user.name -->
              <div v-if="consumptionRatioByUserId.options.series">
                <chart-card
                  :id="consumptionRatioByUserId.options.chart.id"
                  :height="consumptionRatioByUserId.options.chart.height"
                  :type="consumptionRatioByUserId.options.chart.type"
                  :options="consumptionRatioByUserId.options"
                  :series="consumptionRatioByUserId.options.series"
                ></chart-card>
              </div>
            </div>
          </card>
        </div>
      </div>

      <div class="row">
        <div class="col-md-6">
          <card>
            <template slot="header">
              <h4 class="card-title">Evolution de la consommation (W)</h4>
              <base-select :id="consumptionByUserId.options.chart.id" @changed="reloadConsumptionByUserId"></base-select>
            </template>
            <div v-if="consumptionByUserId.isLoaded">
              <!-- If user.name exists, display user.name -->
              <div v-if="consumptionByUserId.options.series[0].data">
                <chart-card
                  :id="consumptionByUserId.options.chart.id"
                  :height="consumptionByUserId.options.chart.height"
                  :type="consumptionByUserId.options.chart.type"
                  :options="consumptionByUserId.options"
                  :series="consumptionByUserId.options.series"
                ></chart-card>
              </div>
            </div>
          </card>
        </div>
        <div class="col-md-6">
          <card>
            <template slot="header">
              <h4 class="card-title">Equipement du foyer</h4>
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

const axios = require("axios");

export default {
  components: {
    Card,
    ChartCard
  },
  data() {
    return {
      userInfo: {
        data: {},
        isLoaded: false
      },
      productionByUserId: {
        options: {
          series: [
            {
              name: "Evolution de la production (W)",
              data: []
            }
          ],
          chart: {
            id: "prod-by-user-id",
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
      productionRatioByUserId: {
        options: {
          chart: {
            id: "prod-ratio-by-user-id",
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
      consumptionRatioByUserId: {
        options: {
          chart: {
            id: "cons-ratio-by-user-id",
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
      consumptionByUserId: {
        options: {
          series: [
            {
              name: "Evolution de la consommation (W)",
              data: []
            }
          ],
          chart: {
            id: "cons-by-user-id",
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
      }
    };
  },
  methods: {
    reloadProductionByUserId(value) {
      switch (value) {
        case "today":
          this.getFroniusProductionByUserId(this.$route.params.id, this.productionByUserId);
          break;
        default:
          this.getPanelsProductionByUserId(value, this.$route.params.id, this.productionByUserId);
          break;
      }
    },
    reloadProductionRatioByUserId(value) {
      this.getPanelsProductionRatioByUserId(value, this.$route.params.id, this.productionRatioByUserId);
    },
    reloadConsumptionRatioByUserId(value) {
      this.getPanelsConsumptionRatioByUserId(value, this.$route.params.id, this.consumptionRatioByUserId);
    },
    reloadConsumptionByUserId(value) {
      switch (value) {
        case "today":
          this.getFroniusConsumptionByUserId(this.$route.params.id, this.consumptionByUserId);
          break;
        default:
          this.getPanelsConsumptionByUserId(value, this.$route.params.id, this.consumptionByUserId);
          break;
      }
    },
    getUserById(userId, card) {
      card.isLoaded = false;
      card.data = {};

      axios
        .get("http://localhost:3000/api/users/" + userId)
        .then(response => {
          let result = response.data.data.result;

          card.isLoaded = true;

          result.forEach(element => {
            if (element.typology === null) {
              element.typology = "inconnue";
            }

            element.typology = this.capitalizeFirstLetter(element.typology);

            element.created_on = new Date(
              Date.parse(element.created_on)
            ).toLocaleString();

            card.data = element;
          });
        })
        .catch(error => {
          console.log(error);
        });
    },
    getPanelsProductionByUserId(time_period, user_id, chart) {
      chart.options.xaxis.categories = [];
      chart.options.series[0].data = [];
      chart.isLoaded = false;

      axios
        .get(
          "http://localhost:3000/api/panels/production/" +
            time_period +
            "/" +
            user_id
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
            chart.options.series[0].data.push(
              this.round(element.production, 2)
            );
          });
        })
        .catch(error => {
          console.log(error);
        });
    },
    getFroniusProductionByUserId(user_id, chart) {
      chart.options.xaxis.categories = [];
      chart.options.series[0].data = [];
      chart.isLoaded = false;

      axios
        .get(
          "http://localhost:3000/api/fronius/production/" + user_id
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
            chart.options.series[0].data.push(
              this.round(element.production, 2)
            );
          });
        })
        .catch(error => {
          console.log(error);
        });
    },
    getPanelsProductionRatioByUserId(time_period, user_id, chart) {
      chart.isLoaded = false;
      chart.options.series = [];

      axios
        .get(
          "http://localhost:3000/api/panels/production/ratio/" +
            time_period +
            "/" +
            user_id
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
    getPanelsConsumptionRatioByUserId(time_period, user_id, chart) {
      chart.isLoaded = false;
      chart.options.series = [];

      axios
        .get(
          "http://localhost:3000/api/panels/consumption/ratio/" +
            time_period +
            "/" +
            user_id
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
    getPanelsConsumptionByUserId(time_period, user_id, chart) {
      chart.options.xaxis.categories = [];
      chart.options.series[0].data = [];
      chart.isLoaded = false;

      axios
        .get(
          "http://localhost:3000/api/panels/consumption/" +
            time_period +
            "/" +
            user_id
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
            chart.options.series[0].data.push(
              this.round(element.consumption, 2)
            );
          });
        })
        .catch(error => {
          console.log(error);
        });
    },
    getFroniusConsumptionByUserId(user_id, chart) {
      chart.options.xaxis.categories = [];
      chart.options.series[0].data = [];
      chart.isLoaded = false;

      axios
        .get(
          "http://localhost:3000/api/fronius/consumption/" +
            user_id
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
            chart.options.series[0].data.push(
              this.round(element.consumption, 2)
            );
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
    const userId = this.$route.params.id;

    this.getUserById(userId, this.userInfo);
    this.getPanelsProductionByUserId("month", userId, this.productionByUserId);
    this.getPanelsProductionRatioByUserId(
      "month",
      userId,
      this.productionRatioByUserId
    );
    this.getPanelsConsumptionRatioByUserId(
      "month",
      userId,
      this.consumptionRatioByUserId
    );
    this.getPanelsConsumptionByUserId(
      "month",
      userId,
      this.consumptionByUserId
    );
  }
};
</script>

