# Watch Catalog

A Next.js watch catalog with a four-product featured carousel, searchable product list, watch details, and create, edit, and delete flows.

## Run locally

```sh
npm install
npm run dev
```

## Run tests

```sh
npm test
```

The Vitest and React Testing Library suite covers the mocked product-list API, watch details, create/update/delete requests, deletion from the visible list, and required-field validation.

## Deploy to Azure Static Web Apps

The app uses client-side routing, so direct requests to routes such as `/watches`
must serve the exported app shell. The
[`staticwebapp.config.json`](./public/staticwebapp.config.json) file configures
that fallback and is copied into the `out` deployment directory during the
Next.js static export.

Azure Static Web Apps hosts the static export, not the Next.js `pages/api`
handlers. The `/api/watches` endpoints therefore need a separately deployed API
before catalog data operations will work in Azure.

## Routes

- `/` — home and featured watch carousel
- `/watches` — searchable product list
- `/watch` — choose a watch to view
- `/watch/{watchId}` — watch details
- `/watches/add` — add a product
- `/watches/edit` and `/watches/edit/{watchId}` — choose or edit a product
- `/watches/delete` and `/watches/delete/{watchId}` — choose or delete a product
- `/error` — example not-found page

Watch data is stored in `db.json` with product number, name, model, descriptions, PHP price, movement, chronograph, dimensions, weight, jewel count, case material, and strap material. The `/api/watches` endpoints provide CRUD operations, and Redux Toolkit manages the catalog state in the browser.
