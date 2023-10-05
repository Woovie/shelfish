<script setup></script>

<template>
  <div class="shelfColumn">
    {{ slot }}
  </div>
</template>

<script>
export default {
  name: 'ShelfColumn',
  props: {
    columnID: Number
  }
}
</script>

<style scoped>
.shelfColumn {
  display: flex;
  flex-direction: column;
  background-color: rgb(53, 76, 20);
  min-height: 50px;
  padding-left: 5px;
  padding-right: 5px;
  flex-grow: 1;
}
</style>
