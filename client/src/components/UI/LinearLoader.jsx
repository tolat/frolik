import React from "react";
import styles from "./styles/LinearLoader.module.scss";
import { useSelector } from "react-redux";

const LinearLoader = () => {
  const isConnecting = useSelector((state) => state.socket.isConnecting);
  const loaderStyle = { opacity: isConnecting ? 1 : 0 };
  return (
    <div style={loaderStyle} className={styles.linearLoaderContainer}>
      <div className={styles.linearLoader}></div>
    </div>
  );
};

export default LinearLoader;
