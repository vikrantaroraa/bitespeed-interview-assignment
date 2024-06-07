/* eslint-disable react/prop-types */
import styles from "./index.module.css";
import messageIcon from "../../assets/images/message-circle.svg";

const Sidebar = ({
  isANodeSelected,
  selectedNodeLabel,
  setSelectedNodeLabel,
  updateSelectedNodeLabel,
}) => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  const callSubmitFormOnEnter = (e) => {
    if (e.key === "Enter") {
      document.getElementById("update-node-form").requestSubmit();
    }
  };

  const submitForm = (e) => {
    e.preventDefault();
    setSelectedNodeLabel("");
    updateSelectedNodeLabel();
  };

  return (
    <aside className={styles["sidebar"]}>
      {!isANodeSelected ? (
        <>
          <div>Note:- You can drag these nodes to the pane on the right.</div>
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
        </>
      ) : (
        <>
          <div className={styles["message-heading"]}>Message</div>
          <hr />
          <form onSubmit={(e) => submitForm(e)} id="update-node-form">
            <textarea
              value={selectedNodeLabel}
              onChange={(e) => setSelectedNodeLabel(e.target.value)}
              onKeyDown={(e) => callSubmitFormOnEnter(e)}
            />
          </form>
          <hr />
        </>
      )}
    </aside>
  );
};

export default Sidebar;