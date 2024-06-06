import React from "react";
import styles from "./index.module.css";
import messageIcon from "../../assets/images/message-circle.svg";

const Sidebar = () => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside className={styles["sidebar"]}>
      <div className={styles["description"]}>
        Note:- You can drag these nodes to the pane on the right.
      </div>
      <hr />
      <div
        className={styles["message-node"]}
        onDragStart={(event) => onDragStart(event, "messageNode")}
        draggable
      >
        <div className={styles["image-container"]}>
          <img src={messageIcon} alt="whatsapp-icon" />
        </div>
        <span>Message Node</span>
      </div>
    </aside>
  );
};

export default Sidebar;
