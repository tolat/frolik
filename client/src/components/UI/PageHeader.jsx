import styles from "./styles/PageHeader.module.scss";

// Large page title at the top of a main page (Outing, Social, Chats,
// Alerts), with an optional action on the right.
const PageHeader = ({ title, children }) => (
  <header className={styles.header}>
    <h1 className={styles.title}>{title}</h1>
    {children ? <div className={styles.actions}>{children}</div> : null}
  </header>
);

export default PageHeader;
