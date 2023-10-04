<script setup>

</script>

<template>
    <div class="product">
    </div>
</template>

<script>
    export default {
        name: "Product",
        props: {
            product_name: String,
            product_options: Object
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