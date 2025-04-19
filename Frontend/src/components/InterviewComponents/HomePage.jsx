import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
function HomePage() {

    useEffect(() => {

        // console.log(typeof import.meta.env.VITE_BACKEND_URL)
        // console.log(typeof import.meta.env.VITE_SERVER_SECRET)
        const x = Number(import.meta.env.VITE_APP_ID)
        // console.log(x)
    }, [])

    const [roomCode, setRoomCode] = useState("")
    const navigate = useNavigate()

    const handleChange = (e) => {
        e.preventDefault()
        setRoomCode(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        navigate(`/room/${roomCode}`, { replace: true }); // if you don't want the user to go back to lobby

    }

    return (
        <div className='home-page'>
            <form>
                <div>
                    <label htmlFor="">Enter room code</label>
                    <input onChange={handleChange} value={roomCode} type="text" name="" placeholder='Enter room code' id="" />
                    <button onClick={handleSubmit} type="submit">Enter room</button>
                </div>
            </form>
        </div>
    )
}

export default HomePage
