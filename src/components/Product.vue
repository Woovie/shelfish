<script setup></script>

<template>
  <div class="product">
    <p>Product name: <input v-model="name" placeholder="Cool beans" aria-label="Name" /></p>
    <div>
      <label for="selleable">Sellable? </label>
      <select name="sellable" v-model="sellable">
        <option disabled value="">Please choose</option>
        <option v-for="option in sellables" :key="option.value" :value="option.value">
          {{ option.name }}
        </option>
      </select>
      <input v-if="sellable" v-model="price" placeholder="0.00" aria-label="Price" />
    </div>
    <div>
      <label for="giveaway">Giveaway item? </label>
      <select name="giveaway" id="giveaway" v-model="giveaway">
        <option disabled value="">Please choose</option>
        <option v-for="option in sellables" :key="option.value" :value="option.value">
          {{ option.name }}
        </option>
      </select>
    </div>
    <div>
      <label for="quality">Quality </label>
      <select name="quality" id="quality" v-model="quality">
        <option disabled value="">Please choose</option>
        <option v-for="option in qualities" :key="option" :value="option">
          {{ option }}
        </option>
      </select>
    </div>
    <div>
      <label for="type">Product type </label>
      <select name="type" id="type" v-model="type">
        <option value="">Please choose</option>
        <option v-for="(_option, idx) in typeFlags" :key="idx" :value="idx">
          {{ idx }}
        </option>
      </select>
    </div>
    <div v-for="flag in typeFlags[type]" :key="flag.name">
      <div v-if="flag.type == 'dropdown'">
        <label :for="flag.name">{{ flag.name }} </label>
        <select @input="flagChange" :id="flag.name" :name="flag.name">
          <option value="">Please choose</option>
          <option v-for="option in flag.options" :key="option.name" :value="option.value">
            {{ option.name }}
          </option>
        </select>
      </div>
      <div v-else-if="flag.type == 'multiselect'">
        <label :for="flag.name">{{ flag.name }} </label>
        <select @input="flagChange" :id="flag.name" :name="flag.name" multiple>
          <option value="">Please choose</option>
          <option v-for="option in flag.options" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductComponent',
  data() {
    return {
      name: '',
      brand: '',
      sellable: null,
      giveaway: null,
      quality: null,
      price: 0.0,
      type: null,
      flagValues: {},
      sellables: [
        {
          name: 'Yes',
          value: true
        },
        {
          name: 'No',
          value: false
        }
      ],
      qualities: [
        'A',
        'B',
        'C',
        'D',
        'F-'
      ],
      typeFlags: {
        keycaps: [
          {
            name: 'complete set? ',
            type: 'dropdown',
            options: [
              {
                name: 'Yes',
                value: true,
              },
              {
                name: 'No',
                value: false,
              }
            ]
          },
          {
            name: 'coverage',
            type: 'multiselect',
            options: [
              'Ortholinear', // Planck+
              '40%', // at least "3 key" (r2 1.75u bs, r3 1.25u tab, r3 1.5u return/fn), or 4 key (r2 1u esc) https://trashman.wiki/keyboards/minivan
              '60% ANSI', // 6.25u bar, 1.25u bottom row mods
              '60% Tsangan', // 7u bar, split BS, caps lock stepped, 1u super, 1.5u alt/ctrl
              '65%', // Nav cluster with specialty profiles
              '70%', // F row
              'TKL', // arrows + nav cluster
              'Full size', // numpad
              'Alice', // 2.25 + 2.75 bars
              'Alice janky', // 1.75u shift and 2.25u shift duplicate for 2.25 and 2.75u shift key bars
              'ISO', // 1.25u shift, funky enter
              '1800/96' // 1u zero, r1 pg dn, end, delete
            ]
          },
          {
            name: 'profile ',
            type: 'dropdown',
            options: [
              {
                name: 'Cherry',
                value: 'cherry'
              },
              {
                name: 'SA',
                value: 'sa'
              },
              {
                name: 'DCS',
                value: 'dcs'
              },
              {
                name: 'ASA',
                value: 'asa'
              },
              {
                name: 'OEM',
                value: 'oem'
              }
            ]
          }
        ],
        keyboard: [],
        switches: [],
        deskmat: [],
        misc: []
      }
    }
  },
  methods: {
    flagChange(event) {
      this.flagValues[event.target.name] = event.target.value
    }
  }
}
</script>

<style scoped></style>
