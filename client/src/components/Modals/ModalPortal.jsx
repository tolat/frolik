import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const ModalPortal = (props) => {
  const [domReady, setDomReady] = useState(false);

  useEffect(() => {
    setDomReady(true);
  }, []);

  return domReady
    ? createPortal(props.children, document.getElementById("modal-container"))
    : null;
};

export default ModalPortal
