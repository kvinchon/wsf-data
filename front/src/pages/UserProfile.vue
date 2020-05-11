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
                  <p
                    class="card-category client-since"
                  >Client depuis le {{this.userInfo.data.created_on}}</p>
                  <button class="btnUserInfo" @click="userInfo.isShown = !userInfo.isShown"></button>
                </template>
                <div class="userInfo1" v-show="userInfo.isShown">
                  <div class="row">
                    <div class="col-md-6">
                      <p>
                        <strong>Nom :</strong>
                        {{this.userInfo.data.last_name}}
                      </p>
                    </div>
                    <div class="col-md-6">
                      <p>
                        <strong>Identifiant :</strong>
                        {{this.userInfo.data.id}}
                      </p>
                    </div>
                    <div class="col-md-6">
                      <p>
                        <strong>Prénom :</strong>
                        {{this.userInfo.data.first_name}}
                      </p>
                    </div>
                    <div class="col-md-6">
                      <p>
                        <strong>Typologie :</strong>
                        {{this.userInfo.data.typology}}
                      </p>
                    </div>
                    <div class="col-md-6">
                      <p>
                        <strong>Code postal :</strong>
                        {{this.userInfo.data.zipcode}} ({{this.userInfo.data.city}})
                      </p>
                    </div>
                    <div class="col-md-6">
                      <p>
                        <strong>Email :</strong>
                        {{this.userInfo.data.email}}
                      </p>
                    </div>
                  </div>
                </div>

                <div class="userInfo2" v-show="!userInfo.isShown">
                  <div class="row">
                    <div class="col-md-6">
                      <p>
                        <strong>Surface du foyer :</strong>
                        {{this.userInfo.data.surface}} m²
                      </p>
                    </div>
                    <div class="col-md-6">
                      <p>
                        <strong>Nombre de panneaux :</strong>
                        {{this.userInfo.data.nb_panels}}
                      </p>
                    </div>
                    <div class="col-md-6">
                      <p>
                        <strong>Nombre de personnes :</strong>
                        {{this.userInfo.data.nb_people}}
                      </p>
                    </div>
                    <div class="col-md-6">
                      <p>
                        <strong>Total d'interventions :</strong>
                        {{this.userInfo.data.total_interventions}}
                      </p>
                    </div>
                    <div class="col-md-6">
                      <p>
                        <strong>Consommation journalière type :</strong>
                        {{this.userInfo.data.daily_consumption}} kWh
                      </p>
                    </div>
                    <div class="col-md-6">
                      <p>
                        <strong>Type de foyer :</strong>
                        {{this.userInfo.data.household_type}}
                      </p>
                    </div>
                  </div>
                </div>
              </card>
            </div>
          </div>

          <div class="row">
            <div class="col-md-12">
              <card class="production-card">
                <template slot="header">
                  <div class="production-rectangle"></div>
                  <div class="production-header">
                    <div v-if="productionEvolution.isLoaded">
                      <h4
                        class="card-title"
                      >Production : {{this.productionEvolution.data.production}} kWh</h4>
                      <p
                        class="card-category production-category"
                        v-if="productionEvolution.options.value != 'total'"
                      >
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
                      class="filter-select"
                      :id="productionEvolution.options.id"
                      :options="select.options.choices"
                      :selected="select.options.selected.default"
                      @changed="reloadProductionEvolutionByUserId"
                    ></base-select>
                  </div>
                </template>
              </card>
            </div>

            <div class="col-md-12">
              <card class="consumption-card">
                <template slot="header">
                  <div class="consumption-rectangle"></div>
                  <div class="consumption-header">
                    <div v-if="consumptionEvolution.isLoaded">
                      <h4
                        class="card-title"
                      >Consommation : {{this.consumptionEvolution.data.consumption}} kWh</h4>
                      <p
                        class="card-category consumption-category"
                        v-if="consumptionEvolution.options.value != 'total'"
                      >
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
                      class="filter-select"
                      :id="consumptionEvolution.options.id"
                      :options="select.options.choices"
                      :selected="select.options.selected.default"
                      @changed="reloadConsumptionEvolutionByUserId"
                    ></base-select>
                  </div>
                </template>
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
                    :id="consumptionRatioByUserId.chartOptions.chart.id"
                    :options="select.options.choices"
                    :selected="select.options.selected.default"
                    @changed="reloadConsumptionRatioByUserId"
                  ></base-select>
                </template>
                <div v-if="consumptionRatioByUserId.isLoaded">
                  <div id="chart">
                    <chart-card
                      :type="consumptionRatioByUserId.chartOptions.chart.type"
                      :height="consumptionRatioByUserId.chartOptions.chart.height"
                      :options="consumptionRatioByUserId.chartOptions"
                      :series="consumptionRatioByUserId.series"
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
                    :id="productionRatioByUserId.chartOptions.chart.id"
                    :options="select.options.choices"
                    :selected="select.options.selected.default"
                    @changed="reloadProductionRatioByUserId"
                  ></base-select>
                </template>
                <div v-if="productionRatioByUserId.isLoaded">
                  <div id="chart">
                    <chart-card
                      :type="productionRatioByUserId.chartOptions.chart.type"
                      :height="productionRatioByUserId.chartOptions.chart.height"
                      :options="productionRatioByUserId.chartOptions"
                      :series="productionRatioByUserId.series"
                    ></chart-card>
                    <span class="production-self">Auto-consommation</span>
                    <span class="production-export">Exportation</span>
                  </div>
                </div>
              </card>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-md-12">
          <card class="interventions-card">
            <template slot="header">
              <h4 class="card-title">Prévisions de maintenance</h4>
              <p
                class="card-category total-interventions"
              >Total d'interventions effectuées : {{userInterventions.data.total}}</p>
              <base-select
                class="filter-select"
                :id="userInterventions.options.id"
                :options="select.options.choices"
                :selected="select.options.selected.total"
                @changed="reloadInterventions"
              ></base-select>
            </template>
            <div class="row">
              <div class="col-md-6">
                <card v-for="item in userInterventions.data.items" :key="item.name">
                  <template slot="header">
                    <span v-if="item.status === 'Urgent'" class="inter-critical">{{item.status}}</span>
                    <span v-else-if="item.status === 'À venir'" class="inter-coming">{{item.status}}</span>
                    <span v-else-if="item.status === 'Résolu'" class="inter-done">{{item.status}}</span>
                    <span
                      v-if="typeof(item.date) === 'number'"
                      class="inter-date"
                    >Il y a {{item.date}} jours</span>
                    <span v-else class="inter-date">{{item.date}}</span>
                    <span v-if="item.status === 'Urgent'" class="date-critical"></span>
                    <span v-else-if="item.status === 'À venir'" class="date-coming"></span>
                    <h4 class="card-title">{{item.name}}</h4>
                  </template>
                  <p>Contacter > Rendez-vous > Prise en charge > Compte rendu</p>

                  <p class="inter-anomaly" v-if="item.status === 'Résolu'">
                    <span class="inter-detected">Anomalie détectée :</span>
                    <span :class="'inter-solved'">résolue</span>
                  </p>
                  <p class="inter-anomaly" v-else-if="item.status != 'Terminé'">
                    <span class="inter-detected">Anomalie détectée :</span>
                    <span :class="'inter-'+item.nature">{{item.nature}}</span>
                  </p>
                  <button
                    class="btn btn-primary btn-sm inter-btn"
                    v-if="item.status === 'Urgent' || item.status === 'À venir'"
                  >Contacter</button>
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
      consumptionRatioByUserId: {
        series: [],
        chartOptions: {
          chart: {
            id: "cons-ratio-by-user-id",
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
      userInterventions: {
        data: {
          total: 0,
          items: []
        },
        options: {
          id: "user-interventions"
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
    reloadInterventions(value) {
      this.getInterventionsByUserId(
        value,
        this.$route.params.id,
        this.userInterventions
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
    getInterventionsByUserId(time_period, user_id, card) {
      card.isLoaded = false;
      card.data.total = 0;
      card.data.items = [];

      axios
        .get(
          "http://localhost:3000/api/interventions/" +
            time_period +
            "/" +
            user_id
        )
        .then(response => {
          var result = response.data.data.result;
          var options = { year: "numeric", month: "long" };

          card.isLoaded = true;

          result.forEach(element => {
            if (element.date < "2019-12-01" || element.date >= "2020-01-01") {
              if (element.date < "2019-12-01") {
                card.data.total += 1;
              }
              element.date = new Date(
                Date.parse(element.date)
              ).toLocaleDateString("fr-FR", options);
              element.date = this.capitalizeFirstLetter(element.date);
            } else {
              var startDate = new Date(Date.parse(element.date));
              var endDate = new Date("2019-12-31");
              element.date = this.getDays(startDate, endDate);
            }

            element.name = this.capitalizeFirstLetter(element.name);
            element.type = this.capitalizeFirstLetter(element.nature);
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
      this.getInterventionsByUserId(month, user_id, this.userInterventions);
    },
    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    getDays(first, second) {
      // Take the difference between the dates and divide by milliseconds per day.
      // Round to nearest whole number to deal with DST.
      return Math.round((second - first) / (1000 * 60 * 60 * 24));
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
    this.getInterventionsByUserId("total", userId, this.userInterventions);
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
.client-since {
  font-style: italic;
  font-weight: normal;
  font-size: 14px;
  line-height: 16px;
  letter-spacing: 0.01em;
  color: #90a0b7;
}
.userInfo1 p,
.userInfo2 p {
  font-style: normal;
  font-size: 14px;
  line-height: 18px;
  letter-spacing: 0.01em;
}
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
.production-rectangle,
.consumption-rectangle {
  position: absolute;
  top: 0;
  left: 0;
  width: 20px;
  height: 100%;
  box-shadow: 0px 0px 16px rgba(0, 0, 0, 0.14);
  border-radius: 4px 0 0 4px;
}
.production-rectangle {
  background: #69af23;
}
.consumption-rectangle {
  background: #f17e7f;
}
.production-header,
.consumption-header {
  padding-left: 20px;
}
.production-category,
.consumption-category {
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 30px;
  color: #000000;
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
.btn-interventions,
.btn-interventions:hover,
.btn-interventions:active:hover {
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
  background: linear-gradient(
    179.97deg,
    #ffffff 0.05%,
    rgba(255, 255, 255, 0) 166.1%
  );
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
.total-interventions {
  position: absolute;
  top: 20px;
  left: 0;
  right: 0;
  text-align: center;
}
.inter-panne,
.inter-maintenance,
.inter-solved {
  display: inline-block;
  width: 120px;
  font-style: normal;
  font-weight: 500;
  font-size: 11px;
  line-height: 20px;
  text-align: center;
  letter-spacing: 0.02em;
  color: #ffffff;
  border-radius: 8px;
  margin-left: 10px;
}
.inter-panne {
  background: #e62b87;
}
.inter-maintenance {
  background: #910f7d;
}
.inter-solved {
  background: #bdbdbd;
}
.inter-detected {
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  color: #8b9eb0;
}
.inter-anomaly {
  position: absolute;
  top: 20px;
  right: 15px;
}
.inter-critical,
.inter-coming,
.inter-done {
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 21px;
  letter-spacing: 0.02em;
  font-weight: bold;
  margin-right: 20px;
}
.inter-critical {
  color: #e74a50;
}
.inter-coming {
  color: #becd00;
}
.inter-done {
  color: #c4c4c4;
}
.inter-date {
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  color: #90a0b7;
}
.date-critical,
.date-coming {
  display: inline-block;
  width: 10px;
  height: 10px;
  border: 1px solid #ffffff;
  border-radius: 50%;
  margin-left: 10px;
}
.date-critical {
  background: #e74a50;
}
.date-coming {
  background: #6ed2b1;
}
.inter-btn {
  position: absolute;
  right: 15px;
  bottom: 20px;
}
.interventions-card {
  background: url("/img/icons/inter-background.png") no-repeat;
  background-color: #FFFFFF;
  background-position-y: 60px;
}
</style>
<style>
.production-card .card-header,
.consumption-card .card-header {
  margin-bottom: 5px;
}
</style>