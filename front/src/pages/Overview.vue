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

      <div class="row">
        <div class="col-md-4">
          <div v-if="typologyRatio.isLoaded">
            <!-- If user.name exists, display user.name -->
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
        <div class="col-md-4">
          <div v-if="statusRatio.isLoaded">
            <!-- If user.name exists, display user.name -->
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
      typologyRatio: {
        type: "donut",
        height: 300,
        options: {
          chart: {
            id: "typology-ratio"
          },
          labels: []
        },
        series: [],
        isLoaded: false
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
        series: [],
        isLoaded: false
      }
    };
  },
  methods: {
    getUsersRatioByFilter(filter, chart) {
      chart.series = [];
      chart.options.labels = [];
      chart.isLoaded = false;

      axios
        .get("http://localhost:3000/api/users/ratio/" + filter)
        .then(response => {
          let result = response.data.data.result;

          chart.isLoaded = true;

          result.forEach(element => {
            chart.options.labels.push(element.label);
            chart.series.push(parseInt(element.ratio));
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
<style>
</style>
