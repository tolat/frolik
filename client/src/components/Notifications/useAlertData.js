import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { dataActions } from "../../store/data-slice";
import { initializeUserPhotos } from "../../store/data-actions";
import {
  fetchOuting,
  fetchPhotos,
  fetchProfilePic,
  fetchStrippedUser,
} from "../../utils/data-fetch";
import { hideModal, swapModal } from "../../store/modal-actions";
import { modalActions } from "../../store/modal-slice";
import { popupActions } from "../../store/popup-slice";
import { friendAccess } from "../../utils/friendAccess";

// The outing an alert is about (fetched once and cached, as before)
export const useAlertOuting = (outingID) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const inviteOutings = useSelector((state) => state.data.inviteOutings);
  const outing =
    inviteOutings?.find((o) => o._id === outingID) ||
    user?.outings?.find((o) => o?._id === outingID && o.activity?.name);
  useEffect(() => {
    if (!outingID || outing) return;
    fetchOuting(outingID, user, (fetched) => {
      if (!fetched) return;
      dispatch(dataActions.addInviteOuting(fetched));
      initializeUserPhotos({ ...user, outings: user.outings.concat([fetched]) });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outingID, !!outing]);
  return outing;
};

// The person an alert is about (stripped user, cached)
export const useAlertPerson = (userID, outing) => {
  const dispatch = useDispatch();
  const cachedUsers = useSelector((state) => state.data.cachedUsers);
  const person =
    outing?.users?.find((u) => u._id === userID) ||
    cachedUsers.find((u) => u._id === userID);
  useEffect(() => {
    if (!userID || person) return;
    fetchStrippedUser(userID, (stripped) => {
      if (!stripped) return;
      dispatch(dataActions.addCachedUser(stripped));
      fetchPhotos(stripped);
      fetchProfilePic(stripped._id);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userID, !!person]);
  useEffect(() => {
    if (person?._id) fetchProfilePic(person._id);
  }, [person?._id]);
  return person;
};

export const useCategoryColor = (outing) =>
  useSelector(
    (state) => state.auth.globals?.categoryColorMap?.[outing?.activity?.category]
  );

// Openers
export const useOpeners = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  return {
    // Same rule as everywhere else: friends, and people you've completed an
    // Outing with, unless one of you unfriended the other since
    canOpenProfile: (person) => !!person && friendAccess(user, person).canViewProfile,
    openOuting: async (outing) => {
      if (!outing) return;
      await hideModal();
      dispatch(modalActions.setActiveOuting(outing));
      dispatch(modalActions.setSelector("outing-modal"));
      dispatch(modalActions.showModal({ headerStyle: { backgroundColor: "white" } }));
    },
    openProfile: (person) => {
      if (!person) return;
      dispatch(popupActions.hidePopup());
      swapModal(() => {
        dispatch(modalActions.setActiveModalUser(person));
        dispatch(modalActions.setSelector("profile-viewer-modal"));
        dispatch(modalActions.showModal());
      });
    },
  };
};
