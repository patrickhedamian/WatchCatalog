"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWatches } from "../../store/watchesSlice";
import WatchImage from "./WatchImage";
import ErrorPage from "./ErrorPage";
import LoadingOverlay from "../LoadingOverlay";

export default function WatchDetails({ id }) {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state) => state.watches);

  useEffect(() => {
    dispatch(fetchWatches());
  }, [dispatch]);

  if (status === "loading" || status === "idle") {
    return <LoadingOverlay message="Loading watch details..." />;
  }
  if (status === "failed") {
    return <main id="main-content" tabIndex="-1" className="container py-5"><p role="alert">Unable to load watch details: {error}</p></main>;
  }

  const watch = items.find((item) => item.id === id);
  if (!watch) {
    return <ErrorPage message={`No watch with ID ${id} exists in the catalog.`} />;
  }

  return (
    <main id="main-content" tabIndex="-1" className="container catalog-page">
      <a href="/watches" className="back-link">← Product List</a>
      <article className="watch-details">
        <div className="watch-details-image">
          <WatchImage src={watch.imageUrl} alt={`${watch.name} ${watch.model}`} />
        </div>
        <div className="watch-details-copy">
          <p className="catalog-eyebrow">{watch.productNumber}</p>
          <h1>{watch.name} {watch.model}</h1>
          <p className="watch-price">{formatPrice(watch.price)}</p>
          <p>{watch.shortDescription}</p>
          <h2 className="h5 mt-4">Product details</h2>
          <p>{watch.fullDescription}</p>
          <dl className="watch-specs">
            <div><dt>Caliber and movement</dt><dd>{watch.caliberAndMovement}</dd></div>
            <div><dt>Chronograph</dt><dd>{watch.chronograph ? "Yes" : "No"}</dd></div>
            <div><dt>Weight</dt><dd>{watch.weight} g</dd></div>
            <div><dt>Height</dt><dd>{watch.height} mm</dd></div>
            <div><dt>Diameter</dt><dd>{watch.diameter} mm</dd></div>
            <div><dt>Thickness</dt><dd>{watch.thickness} mm</dd></div>
            <div><dt>Jewel</dt><dd>{watch.jewel}</dd></div>
            <div><dt>Case material</dt><dd>{watch.caseMaterial}</dd></div>
            <div><dt>Strap material</dt><dd>{watch.strapMaterial}</dd></div>
          </dl>
          <div className="d-flex gap-2 flex-wrap">
            <a className="btn btn-accent" href={`/watches/edit/${watch.id}`}>Edit Watch</a>
            <a className="btn btn-outline-secondary" href={`/watches/delete/${watch.id}`}>Delete Watch</a>
          </div>
        </div>
      </article>
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
