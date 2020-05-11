<template>
  <div>
    <label v-bind:for="id+'-select'">Afficher :</label>
    <select name="filter" v-bind:id="id+'-select'" @change="onChange($event)" v-model="select">
      <option
        v-for="choice in choices"
        v-bind:value="choice.value"
        v-bind:key="choice.key"
      >{{ choice.text }}</option>
    </select>
  </div>
</template>

<script>
export default {
  name: "base-select",
  props: {
    id: String,
    options: Array,
    selected: String
  },
  data() {
    return {
      choices: this.options,
      select: this.selected
    };
  },
  methods: {
    onChange(event) {
      this.$emit('changed', event.target.value);
    }
  }
};
</script>