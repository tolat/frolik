import NotificationsModal from "../Notifications/NotificationsModal";
import { pageRouteLoader } from "../../utils/utils";
import { fetchAuth } from "../../store/auth-actions";

// Alerts is a normal page (like Profile/Chat) so it gets the page fade and an
// active nav icon, instead of opening as a slide-in modal.
const Alerts = () => <NotificationsModal asPage />;

export default Alerts;

export const alertsLoader = async () => {
  const redirect = await pageRouteLoader("/alerts");
  if (redirect) {
    return redirect;
  }

  // Refresh notifications in the background
  fetchAuth();

  return null;
};
