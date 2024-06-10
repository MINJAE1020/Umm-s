import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, TextField, Button, Typography, Box } from "@mui/material";

function Screen5() {
    const [email, setEmail] = useState("");
    const [PW, setPW] = useState("");
    const [userLocation, setUserLocation] = useState("");
    const [myTool, setMyTool] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchUserInfo = async () => {
            const userEmail = localStorage.getItem("userEmail");
            if (!userEmail) {
                alert("로그인이 필요합니다.");
                return;
            }

            try {
                const response = await axios.get(
                    "http://localhost:3001/user-info",
                    {
                        params: { userEmail },
                    }
                );
                const userData = response.data;
                setEmail(userData.email);
                setUserLocation(userData.userLocation);
                setMyTool(userData.myTool);
            } catch (error) {
                setMessage("사용자 정보를 가져오는 중 오류가 발생했습니다.");
            }
        };

        fetchUserInfo();
    }, []);

    const handleUpdate = async () => {
        const userEmail = localStorage.getItem("userEmail");

        try {
            const response = await axios.post(
                "http://localhost:3001/update-user",
                {
                    email: userEmail,
                    PW,
                    userLocation,
                    myTool,
                }
            );
            setMessage(response.data.message);
            alert("사용자 정보가 성공적으로 변경되었습니다.");
        } catch (error) {
            setMessage("사용자 정보를 업데이트하는 중 오류가 발생했습니다.");
        }
    };

    return (
        <Container>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    mt: 5,
                }}
            >
                <Typography variant="h4">사용자 정보 변경</Typography>
                <Typography variant="h6">ID: {email}</Typography>
                <TextField
                    label="비밀번호"
                    variant="outlined"
                    margin="normal"
                    type="password"
                    value={PW}
                    onChange={(e) => setPW(e.target.value)}
                    fullWidth
                    sx={{ width: 700 }}
                />
                <TextField
                    label="사용자 위치"
                    variant="outlined"
                    margin="normal"
                    value={userLocation}
                    onChange={(e) => setUserLocation(e.target.value)}
                    fullWidth
                    sx={{ width: 700 }}
                />
                <TextField
                    label="나의 도구"
                    variant="outlined"
                    margin="normal"
                    value={myTool}
                    onChange={(e) => setMyTool(e.target.value)}
                    fullWidth
                    sx={{ width: 700 }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleUpdate}
                    sx={{ width: 400, mt: 4 }}
                >
                    변경
                </Button>
            </Box>
        </Container>
    );
}

export default Screen5;
