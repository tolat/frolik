import { useDispatch } from "react-redux";
import { popupActions } from "../../store/popup-slice";
import Drawer from "./Drawer";

// Popup content (e.g. WarningPopup) shown in a bottom drawer. Tapping outside
// or dragging it down closes it, like Cancel.
const Popup = (props) => {
  const dispatch = useDispatch();
  return (
    <Drawer
      open={!!props.showPopup}
      onClose={() => dispatch(popupActions.hidePopup())}
      label={props.label}
    >
      {props.children}
    </Drawer>
  );
};

export default Popup;
