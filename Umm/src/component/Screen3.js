import React, { useState } from "react";

const screen = {
    display: "flex",
    justifyContent: "space-between",
};

const mapContainer = {
    width: "50%",
    border: "1px solid black",
    display: "flex",
    flexDirection: "column",
};

const locateContent = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    margin: "2%",
};

const locateBar = {
    border: "1px solid black",
    borderRadius: "5px",
    width: "80%",
    boxSizing: "content-box",
    margin: "2%",
};

const mapContent = {
    width: "90%",
    height: "90%",
    border: "5px solid rgb(30, 187, 72)",
    margin: "2%",
    borderRadius: "5px",
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

const rectangleList = {
    display: "flex",
    flexDirection: "column",
};

const rectangleItem = {
    display: "flex",
    // justifyContent: 'center',
    alignItems: "center",
    marginRight: "10px",
    marginBottom: "10px",
    border: "1px solid black",
    marginLeft: "5%",
    height: "40%",
};

const rectangle = {
    marginRight: "10px",
};

const removeButton = {
    padding: "5px 10px",
    border: "none",
    backgroundColor: "gray",
    color: "white",
    cursor: "pointer",
};

const alarmContent = {
    display: "flex",
    flexDirection: "column",
    width: "50%",
};

const pstyle = {
    fontWeight: "bolder",
    margin: "25%",
    marginLeft: "50%",
    width: "40vh",
};

const settingTime = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
};

function Screen3() {
    const [rectangles, setRectangles] = useState([]);
    const [alarmTime, setAlarmTime] = useState({
        month: "",
        day: "",
        hour: "",
        minute: "",
    });

    const handleAddRectangle = () => {
        const { month, day, hour, minute } = alarmTime;
        if (month !== "" && day !== "" && hour !== "" && minute !== "") {
            const formattedTime = `${month}/${day} ${hour}:${minute}`;
            setRectangles([
                ...rectangles,
                { id: rectangles.length + 1, time: formattedTime },
            ]);
            setAlarmTime({ month: "", day: "", hour: "", minute: "" }); // Reset alarmTime after adding to the list
        } else {
            alert("알람을 설정하기 위해 모든 칸을 입력해주세요.");
        }
    };

    const handleRemoveRectangle = (id) => {
        const updatedRectangles = rectangles.filter(
            (rectangle) => rectangle.id !== id
        );
        setRectangles(updatedRectangles);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAlarmTime({ ...alarmTime, [name]: value });
    };

    return (
        <div className="screen" style={screen}>
            <div className="map-container" style={mapContainer}>
                <div>
                    <label style={locateContent}>
                        내위치:{" "}
                        <div style={locateBar}>
                            <p>인천광역시 서구 검단동</p>
                        </div>
                    </label>
                </div>
                <div style={mapContent}>
                    <label>
                        배출 요일:<p></p>
                    </label>
                    <label>
                        미수거일:<p></p>
                    </label>
                    <label>
                        배출 장소:<p></p>
                    </label>
                    <label>
                        배출 방법:<p></p>
                    </label>
                    <label>
                        배출 시간:<p></p>
                    </label>
                </div>
            </div>

            <div style={alarmContent}>
                <div style={settingTime}>
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
                    <button style={addButton} onClick={handleAddRectangle}>
                        +
                    </button>
                    <p>
                        <strong>알람추가</strong>
                    </p>
                </div>
                <div style={rectangleList}>
                    {rectangles.map((rectangle) => (
                        <div key={rectangle.id} style={rectangleItem}>
                            <div style={rectangle}>
                                <p style={pstyle}>{rectangle.time}</p>
                            </div>
                            <button
                                style={removeButton}
                                onClick={() =>
                                    handleRemoveRectangle(rectangle.id)
                                }
                            >
                                -
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Screen3;
