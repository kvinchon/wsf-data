<template>
  <div class="wrapper">
    <side-bar>
      <mobile-menu slot="content"></mobile-menu>
      <avatar>
        <template slot="image">
          <img src="/img/faces/avatar.png" alt="avatar" />
        </template>

        <template slot="header">
          <div class="avatar-name">{{avatar.data.firstName}} {{avatar.data.lastName}}</div>
          <div class="avatar-email">{{avatar.data.email}}</div>
        </template>
      </avatar>
      <sidebar-link to="/admin/home">
        <i class="nc-icon nc-chart-pie-35"></i>
        <p>Accueil</p>
      </sidebar-link>
      <sidebar-link to="/admin/user">
        <i class="nc-icon nc-circle-09"></i>
        <p>Liste</p>
      </sidebar-link>
      <sidebar-link to="/admin/stats">
        <i class="nc-icon nc-notes"></i>
        <p>Statistiques</p>
      </sidebar-link>
      <!--<sidebar-link to="/admin/chat">
        <i class="nc-icon nc-paper-2"></i>
        <p>Chat</p>
      </sidebar-link>-->
      <div class="navbar-welcome">
        <p class="welcome-hello">Bonjour {{avatar.data.firstName}} !</p>
        <p class="welcome-rdv">
          Nous sommes le
          <span class="welcome-rdv-date">{{appointments.data.date}}</span> et tu as
          <span
            class="welcome-rdv-appoint"
            v-if="appointments.data.nbAppoint === 0"
          >aucun RDV</span>
          <span class="welcome-rdv-appoint" v-else>{{appointments.data.nbAppoint}} RDV</span>
          aujourd'hui !
        </p>
        <p class="welcome-notif">
          <span v-if="notifications.data.total === 0">
            Tu as
            <span class="welcome-notif-total">aucune notification.</span>
          </span>
          <span v-else-if="notifications.data.total === 1">
            Tu as
            <span class="welcome-notif-total">une notification.</span>
            <span v-if="notifications.data.critical === 1">
              Attention,
              <span class="welcome-notif-crit">une notification urgente</span> est apparue !
            </span>
          </span>
          <span v-if="notifications.data.total > 1">
            Tu as
            <span class="welcome-notif-total">{{notifications.data.total}} notifications.</span>
            <span v-if="notifications.data.critical === 1">
              Attention,
              <span class="welcome-notif-crit">une notification urgente</span> est apparue !
            </span>
            <span v-else-if="notifications.data.critical > 1">
              Attention,
              <span
                class="welcome-notif-crit"
              >{{notifications.data.critical}} notifications urgentes</span> sont apparues !
            </span>
          </span>
        </p>
        <img src="/img/faces/ilio.png" alt="ilio" />
      </div>
      <div class="navbar-settings">
        <img src="/img/icons/settings.png" alt="settings" />
        <a href="#" class="settings-link">Settings</a>
      </div>
      <div class="navbar-footer">MyPower</div>
    </side-bar>
    <div class="main-panel">
      <top-navbar></top-navbar>
      <dashboard-content @click="toggleSidebar"></dashboard-content>
    </div>
  </div>
</template>
<style lang="scss">
</style>
<script>
import TopNavbar from "./TopNavbar.vue";
import DashboardContent from "./Content.vue";
import MobileMenu from "./MobileMenu.vue";
import Avatar from "./Avatar.vue";

const axios = require("axios");

export default {
  components: {
    TopNavbar,
    DashboardContent,
    MobileMenu,
    Avatar
  },
  data() {
    return {
      avatar: {
        data: {
          firstName: "Julie",
          lastName: "Bertand",
          email: "j.bertand@engie.com"
        }
      },
      appointments: {
        data: {
          date: "",
          nbAppoint: 0
        }
      },
      notifications: {
        data: {
          total: 0,
          critical: 0
        }
      }
    };
  },
  methods: {
    getAdvisorAppointments(advisor_id, card) {
      card.data.nbAppoint = 0;

      axios
        .get("http://localhost:3000/api/appointments/" + advisor_id + "/today")
        .then(response => {
          var count = response.data.meta.count;
          card.data.nbAppoint = count;
          card.data.date = "mardi 31 décembre 2019";
        })
        .catch(error => {
          console.log(error);
        });
    },
    getNotifications(advisor_id, time_period, card) {
      axios
        .get(
          "http://localhost:3000/api/notifications/" +
            advisor_id +
            "/" +
            time_period
        )
        .then(response => {
          var total = response.data.meta.totalCount;
          var critical = response.data.meta.criticalCount;
          card.data.total = total;
          card.data.critical = critical;
        })
        .catch(error => {
          console.log(error);
        });
    },
    toggleSidebar() {
      if (this.$sidebar.showSidebar) {
        this.$sidebar.displaySidebar(false);
      }
    }
  },
  mounted() {
    const advisorId = 1;
    this.getAdvisorAppointments(advisorId, this.appointments);
    this.getNotifications(advisorId, "total", this.notifications);
  }
};
</script>
<style scoped>
.avatar {
  text-align: center;
  margin-bottom: 50px;
}
.avatar-image img {
  width: 100px;
  border-radius: 50%;
  margin-bottom: 20px;
}
.avatar-name {
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  color: #1f106d;
}
.avatar-email {
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  color: #e3edf7;
}
.navbar-welcome {
  display: inline-block;
  width: 260px;
  height: 350px;
  position: absolute;
  background: url("/img/icons/intersect.png") no-repeat;
  color: #000000;
  margin-top: 20px;
}
.navbar-welcome img {
  width: 70px;
  height: auto;
  border-radius: 50%;
  position: relative;
  bottom: 0;
  left: 25px;
}
.welcome-hello {
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 21px;
  text-align: center;
  letter-spacing: 0.01em;
  color: #323c47;
  margin-top: 60px;
}
.welcome-rdv,
.welcome-notif {
  font-style: normal;
  font-weight: normal;
  font-size: 13px;
  line-height: 18px;
  text-align: center;
  letter-spacing: 0.01em;
  margin-left: 25px;
  margin-right: 25px;
  color: #707683;
}
.welcome-rdv-date,
.welcome-rdv-appoint,
.welcome-notif-total,
.welcome-notif-crit {
  font-weight: bold;
}
.welcome-notif-crit {
  color: red;
}
.navbar-settings {
  display: inline-block;
  width: 100%;
  text-align: center;
  position: absolute;
  bottom: 80px;
}
.navbar-settings img {
  width: 13px;
  height: auto;
  margin-right: 20px;
}
.settings-link {
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 19px;
  letter-spacing: 0.01em;
  color: #e3edf7;
}
.navbar-footer {
  display: inline-block;
  width: 100%;
  position: absolute;
  bottom: 20px;
  text-align: center;
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  line-height: 25px;
  color: #ffffff;
}
</style>