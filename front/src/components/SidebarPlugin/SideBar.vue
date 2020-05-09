<template>
  <div
    class="sidebar"
    :style="sidebarStyle"
    :data-color="backgroundColor"
  >
    <div class="sidebar-wrapper">
      <slot name="content"></slot>
      <ul class="nav nav-main__links">
        <!--By default vue-router adds an active class to each route link. This way the links are colored when clicked-->
        <slot>
          <sidebar-link
            v-for="(link,index) in sidebarLinks"
            :key="link.name + index"
            :to="link.path"
            @click="closeNavbar"
            :link="link"
          >
            <i :class="link.icon"></i>
            <p>{{link.name}}</p>
          </sidebar-link>
        </slot>
      </ul>
      <ul class="nav nav-bottom" v-if="$slots['bottom-links']">
        <slot name="bottom-links"></slot>
      </ul>
    </div>
  </div>
</template>
<script>
import SidebarLink from "./SidebarLink.vue";

export default {
  components: {
    SidebarLink
  },
  props: {
    title: {
      type: String,
      default: "MyPower"
    },
    backgroundColor: {
      type: String,
      default: "",
      validator: value => {
        let acceptedValues = [
          "",
          "blue",
          "azure",
          "green",
          "orange",
          "red",
          "purple",
          "black",
          "white"
        ];
        return acceptedValues.indexOf(value) !== -1;
      }
    },
    activeColor: {
      type: String,
      default: "success",
      validator: value => {
        let acceptedValues = [
          "primary",
          "info",
          "success",
          "warning",
          "danger"
        ];
        return acceptedValues.indexOf(value) !== -1;
      }
    },
    sidebarLinks: {
      type: Array,
      default: () => []
    },
    autoClose: {
      type: Boolean,
      default: true
    }
  },
  provide() {
    return {
      autoClose: this.autoClose
    };
  },
  computed: {
    sidebarStyle() {
      return {
        backgroundImage: `url(${this.backgroundImage})`
      };
    }
  }
};
</script>
<style>
.sidebar .sidebar-wrapper {
  display: flex;
  flex-direction: column;
}
.sidebar .nav-main__links {
  flex: 1;
}
.sidebar .sidebar-wrapper .logo .logo__container {
  padding-left: 10px;
}
.sidebar-wrapper {
  background: linear-gradient(
    180deg,
    #6ed2b1 0%,
    rgba(0, 170, 255, 0.51) 118.2%
  );
  box-shadow: 6px 0px 18px rgba(0, 0, 0, 0.06);
  border-radius: 0px 53px 0px 0px;
}
</style>
