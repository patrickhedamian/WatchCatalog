"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteWatch, fetchWatches } from "../../store/watchesSlice";
import LoadingOverlay from "../LoadingOverlay";

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
    return <LoadingOverlay message="Loading watch..." />;
  }
  if (status === "failed") {
    return <main id="main-content" tabIndex="-1" className="container py-5"><p role="alert">Unable to load watch: {loadError}</p></main>;
  }
  if (!watch) {
    return (
      <main id="main-content" tabIndex="-1" className="container py-5">
        <h1>Watch not found</h1>
        <p role="alert">The requested watch does not exist in the catalog.</p>
        <a href="/watches">Return to the product list</a>
      </main>
    );
  }

  return (
    <main id="main-content" tabIndex="-1" className="container catalog-page">
      <div className="watch-delete-panel">
        <p className="catalog-eyebrow">Catalog management</p>
        <h1>Delete Watch</h1>
        <p>Are you sure you want to remove <strong>{watch.name} {watch.model}</strong>?</p>
        {error && <p className="alert alert-danger" role="alert">{error}</p>}
        <div className="d-flex gap-2">
          <button className="btn btn-danger" type="button" onClick={confirmDelete} disabled={deleting} aria-busy={deleting}>
            {deleting ? "Deleting..." : "Confirm Delete"}
          </button>
          {deleting && (
            <span className="mutation-progress" role="status" aria-live="polite">
              <i className="fas fa-spinner fa-spin" aria-hidden="true" />
              Deleting watch...
            </span>
          )}
          <a className="btn btn-outline-secondary" href={`/watch/${id}`}>Cancel</a>
        </div>
      </div>
    </main>
  );
}
