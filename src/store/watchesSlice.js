import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const API_URL = "https://react-demo-enach4akbkerc5b3.southeastasia-01.azurewebsites.net/api/products";
const CURRENCY = "PHP";

async function requestJson(url, options, { allowEmpty = false } = {}) {
  const response = await fetch(url, options);
  const responseBody = await response.text();
  let data = null;

  if (responseBody.trim()) {
    try {
      data = JSON.parse(responseBody);
    } catch {
      if (response.ok) {
        throw new Error(`Expected a JSON response from ${url}.`);
      }
    }
  } else if (response.ok && !allowEmpty) {
    throw new Error(`Expected a JSON response from ${url}.`);
  }

  if (!response.ok) {
    throw new Error(data?.error || `Request failed with status ${response.status}`);
  }
  return data;
}

function fromApiWatch(watch) {
  const { productName, ...properties } = watch;
  return { ...properties, name: productName };
}

function toApiWatch(watch) {
  const { name, ...properties } = watch;
  return { ...properties, productName: name, currency: CURRENCY };
}

export const fetchWatches = createAsyncThunk(
  "watches/fetchAll",
  async () => (await requestJson(API_URL)).map(fromApiWatch),
  {
    condition: (_, { getState }) => {
      const status = getState().watches.status;
      return status !== "loading" && status !== "succeeded";
    },
  },
);

export const createWatch = createAsyncThunk("watches/create", (watch) =>
  requestJson(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(toApiWatch({ ...watch, featured: watch.featured ?? false })),
  }).then(fromApiWatch),
);

export const updateWatch = createAsyncThunk("watches/update", ({ id, ...changes }) =>
  requestJson(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(toApiWatch({ id, ...changes })),
  }).then(fromApiWatch),
);

export const deleteWatch = createAsyncThunk("watches/delete", (id) =>
  requestJson(`${API_URL}/${id}`, { method: "DELETE" }, { allowEmpty: true }).then(() => id),
);

const watchesSlice = createSlice({
  name: "watches",
  initialState: {
    items: [],
    status: "idle",
    mutationStatus: "idle",
    error: null,
  },
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchWatches.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchWatches.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchWatches.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(createWatch.pending, (state) => {
        state.mutationStatus = "loading";
        state.error = null;
      })
      .addCase(createWatch.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";
        state.items.unshift(action.payload);
      })
      .addCase(createWatch.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.error = action.error.message;
      })
      .addCase(updateWatch.pending, (state) => {
        state.mutationStatus = "loading";
        state.error = null;
      })
      .addCase(updateWatch.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";
        state.items = state.items.map((watch) =>
          watch.id === action.payload.id ? action.payload : watch,
        );
      })
      .addCase(updateWatch.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.error = action.error.message;
      })
      .addCase(deleteWatch.pending, (state) => {
        state.mutationStatus = "loading";
        state.error = null;
      })
      .addCase(deleteWatch.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";
        state.items = state.items.filter((watch) => watch.id !== action.payload);
      })
      .addCase(deleteWatch.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.error = action.error.message;
      });
  },
});

export default watchesSlice.reducer;
