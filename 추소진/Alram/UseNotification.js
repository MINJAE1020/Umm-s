import React from "react";
import ReactDOM from "react-dom";

export default function UseNotification({ title, options }) {
  if (!("Notification" in window)) {
    return;
  }

  const fireNotif = () => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification(title, options);
        } else {
          return;
        }
      });
    } else {
      new Notification(title, options);
    }
  };

  return (
    <div className="App">
      <button onClick={fireNotif}>Push notification</button>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(
  <React.StrictMode>
    <UseNotification title="Test Notification" options={{ body: "Notification body test" }} />
  </React.StrictMode>,
  rootElement
);
