<template>
  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-6">
          <div class="row">
            <div class="col-md-12">
              <card>
                <template slot="header">
                  <h4 class="card-title">Informations client</h4>
                  <p class="card-category">Client depuis le {{this.userInfo.data.created_on}}</p>
                  <button class="btnUserInfo" @click="userInfo.isShown = !userInfo.isShown"></button>
                </template>
                <div class="userInfo1" v-show="userInfo.isShown">
                  <div class="row">
                    <div class="col-md-6">
                      <p>Nom : {{this.userInfo.data.last_name}}</p>
                    </div>
                    <div class="col-md-6">
                      <p>Identifiant : {{this.userInfo.data.id}}</p>
                    </div>
                    <div class="col-md-6">
                      <p>Prénom : {{this.userInfo.data.first_name}}</p>
                    </div>
                    <div class="col-md-6">
                      <p>Typologie : {{this.userInfo.data.typology}}</p>
                    </div>
                    <div class="col-md-6">
                      <p>Code postal : {{this.userInfo.data.zipcode}} ({{this.userInfo.data.city}})</p>
                    </div>
                    <div class="col-md-6">
                      <p>Email : {{this.userInfo.data.email}}</p>
                    </div>
                  </div>
                </div>

                <div class="userInfo2" v-show="!userInfo.isShown">
                  <div class="row">
                    <div class="col-md-6">
                      <p>Surface du foyer : {{this.userInfo.data.surface}} m²</p>
                    </div>
                    <div class="col-md-6">
                      <p>Nombre de panneaux : {{this.userInfo.data.nb_panels}}</p>
                    </div>
                    <div class="col-md-6">
                      <p>Nombre de personnes : {{this.userInfo.data.nb_people}}</p>
                    </div>
                    <div class="col-md-6">
                      <p>Total d'interventions : {{this.userInfo.data.total_interventions}}</p>
                    </div>
                    <div class="col-md-6">
                      <p>Consommation journalière type : {{this.userInfo.data.daily_consumption}} kWh</p>
                    </div>
                    <div class="col-md-6">
                      <p>Type de foyer : {{this.userInfo.data.household_type}}</p>
                    </div>
                  </div>
                </div>
              </card>
            </div>
          </div>

          <div class="row">
            <div class="col-md-6">
              <card>
                <template slot="header">
                  <div v-if="productionEvolution.isLoaded">
                    <h4
                      class="card-title"
                    >Production : {{this.productionEvolution.data.production}} kWh</h4>
                    <p class="card-category" v-if="productionEvolution.options.value != 'total'">
                      En
                      <span v-if="this.productionEvolution.data.evolution > 0">augmentation</span>
                      <span v-else>baisse</span>
                      de {{ Math.abs(this.productionEvolution.data.evolution)}}% par rapport
                      <span
                        v-if="productionEvolution.options.value === 'today'"
                      >à hier</span>
                      <span
                        v-else-if="productionEvolution.options.value === 'week'"
                      >à la semaine dernière</span>
                      <span
                        v-else-if="productionEvolution.options.value === 'month'"
                      >au mois dernier</span>
                    </p>
                  </div>
                  <base-select
                    :id="productionEvolution.options.id"
                    @changed="reloadProductionEvolutionByUserId"
                  ></base-select>
                </template>
              </card>
            </div>

            <div class="col-md-6">
              <card>
                <template slot="header">
                  <div v-if="consumptionEvolution.isLoaded">
                    <h4
                      class="card-title"
                    >Consommation : {{this.consumptionEvolution.data.consumption}} kWh</h4>
                    <p class="card-category" v-if="consumptionEvolution.options.value != 'total'">
                      En
                      <span v-if="this.consumptionEvolution.data.evolution > 0">augmentation</span>
                      <span v-else>baisse</span>
                      de {{ Math.abs(this.consumptionEvolution.data.evolution)}}% par rapport
                      <span
                        v-if="consumptionEvolution.options.value === 'today'"
                      >à hier</span>
                      <span
                        v-else-if="consumptionEvolution.options.value === 'week'"
                      >à la semaine dernière</span>
                      <span
                        v-else-if="consumptionEvolution.options.value === 'month'"
                      >au mois dernier</span>
                    </p>
                  </div>
                  <base-select
                    :id="consumptionEvolution.options.id"
                    @changed="reloadConsumptionEvolutionByUserId"
                  ></base-select>
                </template>
              </card>
            </div>
          </div>
        </div>

        <div class="col-md-6">
          <div class="row">
            <div class="col-md-12">
              <base-select
                :id="consumptionRatioByUserId.chartOptions.chart.id"
                @changed="reloadConsumptionRatioByUserId"
              ></base-select>
              <div v-if="consumptionRatioByUserId.isLoaded">
                <div id="chart">
                  <chart-card
                    :type="consumptionRatioByUserId.chartOptions.chart.type"
                    :height="consumptionRatioByUserId.chartOptions.chart.height"
                    :options="consumptionRatioByUserId.chartOptions"
                    :series="consumptionRatioByUserId.series"
                  ></chart-card>
                </div>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-md-12">
              <base-select
                :id="productionRatioByUserId.chartOptions.chart.id"
                @changed="reloadProductionRatioByUserId"
              ></base-select>
              <div v-if="productionRatioByUserId.isLoaded">
                <div id="chart">
                  <chart-card
                    :type="productionRatioByUserId.chartOptions.chart.type"
                    :height="productionRatioByUserId.chartOptions.chart.height"
                    :options="productionRatioByUserId.chartOptions"
                    :series="productionRatioByUserId.series"
                  ></chart-card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-md-12">
          <card>
            <template slot="header">
              <h4 class="card-title">Prévisions de maintenance</h4>
              <span>Total d'interventions effectuées : {{userInterventions.data.total}}</span>
            </template>
            <div class="row">
              <div class="col-md-6">
                <card v-for="item in userInterventions.data.items" :key="item.name">
                  <template slot="header">
                    <h4 class="card-title">{{item.name}}</h4>
                    <div>{{item.date}}</div>
                    <div v-if="item.status != 'Terminé'">{{item.status}}</div>
                  </template>
                  <p>Contact > Prise en charge > Compte rendu réparation anomalie</p>

                  <p v-if="item.status === 'Résolu'">Anomalie détectée : Résolue</p>
                  <p v-else-if="item.status != 'Terminé'">Anomalie détectée : {{item.nature}}</p>
                  <button v-if="item.status === 'Urgent' || item.status === 'À venir'">Contacter</button>
                </card>
              </div>
              <div class="col-md-6 text-center">
                <base-button
                  v-for="month in months"
                  :key="month.name"
                  :value="month.value"
                  :onClick="getInterventionsByMonth"
                  class="btn btn-primary btn-fill btn-interventions"
                  v-bind:class="month.class"
                >{{month.name}}</base-button>
                <img src="/img/faces/ilio.png" alt="ilio" class="img-interventions" />
              </div>
            </div>
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
        isShown: true,
        isLoaded: false
      },
      productionEvolution: {
        data: {},
        options: {
          id: "prod-evolution",
          value: ""
        },
        isLoaded: false
      },
      consumptionEvolution: {
        data: {},
        options: {
          id: "cons-evolution",
          value: ""
        },
        isLoaded: false
      },
      productionRatioByUserId: {
        series: [],
        chartOptions: {
          chart: {
            id: "prod-ratio-by-user-id",
            type: "bar",
            height: 130,
            stacked: true,
            stackType: "100%",
            toolbar: {
              show: false
            }
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
            enabled: false
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
          },
          colors: ['#69AF23', '#F17E7F']
        },
        isLoaded: false
      },
      consumptionRatioByUserId: {
        series: [],
        chartOptions: {
          chart: {
            id: "cons-ratio-by-user-id",
            type: "bar",
            height: 130,
            stacked: true,
            stackType: "100%",
            toolbar: {
              show: false
            }
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
            enabled: false
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
          },
          colors: ['#69AF23', '#F17E7F']
        },
        isLoaded: false
      },
      userInterventions: {
        data: {
          total: 0,
          items: []
        },
        isLoaded: false
      },
      months: [
        { name: "Janvier", value: 1, class: "btn-interventions-1" },
        { name: "Février", value: 2, class: "btn-interventions-2" },
        { name: "Mars", value: 3, class: "btn-interventions-3" },
        { name: "Avril", value: 4, class: "btn-interventions-4" },
        { name: "Mai", value: 5, class: "btn-interventions-5" },
        { name: "Juin", value: 6, class: "btn-interventions-6" },
        { name: "Juillet", value: 7, class: "btn-interventions-7" },
        { name: "Août", value: 8, class: "btn-interventions-8" },
        { name: "Septembre", value: 9, class: "btn-interventions-9" },
        { name: "Octobre", value: 10, class: "btn-interventions-10" },
        { name: "Novembre", value: 11, class: "btn-interventions-11" },
        { name: "Décembre", value: 12, class: "btn-interventions-12" }
      ]
    };
  },
  methods: {
    reloadProductionEvolutionByUserId(value) {
      this.getPanelsProductionEvolutionByUserId(
        value,
        this.$route.params.id,
        this.productionEvolution
      );
    },
    reloadConsumptionEvolutionByUserId(value) {
      this.getPanelsConsumptionEvolutionByUserId(
        value,
        this.$route.params.id,
        this.consumptionEvolution
      );
    },
    reloadProductionRatioByUserId(value) {
      this.getPanelsProductionRatioByUserId(
        value,
        this.$route.params.id,
        this.productionRatioByUserId
      );
    },
    reloadConsumptionRatioByUserId(value) {
      this.getPanelsConsumptionRatioByUserId(
        value,
        this.$route.params.id,
        this.consumptionRatioByUserId
      );
    },
    getUserById(user_id, card) {
      card.isLoaded = false;
      card.data = {};

      axios
        .get("http://localhost:3000/api/users/" + user_id)
        .then(response => {
          var result = response.data.data.result;

          card.isLoaded = true;

          result.forEach(element => {
            element.typology = this.capitalizeFirstLetter(element.typology);
            element.created_on = new Date(
              Date.parse(element.created_on)
            ).toLocaleDateString();

            card.data = element;
          });
        })
        .catch(error => {
          console.log(error);
        });
    },
    getPanelsProductionEvolutionByUserId(time_period, user_id, card) {
      card.data = {};
      card.isLoaded = false;

      axios
        .get(
          "http://localhost:3000/api/panels/production/evolution/" +
            time_period +
            "/" +
            user_id
        )
        .then(response => {
          var result = response.data.data.result;
          card.isLoaded = true;
          card.options.value = time_period;

          result.forEach(element => {
            card.data = element;
          });
        })
        .catch(error => {
          console.log(error);
        });
    },
    getPanelsConsumptionEvolutionByUserId(time_period, user_id, card) {
      card.data = {};
      card.isLoaded = false;

      axios
        .get(
          "http://localhost:3000/api/panels/consumption/evolution/" +
            time_period +
            "/" +
            user_id
        )
        .then(response => {
          var result = response.data.data.result;
          card.isLoaded = true;
          card.options.value = time_period;

          result.forEach(element => {
            card.data = element;
          });
        })
        .catch(error => {
          console.log(error);
        });
    },
    getPanelsProductionRatioByUserId(time_period, user_id, chart) {
      chart.isLoaded = false;
      chart.series = [];

      axios
        .get(
          "http://localhost:3000/api/panels/production/ratio/" +
            time_period +
            "/" +
            user_id
        )
        .then(response => {
          var result = response.data.data.result;
          chart.isLoaded = true;

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
    getPanelsConsumptionRatioByUserId(time_period, user_id, chart) {
      chart.isLoaded = false;
      chart.series = [];

      axios
        .get(
          "http://localhost:3000/api/panels/consumption/ratio/" +
            time_period +
            "/" +
            user_id
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
    getInterventionsByUserId(user_id, card, month) {
      card.isLoaded = false;
      card.data.total = 0;
      card.data.items = [];

      if (month) {
        var url =
          "http://localhost:3000/api/interventions/" + user_id + "/" + month;
      } else {
        var url = "http://localhost:3000/api/interventions/" + user_id;
      }

      axios
        .get(url)
        .then(response => {
          var result = response.data.data.result;
          var options = { year: "numeric", month: "long" };

          card.isLoaded = true;

          result.forEach(element => {
            if (element.date < "2019-12-01") {
              card.data.total += 1;
            }

            element.date = new Date(
              Date.parse(element.date)
            ).toLocaleDateString("fr-FR", options);

            element.name = this.capitalizeFirstLetter(element.name);
            element.type = this.capitalizeFirstLetter(element.nature);
            element.date = this.capitalizeFirstLetter(element.date);
            element.status = this.capitalizeFirstLetter(element.status);

            card.data.items.push(element);
          });
        })
        .catch(error => {
          console.log(error);
        });
    },
    getInterventionsByMonth(e) {
      var month = e.target.value;
      var user_id = this.$route.params.id;
      this.getInterventionsByUserId(user_id, this.userInterventions, month);
    },
    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
  },
  mounted() {
    const userId = this.$route.params.id;

    this.getUserById(userId, this.userInfo);
    this.getPanelsProductionEvolutionByUserId(
      "month",
      userId,
      this.productionEvolution
    );
    this.getPanelsConsumptionEvolutionByUserId(
      "month",
      userId,
      this.consumptionEvolution
    );
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
    this.getInterventionsByUserId(userId, this.userInterventions);
  }
};
</script>
<style scoped>
.btnUserInfo {
  position: absolute;
  top: 20px;
  right: 20px;
  background: url(/img/icons/arrow-right.png) no-repeat;
  border: none;
  height: 100%;
}
.btnUserInfo:focus {
  outline: 0;
}
.btn-interventions, .btn-interventions:hover, .btn-interventions:active:hover {
  background: linear-gradient(
    180deg,
    #e3edf7 0%,
    rgba(227, 237, 247, 0.5) 100%
  );
  border-radius: 50px;
  font-style: normal;
  font-weight: 300;
  font-size: 16px;
  line-height: 19px;
  letter-spacing: 0.01em;
  color: #0b74c0;
  height: 80px;
  border: none;
}
.btn-interventions:hover,
.btn-interventions:focus {
  border: 2px solid #0b74c0;
}
.btn-interventions:focus {
  font-style: normal;
  font-weight: bold;
  line-height: 19px;
  letter-spacing: 0.01em;
  color: #0b74c0;
  background: linear-gradient(179.97deg, #FFFFFF 0.05%, rgba(255, 255, 255, 0) 166.1%);
}
.btn-interventions-9,
.btn-interventions-10,
.btn-interventions-11,
.btn-interventions-12 {
  color: #ffffff;
}
.btn-interventions-9 {
  background: linear-gradient(90deg, #00aaff 0.23%, #0b74c0 100%);
}
.btn-interventions-10 {
  background: linear-gradient(90deg, #00aaff 0%, #23d2b5 99.77%);
}
.btn-interventions-11 {
  background: linear-gradient(90deg, #00aaff 0.11%, #23d2b5 99.89%);
}
.btn-interventions-12 {
  background: linear-gradient(90deg, #e74a50 7.35%, #f78a31 100%);
}
.btn-interventions-2,
.btn-interventions-5,
.btn-interventions-8,
.btn-interventions-11 {
  margin-left: 20px;
  margin-right: 20px;
}
.btn-interventions-1,
.btn-interventions-3,
.btn-interventions-8 {
  margin-top: 100px;
}
.btn-interventions-5,
.btn-interventions-10,
.btn-interventions-12 {
  margin-top: -100px;
}
.img-interventions {
  position: absolute;
  top: 260px;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  width: 140px;
  border-radius: 50%;
}
</style>