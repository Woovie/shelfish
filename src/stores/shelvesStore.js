import { defineStore } from "pinia";

export const useShelfStore = defineStore('shelvesStore', {
  state: () => {
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
})