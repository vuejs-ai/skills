Create a Vue component `src/components/ProductList.vue` that:

1. Receives a `products` array prop with items containing `name` (string), `price` (number), and `inStock` (boolean)
2. Displays only in-stock products sorted by price (lowest first)
3. Shows the total count of in-stock products above the list

The component should efficiently derive and cache the filtered/sorted list.
