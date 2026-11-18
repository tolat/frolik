import { useDispatch, useSelector } from "react-redux";
import { popupActions } from "../../store/popup-slice";
import Drawer from "./Drawer";

// A popup with custom content (Outing Members, Send to a friend…), shown in
// a bottom drawer. Open with popupActions.showPopup(selector).
const EmptyPopup = (props) => {
  const dispatch = useDispatch();
  const open = useSelector((state) => state.popup.selector === props.selector);
  return (
    <Drawer
      open={open}
      onClose={() => dispatch(popupActions.hidePopup())}
      label={props.label}
    >
      {props.children}
    </Drawer>
  );
};

export default EmptyPopup;
