import { useSelector } from "react-redux";

const { useState, useEffect } = require("react");
const { createPortal } = require("react-dom");

const ModalHeaderPortal = (props) => {
  const modalState = useSelector((state) => state.modal);
  const [domReady, setDomReady] = useState(false);
  const content =
    modalState.selector === props.selector ? props.children : null;

  useEffect(() => {
    setDomReady(true);
  }, []);

  return domReady
    ? createPortal(content, document.getElementById("slide-in-modal-header"))
    : null;
};

export default ModalHeaderPortal;
