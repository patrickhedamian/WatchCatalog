"use client";

import { startTransition, useState } from "react";
import { useViewTransitionCarousel, ViewTransitionCarouselProvider } from "./ViewTransitionCarouselProvider";
import WatchImage from "../watches/WatchImage";

function WatchCarouselInner({ watches, currentSlide, setCurrentSlide, setSlideDirection }) {
  const { slideDirection, isAnimating, previousSlideIndex } = useViewTransitionCarousel();

  function goToSlide(index) {
    if (!isAnimating && index !== currentSlide) {
      const direction = index > currentSlide ? "next" : "prev";
      startTransition(() => {
        setSlideDirection(direction);
        setCurrentSlide(index);
      });
    }
  }

  if (!watches.length) {
    return <section className="container py-5"><p>No featured watches are available.</p></section>;
  }
  const isFirst = currentSlide === 0;
  const isLast = currentSlide === watches.length - 1;

  return (
    <section className="watch-carousel-wrapper" aria-label="Featured watches">
      <div className="carousel-container">
        <div className="carousel-slide-wrapper">
          <div className="carousel-slide-content">
            <WatchCarouselSlide
              watch={watches[currentSlide]}
              animationClass={
                isAnimating && slideDirection === "next"
                  ? "slide-in-right"
                  : isAnimating && slideDirection === "prev"
                    ? "slide-in-left"
                    : ""
              }
            />
            {isAnimating && previousSlideIndex !== null && watches[previousSlideIndex] && (
              <WatchCarouselSlide
                watch={watches[previousSlideIndex]}
                animationClass={slideDirection === "next" ? "slide-out-left" : "slide-out-right"}
              />
            )}
          </div>
        </div>

        <button
          className={`carousel-nav-btn carousel-nav-prev ${isFirst ? "disabled" : ""}`}
          type="button"
          onClick={() => goToSlide(currentSlide - 1)}
          disabled={isFirst || isAnimating}
          aria-label="Previous watch"
        ><span className="carousel-nav-icon carousel-arrow-left" /></button>
        <button
          className={`carousel-nav-btn carousel-nav-next ${isLast ? "disabled" : ""}`}
          type="button"
          onClick={() => goToSlide(currentSlide + 1)}
          disabled={isLast || isAnimating}
          aria-label="Next watch"
        ><span className="carousel-nav-icon carousel-arrow-right" /></button>
      </div>

      <div className="carousel-indicators-custom">
        {watches.map((watch, index) => (
          <button
            key={watch.id}
            type="button"
            onClick={() => goToSlide(index)}
            className={index === currentSlide ? "active" : ""}
            aria-current={index === currentSlide}
            aria-label={`Show ${watch.name} ${watch.model}`}
            disabled={isAnimating}
          />
        ))}
      </div>
    </section>
  );
}

function WatchCarouselSlide({ watch, animationClass }) {
  return (
    <article className={`card border-0 carousel-watch-card ${animationClass || ""}`}>
      <a href={`/watch/${watch.id}`} className="watch-slide-link">
        <div className="watch-slide-image-wrap">
          <WatchImage src={watch.imageUrl} alt={`${watch.name} ${watch.model}`} className="watch-slide-image" />
        </div>
        <div className="watch-slide-copy">
          <p className="catalog-eyebrow">{watch.name} · Featured collection</p>
          <h2>{watch.model}</h2>
          <p>{watch.shortDescription}</p>
          <span className="btn btn-accent">Discover this watch</span>
        </div>
      </a>
    </article>
  );
}

export default function WatchCarousel({ watches, currentSlide, setCurrentSlide }) {
  const [slideDirection, setSlideDirection] = useState(null);

  return (
    <ViewTransitionCarouselProvider currentSlideIndex={currentSlide} direction={slideDirection}>
      <WatchCarouselInner
        watches={watches}
        currentSlide={currentSlide}
        setCurrentSlide={setCurrentSlide}
        setSlideDirection={setSlideDirection}
      />
    </ViewTransitionCarouselProvider>
  );
}
