import React, { useState, useEffect } from "react";
import axios from "axios";
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
    width: "500px", // 너비를 100%로 설정
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
                    currentTime.getDay().toString() === day &&
                    currentTime.getHours().toString() === hour &&
                    currentTime.getMinutes().toString() === minute
                ) {
                    alert("배출 시간이 되었습니다!");
                    clearInterval(interval); // 한 번 알림을 띄우면 interval 정지
                }
            });
        }, 60000);

        return () => clearInterval(interval);
    }, [alarms]);

    useEffect(() => {
        const fetchAlarms = async () => {
            const userEmail = localStorage.getItem("userEmail");
            if (!userEmail) {
                alert("로그인이 필요합니다.");
                return;
            }

            try {
                const response = await axios.get(
                    "http://localhost:3001/alarms",
                    {
                        params: { userEmail },
                    }
                );
                setAlarms(response.data);
            } catch (error) {
                console.error("Error fetching alarms:", error);
            }
        };

        fetchAlarms();

        const interval = setInterval(() => {
            setCurrentTime(moment().tz("Asia/Seoul"));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAlarmTime((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleAddAlarm = async () => {
        const userEmail = localStorage.getItem("userEmail"); // 저장된 이메일 가져오기
        if (!userEmail) {
            alert("로그인이 필요합니다.");
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:3001/add-alarm",
                {
                    userEmail,
                    day: alarmTime.day,
                    hour: alarmTime.hour,
                    minute: alarmTime.minute,
                }
            );

            if (response.status === 200) {
                setAlarms([
                    ...alarms,
                    {
                        time: `${alarmTime.day} ${alarmTime.hour}:${alarmTime.minute}`,
                    },
                ]);
            }
        } catch (error) {
            console.error("Error adding alarm:", error);
            alert("알람 추가 중 오류가 발생했습니다.");
        }
    };

    const handleRemoveAlarm = async (index) => {
        const userEmail = localStorage.getItem("userEmail");
        const alarm = alarms[index];
        const [day, time] = alarm.time.split(" ");
        const [hour, minute] = time.split(":");

        try {
            const response = await axios.post(
                "http://localhost:3001/remove-alarm",
                {
                    userEmail,
                    day,
                    hour,
                    minute,
                }
            );

            if (response.status === 200) {
                const updatedAlarms = alarms.filter((_, i) => i !== index);
                setAlarms(updatedAlarms);
            }
        } catch (error) {
            console.error("Error removing alarm:", error);
            alert("알람 삭제 중 오류가 발생했습니다.");
        }
    };

    return (
        <div style={screen}>
            <div style={rightScreen}>{dateTimeWithDayOfWeek}</div>
            <div style={alarmContent}>
                <div style={selectBar}>
                    <select
                        name="day"
                        value={alarmTime.day}
                        onChange={handleChange}
                        style={selectStyle}
                    >
                        <option value="">요일</option>
                        {Array.from({ length: 7 }, (_, i) => (
                            <option key={i} value={i}>
                                {daysOfWeek[i]}
                            </option>
                        ))}
                    </select>
                    <select
                        name="hour"
                        value={alarmTime.hour}
                        onChange={handleChange}
                        style={selectStyle}
                    >
                        <option value="">시간</option>
                        {Array.from({ length: 24 }, (_, i) => (
                            <option key={i} value={i}>
                                {i.toString().padStart(2, "0")}
                            </option>
                        ))}
                    </select>
                    <select
                        name="minute"
                        value={alarmTime.minute}
                        onChange={handleChange}
                        style={selectStyle}
                    >
                        <option value="">분</option>
                        {Array.from({ length: 60 }, (_, i) => (
                            <option key={i} value={i}>
                                {i.toString().padStart(2, "0")}
                            </option>
                        ))}
                    </select>
                </div>
                <div style={addButtonContainer}>
                    <button onClick={handleAddAlarm} style={addButton}>
                        알람 추가
                    </button>
                </div>
                {alarms.map((alarm, index) => (
                    <div key={index} style={alarmItem}>
                        {daysOfWeek[parseInt(alarm.time?.split(" ")[0], 10)]}{" "}
                        {alarm.time?.split(" ")[1]}
                        <button
                            onClick={() => handleRemoveAlarm(index)}
                            style={removeButton}
                        >
                            알람 삭제
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Screen3;
