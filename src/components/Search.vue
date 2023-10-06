<template>
  <div>
    Search: <input type="text" aria-label="Search for item" placeholder="Some cool product" />
  </div>
</template>

<script>
export default {
  name: 'SearchBox',
  props: [
    'shelfData',
    'updateData'
  ],
  emits: [
    'updatedData'
  ],
  data() {
    return {
      products: {}
    }
  },
  watch: {
    updateData: function() {
      if (this.updateData) {
        this.products = this.shelfData,
        this.$emit('updatedData')
        console.log(this.shelfData)
      }
    }
  }
}
</script>

<style scoped></style>
