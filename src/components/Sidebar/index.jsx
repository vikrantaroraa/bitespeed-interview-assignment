/* eslint-disable react/prop-types */
import styles from "./index.module.css";
import messageIcon from "../../assets/images/message-circle.svg";
import arrowLeftIcon from "../../assets/images/arrow-left.svg";

const Sidebar = ({
  isANodeSelected,
  selectedNodeLabel,
  setSelectedNodeLabel,
  updateSelectedNodeLabel,
  setIsANodeSelected,
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
          <div>Note:- You can drag these nodes to the pane on the left.</div>
          <div>
            Note:- Initial message shown in the node is the id of the newly
            created node.
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
        </>
      ) : (
        <>
          <div className={styles["message-heading-and-back-icon"]}>
            <div
              className={styles["back-icon"]}
              onClick={() => setIsANodeSelected(false)}
            >
              <div className={styles["image-container"]}>
                <img src={arrowLeftIcon} alt="whatsapp-icon" />
              </div>
            </div>
            <span className={styles["message-heading"]}>Message</span>
          </div>
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
