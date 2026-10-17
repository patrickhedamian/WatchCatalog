import Header from "./Header";
import AppMenu from "./AppMenu";
import { ThemeContext, ThemeProvider } from "../contexts/ThemeContext";
import { useContext } from "react";
import Home from "../home/Home";
import ProductList from "../watches/ProductList";
import WatchDetails from "../watches/WatchDetails";
import WatchForm from "../watches/WatchForm";
import DeleteWatchPage from "../watches/DeleteWatchPage";
import ErrorPage from "../watches/ErrorPage";
import WatchActionList from "../watches/WatchActionList";
import StoreProvider from "../../store/StoreProvider";

function ThemeSurface({ children }) {
  const { darkTheme } = useContext(ThemeContext);
  return <div className={darkTheme ? "theme-dark" : "theme-light"}>{children}</div>;
}

export default function Layout({ url }) {
  const pathname = url.split("?")[0].replace(/\/+$/, "") || "/";
  const watchId = (route) => {
    const match = route.match(/\/(\d+)$/);
    return match ? Number(match[1]) : null;
  };
  const detailId = pathname.match(/^\/watch\/(\d+)$/);
  const editId = pathname.startsWith("/watches/edit/") ? watchId(pathname) : null;
  const deleteId = pathname.startsWith("/watches/delete/") ? watchId(pathname) : null;

  return (
    <StoreProvider>
      <ThemeProvider>
        <Header />
        <AppMenu />
        <ThemeSurface>
          {pathname === "/" && <Home />}
          {pathname === "/watches" && <ProductList />}
          {pathname === "/watch" && <WatchActionList action="details" />}
          {pathname === "/watches/add" && <WatchForm watchId={null} />}
          {pathname === "/watches/edit" && <WatchActionList action="edit" />}
          {pathname === "/watches/delete" && <WatchActionList action="delete" />}
          {editId !== null && <WatchForm watchId={editId} />}
          {deleteId !== null && <DeleteWatchPage id={deleteId} />}
          {detailId && <WatchDetails id={Number(detailId[1])} />}
          {pathname === "/error" && <ErrorPage />}
          {pathname !== "/" &&
            pathname !== "/watches" &&
            pathname !== "/watch" &&
            pathname !== "/watches/add" &&
            pathname !== "/watches/edit" &&
            pathname !== "/watches/delete" &&
            !pathname.startsWith("/watches/edit/") &&
            !pathname.startsWith("/watches/delete/") &&
            !detailId &&
            pathname !== "/error" && <ErrorPage />}
          {(pathname.startsWith("/watches/edit/") && editId === null) && <ErrorPage message="A valid watch ID is required to edit a product." />}
          {(pathname.startsWith("/watches/delete/") && deleteId === null) && <ErrorPage message="A valid watch ID is required to delete a product." />}
        </ThemeSurface>
      </ThemeProvider>
    </StoreProvider>
  );
}
