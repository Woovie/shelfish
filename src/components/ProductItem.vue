<script setup>

</script>

<template>
  <slot>{{ name }}</slot>
</template>

<script>
  export default {
    name: 'ProductItem',
    props: {
      name: String,
    }
  }
</script>

<style scoped>

</style>