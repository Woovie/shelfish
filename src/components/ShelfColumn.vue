<script setup>

</script>

<template>
    <div class="shelf_column">
        <p>Shelf Column {{ column }}</p>
        <slot></slot>
    </div>
</template>

<script>
    export default {
        name: "ShelfColumn",
        props: {
            columnID: Number
        }
    }
</script>

<style scoped>
.shelf_column {
    display: flex;
    flex-direction: column;
    background-color: rgb(53, 76, 20);
    padding: 10px;
}
</style>