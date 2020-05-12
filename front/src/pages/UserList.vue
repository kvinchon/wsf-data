<template>
  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <!-- Users card -->
          <card class="table-striped-with-hover" body-classes="table-full-width table-responsive">
            <template slot="header">
              <h4 class="card-title">Liste des utilisateurs</h4>
            </template>
            <!-- A new row is added for each user -->
            <l-table
              class="table-hover table-striped table-users"
              :columns="users.columns"
              :data="users.data"
              :clickable="true"
            ></l-table>
          </card>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import LTable from "src/components/Table.vue";

const axios = require("axios");

export default {
  components: {
    LTable
  },
  data() {
    return {
      users: {
        columns: [],
        data: [],
        isLoaded: false
      }
    };
  },
  methods: {
    /**
     * Retrieves users.
     *
     * @param {Object} table The users table.
     */
    getUsers(table) {
      // If the table has already been filled in, it is reset to show the new data
      table.isLoaded = false;
      table.data = [];

      axios
        .get("http://localhost:3000/api/users")
        .then(response => {
          var result = response.data.data.result;
          var columns = Object.keys(result[0]);

          table.isLoaded = true;

          // Retrieves the keys to display them in the table
          columns.forEach(column => {
            table.columns.push(column);
          });

          // For each response element, we process the data to display it as we want and add it to our table
          result.forEach(element => {
            if (element.intervention) {
              element.intervention = this.capitalizeFirstLetter(
                element.intervention
              );
            }
            element.typology = this.capitalizeFirstLetter(element.typology);
            element.status = this.capitalizeFirstLetter(element.status);
            element.created_on = new Date(
              Date.parse(element.created_on)
            ).toLocaleString();

            table.data.push(element);
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
    }
  },
  mounted() {
    this.getUsers(this.users);
  }
};
</script>
<style>
.table-users:hover {
  cursor: pointer;
}
</style>
