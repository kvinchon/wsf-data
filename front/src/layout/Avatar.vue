<template>
  <div class="avatar">
    <div class="avatar-image" v-if="$slots.image">
      <slot name="image"></slot>
    </div>
    <div class="avatar-header" v-if="$slots.header">
      <slot name="header">
        <div class="avatar-name">{{name}}</div>
        <div class="avatar-email">{{email}}</div>
      </slot>
    </div>
  </div>
</template>
<script>
export default {
  name: "avatar",
  props: {
    name: {
      type: String,
      description: "Avatar name"
    },
    email: {
      type: String,
      description: "Avatar email"
    }
  }
};
</script>
<style>
</style>
