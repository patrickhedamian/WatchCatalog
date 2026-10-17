"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteWatch, fetchWatches } from "../../store/watchesSlice";

export default function DeleteWatchPage({ id }) {
  const dispatch = useDispatch();
  const { items, status, error: loadError } = useSelector((state) => state.watches);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const watch = items.find((item) => item.id === id);

  useEffect(() => {
    dispatch(fetchWatches());
  }, [dispatch]);

  async function confirmDelete() {
    setDeleting(true);
    setError("");
    const result = await dispatch(deleteWatch(id));
    if (deleteWatch.fulfilled.match(result)) {
      window.location.href = "/watches";
    } else {
      setDeleting(false);
      setError(result.error.message || "The watch could not be deleted.");
    }
  }

  if (status === "loading" || status === "idle") {
    return <main className="container py-5" role="status">Loading watch...</main>;
  }
  if (status === "failed") {
    return <main className="container py-5" role="alert">Unable to load watch: {loadError}</main>;
  }
  if (!watch) {
    return (
      <main className="container py-5" role="alert">
        <h1>Watch not found</h1>
        <a href="/watches">Return to the product list</a>
      </main>
    );
  }

  return (
    <main className="container catalog-page">
      <div className="watch-delete-panel">
        <p className="catalog-eyebrow">Catalog management</p>
        <h1>Delete Watch</h1>
        <p>Are you sure you want to remove <strong>{watch.name} {watch.model}</strong>?</p>
        {error && <p className="alert alert-danger" role="alert">{error}</p>}
        <div className="d-flex gap-2">
          <button className="btn btn-danger" type="button" onClick={confirmDelete} disabled={deleting}>
            {deleting ? "Deleting..." : "Confirm Delete"}
          </button>
          <a className="btn btn-outline-secondary" href={`/watch/${id}`}>Cancel</a>
        </div>
      </div>
    </main>
  );
}
