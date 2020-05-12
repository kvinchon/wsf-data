<template>
  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-4">
          <div class="row">
            <div class="col-md-12">
              <!-- Objectives card -->
              <card>
                <template slot="header">
                  <h4 class="card-title">Objectifs</h4>
                  <button class="btn btn-primary btn-sm btn-home">Ajouter</button>
                </template>
                <div class="row">
                  <div class="col-md-12">
                    <!-- A new card is added for each objective -->
                    <card v-for="item in objectives.data.items" :key="item.title">
                      <template slot="header">
                        <h4 class="card-title">{{item.title}}</h4>
                        <p class="card-category">{{item.category}}</p>
                      </template>
                      <span class="completed-obj">{{item.completed}}</span>
                      <div class="div-obj">
                        <div
                          class="deadline-obj"
                          v-if="item.deadline"
                        >Date limite : {{item.deadline}}</div>
                        <div class="remaining-obj">
                          {{item.remaining}}
                          <br />restants
                        </div>
                      </div>
                    </card>
                  </div>
                </div>
              </card>
            </div>
          </div>

          <div class="row">
            <div class="col-md-12">
              <!-- Appointments card -->
              <card>
                <template slot="header">
                  <h4 class="card-title">Rendez-vous</h4>
                  <button class="btn btn-primary btn-sm btn-home">Ajouter</button>
                </template>
                <calendar
                  class="calendar"
                  is-expanded
                  :min-date="new Date('2019-01-01')"
                  :max-date="new Date('2020-01-31')"
                  :attributes="appointments.attributes"
                />
                <div class="row">
                  <div class="col-md-12">
                    <!-- A new card is added for each appointment -->
                    <card v-for="item in appointments.data.items" :key="item.household">
                      <template slot="header">
                        <h4 class="card-title">Foyer {{item.household}}</h4>
                        <p class="card-category">{{item.method}}</p>
                        <span class="date-appoint">{{item.date}}</span>
                      </template>
                      <div class="subject-appoint">{{item.subject}}</div>
                    </card>
                  </div>
                </div>
              </card>
            </div>
          </div>
        </div>

        <div class="col-md-4">
          <div class="row">
            <div class="col-md-12">
              <!-- Typology distribution card -->
              <card>
                <template slot="header">
                  <h4 class="card-title">Répartition des clients par typologie</h4>
                </template>
                <div v-if="typologyRatio.series">
                  <!-- Typology distribution chart -->
                  <chart-card
                    :id="typologyRatio.options.chart.id"
                    :type="typologyRatio.type"
                    :height="typologyRatio.height"
                    :options="typologyRatio.options"
                    :series="typologyRatio.series"
                  ></chart-card>
                </div>
              </card>
            </div>
          </div>

          <div class="row">
            <div class="col-md-12">
              <!-- Status distribution card -->
              <card>
                <template slot="header">
                  <h4 class="card-title">Répartition des utilisateurs par statut</h4>
                </template>
                <div v-if="statusRatio.series">
                  <!-- Status distribution chart -->
                  <chart-card
                    :id="statusRatio.options.chart.id"
                    :type="statusRatio.type"
                    :height="statusRatio.height"
                    :options="statusRatio.options"
                    :series="statusRatio.series"
                  ></chart-card>
                </div>
              </card>
            </div>
          </div>
        </div>

        <div class="col-md-4">
          <div class="row">
            <div class="col-md-12">
              <!-- Notifications card -->
              <card class="card-notif">
                <template slot="header">
                  <h4 class="card-title">Notifications</h4>
                  <base-select
                    :id="notifications.options.id"
                    :options="select.options.choices"
                    :selected="select.options.selected.default"
                    @changed="reloadNotifications"
                    class="filter-select"
                  ></base-select>
                </template>
                <div class="row">
                  <div class="col-md-12">
                    <!-- A new card is added for each notification -->
                    <card v-for="item in notifications.data.items" :key="item.title">
                      <template slot="header">
                        <h4 class="card-title">Foyer de {{item.first_name}} {{item.last_name}}</h4>
                        <p class="card-category">{{item.category}}</p>
                        <span class="date-notif">Il y a {{item.date}} jours</span>
                        <span class="status-notif" v-if="item.status === 'Urgent'">{{item.status}}</span>
                      </template>
                      <div>
                        <span class="care-notif">{{item.care}}</span>
                        <span class="btn-span-notif">
                          <button
                            class="btn btn-primary btn-sm btn-notif"
                            @click="getLocation(item)"
                          >Voir le foyer</button>
                          <button
                            class="btn btn-primary btn-sm btn-notif"
                            @click="getContact()"
                          >Contacter</button>
                        </span>
                      </div>
                    </card>
                  </div>
                </div>
                <div
                  class="div-notif-plus"
                  v-if="notifications.data.count > 5 && notifications.data.full === false"
                >
                  <button class="btn-notif-plus" @click="getAllNotifications">En voir plus</button>
                </div>
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
import Calendar from "v-calendar/lib/components/calendar.umd";

