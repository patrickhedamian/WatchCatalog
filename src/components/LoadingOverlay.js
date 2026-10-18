import styles from "./LoadingOverlay.module.css";

export default function LoadingOverlay({ message }) {
  return (
    <main className={styles.loadingOverlay} role="status">
      <div className={styles.loadingIndicator}>
        <i className="fas fa-spinner fa-spin" aria-hidden="true" />
        <span>{message}</span>
      </div>
    </main>
  );
}
