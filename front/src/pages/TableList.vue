<template>
  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <card class="table-striped-with-hover" body-classes="table-full-width table-responsive">
            <template slot="header">
              <h4 class="card-title">Striped Table with Hover</h4>
              <p class="card-category">Here is a subtitle for this table</p>
            </template>
            <l-table
              class="table-hover table-striped"
              :columns="users.columns"
              :data="users.data"
            ></l-table>
          </card>
        </div>

        <!--<div class="col-12">
          <card class="card-plain">
            <template slot="header">
              <h4 class="card-title">Table on Plain Background</h4>
              <p class="card-category">Here is a subtitle for this table</p>
            </template>
            <div class="table-responsive">
              <l-table class="table-hover"
                       :columns="table2.columns"
                       :data="table2.data">
              </l-table>
            </div>
          </card>
        </div>

        <div class="col-12">
          <card class="strpied-tabled-with-hover"
                body-classes="table-full-width table-responsive"
          >
            <template slot="header">
              <h4 class="card-title">Small table</h4>
              <p class="card-category">Here is a subtitle for this table</p>
            </template>
            <l-table class="table-hover table-striped table-sm"
                     :columns="users.columns"
                     :data="users.data">
            </l-table>
          </card>

        </div>-->
      </div>
    </div>
  </div>
</template>
<script>
import LTable from "src/components/Table.vue";
import Card from "src/components/Cards/Card.vue";

const axios = require("axios");
const tableColumns = [
  "Nom",
  "Email",
  "Typologie",
  "Statut",
  "Identifiant",
  "Date de création"
];
const tableData = [
  {
    nom: "Dakota Rice",
    email: "test",
    typologie: "test",
    statut: "test",
    identifiant: 1,
    "date de création": "Hier"
  }
];
export default {
  components: {
    LTable,
    Card
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
    getUsers(table) {
      table.isLoaded = false;
      table.data = [];

      axios
        .get("http://localhost:3000/api/users")
        .then(response => {
          let result = response.data.data.result;
          let columns = Object.keys(result[0]);

          table.isLoaded = true;

          columns.forEach(column => {
            table.columns.push(column);
          });

          result.forEach(element => {
            if (element.typology === null) {
              element.typology = "inconnue";
            }

            element.created_on = new Date(
              Date.parse(element.created_on)
            ).toLocaleString();

            table.data.push(element);
          });
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  mounted() {
    this.getUsers(this.users);
  }
};
</script>
<style>
</style>
