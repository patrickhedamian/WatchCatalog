export default function ErrorPage({ message = "The page you requested could not be found." }) {
  return (
    <main className="container catalog-page error-page">
      <p className="catalog-eyebrow">404 · Not found</p>
      <h1>We couldn’t find that page.</h1>
      <p>{message}</p>
      <a className="btn btn-accent" href="/">Return Home</a>
    </main>
  );
}
