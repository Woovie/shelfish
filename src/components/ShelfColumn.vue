<script setup>

</script>

<template>
    <div class="shelfColumn">
        <p>Shelf Column {{ columnID }}</p>
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
.shelfColumn {
    display: flex;
    flex-direction: column;
    background-color: rgb(53, 76, 20);
    padding: 10px;
}
</style>