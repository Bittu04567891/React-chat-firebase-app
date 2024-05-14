import "./userinfo.css";

const Userinfo = () => {
  return (
    <div className="userInfo">
      <div className="user">
        <img src="./avatar.png" alt="" />
        <h2>Bittu Thakur</h2>
      </div>
      <div className="icons"></div>
      <img src="./more.png" alt="" />
      <img src="./video.png" alt="" />
      <img src="./edit.png" alt="" />
    </div>
  );
};

export default Userinfo;
