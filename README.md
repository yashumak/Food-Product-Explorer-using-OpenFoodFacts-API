# Food Product Explorer

A web application that allows users to search, filter, and view detailed information about food products using the **OpenFoodFacts** API.

---

## 🎯 Objective

Create a responsive React (or Next.js) app that fetches product data from the OpenFoodFacts API and provides search, barcode lookup, category filtering, sorting, pagination, and detailed product pages.

---

## ⚙️ Technologies

* **Front-end:** ReactJS (or Next.js)
* **Styling:** Tailwind CSS, Bootstrap, or plain CSS
* **State management (optional):** React Context API or Redux
* **API:** OpenFoodFacts — `https://world.openfoodfacts.org/`

---

## ✅ Features

1. **Homepage**

   * Displays a list of food products fetched from the OpenFoodFacts API.
   * Each product card shows:

     * Product name
     * Image
     * Category
     * Ingredients (if available)
     * Nutrition Grade (A, B, C, D, E)
   * Pagination: infinite scroll or "Load more" button.

2. **Search by name**

   * Search bar to filter products by product name (debounced). Uses the search endpoint.

3. **Barcode search**

   * Search by barcode (UPC/EAN) to retrieve a single product (product detail endpoint).

4. **Category filter**

   * Dropdown or side filter to select a category (e.g., beverages, dairy, snacks).
   * Categories fetched from the OpenFoodFacts category endpoint.

5. **Sorting**

   * Sort by Product name (A–Z, Z–A)
   * Sort by Nutrition Grade (ascending/descending)

6. **Product Detail Page**

   * Product image (large)
   * Full list of ingredients
   * Nutritional values (energy, fat, carbs, proteins, etc.)
   * Labels (vegan, gluten-free, etc.)

7. **Responsive design**

   * Works well on mobile and desktop.

8. **(Bonus)** Cart functionality and persistent state using Context/Redux or localStorage.

---

## 📡 OpenFoodFacts API — Useful Endpoints

* Get products by category:

  ```
  https://world.openfoodfacts.org/category/{category}.json
  ```
* Search products by name:

  ```
  https://world.openfoodfacts.org/cgi/search.pl?search_terms={name}&json=true
  ```
* Get product details by barcode:

  ```
  https://world.openfoodfacts.org/api/v0/product/{barcode}.json
  ```
* Example:

  ```
  https://world.openfoodfacts.org/api/v0/product/737628064502.json
  ```

> Note: The API is maintained by a non-profit. If the server is down, wait briefly and retry.

---

## 📁 Project Structure (suggested)

```
food-product-explorer/
├─ public/
├─ src/
│  ├─ components/
│  │  ├─ ProductCard.jsx
│  │  ├─ SearchBar.jsx
│  │  ├─ CategoryFilter.jsx
│  │  ├─ SortControls.jsx
│  │  └─ InfiniteLoader.jsx
│  ├─ pages/ (or routes/ for Next.js)
│  │  ├─ Home.jsx
│  │  └─ ProductDetail.jsx
│  ├─ contexts/ (optional)
│  ├─ hooks/
│  ├─ services/
│  │  └─ openFoodFactsApi.js
│  ├─ styles/
│  └─ App.jsx
├─ .env.local
├─ package.json
└─ README.md
```

---

## 🛠️ Example Implementation Notes

### API service (example)

* Create a single file `openFoodFactsApi.js` that exports methods:

  * `searchProducts({ query, page, pageSize })` — wraps `search.pl` endpoint.
  * `getProductsByCategory(category, page)` — wraps category endpoint.
  * `getProductByBarcode(barcode)` — wraps `api/v0/product/{barcode}.json`.

### Pagination strategy

* Use `page` and `page_size` params with `search.pl` for server-side paging.
* For infinite scroll: fetch next page when the user scrolls near the bottom.
* For "Load more": request the next page and append results.

### Search UX

* Debounce text input (e.g., 300ms) to avoid excessive requests.
* Show a spinner while loading and a friendly message when no results.

### Barcode lookup

* On barcode search success, navigate directly to the product detail page.
* Show an error/toast when product is not found.

### Sorting

* Sorting by name and nutrition grade can be done client-side for fetched results.
* Alternatively, apply server-side filters where possible and then sort client-side.

---

## 📥 Installation & Running (React example)

```bash
# clone
git clone <your-repo-url>
cd food-product-explorer

# install
npm install

# run (development)
npm start

# build (production)
npm run build
```

If using Next.js:

```bash
npm run dev
npm run build
npm run start
```

Add `.env.local` for any environment variables (if needed):

```
REACT_APP_API_BASE=https://world.openfoodfacts.org
```

---

## ✅ Evaluation Criteria (for submission)

* **Code quality:** clean, modular components, consistent naming
* **API integration:** correct usage of OpenFoodFacts endpoints
* **UI/UX:** responsive and user-friendly design
* **Functionality:** search, filter, barcode lookup, sorting implemented
* **Pagination:** infinite scroll or smooth load-more

---

## 💡 Bonus / Extra Credit

* Cart functionality (persisted via Context + localStorage)
* Unit tests for components (Jest + React Testing Library)
* Accessibility improvements (ARIA labels, keyboard nav)
* Caching API responses for repeated queries

---

