<script setup>
import Search from './components/Search.vue'
import ShelfUnit from './components/ShelfUnit.vue'
import ShelfSection from './components/Shelf.vue'
import ShelfColumn from './components/ShelfColumn.vue'
import ProductComponent from './components/Product.vue'
</script>

<template>
  <div id="contentContainer">
    <Search />
    <div class="shelfContainer">
      <ShelfUnit
        @click="selectShelfUnit"
        :class="{
          selectingShelfUnit: shelfUnitSelect,
          shelfSelected: selectedShelfUnit == shelfUnit.id
        }"
        v-for="shelfUnit in shelfData"
        :shelfUnitID="shelfUnit.id"
        :data-shelf-unit="shelfUnit.id"
        :key="shelfUnit.id"
      >
        <ShelfSection
          @click="selectShelfSection"
          v-for="shelfSection in shelfUnit.shelves"
          :class="{
            selectingShelfSection: shelfSectionSelect && selectedShelfUnit == shelfUnit.id,
            shelfSectionSelected:
              selectedShelfSection == shelfSection.id && selectedShelfUnit == shelfUnit.id
          }"
          :shelfSectionID="shelfSection.id"
          :data-shelf-section="shelfSection.id"
          :data-shelf-parent="shelfUnit.id"
          :key="shelfSection.id"
        >
          <ShelfColumn
            @click="selectSectionColumn"
            v-for="shelfColumn in shelfSection.columns"
            :columnID="shelfColumn.id"
            :data-shelf-column="shelfColumn.id"
            :data-section-parent="shelfSection.id"
            :data-shelf-parent="shelfUnit.id"
            :key="shelfColumn.id"
          ></ShelfColumn>
        </ShelfSection>
      </ShelfUnit>
    </div>
    <button @click="addItemMode">Add Item</button>
    <button @click="cancelAddItem" v-if="addingItemMode">Cancel</button>
    <div>
      <p id="addItemStatusBar">Click Add Item to get started!</p>
      <p v-if="selectedShelfUnit">Shelf Unit: {{ selectedShelfUnit }}</p>
      <p v-if="selectedShelfSection">Shelf Section: {{ selectedShelfSection }}</p>
      <p v-if="selectedSectionColumn">Column: {{ selectedSectionColumn }}</p>
      <div v-if="selectedSectionColumn && !selectedItemType">
        <label for="productType">What is being added? </label>
        <select name="productType" v-model="selectedItemType">
          <option disabled value="">Please choose</option>
          <option
          v-for="itemType in itemTypes"
          :key="itemType.value"
          :value="itemType.value">
            {{ itemType.name }}
          </option>
        </select>
      </div>
      <p v-if="selectedItemType">Item type: {{ selectedItemType }}</p>
      <ProductComponent v-if="selectedItemType && selectedItemType == 'product'">
      </ProductComponent>
    </div>
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
        const target = event.currentTarget // Not needed outside of the if
        document.querySelector('#addItemStatusBar').innerText = `Chose unit ${target.getAttribute(
          'data-shelf-unit'
        )}`
        this.shelfUnitSelect = false
        this.selectedShelfUnit = event.currentTarget.getAttribute('data-shelf-unit')
        this.shelfSectionSelect = true
      }
    },
    selectShelfSection(event) {
      const target = event.currentTarget // Used in the if logic
      if (
        this.addingItemMode &&
        this.shelfSectionSelect &&
        this.selectedShelfUnit == target.getAttribute('data-shelf-parent')
      ) {
        document.querySelector(
          '#addItemStatusBar'
        ).innerText = `Chose section ${target.getAttribute('data-shelf-section')}`
        this.shelfSectionSelect = false
        this.selectedShelfSection = target.getAttribute('data-shelf-section')
        if (
          this.shelfData[this.selectedShelfUnit - 1].shelves[this.selectedShelfSection - 1].columns
            .length === 0
        ) {
          this.createNewColumn()
        } else {
          this.sectionColumnSelect = true
        }
      }
    },
    selectSectionColumn(event) {
      if (
        this.addingItemMode &&
        this.sectionColumnSelect &&
        this.selectedShelfSection == event.currentTarget.getAttribute('data-section-parent')
      ) {
        const columns =
          this.shelfData[this.selectedShelfUnit - 1].shelves[this.selectedShelfSection - 1].columns
      }
    },
    createNewColumn() {
      // TODO add logic to check if column contains any containers, proceed to choose to add new item or choose an existing container
      this.shelfData[this.selectedShelfUnit - 1].shelves[
        this.selectedShelfSection - 1
      ].columns.push({
        id: 1,
        items: []
      })
      this.selectedSectionColumn = 1
      document.querySelector('#addItemStatusBar').innerText +=
        ', no existing columns, created new column'
      // TODO go on to the next logic needed for post-selectSectionColumn
    }
  },
  data() {
    return {
      shelfData: [],
      addingItemMode: false,
      shelfUnitSelect: false,
      shelfSectionSelect: false,
      sectionColumnSelect: false,
      selectedShelfUnit: null,
      selectedShelfSection: null,
      selectedSectionColumn: null,
      selectedItemType: null,
      itemTypes: [
        {
          name: 'Product',
          value: 'product'
        },
        {
          name: 'Container',
          value: 'container'
        }
      ]
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

.shelfSelected {
  background-color: violet;
}

.shelfSectionSelected {
  background-color: tomato;
}
</style>
