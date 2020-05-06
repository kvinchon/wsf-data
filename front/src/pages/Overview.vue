<template>
  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-4">
          <div class="row">
            <div class="col-md-12">
              <card>
                <template slot="header">
                  <h4 class="card-title">Objectifs</h4>
                  <button class="btn btn-primary btn-sm btn-home">Ajouter</button>
                </template>
              </card>
            </div>
          </div>

          <div class="row">
            <div class="col-md-12">
              <card>
                <template slot="header">
                  <h4 class="card-title">Rendez-vous</h4>
                  <button class="btn btn-primary btn-sm btn-home">Ajouter</button>
                </template>
              </card>
            </div>
          </div>
        </div>

        <div class="col-md-4">
          <div class="row">
            <div class="col-md-12">
                <div v-if="typologyRatio.series">
                  <chart-card
                    :id="typologyRatio.options.chart.id"
                    :type="typologyRatio.type"
                    :height="typologyRatio.height"
                    :options="typologyRatio.options"
                    :series="typologyRatio.series"
                  >
                    <template slot="header">
                      <h4 class="card-title">Répartition des clients par typologie</h4>
                    </template>
                  </chart-card>
                </div>
              
            </div>
          </div>

          <div class="row">
            <div class="col-md-12">
                <div v-if="statusRatio.series">
                  <chart-card
                    :id="statusRatio.options.chart.id"
                    :type="statusRatio.type"
                    :height="statusRatio.height"
                    :options="statusRatio.options"
                    :series="statusRatio.series"
                  >
                    <template slot="header">
                      <h4 class="card-title">Répartition des utilisateurs par statut</h4>
                    </template>
                  </chart-card>
                </div>
            </div>
          </div>
        </div>

        <div class="col-md-4">
          <div class="row">
            <div class="col-md-12">
              <card>
                <template slot="header">
                  <h4 class="card-title">Notifications</h4>
                </template>
              </card>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ChartCard from "src/components/Cards/ChartCard.vue";

const axios = require("axios");

export default {
  components: {
    ChartCard
  },
  data() {
    return {
      typologyRatio: {
        type: "donut",
        height: 300,
        options: {
          chart: {
            id: "typology-ratio"
          },
          labels: []
        },
        series: []
      },
      statusRatio: {
        type: "donut",
        height: 300,
        options: {
          chart: {
            id: "status-ratio"
          },
          labels: []
        },
        series: []
      }
    };
  },
  methods: {
    getUsersRatioByFilter(filter, chart) {
      axios
        .get("http://localhost:3000/api/users/ratio/" + filter)
        .then(response => {
          var result = response.data.data.result;

          result.forEach(element => {
            chart.options.labels.push(element.label);
            chart.series.push(element.ratio);
          });
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  mounted() {
    this.getUsersRatioByFilter("typology", this.typologyRatio);
    this.getUsersRatioByFilter("status", this.statusRatio);
  }
};
</script>
<style scoped>
.btn-home {
  position: absolute;
  top: 20px;
  right: 20px;
}
</style>
