import "./MessageBox.css";

interface MessageBoxProps {
  message: string;
  messageType: "warning" | "error" | "none";
}

function MessageBox({ message, messageType }: MessageBoxProps) {
  return (
    <div className={`msg-box ${messageType}`}>
      <h3>{message}</h3>
    </div>
  );
}

export default MessageBox;
