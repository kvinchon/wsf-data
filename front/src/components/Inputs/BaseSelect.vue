<template>
  <div>
    <label v-bind:for="id+'-select'">Filtrer :</label>
    <select name="filter" v-bind:id="id+'-select'" @change="onChange($event)" v-model="selected">
      <option
        v-for="option in options"
        v-bind:value="option.value"
        v-bind:key="option.key"
      >{{ option.text }}</option>
    </select>
  </div>
</template>

<script>
export default {
  name: "base-select",
  props: {
    id: String,
  },
  data() {
    return {
      selected: "month",
      options: [
        { text: "Aujourd'hui", key: 1, value: "today" },
        { text: "Semaine", key: 2, value: "week" },
        { text: "Mois", key: 3, value: "month" },
        { text: "Total", key: 4, value: "total" }
      ]
    };
  },
  methods: {
    onChange(event) {
      this.$emit('changed', event.target.value);
    }
  }
};
</script>