<template>
  <div class="wrapper">
    <side-bar>
      <mobile-menu slot="content"></mobile-menu>
      <avatar>
        <template slot="image">
          <img src="/img/faces/avatar.png" alt="avatar" />
        </template>

        <template slot="header">
          <div class="avatar-name">Julie Bertand</div>
          <div class="avatar-email">j.bertand@engie.com</div>
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
export default {
  components: {
    TopNavbar,
    DashboardContent,
    MobileMenu,
    Avatar
  },
  methods: {
    toggleSidebar() {
      if (this.$sidebar.showSidebar) {
        this.$sidebar.displaySidebar(false);
      }
    }
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