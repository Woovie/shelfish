<script setup>
import Search from './components/Search.vue';
import ShelfUnit from './components/ShelfUnit.vue';
import Shelf from './components/Shelf.vue';
import ShelfColumn from './components/ShelfColumn.vue';
</script>

<template>
    <div id="contentContainer">
        <Search />
        <div class="shelfContainer">
            <ShelfUnit :class="{'selectingShelfUnit': shelfUnitSelect}" @click="selectShelfUnit" v-for="shelfUnit in shelfData" :shelfUnitID="shelfUnit.id" :data-shelf-unit="shelfUnit.id">
                <Shelf :class="{'selectingShelfSection': shelfSectionSelect}" @click="selectShelfSection" v-for="shelfSection in shelfUnit.shelves" :shelfSectionID="shelfSection.id" :data-shelf-section="shelfSection.id">
                    <ShelfColumn v-for="shelfColumn in shelfSection.columns" :columnID="shelfColumn.id" :data-shelf-column="shelfColumn.id"></ShelfColumn>
                </Shelf>
            </ShelfUnit>
        </div>
        <button @click="addItemMode">Add Item</button>
        <button @click="cancelAddItem" v-if="addingItemMode">Cancel</button>
    </div>
</template>

<script>
    export default {
        mounted() {
            const shelfCount = 3
            const sections = 6
            for (let shelfUnit = 0; shelfUnit < shelfCount; shelfUnit++) {
                const payload = {
                    id: shelfUnit + 1,
                    shelves: []
                }
                for (let shelfSection = 0; shelfSection < sections; shelfSection++) {
                    payload.shelves.push({
                        id: shelfSection + 1,
                        columns: []
                    })
                }
                this.shelfData.push(payload)
            }
        },
        methods: {
            addItemMode() {
                this.addingItemMode = true
                this.shelfUnitSelect = true
            },
            cancelAddItem() {
                this.addingItemMode = false
            },
            selectShelfUnit(event) {
                if (this.addingItemMode && this.shelfUnitSelect) {
                    this.shelfUnitSelect = false
                    this.selectedShelfUnit = event.target.getAttribute('data-shelf-unit')
                    this.shelfSectionSelect = true
                }
            },
            selectShelfSection(event) {
                if (this.addingItemMode && this.shelfSectionSelect) {
                    this.shelfSectionSelect = false
                    this.selectedShelfSection = event.target.getAttribute('data-shelf-unit')
                }
            }
        },
        data() {
            return {
                addingItemMode: false,
                selectedShelfUnit: null,
                selectedShelfSection: null,
                shelfUnitSelect: false,
                shelfSectionSelect: false,
                shelfData: []
            }
        }
    }
</script>

<style scoped>
    #contentContainer {
        margin-left: 10%;
        margin-right: 10%;
    }

    .shelfContainer {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }

    .selectingShelfUnit {
        background-color: red;
    }

    .selectingShelfUnit:hover {
        background-color: purple;
    }

    .selectingShelfSection {
        background-color: teal;
    }

    .selectingShelfSection:hover {
        background-color: gold;
    }
</style>
