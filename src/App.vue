<script setup>
import Search from './components/Search.vue'
import ShelfUnit from './components/ShelfUnit.vue'
import ShelfSection from './components/Shelf.vue'
import ShelfColumn from './components/ShelfColumn.vue'
import ProductEntry from './components/ProductEntry.vue'
import ProductItem from './components/ProductItem.vue'
</script>

<template>
  <div id="contentContainer">
    <Search />
    <div class="shelfContainer">
      <ShelfUnit
        @click="selectShelfUnit"
        :class="{
          selectingShelfUnit: state.shelfUnitSelect,
          shelfSelected: state.selectedShelfUnit == shelfUnit.id
        }"
        v-for="shelfUnit in shelfData"
        :shelfUnitID="shelfUnit.id"
        :data-shelf-unit="shelfUnit.id"
        :key="shelfUnit.id"
      >
        <ShelfSection
          @click="selectShelfSection"
          :class="{
            selectingShelfSection:
              state.shelfSectionSelect && state.selectedShelfUnit == shelfUnit.id,
            shelfSectionSelected:
              state.selectedShelfSection == shelfSection.id &&
              state.selectedShelfUnit == shelfUnit.id
          }"
          v-for="shelfSection in shelfUnit.shelves"
          :shelfSectionID="shelfSection.id"
          :data-shelf-section="shelfSection.id"
          :data-shelf-parent="shelfUnit.id"
          :key="shelfSection.id"
        >
          <ShelfColumn
            @click="selectSectionColumn"
            :class="{
              selectingShelfSectionColumnAdjust: state.shelfSectionSelect && state.selectedShelfUnit == shelfUnit.id,
              selectingShelfColumn: state.sectionColumnSelect && state.selectedShelfSection == shelfSection.id
            }"
            v-for="shelfColumn in shelfSection.columns"
            :columnID="shelfColumn.id"
            :data-shelf-column="shelfColumn.id"
            :data-section-parent="shelfSection.id"
            :data-shelf-parent="shelfUnit.id"
            :key="shelfColumn.id"
          >
            <ProductItem v-for="productItem in shelfColumn.items" :key="productItem.name">{{
              productItem.name
            }}</ProductItem>
          </ShelfColumn>
        </ShelfSection>
      </ShelfUnit>
    </div>
    <button @click="addItemMode" v-if="!state.addingItemMode">Add Item</button>
    <div>
      <p>{{ state.message }}</p>
      <p v-if="state.selectedShelfUnit">Shelf Unit: {{ state.selectedShelfUnit }}</p>
      <p v-if="state.selectedShelfSection">Shelf Section: {{ state.selectedShelfSection }}</p>
      <p v-if="state.selectedSectionColumn">Column: {{ state.selectedSectionColumn }}</p>
      <div v-if="state.selectedSectionColumn && !state.selectedItemType">
        <label for="productType">What is being added? </label>
        <select name="productType" v-model="state.selectedItemType">
          <option disabled value="">Please choose</option>
          <option v-for="itemType in itemTypes" :key="itemType.value" :value="itemType.value">
            {{ itemType.name }}
          </option>
        </select>
      </div>
      <p v-if="state.selectedItemType">Item type: {{ state.selectedItemType }}</p>
      <ProductEntry
        v-if="state.selectedItemType && state.selectedItemType == 'product'"
        @finishedEntry="addProduct"
      >
      </ProductEntry>
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
      this.state.addingItemMode = true
      this.state.shelfUnitSelect = true
      this.state.message = "Choose a shelf unit"
    },
    selectShelfUnit(event) {
      if (this.state.addingItemMode && this.state.shelfUnitSelect) {
        const target = event.currentTarget // Not needed outside of the if
        this.state.message = `Chose unit ${target.getAttribute(
          'data-shelf-unit'
        )}, choose a shelf section`
        this.state.shelfUnitSelect = false
        this.state.selectedShelfUnit = event.currentTarget.getAttribute('data-shelf-unit')
        this.state.shelfSectionSelect = true
      }
    },
    selectShelfSection(event) {
      const target = event.currentTarget // Used in the if logic
      if (
        this.state.addingItemMode &&
        this.state.shelfSectionSelect &&
        this.state.selectedShelfUnit == target.getAttribute('data-shelf-parent')
      ) {
        this.state.message = `Chose section ${target.getAttribute('data-shelf-section')}`
        this.state.shelfSectionSelect = false
        this.state.selectedShelfSection = target.getAttribute('data-shelf-section')
        if (
          this.shelfData[this.state.selectedShelfUnit - 1].shelves[
            this.state.selectedShelfSection - 1
          ].columns.length === 0
        ) {
          this.createNewColumn()
        } else {
          this.state.sectionColumnSelect = true
          this.state.message += ", choose a column"
        }
      }
    },
    selectSectionColumn(event) {
      if (
        this.state.addingItemMode &&
        this.state.sectionColumnSelect &&
        this.state.selectedShelfSection == event.currentTarget.getAttribute('data-section-parent')
      ) {
        this.state.sectionColumnSelect = false
        this.state.selectedSectionColumn = event.currentTarget.getAttribute('data-shelf-column')
        this.state.message = `Chose column ${event.currentTarget.getAttribute('data-shelf-column')}, fill in the product details.`
      }
    },
    createNewColumn() {
      // TODO add logic to check if column contains any containers, proceed to choose to add new item or choose an existing container
      this.shelfData[this.state.selectedShelfUnit - 1].shelves[
        this.state.selectedShelfSection - 1
      ].columns.push({
        id: 1,
        items: []
      })
      this.state.selectedSectionColumn = 1
      this.state.message += ', no existing columns, created new column'
      // TODO go on to the next logic needed for post-selectSectionColumn
    },
    addProduct(product) {// TODO add indicator that this occured
      this.shelfData[this.state.selectedShelfUnit - 1].shelves[
        this.state.selectedShelfSection - 1
      ].columns[this.state.selectedSectionColumn - 1].items.push(product)
      this.state = this.initialState()
    },
    initialState() {
      return {
        addingItemMode: false,
        shelfUnitSelect: false,
        shelfSectionSelect: false,
        sectionColumnSelect: false,
        selectedShelfUnit: null,
        selectedShelfSection: null,
        selectedSectionColumn: null,
        selectedItemType: null,
        message: 'Click add to get started!'
      }
    }
  },
  data() {
    return {
      shelfData: [],
      itemTypes: [
        {
          name: 'Product',
          value: 'product'
        },
        {
          name: 'Container',
          value: 'container'
        }
      ],
      state: this.initialState()
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

.selectingShelfSectionColumnAdjust {
  background-color: rgba(0, 0, 0, 0);
}

.selectingShelfColumn {
  background-color: yellowgreen;
}

.selectingShelfColumn:hover {
  background-color: darkkhaki;
}

.shelfSelected {
  background-color: violet;
}

.shelfSectionSelected {
  background-color: tomato;
}
</style>
