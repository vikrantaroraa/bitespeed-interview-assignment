/* eslint-disable react/prop-types */
import { Handle, Position } from "reactflow";
import styles from "./index.module.css";
import messageIcon from "../../assets/images/message-circle.svg";
import whatsappIcon from "../../assets/images/whatsapp-icon.svg";

// not using this anywhere as of now, might come handy later
const MessageNode = () => {
  return (
    <div className={styles["pipeline-node"]} draggable>
      <Handle
        type="target"
        position={Position.Left}
        className={styles["targetHandle"]}
      />
      <div className={styles["custom-node-header"]}>
        <div className={styles["icon-and-heading"]}>
          <div className={styles["image-container"]}>
            <img src={messageIcon} alt="message-icon" />
          </div>
          <span>
            <strong>Send Message</strong>
          </span>
        </div>
        <div className={styles["image-container"]}>
          <img src={whatsappIcon} alt="whatsapp-icon" />
        </div>
      </div>
      <div className={styles["custom-node__body"]}>
        <span>Message Node</span>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className={styles["sourceHandle"]}
      />
    </div>
  );
};

export default MessageNode;
