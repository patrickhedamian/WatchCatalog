"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWatches } from "../../store/watchesSlice";
import WatchImage from "./WatchImage";
import LoadingOverlay from "../LoadingOverlay";

const actionInfo = {
  details: { title: "Details", path: (id) => `/watch/${id}`, label: "More Info" },
  edit: { title: "Edit", path: (id) => `/watches/edit/${id}`, label: "Edit Watch" },
  delete: { title: "Delete", path: (id) => `/watches/delete/${id}`, label: "Delete Watch" },
};

export default function WatchActionList({ action }) {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state) => state.watches);
  const info = actionInfo[action];

  useEffect(() => {
    dispatch(fetchWatches());
  }, [dispatch]);

  if (status === "loading" || status === "idle") {
    return <LoadingOverlay message="Loading watches..." />;
  }
  if (status === "failed") {
    return <main id="main-content" tabIndex="-1" className="container py-5"><p role="alert">Unable to load watches: {error}</p></main>;
  }

  return (
    <main id="main-content" tabIndex="-1" className="container catalog-page">
      <div className="catalog-page-heading">
        <div>
          <p className="catalog-eyebrow">Choose a product</p>
          <h1>{info.title} a Watch</h1>
        </div>
        <a className="btn btn-outline-secondary" href="/watches">Product List</a>
      </div>
      <ul className="watch-grid" aria-label="Catalog watches">
        {items.map((watch) => (
          <li key={watch.id}>
            <article className="card watch-card">
              <a className="watch-card-image" href={info.path(watch.id)}>
                <WatchImage src={watch.imageUrl} alt={`${watch.name || watch.productName || "Watch"} ${watch.model}`} />
              </a>
              <div className="card-body">
                <p className="catalog-eyebrow">{watch.productNumber} · {watch.name || watch.productName}</p>
                <h2 className="h5">{watch.model}</h2>
                <a
                  href={info.path(watch.id)}
                  aria-label={`${info.label} ${watch.name || watch.productName || "watch"} ${watch.model}`}
                >
                  {info.label}
                </a>
              </div>
            </article>
          </li>
        ))}
      </ul>
      {items.length === 0 && <p>There are no watches in the catalog yet.</p>}
    </main>
  );
}
