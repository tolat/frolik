import Talk from "talkjs";
import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import styles from "./styles/Chat.module.scss";
import FriendCard from "../UI/FriendCard";
import { pageRouteLoader } from "../../utils/utils";

const Chat = (props) => {
  const chatboxEl = useRef();
  const user = useSelector((state) => state.auth.user);
  const [talkLoaded, markTalkLoaded] = useState(false);

  useEffect(() => {
    Talk.ready.then(() => markTalkLoaded(true));

    if (talkLoaded) {
      const currentUser = new Talk.User({
        id: "1",
        name: "Henry Mill",
        email: "henrymill@example.com",
        photoUrl: "henry.jpeg",
        welcomeMessage: "Hello!",
        role: "default",
      });

      const otherUser = new Talk.User({
        id: "2",
        name: "Jessica Wells",
        email: "jessicawells@example.com",
        photoUrl: "jessica.jpeg",
        welcomeMessage: "Hello!",
        role: "default",
      });

      const session = new Talk.Session({
        appId: "t7UolSN5",
        me: currentUser,
      });

      const conversationId = Talk.oneOnOneId(currentUser, otherUser);
      const conversation = session.getOrCreateConversation(conversationId);
      conversation.setParticipant(currentUser);
      conversation.setParticipant(otherUser);
      if (user) {
        const chatbox = session.createChatbox();
        chatbox.select(conversation);
        chatbox.mount(chatboxEl.current);
      }
      return () => session.destroy();
    }
  }, [user, talkLoaded]);

  return (
    <div>
      {user.friends.map((u) => (
        <FriendCard key={Math.random()} user={u} />
      ))}
      <div className={styles.container} ref={chatboxEl} />;
    </div>
  );
};

export default Chat;

export const chatLoader = async () => {
  const redirect = await pageRouteLoader();
  if (redirect) {
    return redirect;
  }

  return null;
};
