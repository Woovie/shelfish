<template>
  <div id="contentContainer">
    <Search />
    <div class="shelfContainer">
      <ShelfUnit
        @click="selectShelfUnit"
        :class="{
          selectingShelfUnit: shelfStore.shelfUnitSelect,
          shelfSelected: shelfStore.selectedShelfUnit == shelfUnit.id
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
              shelfStore.shelfSectionSelect && shelfStore.selectedShelfUnit == shelfUnit.id,
            shelfSectionSelected:
              shelfStore.selectedShelfSection == shelfSection.id &&
              shelfStore.selectedShelfUnit == shelfUnit.id
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
              selectingShelfSectionColumnAdjust:
                shelfStore.shelfSectionSelect && shelfStore.selectedShelfUnit == shelfUnit.id,
              selectingShelfColumn:
                shelfStore.sectionColumnSelect && shelfStore.selectedShelfSection == shelfSection.id
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
          <div class="newColumnButton" @click="createNewColumn" v-if="shelfSection.columns.length > 0 && shelfStore.sectionColumnSelect">+</div>
        </ShelfSection>
      </ShelfUnit>
    </div>
    <button @click="addItemMode" v-if="!shelfStore.addingItemMode">Add Item</button>
    <button @click="cancellingProduct" v-if="shelfStore.addingItemMode">Cancel</button>
    <div>
      <p>{{ shelfStore.message }}</p>
      <p v-if="shelfStore.selectedShelfUnit">Shelf Unit: {{ shelfStore.selectedShelfUnit }}</p>
      <p v-if="shelfStore.selectedShelfSection">Shelf Section: {{ shelfStore.selectedShelfSection }}</p>
      <p v-if="shelfStore.selectedSectionColumn">Column: {{ shelfStore.selectedSectionColumn }}</p>
      <div v-if="shelfStore.selectedSectionColumn && !shelfStore.selectedItemType">
        <label for="productType">What is being added? </label>
        <select name="productType" v-model="shelfStore.selectedItemType">
          <option disabled value="">Please choose</option>
          <option v-for="itemType in itemTypes" :key="itemType.value" :value="itemType.value">
            {{ itemType.name }}
          </option>
        </select>
      </div>
      <p v-if="shelfStore.selectedItemType">Item type: {{ shelfStore.selectedItemType }}</p>
      <ProductEntry
        v-if="shelfStore.selectedItemType && shelfStore.selectedItemType == 'product'"
        @finishedEntry="addProduct"
        @entryCancelled="cancelledProduct"
        :cancelEntry="cancelProduct"
      >
      </ProductEntry>
    </div>
  </div>
</template>

<script>
import Search from './components/Search.vue'
import ShelfUnit from './components/ShelfUnit.vue'
import ShelfSection from './components/Shelf.vue'
import ShelfColumn from './components/ShelfColumn.vue'
import ProductEntry from './components/ProductEntry.vue'
import ProductItem from './components/ProductItem.vue'
import { useShelfStore } from './stores/shelvesStore'

