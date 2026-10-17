export default function WatchImage({ src, alt, className }) {
  function useFallback(event) {
    const image = event.currentTarget;
    if (image.dataset.fallbackApplied === "true") return;
    image.dataset.fallbackApplied = "true";
    image.src = "/images/watch-placeholder.svg";
  }

  return <img src={src} alt={alt} className={className} onError={useFallback} />;
}
