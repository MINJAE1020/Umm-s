import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
// import "../App.css";

const textStyle = {
    fontWeight: "bold",
    marginBottom: "10px",
};

const Screen4 = () => {
    const [selectedCity, setSelectedCity] = useState("");
    const [cityData, setCityData] = useState([]);
    const [selectedWeight, setSelectedWeight] = useState(1);
    const [wasteRecords, setWasteRecords] = useState({});
    const [date, setDate] = useState(new Date());

    const handleSelectChange = async (event) => {
        const selected = event.target.value;
        setSelectedCity(selected);
        try {
            const response = await axios.get(
                `http://localhost:3001/average-waste?city=${encodeURIComponent(
                    selected
                )}`
            );
            if (Array.isArray(response.data)) {
                setCityData(response.data);
            } else {
                setCityData([]);
            }
        } catch (error) {
            console.error("Error fetching data:", error.message);
        }
    };

    const handleWeightChange = (event) => {
        setSelectedWeight(parseFloat(event.target.value));
    };

    const handleDateChange = (newDate) => {
        setDate(newDate);
        setWasteRecords({});
    };

    const saveWasteRecord = async (updatedRecords) => {
        try {
            const totalWaste = Object.values(updatedRecords).reduce(
                (acc, weight) => acc + weight,
                0
            );
            const records = Object.keys(updatedRecords).map((date) => ({
                date,
                weight: updatedRecords[date],
            }));
            await axios.post("http://localhost:3001/record-waste", {
                records,
                totalWaste,
            });
        } catch (error) {
            console.error("Error saving record:", error.message);
        }
    };

    const handleCheckboxChange = async (day) => {
        const dayKey = day.toISOString().split("T")[0];
        const updatedRecords = { ...wasteRecords };

        if (updatedRecords[dayKey]) {
            delete updatedRecords[dayKey];
        } else {
            updatedRecords[dayKey] = selectedWeight;
        }

        setWasteRecords(updatedRecords);
        await saveWasteRecord(updatedRecords);
    };

    useEffect(() => {
        const fetchUserWaste = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:3001/user-waste"
                );
                const records = response.data.reduce((acc, record) => {
                    acc[record.date] = record.weight;
                    return acc;
                }, {});
                setWasteRecords(records);
            } catch (error) {
                console.error("Error fetching user waste data:", error.message);
            }
        };
        fetchUserWaste();
    }, []);

    const calculateUserWaste = () => {
        const totalWaste = Object.values(wasteRecords).reduce(
            (acc, weight) => acc + weight,
            0
        );
        return [{ 지역: "사용자 개인배출량", 가구평균배출량: totalWaste }];
    };

    const userWaste = calculateUserWaste();

    const daysInMonth = new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        0
    ).getDate();
    const firstDayIndex = new Date(
        date.getFullYear(),
        date.getMonth(),
        1
    ).getDay();

    return (
        <div className="centered-container">
            <label style={textStyle}>
                사용자가 거주하고 있는 도시를 선택하세요:
                <select value={selectedCity} onChange={handleSelectChange}>
                    <option value="서울">서울</option>
                    <option value="부산">부산</option>
                    <option value="대구">대구</option>
                    <option value="인천">인천</option>
                    <option value="광주">광주</option>
                    <option value="대전">대전</option>
                    <option value="울산">울산</option>
                </select>
            </label>

            <div className="barchart-area">
                <BarChart
                    width={900}
                    height={200}
                    data={[...userWaste, ...cityData]}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="지역" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="가구평균배출량" fill="rgb(30, 187, 72)" />
                </BarChart>
            </div>

            <label style={textStyle}>
                배출량 선택:
                <select value={selectedWeight} onChange={handleWeightChange}>
                    <option value={1}>1L</option>
                    <option value={2}>2L</option>
                    <option value={4.5}>4.5L</option>
                    <option value={5}>5L</option>
                    <option value={7}>7L</option>
                    <option value={10}>10L</option>
                </select>
            </label>

            <div className="calendar-container">
                <div>
                    <Calendar value={date} onChange={handleDateChange} />
                </div>
                <div className="checkbox-grid">
                    {Array.from({ length: firstDayIndex }).map((_, i) => (
                        <div
                            key={`empty-${i}`}
                            className="checkbox-cell empty"
                        ></div>
                    ))}
                    {Array.from({ length: daysInMonth }, (_, i) => {
                        const day = new Date(
                            date.getFullYear(),
                            date.getMonth(),
                            i + 1
                        );
                        const dayKey = day.toISOString().split("T")[0];
                        return (
                            <div key={i} className="checkbox-cell">
                                <label>
                                    {`${i + 1}일`}
                                    <input
                                        type="checkbox"
                                        checked={!!wasteRecords[dayKey]}
                                        onChange={() =>
                                            handleCheckboxChange(day)
                                        }
                                    />
                                </label>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Screen4;
