"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteWatch, fetchWatches } from "../../store/watchesSlice";
import WatchImage from "./WatchImage";

export default function ProductList() {
  const dispatch = useDispatch();
  const { items, status, mutationStatus, error } = useSelector((state) => state.watches);
  const [search, setSearch] = useState("");
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    dispatch(fetchWatches());
  }, [dispatch]);

  const filteredWatches = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return items;
    return items.filter((watch) =>
      `${watch.productNumber} ${watch.name} ${watch.model}`.toLowerCase().includes(query),
    );
  }, [items, search]);

  async function removeWatch(id) {
    if (!window.confirm("Delete this watch from the catalog?")) return;
    setActionError("");
    const result = await dispatch(deleteWatch(id));
    if (deleteWatch.rejected.match(result)) setActionError(result.error.message);
  }

  if (status === "loading" || status === "idle") {
    return <main className="container py-5" role="status">Loading watches...</main>;
  }
  if (status === "failed") {
    return <main className="container py-5" role="alert">Unable to load watches: {error}</main>;
  }

  return (
    <main className="container catalog-page">
      <div className="catalog-page-heading">
        <div>
          <p className="catalog-eyebrow">The collection</p>
          <h1>Product List</h1>
          <p>{items.length} watches in the catalog</p>
        </div>
        <a className="btn btn-accent" href="/watches/add">Add a watch</a>
      </div>
      <label className="watch-search">
        <span className="visually-hidden">Search watches</span>
        <input
          className="form-control"
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by product number, name, or model"
        />
      </label>
      {(actionError || (mutationStatus === "failed" && error)) && (
        <p className="alert alert-danger" role="alert">{actionError || error}</p>
      )}
      {mutationStatus === "loading" && <p role="status">Saving catalog changes...</p>}
      <div className="watch-grid">
        {filteredWatches.map((watch) => (
          <article className="card watch-card" key={watch.id}>
            <a className="watch-card-image" href={`/watch/${watch.id}`}>
              <WatchImage src={watch.imageUrl} alt={`${watch.name} ${watch.model}`} />
            </a>
            <div className="card-body">
              <p className="catalog-eyebrow">{watch.productNumber} · {watch.name}</p>
              <h2 className="h5">{watch.model}</h2>
              <p className="watch-price">{formatPrice(watch.price)}</p>
              <p className="watch-short-description">{watch.shortDescription}</p>
              <div className="watch-card-actions">
                <a href={`/watch/${watch.id}`}>More Info</a>
                <a href={`/watches/edit/${watch.id}`}>Edit</a>
                <button className="btn btn-link text-danger p-0" onClick={() => removeWatch(watch.id)}>
                  Delete
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
      {filteredWatches.length === 0 && <p>No watches match your search.</p>}
    </main>
  );
}

function formatPrice(price) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}
