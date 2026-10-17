"use client";

import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWatches } from "../../store/watchesSlice";
import WatchCarousel from "./WatchCarousel";
import SignupForm from "./SignupForm";

export default function Home() {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state) => state.watches);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [carouselWatches, setCarouselWatches] = useState([]);
  const hasRandomizedWatches = useRef(false);

  useEffect(() => {
    dispatch(fetchWatches());
  }, [dispatch]);

  useEffect(() => {
    if (status !== "succeeded" || hasRandomizedWatches.current) return;

    const shuffledWatches = [...items];
    for (let index = shuffledWatches.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [shuffledWatches[index], shuffledWatches[randomIndex]] = [
        shuffledWatches[randomIndex],
        shuffledWatches[index],
      ];
    }

    setCarouselWatches(shuffledWatches.slice(0, 4));
    hasRandomizedWatches.current = true;
  }, [items, status]);

  if (status === "loading" || status === "idle") {
    return <main className="container py-5" role="status">Loading watches...</main>;
  }
  if (status === "failed") {
    return <main className="container py-5" role="alert">Unable to load watches: {error}</main>;
  }

  return (
    <main>
      <section className="catalog-intro container">
        <p className="catalog-eyebrow">Time, thoughtfully selected</p>
        <h1>Find a watch that fits your style.</h1>
        <p>Explore standout designs from trusted watchmakers and discover the details behind each one.</p>
        <a className="btn btn-accent" href="/watches">Browse the collection</a>
      </section>
      <WatchCarousel
        watches={carouselWatches}
        currentSlide={currentSlide}
        setCurrentSlide={setCurrentSlide}
      />
      <SignupForm />
    </main>
  );
}
