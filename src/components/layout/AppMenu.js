import { useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";

export default function AppMenu() {
  const { darkTheme, toggleTheme } = useContext(ThemeContext);

  return (
    <nav className="d-flex justify-content-center py-3 watch-menu" aria-label="Main navigation">
      <div className="container">
        <ul className="nav nav-pills gap-1 align-items-center justify-content-start">
          <li className="nav-item"><a className="nav-link" href="/">Home</a></li>
          <li className="nav-item"><a className="nav-link" href="/watches">Product List</a></li>
          <li>
            <input
              type="checkbox"
              role="switch"
              className="themeToggleCheckbox"
              autoComplete="off"
              id="themeToggle"
              checked={darkTheme}
              onChange={toggleTheme}
            />
            <label htmlFor="themeToggle" className="themeToggleCheckbox-label">
              <span className="visually-hidden">Dark theme</span>
              <i className="fas fa-moon" aria-hidden="true"></i>
              <i className="fas fa-sun" aria-hidden="true"></i>
              <span className="ball"></span>
            </label>
          </li>
        </ul>
      </div>
    </nav>
  );
}
