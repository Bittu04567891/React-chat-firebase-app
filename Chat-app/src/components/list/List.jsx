import ChatList from "./chatList/ChatList";
import "./list.css";
import Userinfo from "./userInfo/Userinfo";

export const List = () => {
  return (
    <div className="list">
      <Userinfo />
      <ChatList />
    </div>
  );
};
