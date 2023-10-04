<script setup>

</script>

<template>
    <div class="shelfSection">
        <div class="shelfSectionInner">
            <slot></slot>
        </div>
        <div class="shelfSectionShelf">
            Shelf Section: {{ shelfSectionID }}
        </div>
    </div>
</template>

<script>
    export default {
        name: "Shelf",
        props: {
            shelfSectionID: Number
        }
    }
</script>

<style scoped>
.shelfSectionInner {
    display: flex;
    flex-direction: row;
    padding: 10px;
    min-height: 50px;
}

.shelfSectionShelf {
    background-color: rgb(238, 183, 99);
    padding: 5px;
    color: black;
}
</style>