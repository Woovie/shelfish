<script setup></script>

<template>
  <div class="shelfUnit">
    <p>Shelf Unit: {{ shelfUnitID }}</p>
    <div class="shelfUnitInner">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ShelfUnit',
  props: {
    shelfUnitID: Number
  }
}
</script>

<style scoped>
.shelfUnit {
  box-shadow: 0px 0px 1px white;
  margin-right: 4px;
  width: 33%;
}
.shelfUnitInner {
  padding: 10px;
}

p {
  margin: 2px;
  margin-left: 10px;
}
</style>
