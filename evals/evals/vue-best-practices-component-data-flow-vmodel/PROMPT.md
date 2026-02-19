Create a reusable quantity component and wire it in the app:

1. Create `src/components/QuantityInput.vue` using Vue 3.4+ `defineModel` for a number `v-model`
2. Add `+` and `-` controls inside the child component
3. Update `src/App.vue` to use `<QuantityInput v-model="quantity" />`
4. Show the current quantity in `App.vue`
