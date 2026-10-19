import { configureStore } from "@reduxjs/toolkit";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ProductList from "../ProductList";
import WatchDetails from "../WatchDetails";
import WatchForm from "../WatchForm";
import AppMenu from "../../layout/AppMenu";
import { ThemeProvider } from "../../contexts/ThemeContext";
import watchesReducer from "../../../store/watchesSlice";

const productsApiUrl = "https://react-demo-enach4akbkerc5b3.southeastasia-01.azurewebsites.net/api/products";

const sampleWatches = [
  {
    id: 1,
    productNumber: "WC-RO-001",
    productName: "Rolex",
    currency: "PHP",
    model: "Submariner Date",
    shortDescription: "An iconic dive watch.",
    fullDescription: "A detailed description of this dive watch.",
    price: 10500,
    imageUrl: "/images/watch.jpg",
    caliberAndMovement: "Automatic",
    chronograph: false,
    weight: 155,
    height: 12.5,
    diameter: 41,
    thickness: 12.5,
    jewel: 31,
    caseMaterial: "Oystersteel",
    strapMaterial: "Oystersteel",
    featured: true,
  },
  {
    id: 2,
    productNumber: "WC-OM-002",
    productName: "Omega",
    currency: "PHP",
    model: "Speedmaster Moonwatch",
    shortDescription: "A hand-wound chronograph.",
    fullDescription: "A detailed description of this chronograph.",
    price: 6700,
    imageUrl: "/images/omega.jpg",
    caliberAndMovement: "Manual winding",
    chronograph: true,
    weight: 149,
    height: 13.2,
    diameter: 42,
    thickness: 13.2,
    jewel: 26,
    caseMaterial: "Stainless steel",
    strapMaterial: "Leather",
    featured: true,
  },
];

function createResponse(data, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => data,
  };
}

function createStore() {
  return configureStore({
    reducer: { watches: watchesReducer },
  });
}

function renderWithStore(ui) {
  const store = createStore();
  return {
    store,
    ...render(<Provider store={store}>{ui}</Provider>),
  };
}

function fillWatchForm() {
  const values = {
    "Product number": "WC-TEST-003",
    Name: "Test Watch",
    Model: "Test Model",
    "Price (PHP)": "1250.50",
    "Image URL": "https://example.com/watch.jpg",
    "Caliber and movement": "Automatic",
    "Weight (g)": "120",
    "Height (mm)": "11.5",
    "Diameter (mm)": "40",
    "Thickness (mm)": "10.5",
    "Jewel count": "24",
    "Case material": "Stainless steel",
    "Strap material": "Leather",
    "Short description": "A short test description.",
    "Full description": "A detailed description for the test watch.",
  };

  Object.entries(values).forEach(([label, value]) => {
    fireEvent.change(screen.getByLabelText(label), { target: { value } });
  });
}

