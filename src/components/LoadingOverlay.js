import styles from "./LoadingOverlay.module.css";

export default function LoadingOverlay({ message }) {
  return (
    <main id="main-content" className={styles.loadingOverlay} tabIndex="-1">
      <div className={styles.loadingIndicator}>
        <i className="fas fa-spinner fa-spin" aria-hidden="true" />
        <span role="status" aria-live="polite">{message}</span>
      </div>
    </main>
  );
}
