import { useEffect, useRef, useState } from "react";
import "./chat.css";
import EmojiPicker from "emoji-picker-react";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { useChatStore } from "../../lib/chatStore";
import { db } from "../../lib/firebase";
import { useUserStore } from "../../lib/userStore";

const Chat = () => {
  const [chat, setChat] = useState(null);
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const { currentUser } = useUserStore();
  const { chatId } = useChatStore();
  const endRef = useRef(null);

  useEffect(() => {
    const scrollToBottom = () => {
      endRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    scrollToBottom();
  }, [chat]);

  useEffect(() => {
    if (!chatId) return;

    const docRef = doc(db, "chats", chatId);
    const unSub = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setChat(docSnap.data());
        } else {
          console.log("No such document!");
        }
      },
      (error) => {
        console.error("Error fetching document: ", error);
      }
    );

    return () => unSub();
  }, [chatId]);

  const handleEmoji = (e) => {
    setText((prev) => prev + e.emoji);
    setOpen(false);
  };
  const handleSend = async () => {
    if (text === "") return;
    try {
      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser.id,
          text,
          createdAt: new Date(),
        }),
      });

      const userChatsRef = doc(db, "userChats", currentUser.id);
      const userChatsSnapshot = await getDoc(userChatsRef);

      if (userChatsSnapshot.exists()) {
        const userChatsData = userChatsSnapshot.data();

        const chatIndex = userChatsData.chats.findIndex(
          (c) => c.chatId === chatId
        );

        userChatsData[chatIndex].lastMessage = text;
        userChatsData[chatIndex].isSeen = true;
        userChatsData[chatIndex].updatedAt = Date.now();

        await updateDoc(userChatsRef, {
          chats: userChatsData.chats,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="chat">
      <div className="top">
        <div className="user">
          <img src="./avatar.png" alt="" />
          <div className="texts">
            <span>Abhijeet</span>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
          </div>
        </div>
        <div className="icons">
          <img src="./phone.png" alt="" />
          <img src="./video.png" alt="" />
          <img src="./info.png" alt="" />
        </div>
      </div>
      <div className="center">
        {chat ? (
          chat.messages.map((message, index) => (
            <div className={`message ${message.own ? "own" : ""}`} key={index}>
              {!message.own && <img src="./avatar.png" alt="" />}
              <div className="texts">
                {message.image && <img src={message.image} alt="" />}
                <p>{message.text}</p>
                <span>{message.timestamp}</span>
              </div>
            </div>
          ))
        ) : (
          <p>Loading messages...</p>
        )}
        <div ref={endRef}></div>
      </div>
      <div className="bottom">
        <div className="icons">
          <img src="./img.png" alt="" />
          <img src="./camera.png" alt="" />
          <img src="./mic.png" alt="" />
        </div>
        <input
          type="text"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="emoji">
          <img
            src="./emoji.png"
            alt=""
            onClick={() => setOpen((prev) => !prev)}
          />
          {open && (
            <div className="picker">
              <EmojiPicker onEmojiClick={handleEmoji} />
            </div>
          )}
        </div>
        <button className="sendButton" onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
