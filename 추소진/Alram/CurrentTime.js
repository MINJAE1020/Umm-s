import React, { useState } from 'react'

export default function CurrentTime() {

    const [timer, setTimer] = useState("0000년 00월 00일 00:00:00");
    const currentTimer = () => {
        const date = new Date();
        setTimer(date.toLocaleString())
      }

    const startTimer = () => {
        setInterval(currentTimer, 1000)
      }

      startTimer()

    return (
        <h1>{timer}</h1>
    );
}