"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createWatch, fetchWatches, updateWatch } from "../../store/watchesSlice";
import LoadingOverlay from "../LoadingOverlay";

const emptyWatch = {
  productNumber: "",
  name: "",
  model: "",
  shortDescription: "",
  fullDescription: "",
  price: "",
  imageUrl: "",
  caliberAndMovement: "",
  chronograph: false,
  weight: "",
  height: "",
  diameter: "",
  thickness: "",
  jewel: "",
  caseMaterial: "",
  strapMaterial: "",
};

const numericFields = ["price", "weight", "height", "diameter", "thickness", "jewel"];

export default function WatchForm({ watchId }) {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state) => state.watches);
  const [form, setForm] = useState(emptyWatch);
  const [submitError, setSubmitError] = useState("");
  const [invalidFields, setInvalidFields] = useState([]);
  const isEditing = watchId !== null;
  const watch = items.find((item) => item.id === watchId);

  useEffect(() => {
    dispatch(fetchWatches());
  }, [dispatch]);

  useEffect(() => {
    if (watch) {
      setForm({
        ...emptyWatch,
        ...watch,
        ...Object.fromEntries(numericFields.map((field) => [field, String(watch[field])])),
      });
    }
  }, [watch]);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitError("");
    setInvalidFields([]);
    const values = {
      ...form,
      ...Object.fromEntries(numericFields.map((field) => [field, Number(form[field])])),
      chronograph: Boolean(form.chronograph),
    };
    const result = isEditing
      ? await dispatch(updateWatch({ id: watchId, ...values }))
      : await dispatch(createWatch(values));

    if (isEditing ? updateWatch.fulfilled.match(result) : createWatch.fulfilled.match(result)) {
      window.location.href = isEditing ? `/watch/${watchId}` : `/watches`;
    } else {
      setSubmitError(result.error.message || "The watch could not be saved.");
    }
  }

  if (status === "loading" || status === "idle") {
    return <LoadingOverlay message="Loading watch form..." />;
  }
  if (status === "failed") {
    return <main id="main-content" tabIndex="-1" className="container py-5"><p role="alert">Unable to load watches: {error}</p></main>;
  }
  if (isEditing && !watch) {
    return (
      <main id="main-content" tabIndex="-1" className="container py-5">
        <h1>Watch not found</h1>
        <p role="alert">No watch with ID {watchId} exists in the catalog.</p>
        <a href="/watches">Return to the product list</a>
      </main>
    );
  }

  const fields = [
    ["productNumber", "Product number", "text"],
    ["name", "Name", "text"],
    ["model", "Model", "text"],
    ["price", "Price (PHP)", "number"],
    ["imageUrl", "Image URL", "url"],
    ["caliberAndMovement", "Caliber and movement", "text"],
    ["weight", "Weight (g)", "number"],
    ["height", "Height (mm)", "number"],
    ["diameter", "Diameter (mm)", "number"],
    ["thickness", "Thickness (mm)", "number"],
    ["jewel", "Jewel count", "number"],
    ["caseMaterial", "Case material", "text"],
    ["strapMaterial", "Strap material", "text"],
  ];

  return (
    <main id="main-content" tabIndex="-1" className="container catalog-page">
      <div className="catalog-page-heading">
        <div>
          <p className="catalog-eyebrow">Catalog management</p>
          <h1>{isEditing ? "Edit Watch" : "Add Watch"}</h1>
        </div>
      </div>
      <form
        className="watch-form"
        onSubmit={handleSubmit}
        onInvalidCapture={(event) => {
          const fieldName = event.target.name;
          if (fieldName) setInvalidFields((current) => (
            current.includes(fieldName) ? current : [...current, fieldName]
          ));
        }}
      >
        {fields.map(([name, label, type]) => {
          const fieldId = `watch-${name}`;
          return (
            <label key={name} htmlFor={fieldId}>
              {label}
              <input
                id={fieldId}
                name={name}
                className="form-control"
                type={type}
                min={type === "number" ? (name === "jewel" ? "0" : "0.01") : undefined}
                step={name === "price" ? "0.01" : name === "jewel" ? "1" : type === "number" ? "any" : undefined}
                required
                value={form[name]}
                aria-invalid={invalidFields.includes(name) || undefined}
                aria-describedby={invalidFields.includes(name) ? `${fieldId}-error` : undefined}
                onChange={(event) => {
                  setForm({ ...form, [name]: event.target.value });
                  setInvalidFields((current) => current.filter((field) => field !== name));
                }}
              />
              {invalidFields.includes(name) && (
                <span className="field-error" id={`${fieldId}-error`}>
                Enter a valid {label.toLowerCase()}.
                </span>
              )}
            </label>
          );
        })}
        <label htmlFor="watch-chronograph">
          Chronograph
          <select
            id="watch-chronograph"
            name="chronograph"
            className="form-control"
            value={form.chronograph ? "yes" : "no"}
            onChange={(event) => setForm({ ...form, chronograph: event.target.value === "yes" })}
          >
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </label>
        <label htmlFor="watch-shortDescription">
          Short description
          <textarea
            id="watch-shortDescription"
            name="shortDescription"
            className="form-control"
            required
            rows="2"
            value={form.shortDescription}
            aria-invalid={invalidFields.includes("shortDescription") || undefined}
            aria-describedby={invalidFields.includes("shortDescription") ? "watch-shortDescription-error" : undefined}
            onChange={(event) => {
              setForm({ ...form, shortDescription: event.target.value });
              setInvalidFields((current) => current.filter((field) => field !== "shortDescription"));
            }}
          />
          {invalidFields.includes("shortDescription") && (
            <span className="field-error" id="watch-shortDescription-error">Short description is required.</span>
          )}
        </label>
        <label className="watch-form-description" htmlFor="watch-fullDescription">
          Full description
          <textarea
            id="watch-fullDescription"
            name="fullDescription"
            className="form-control"
            required
            rows="4"
            value={form.fullDescription}
            aria-invalid={invalidFields.includes("fullDescription") || undefined}
            aria-describedby={invalidFields.includes("fullDescription") ? "watch-fullDescription-error" : undefined}
            onChange={(event) => {
              setForm({ ...form, fullDescription: event.target.value });
              setInvalidFields((current) => current.filter((field) => field !== "fullDescription"));
            }}
          />
          {invalidFields.includes("fullDescription") && (
            <span className="field-error" id="watch-fullDescription-error">Full description is required.</span>
          )}
        </label>
        {submitError && <p className="alert alert-danger" role="alert" tabIndex="-1">{submitError}</p>}
        <div className="watch-form-actions">
          <button className="btn btn-accent" type="submit">{isEditing ? "Save Changes" : "Add Watch"}</button>
          <a className="btn btn-outline-secondary" href="/watches">Cancel</a>
        </div>
      </form>
    </main>
  );
}
