import React, { useState, useEffect } from "react";
import moment from "moment-timezone";
import "moment/locale/ko"; // 한글 locale 추가

const screen = {
    display: "flex",
};

const alarmContent = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "700px",
};

const selectBar = {
    display: "flex",
    justifyContent: "center",
    height: "45px", // 높이를 1.5배로 키움
};

const selectStyle = {
    margin: "5px",
    width: "100px",
};

const addButton = {
    cursor: "pointer",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    padding: "4px 8px",
    width: "150px", // 버튼 너비를 150px로 설정
};

const addButtonContainer = {
    display: "flex",
    marginRight: "0px",
    justifyContent: "center",
    alignItems: "center",
};

const alarmItem = {
    display: "flex",
    alignItems: "center",
    marginBottom: "20px",
    marginTop: "20px",
    height: "100px",
    width: "300px",
    border: "2px solid rgb(30, 187, 72)",
    paddingLeft: "8px", // 왼쪽 패딩 설정
    paddingRight: "8px", // 오른쪽 패딩 설정
    fontWeight: "bold", // 글씨를 굵게 설정
};

const removeButton = {
    padding: "2.5px 5px",
    border: "none",
    backgroundColor: "rgb(30, 187, 72)",
    color: "white",
    cursor: "pointer",
    width: "80px", // 버튼 너비를 80px로 설정
    float: "right", // 버튼을 오른쪽으로 정렬
    fontWeight: "bold", // 글씨를 굵게 설정
};

const rightScreen = {
    width: "400px", // 너비를 100%로 설정
    fontWeight: "bold", // 글꼴을 굵게 설정
    fontSize: "25px", // 글꼴 크기를 15px로 설정
    display: "flex", // 플렉스 디스플레이를 사용하여 가운데 정렬을 위한 설정
    justifyContent: "center", // 가로 정렬을 가운데로 설정
    alignItems: "center", // 세로 정렬을 가운데로 설정
};

const daysOfWeek = [
    "일요일",
    "월요일",
    "화요일",
    "수요일",
    "목요일",
    "금요일",
    "토요일",
];

const Screen3 = () => {
    const [alarms, setAlarms] = useState([]);
    const [alarmTime, setAlarmTime] = useState({
        day: "",
        hour: "",
        minute: "",
    });
    const [currentTime, setCurrentTime] = useState(moment().tz("Asia/Seoul"));
    const currentDateTime = currentTime.format("YYYY-MM-DD HH:mm:ss"); // 현재 시간을 가져옴
    moment.locale("ko"); // 한글 locale 설정
    const currentDayOfWeek = currentTime.format("dddd"); // 현재 요일을 가져옴
    const dateTimeWithDayOfWeek = `${currentDateTime}, ${currentDayOfWeek}`; // 시간과 요일을 결합

    useEffect(() => {
        const interval = setInterval(() => {
            const currentTime = new Date();

            alarms.forEach((alarm) => {
                const [day, time] = alarm.time.split(" ");
                const [hour, minute] = time.split(":");

                if (
                    currentTime.getDay() === parseInt(day, 10) &&
                    currentTime.getHours() === parseInt(hour, 10) &&
                    currentTime.getMinutes() === parseInt(minute, 10)
                ) {
                    // 여기서 알림을 실행하거나 원하는 동작을 트리거합니다.
                    console.log("Alarm triggered:", alarm.time);
                }
            });
        }, 1000); // 매 초마다 체크

        return () => clearInterval(interval);
    }, [alarms]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(moment().tz("Asia/Seoul"));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const handleAddAlarm = () => {
        if (alarms.length >= 4) {
            alert("알람은 최대 4개만 등록 가능.");
            return;
        }

        const { day, hour, minute } = alarmTime;
        if (day !== "" && hour !== "" && minute !== "") {
            const formattedTime = `${day} ${hour}:${minute}`;
            const newAlarm = {
                id: Date.now(), // 타임스탬프를 ID로 사용
                time: formattedTime,
            };
            setAlarms((prevAlarms) => [...prevAlarms, newAlarm]);
            setAlarmTime({ day: "", hour: "", minute: "" });
        } else {
            alert("모든 필드를 채워 알람을 설정해주세요.");
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

    const formatAlarmTime = (alarm) => {
        const [day, time] = alarm.time.split(" ");
        const [hour, minute] = time.split(":");
        return `${daysOfWeek[parseInt(day, 10)]} ${hour}시 ${minute}분`;
    };

    return (
        <div className="screen" style={screen}>
            <div className="rightScreen" style={rightScreen}>
                <div>
                    현재 시간: <br />
                    {dateTimeWithDayOfWeek}
                </div>
            </div>
            <div style={alarmContent}>
                <div className="select" style={selectBar}>
                    <select
                        style={selectStyle}
                        name="day"
                        value={alarmTime.day}
                        onChange={handleInputChange}
                    >
                        <option value="">요일</option>
                        {[...Array(7).keys()].map((d) => (
                            <option key={d} value={d}>
                                {daysOfWeek[d]}
                            </option>
                        ))}
                    </select>
                    <select
                        style={selectStyle}
                        name="hour"
                        value={alarmTime.hour}
                        onChange={handleInputChange}
                    >
                        <option value="">시간</option>
                        {[...Array(24).keys()].map((h) => (
                            <option key={h} value={h}>
                                {h.toString().padStart(2, "0")}
                            </option>
                        ))}
                    </select>
                    :
                    <select
                        style={selectStyle}
                        name="minute"
                        value={alarmTime.minute}
                        onChange={handleInputChange}
                    >
                        <option value="">분</option>
                        {[...Array(60).keys()].map((m) => (
                            <option key={m} value={m}>
                                {m.toString().padStart(2, "0")}
                            </option>
                        ))}
                    </select>
                </div>
                <div style={addButtonContainer}>
                    <button style={addButton} onClick={handleAddAlarm}>
                        +
                    </button>
                    <p style={{ marginLeft: "10px" }}>
                        <strong>알람 추가</strong>
                    </p>
                </div>
                <div>
                    {alarms.map((alarm) => (
                        <div
                            key={alarm.id}
                            style={{
                                ...alarmItem,
                                justifyContent: "space-between",
                            }}
                        >
                            <p>{formatAlarmTime(alarm)}</p>
                            <button
                                style={removeButton}
                                onClick={() => handleRemoveAlarm(alarm.id)}
                            >
                                알람 삭제
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Screen3;
