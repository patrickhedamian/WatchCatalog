import "../../styles/bootstrap.min.css";
import "../../styles/site.css";
import "../../styles/fontawesome/css/all.css";
import "../../styles/roboto/roboto.css";

export const metadata = {
  title: "Watch Catalog",
  description: "For ReactJS Upskilling",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
