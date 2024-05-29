import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import CurrentTime from "./CurrentTime";
import UseNotification from "./UseNotification";

export default function Alram() {
    const [time, setTime] = useState("");
    const [alramName, setAlramName] = useState("");

    // UseNotification should be called without directly passing localStorage values
    const fireNotif = UseNotification("알람", {
        body: "설정된 시간이 되었습니다.",
    });

    useEffect(() => {
        const savedTime = localStorage.getItem("notificationTime");
        const savedAlramName = localStorage.getItem("alramName");
        if (savedTime) {
            setTime(savedTime);
        }
        if (savedAlramName) {
            setAlramName(savedAlramName);
        }

        const interval = setInterval(() => {
            const currentTime = new Date();
            const notificationTime = new Date(
                localStorage.getItem("notificationTime")
            );

            if (
                notificationTime &&
                currentTime.getHours() === notificationTime.getHours() &&
                currentTime.getMinutes() === notificationTime.getMinutes()
            ) {
                fireNotif();
            }
        }, 1000); // Check every second

        return () => clearInterval(interval);
    }, [fireNotif]);

    const handleAlramNameChange = (e) => {
        setAlramName(e.target.value);
        localStorage.setItem("alramName", e.target.value);
    };

    const handleTimeChange = (e) => {
        setTime(e.target.value);
        localStorage.setItem("notificationTime", e.target.value);
    };

    const handleSaveTime = () => {
        alert(`${alramName} ${time} 알람 저장 성공`);
        localStorage.setItem("notificationTime", time);
        localStorage.setItem("alramName", alramName);
        console.log("Time after save:", time);
        console.log("Alram name after save:", alramName);
        console.log("time", localStorage.getItem("notificationTime"));
        console.log(
            "Alram name after save:",
            localStorage.getItem("alramName")
        );
    };

    return (
        <div>
            <CurrentTime />
            <input
                type="text"
                value={alramName}
                onChange={handleAlramNameChange}
                placeholder="알람 이름"
            />
            <input type="time" value={time} onChange={handleTimeChange} />
            <button onClick={handleSaveTime}>Save Time</button>
            <UseNotification />
        </div>
    );
}

const rootElement = document.getElementById("root");
ReactDOM.render(
    <React.StrictMode>
        <Alram />
    </React.StrictMode>,
    rootElement
);
