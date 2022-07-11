import { Button, TextField, Select, MenuItem } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import {useNavigate} from 'react-router-dom';


function Login() {
    const [user, setUser] = useState({});
    const [users, setUsers] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        saveUser()
        saveLeads()
        getUser()
    }, [])

    const saveUser = async () => {
        const users = await axios.get("http://zopto-challange.s3.amazonaws.com/users.json");
        localStorage.hasOwnProperty('users') || localStorage.setItem("users", JSON.stringify(
            users?.data?.map((user, index)=>{
                return { ...user, id: index, positive: [], neutral: [], notLead: []}
            })
        ))
    }

    const saveLeads = async () => {
        const leads = await axios.get("https://zopto-challange.s3.amazonaws.com/leads.json")
        localStorage.setItem("leads", JSON.stringify(
            leads?.data?.map((lead, index)=>{
                return { ...lead, id: index}
            })
        ))
    }

    const getUser = () => {
        const user = JSON.parse(localStorage.getItem('users'));
        setUsers([...user])
    }

    const handleChange = (e) => {
        setUser(e.target.value)
    }

    const handleSubmit = () => {
        const userDetail ={
            userLogin: true,
            userLogInTime: Date.now(),
            userExpiryTime: Date.now() + 120,
            user: user
        }

        sessionStorage.setItem("userDetail", btoa(JSON.stringify(userDetail)))
        navigate("/lead");
    }

    return (
        <div style={{display: "flex"}} >
            <div style={{display: "block", width: "33.33%"}} ></div>
            <div style={{display: "block", width: "33.33%", textAlign: "center"}} >
                <h1 style={{textAlign: "left"}}>User</h1>
                <Select
                    style={{width: "100%"}}
                    value={user}
                    label="user"
                    onChange={handleChange}
                >
                    {
                        users && users.map((user, id) => {
                            return (
                                <MenuItem key={id} value={user.id}>{user.name}</MenuItem>
                            )
                        })
                    }
                </Select>
                <br />
                <Button
                    style={{
                        marginTop: "10px", color: "white", backgroundColor: "black", width: "150px", borderRadius: "20px", padding: "10px"}}
                        disabled={!user}
                        onClick={() => handleSubmit()}
                        variant="contained"
                >
                    Login
                </Button>
            </div >
            <div style={{display: "block", width: "33.33%"}}></div>
        </div>
    )
}

export default Login;