describe("watch catalog components", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url, options = {}) => {
        const method = options.method || "GET";
        if (url === productsApiUrl && method === "GET") {
          return createResponse(sampleWatches);
        }
        if (url === productsApiUrl && method === "POST") {
          return createResponse({ ...JSON.parse(options.body), id: 3 });
        }
        if (url === `${productsApiUrl}/1` && method === "PUT") {
          return createResponse(JSON.parse(options.body));
        }
        if (url.startsWith(`${productsApiUrl}/`) && method === "DELETE") {
          return createResponse({ id: Number(url.split("/").pop()) });
        }
        return createResponse({ error: "Unexpected request" }, 404);
      }),
    );
    vi.stubGlobal("confirm", vi.fn(() => true));
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("provides a named navigation landmark and an operable, named theme switch", () => {
    render(
      <ThemeProvider>
        <AppMenu />
      </ThemeProvider>,
    );

    expect(screen.getByRole("navigation", { name: "Main navigation" })).toBeInTheDocument();
    const themeSwitch = screen.getByRole("switch", { name: "Dark theme" });
    expect(themeSwitch).not.toBeChecked();
    fireEvent.click(themeSwitch);
    expect(themeSwitch).toBeChecked();
  });

  it("displays products returned by the mocked API", async () => {
    renderWithStore(<ProductList />);

    expect(await screen.findByRole("heading", { name: "Product List" })).toBeInTheDocument();
    expect(await screen.findByRole("heading", { name: "Submariner Date" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Speedmaster Moonwatch" })).toBeInTheDocument();
    expect(screen.getByText("WC-RO-001 · Rolex")).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledWith(
      productsApiUrl,
      undefined,
    );
    expect(screen.getByRole("searchbox", { name: "Search watches" })).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("2 watches found.");
    expect(screen.getByRole("list", { name: "Catalog watches" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "More information about Rolex Submariner Date" }))
      .toHaveAttribute("href", "/watch/1");
    expect(screen.getByRole("button", { name: "Delete Rolex Submariner Date" })).toBeInTheDocument();
  });

  it("reads and displays the selected watch details", async () => {
    renderWithStore(<WatchDetails id={2} />);

    expect(await screen.findByRole("heading", { name: "Omega Speedmaster Moonwatch" })).toBeInTheDocument();
    expect(screen.getByText("A detailed description of this chronograph.")).toBeInTheDocument();
    expect(screen.getByText("Yes")).toBeInTheDocument();
    expect(screen.getByText("Manual winding")).toBeInTheDocument();
  });

  it("associates invalid form fields with a visible validation message", async () => {
    renderWithStore(<WatchForm watchId={null} />);

    const productNumber = await screen.findByLabelText("Product number");
    fireEvent.invalid(productNumber);

    expect(productNumber).toHaveAttribute("aria-invalid", "true");
    expect(productNumber).toHaveAccessibleDescription("Enter a valid product number.");
  });

  it("submits valid product data in a create API request", async () => {
    renderWithStore(<WatchForm watchId={null} />);

    await screen.findByRole("heading", { name: "Add Watch" });
    fillWatchForm();
    fireEvent.change(screen.getByLabelText("Chronograph"), { target: { value: "yes" } });
    fireEvent.submit(screen.getByRole("button", { name: "Add Watch" }).closest("form"));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        productsApiUrl,
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }),
      );
    });
    const [, request] = fetch.mock.calls.find(([, options]) => options?.method === "POST");
    expect(JSON.parse(request.body)).toMatchObject({
      productNumber: "WC-TEST-003",
      productName: "Test Watch",
      currency: "PHP",
      model: "Test Model",
      price: 1250.5,
      chronograph: true,
      jewel: 24,
      caseMaterial: "Stainless steel",
      strapMaterial: "Leather",
      featured: false,
    });
    expect(JSON.parse(request.body)).not.toHaveProperty("name");
  });

  it("submits edited product data in an update API request", async () => {
    renderWithStore(<WatchForm watchId={1} />);

    const modelInput = await screen.findByLabelText("Model");
    expect(modelInput).toHaveValue("Submariner Date");
    fireEvent.change(modelInput, { target: { value: "Submariner Updated" } });
    fireEvent.submit(screen.getByRole("button", { name: "Save Changes" }).closest("form"));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        `${productsApiUrl}/1`,
        expect.objectContaining({ method: "PUT" }),
      );
    });
    const [, request] = fetch.mock.calls.find(([, options]) => options?.method === "PUT");
    expect(JSON.parse(request.body)).toMatchObject({
      id: 1,
      productNumber: "WC-RO-001",
      productName: "Rolex",
      currency: "PHP",
      model: "Submariner Updated",
      price: 10500,
    });
    expect(JSON.parse(request.body)).not.toHaveProperty("name");
  });

  it("deletes a product and removes it from the displayed list", async () => {
    renderWithStore(<ProductList />);

    const deleteButton = await screen.findByRole("button", { name: "Delete Rolex Submariner Date" });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        `${productsApiUrl}/1`,
        expect.objectContaining({ method: "DELETE" }),
      );
      expect(screen.queryByRole("heading", { name: "Submariner Date" })).not.toBeInTheDocument();
    });
    expect(confirm).toHaveBeenCalledWith("Delete this watch from the catalog?");
    expect(screen.getByRole("heading", { name: "Speedmaster Moonwatch" })).toBeInTheDocument();
  });

  it("marks required product fields invalid and exposes their validation message", async () => {
    renderWithStore(<WatchForm watchId={null} />);

    const productNumberInput = await screen.findByLabelText("Product number");
    const form = productNumberInput.closest("form");

    expect(productNumberInput).toBeRequired();
    expect(productNumberInput).toBeInvalid();
    expect(productNumberInput.validationMessage).not.toBe("");
    expect(form.checkValidity()).toBe(false);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("shows the not-found page when the requested watch does not exist", async () => {
    renderWithStore(<WatchDetails id={999} />);

    expect(await screen.findByRole("heading", { name: "We couldn’t find that page." })).toBeInTheDocument();
    expect(screen.getByText("No watch with ID 999 exists in the catalog.")).toBeInTheDocument();
  });
});
