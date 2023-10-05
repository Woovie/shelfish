<script setup></script>

<template>
  <div class="shelfSection">
    <div class="shelfSectionInner">
      <slot></slot>
    </div>
    <div class="shelfSectionShelf">Shelf Section: {{ shelfSectionID }}</div>
  </div>
</template>

<script>
export default {
  name: 'ShelfSection',
  props: {
    shelfSectionID: Number
  }
}
</script>

<style scoped>
.shelfSectionInner {
  display: flex;
  flex-direction: row;
  min-height: 50px;
  align-items: stretch;
}

.shelfSectionShelf {
  background-color: rgb(238, 183, 99);
  padding: 5px;
  color: black;
}
</style>
