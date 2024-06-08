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
    useEffect(() => {
        const interval = setInterval(() => {
            const currentTime = moment().tz("Asia/Seoul"); // 현재 시간을 서버 시간대로 설정

            alarms.forEach((alarm) => {
                const { day, hour, minute } = alarm;
                const alarmTime = moment()
                    .day(parseInt(day, 10)) // 알람의 요일 설정
                    .hour(parseInt(hour, 10)) // 알람의 시간 설정
                    .minute(parseInt(minute, 10)) // 알람의 분 설정
                    .tz("Asia/Seoul"); // 알람의 시간대 설정

                if (currentTime.isSame(alarmTime, "minute")) {
                    // 현재 시간과 알람 시간이 분 단위로 일치하는지 확인
                    alert("배출 시간이 되었습니다!");
                    clearInterval(interval); // 한 번 알림을 띄우면 interval 정지
                }
            });
        }, 1000); // 1분마다 확인

        return () => clearInterval(interval);
    }, [alarms]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAlarmTime((prevState) => ({
            ...prevState,
            [name]: value.toString(), // 숫자를 문자열로 변환
        }));
    };

    const handleAddAlarm = async () => {
        const userEmail = localStorage.getItem("userEmail");
        if (!userEmail) {
            alert("로그인이 필요합니다.");
            return;
        }

        // 현재 알람 개수가 4개를 초과하는지 확인
        if (alarms.length >= 4) {
            alert("알람은 최대 4개까지만 등록할 수 있습니다.");
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:3001/add-alarm",
                {
                    userEmail,
                    day: alarmTime.day,
                    hour: alarmTime.hour.padStart(2, "0"),
                    minute: alarmTime.minute.padStart(2, "0"),
                }
            );

            if (response.status === 200) {
                const newAlarm = {
                    day: alarmTime.day,
                    hour: alarmTime.hour.padStart(2, "0"),
                    minute: alarmTime.minute.padStart(2, "0"),
                };
                setAlarms([...alarms, newAlarm]);
                setAlarmTime({ day: "", hour: "", minute: "" }); // 알람 추가 후 입력 폼 초기화
            }
        } catch (error) {
            console.error("Error adding alarm:", error);
            alert("알람 추가 중 오류가 발생했습니다.");
        }
    };

    const handleRemoveAlarm = async (index) => {
        const userEmail = localStorage.getItem("userEmail");
        const alarm = alarms[index];

        try {
            const response = await axios.post(
                "http://localhost:3001/remove-alarm",
                {
                    userEmail,
                    day: alarm.day,
                    hour: alarm.hour,
                    minute: alarm.minute,
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
                {alarms.slice(0, 4).map((alarm, index) => (
                    <div key={index} style={alarmItem}>
                        {daysOfWeek[parseInt(alarm.day, 10)]}{" "}
                        {alarm.hour ? alarm.hour.padStart(2, "0") : ""}:
                        {alarm.minute ? alarm.minute.padStart(2, "0") : ""}
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
