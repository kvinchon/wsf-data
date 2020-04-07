<template>
    <button @click="onClick" class="button">
        <slot>Button</slot>
    </button>
</template>

<style>
    .button {
        width: 190px;
        margin-bottom: 30px;
    }
</style>

<script>
  export default{
    name: 'base-button',
    props: {
      onClick: {
          type: Function, 
          required: true
      }
    }
  }
</script>