export default {
  components: {
    Search,
    ShelfUnit,
    ShelfSection,
    ShelfColumn,
    ProductEntry,
    ProductItem
  },
  setup() {
    const shelfStore = useShelfStore()

    return { shelfStore }
  },
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
      this.shelfStore.addingItemMode = true
      this.shelfStore.shelfUnitSelect = true
      this.shelfStore.message = 'Choose a shelf unit'
    },
    selectShelfUnit(event) {
      if (this.shelfStore.addingItemMode && this.shelfStore.shelfUnitSelect) {
        const target = event.currentTarget // Not needed outside of the if
        this.shelfStore.message = `Chose unit ${target.getAttribute(
          'data-shelf-unit'
        )}, choose a shelf section`
        this.shelfStore.shelfUnitSelect = false
        this.shelfStore.selectedShelfUnit = event.currentTarget.getAttribute('data-shelf-unit')
        this.shelfStore.shelfSectionSelect = true
      }
    },
    selectShelfSection(event) {
      const target = event.currentTarget // Used in the if logic
      if (
        this.shelfStore.addingItemMode &&
        this.shelfStore.shelfSectionSelect &&
        this.shelfStore.selectedShelfUnit == target.getAttribute('data-shelf-parent')
      ) {
        this.shelfStore.message = `Chose section ${target.getAttribute('data-shelf-section')}`
        this.shelfStore.shelfSectionSelect = false
        this.shelfStore.selectedShelfSection = target.getAttribute('data-shelf-section')
        if (
          this.shelfData[this.shelfStore.selectedShelfUnit - 1].shelves[
            this.shelfStore.selectedShelfSection - 1
          ].columns.length === 0
        ) {
          this.createColumnEmptySection()
        } else {
          this.shelfStore.sectionColumnSelect = true
          this.shelfStore.message += ', choose a column'
        }
      }
    },
    selectSectionColumn(event) {
      if (
        this.shelfStore.addingItemMode &&
        this.shelfStore.sectionColumnSelect &&
        this.shelfStore.selectedShelfSection == event.currentTarget.getAttribute('data-section-parent')
      ) {
        this.shelfStore.sectionColumnSelect = false
        this.shelfStore.selectedSectionColumn = event.currentTarget.getAttribute('data-shelf-column')
        this.shelfStore.message = `Chose column ${event.currentTarget.getAttribute(
          'data-shelf-column'
        )}, fill in the product details.`
      }
    },
    createNewColumn() {
      const columns = this.shelfData[this.shelfStore.selectedShelfUnit - 1].shelves[this.shelfStore.selectedShelfSection - 1].columns
      const id = columns.length + 1
      columns.push({
        id: id,
        items: []
      })
      this.shelfStore.selectedSectionColumn = id
      this.shelfStore.sectionColumnSelect = false
    },
    createColumnEmptySection() {
      // TODO add logic to check if column contains any containers, proceed to choose to add new item or choose an existing container
      this.shelfData[this.shelfStore.selectedShelfUnit - 1].shelves[
        this.shelfStore.selectedShelfSection - 1
      ].columns.push({
        id: 1,
        items: []
      })
      this.shelfStore.selectedSectionColumn = 1
      this.shelfStore.message += ', no existing columns, created new column'
      this.shelfStore.sectionColumnSelect = false
      // TODO go on to the next logic needed for post-selectSectionColumn
    },
    addProduct(product) {
      // TODO add indicator that this occured
      this.shelfData[this.shelfStore.selectedShelfUnit - 1].shelves[
        this.shelfStore.selectedShelfSection - 1
      ].columns[this.shelfStore.selectedSectionColumn - 1].items.push(product)
      this.shelfStore.$reset()
    },
    cancellingProduct() {
      this.cancelProduct = true
      if (this.shelfStore.selectedSectionColumn !== null) {
        this.shelfData[this.shelfStore.selectedShelfUnit - 1].shelves[
          this.shelfStore.selectedShelfSection - 1
        ].columns.splice(this.shelfStore.selectedSectionColumn - 1)
      }
      this.shelfStore.$reset()
    },
    cancelledProduct() {
      this.cancelProduct = false
    },
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
      cancelProduct: false,
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
  cursor: pointer;
  background-color: purple;
}

.selectingShelfSection {
  background-color: teal;
}

.selectingShelfSection:hover {
  cursor: pointer;
  background-color: gold;
}

.selectingShelfSectionColumnAdjust {
  background-color: rgba(0, 0, 0, 0);
}

.selectingShelfColumn {
  background-color: yellowgreen;
}

.selectingShelfColumn:hover {
  cursor: pointer;
  background-color: darkkhaki;
}

.shelfSelected {
  background-color: violet;
}

.shelfSectionSelected {
  background-color: tomato;
}

.newColumnButton {
  background-color: blue;
  width: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.newColumnButton:hover {
  cursor: pointer;
  background-color: firebrick;
}
</style>