const axios = require("axios");

export default {
  components: {
    ChartCard,
    Calendar
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
      objectives: {
        data: {
          items: []
        },
        isLoaded: false
      },
      appointments: {
        attributes: [],
        data: {
          items: []
        },
        isLoaded: false
      },
      typologyRatio: {
        type: "donut",
        height: 300,
        options: {
          chart: {
            id: "typology-ratio"
          },
          labels: [],
          colors: ["#005288", "#F78A31", "#69AF23", "#885AF8"]
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
          labels: [],
          colors: ["#2B485C", "#FBDB3C", "#910F7D"]
        },
        series: []
      },
      notifications: {
        data: {
          items: [],
          time_period: "",
          full: false,
          count: 0
        },
        options: {
          id: "notifications"
        },
        isLoaded: false
      }
    };
  },
  methods: {
    /**
     * Allows you to reload notifications when the value changes on the select.
     *
     * @param {String} value The value of the select.
     */
    reloadNotifications(value) {
      this.getNotifications(1, value, this.notifications);
    },
    /**
     *  Displays all notifications when you click on "see more".
     */
    getAllNotifications() {
      var time_period = this.notifications.data.time_period;
      this.getNotifications(1, time_period, this.notifications, 10, 5);
    },
    /**
     * Retrieves advisor's objectives.
     *
     * @param {Number} advisor_id The advisor ID.
     * @param {Object} card The objectives card.
     */
    getAdvisorObjectives(advisor_id, card) {
      // If the card has already been filled in, it is reset to show the new data
      card.isLoaded = false;
      card.data.items = [];

      axios
        .get("http://localhost:3000/api/objectives/" + advisor_id)
        .then(response => {
          var result = response.data.data.result;
          var options = { month: "long" };
          card.isLoaded = true;

          // For each response element, we process the data to display it as we want and add it to our card
          result.forEach(element => {
            if (element.deadline) {
              element.deadline = new Date(
                Date.parse(element.deadline)
              ).toLocaleDateString("fr-FR", options);
            }

            element.title = this.capitalizeFirstLetter(element.title);
            element.category = this.capitalizeFirstLetter(element.category);

            card.data.items.push(element);
          });
        })
        // Displays errors
        .catch(error => {
          console.log(error);
        });
    },
    /**
     * Retrieves advisor's appointments.
     *
     * @param {Number} advisor_id The advisor ID.
     * @param {Object} card The appointments card.
     */
    getAdvisorAppointments(advisor_id, card) {
      // If the card has already been filled in, it is reset to show the new data
      card.isLoaded = false;
      card.data.items = [];
      card.attributes = [];

      axios
        .get("http://localhost:3000/api/appointments/" + advisor_id)
        .then(response => {
          var result = response.data.data.result;
          var options = {
            month: "long",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit"
          };
          card.isLoaded = true;

          // For each response element, we process the data to display it as we want and add it to our card
          result.forEach(element => {
            card.attributes.push({
              key: element.household,
              highlight: true,
              dates: new Date(element.date)
            });

            if (element.date) {
              element.date = new Date(Date.parse(element.date)).toLocaleString(
                "fr-FR",
                options
              );
            }

            element.method = this.capitalizeFirstLetter(element.method);
            element.subject = this.capitalizeFirstLetter(element.subject);
            card.data.items.push(element);
          });
        })
        // Displays errors
        .catch(error => {
          console.log(error);
        });
    },
    /**
     * Retrieves distribution of users by typology or status.
     *
     * @param {String} filter The filter applied.
     * @param {Object} chart The chart to build.
     */
    getUsersRatioByFilter(filter, chart) {
      axios
        .get("http://localhost:3000/api/users/ratio/" + filter)
        .then(response => {
          var result = response.data.data.result;

          // For each response element, we add it to our chart
          result.forEach(element => {
            chart.options.labels.push(element.label);
            chart.series.push(element.ratio);
          });
        })
        // Displays errors
        .catch(error => {
          console.log(error);
        });
    },
    /**
     * Redirects to the user's profile.
     *
     * @param {Object} item The current notification.
     */
    getLocation(item) {
      this.$router.push({ name: "Liste / Foyer", params: { id: item.id } });
    },
    /**
     * Retrieves advisor's notifications.
     *
     * @param {Number} advisor_id The advisor ID.
     * @param {String} time_period The period of time taken into account.
     * @param {Object} card The notifications card.
     * @param {Number} limit The number of notifications to be retrieved. (optional)
     * @param {Number} offset The offset to be applied. (optional)
     */
    getNotifications(advisor_id, time_period, card, limit = 5, offset = 0) {
      // If the card has already been filled in, it is reset to show the new data
      card.isLoaded = false;
      card.data.time_period = time_period;

      if (offset === 0) {
        card.data.items = [];
        card.data.full = false;
      } else {
        card.data.full = true;
      }

      axios
        .get(
          "http://localhost:3000/api/notifications/" +
            advisor_id +
            "/" +
            time_period +
            "?limit=" +
            limit +
            "&offset=" +
            offset
        )
        .then(response => {
          var count = response.data.meta.totalCount;
          var result = response.data.data.result;
          var startDate, endDate;
          card.isLoaded = true;
          card.data.count = count;

          // For each response element, we process the data to display it as we want and add it to our card
          result.forEach(element => {
            startDate = new Date(Date.parse(element.date));
            endDate = new Date("2019-12-31");
            element.date = this.getDays(startDate, endDate);

            element.category = this.capitalizeFirstLetter(element.category);
            element.status = this.capitalizeFirstLetter(element.status);
            element.care = this.capitalizeFirstLetter(element.care);

            card.data.items.push(element);
          });
        })
        // Displays errors
        .catch(error => {
          console.log(error);
        });
    },
    /**
     * Returns the string with a capital letter at the beginning.
     *
     * @param {String} string The string to be modified.
     */
    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    /**
     * Returns the number of days between two dates.
     *
     * @param {String} first The first date.
     * @param {String} second The second date.
     */
    getDays(first, second) {
      // Take the difference between the dates and divide by milliseconds per day.
      // Round to nearest whole number to deal with DST.
      return Math.round((second - first) / (1000 * 60 * 60 * 24));
    }
  },
  mounted() {
    // TODO: modify according to the connected advisor
    const advisorId = 1;

    this.getAdvisorObjectives(advisorId, this.objectives);
    this.getAdvisorAppointments(advisorId, this.appointments);
    this.getUsersRatioByFilter("typology", this.typologyRatio);
    this.getUsersRatioByFilter("status", this.statusRatio);
    this.getNotifications(advisorId, "month", this.notifications);
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
.div-obj {
  display: inline-block;
  width: 120px;
  text-align: center;
  position: absolute;
  bottom: 15px;
  right: 50px;
}
.remaining-obj {
  font-style: italic;
  font-weight: 500;
  font-size: 13px;
  line-height: 19px;
  text-align: center;
  color: #323c47;
}
.deadline-obj {
  font-style: italic;
  font-weight: normal;
  font-size: 13px;
  color: #6a707e;
}
.completed-obj {
  position: absolute;
  top: 18px;
  right: 10px;
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  text-align: right;
  color: #90a0b7;
}
.calendar {
  margin-bottom: 30px;
}
.date-appoint {
  position: absolute;
  top: 18px;
  right: 10px;
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  line-height: 18px;
  text-align: right;
  letter-spacing: 0.01em;
  color: #90a0b7;
}
.subject-appoint {
  font-style: normal;
  font-weight: normal;
  font-size: 13px;
  line-height: 18px;
  letter-spacing: 0.01em;
  color: #707683;
}
.filter-select {
  position: absolute;
  right: 20px;
  top: 18px;
}
.btn-home {
  position: absolute;
  top: 20px;
  right: 20px;
}
.card-notif {
  background: linear-gradient(
    180deg,
    rgba(0, 170, 255, 0.5) -7.31%,
    rgba(35, 210, 181, 0.5) 105.85%
  );
  box-shadow: 6px 0px 18px rgba(0, 0, 0, 0.06);
  border-radius: 8px;
}
.date-notif {
  position: absolute;
  top: 18px;
  right: 10px;
}
.status-notif {
  position: absolute;
  top: 40px;
  right: 10px;
  font-style: normal;
  font-weight: bold;
  font-size: 11px;
  line-height: 16px;
  text-align: center;
  color: #e74a50;
}
.care-notif {
  display: inline-block;
  width: 120px;
  font-style: normal;
  font-weight: 500;
  font-size: 11px;
  line-height: 20px;
  text-align: center;
  letter-spacing: 0.02em;
  color: #ffffff;
  background: #42876a;
  border-radius: 8px;
}
.btn-span-notif {
  position: absolute;
  right: 10px;
  bottom: 10px;
}
.btn-notif {
  margin-left: 10px;
}
.div-notif-plus {
  display: inline-block;
  width: 100%;
  text-align: center;
}
.btn-notif-plus {
  background: none !important;
  border: none;
  padding: 0 !important;
  color: #069;
  text-decoration: none;
  cursor: pointer;
  text-align: center;
}
</style>
<style>
.card .card-header {
  background-color: transparent;
}
</style>
