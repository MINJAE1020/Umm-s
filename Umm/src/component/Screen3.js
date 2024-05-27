import React, { useState } from "react";

const screen = {
    display: "flex",
    justifyContent: "space-between",
};

const alarmContent = {
    display: "flex",
    flexDirection: "column",
    width: "50%",
};

const inputStyle = {
    margin: "5px",
    width: "70px",
};

const addButton = {
    cursor: "pointer",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    padding: "8px 16px",
};

const addButtonContainer = {
    display: "flex",
    marginRight: "0px",
    justifyContent: "center",
    alignItems: "center",
};

const alarmList = {
    display: "flex",
    flexDirection: "column",
};

const alarmItem = {
    display: "flex",
    alignItems: "center",
    marginBottom: "10px",
};

const removeButton = {
    padding: "5px 10px",
    border: "none",
    backgroundColor: "gray",
    color: "white",
    cursor: "pointer",
};

const Screen3 = () => {
    const [alarms, setAlarms] = useState([]);
    const [alarmTime, setAlarmTime] = useState({
        month: "",
        day: "",
        hour: "",
        minute: "",
    });

    const handleAddAlarm = () => {
        if (alarms.length >= 6) {
            alert("알람은 최대 6개만 등록 가능.");
            return;
        }

        const { month, day, hour, minute } = alarmTime;
        if (month !== "" && day !== "" && hour !== "" && minute !== "") {
            const formattedTime = `${month}/${day} ${hour}:${minute}`;
            const newAlarm = {
                id: Date.now(), // Using timestamp as ID
                time: formattedTime,
            };
            setAlarms((prevAlarms) => [...prevAlarms, newAlarm]);
            setAlarmTime({ month: "", day: "", hour: "", minute: "" });
        } else {
            alert("Please fill in all fields to set the alarm.");
        }
    };

    const handleRemoveAlarm = (id) => {
        const updatedAlarms = alarms.filter((alarm) => alarm.id !== id);
        setAlarms(updatedAlarms);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAlarmTime({ ...alarmTime, [name]: value });
    };

    return (
        <div className="screen" style={screen}>
            <div style={alarmContent}>
                <div>
                    <input
                        style={inputStyle}
                        type="text"
                        name="month"
                        value={alarmTime.month}
                        onChange={handleInputChange}
                        placeholder="Month"
                    />
                    /
                    <input
                        style={inputStyle}
                        type="text"
                        name="day"
                        value={alarmTime.day}
                        onChange={handleInputChange}
                        placeholder="Day"
                    />
                    <input
                        style={inputStyle}
                        type="text"
                        name="hour"
                        value={alarmTime.hour}
                        onChange={handleInputChange}
                        placeholder="Hour"
                    />
                    :
                    <input
                        style={inputStyle}
                        type="text"
                        name="minute"
                        value={alarmTime.minute}
                        onChange={handleInputChange}
                        placeholder="Minute"
                    />
                </div>
                <div style={addButtonContainer}>
                    <button style={addButton} onClick={handleAddAlarm}>
                        +
                    </button>
                    <p>
                        <strong>Add Alarm</strong>
                    </p>
                </div>
                <div style={alarmList}>
                    {alarms.map((alarm) => (
                        <div key={alarm.id} style={alarmItem}>
                            <p>{alarm.time}</p>
                            <button
                                style={removeButton}
                                onClick={() => handleRemoveAlarm(alarm.id)}
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Screen3;
