import { Button, Select, MenuItem, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import {useNavigate} from 'react-router-dom';
import axios from 'axios'

function Login({userLoading, leadLoading}) {
    const [user, setUser] = useState();
    const [ users, setUsers ] = useState([]);
    const [ loading, setLoading ] = useState(true)
    const navigate = useNavigate();

    const saveUsers = async () => {
        const fetchedUsers = localStorage.hasOwnProperty('users')
          ? JSON.parse(localStorage.getItem('users'))
          : (await axios.get("http://zopto-challange.s3.amazonaws.com/users.json"))?.data || [];
    
        setUsers(fetchedUsers)
        setLoading(false)
        if(!localStorage.hasOwnProperty('users')) {
          localStorage.setItem("users", JSON.stringify(
            fetchedUsers?.map((user, index)=>{
                return { ...user, id: index + 1, positive: [], neutral: [], notLead: []}
            })
          ))
        }
    }

    const saveLeads = async () => {
        const fetchedLeads = localStorage.hasOwnProperty('leads')
            ? JSON.parse(localStorage.getItem('leads'))
            : (await axios.get("https://zopto-challange.s3.amazonaws.com/leads.json"))?.data || [];

        if(!localStorage.hasOwnProperty('leads')) {
            localStorage.setItem("leads", JSON.stringify( fetchedLeads.map((lead,index) => { return{...lead, id:index+1} }) ))
        }
    }
    useEffect(() => {
        const userSession = sessionStorage.getItem("userDetail");
        if(userSession){
            const userInfo = JSON.parse(atob(userSession));
            const notExpired = (userInfo?.userExpiryTime > Date.now())

            if(notExpired)
            navigate('/lead');
        }
        else {
            saveUsers()
            saveLeads()
        }
    }, [])

    const handleChange = (e) =>  setUser(e.target.value) 
    const handleSubmit = () => {
        if(user){
            createSession(user)
            navigate("/lead");
        }
        else {
            alert('Please select user')
        }
    }

    const createSession = (userId) => {
        const userDetail ={
          userLogin: true,
          userLogInTime: Date.now(),
          userExpiryTime: Date.now() + 120*1000,
          id: user
        }
    
        const userSession = setInterval(() => {
          const userSession = sessionStorage.getItem("userDetail")
          if(!userSession){
            clearInterval(userSession)
          }
        else {
          const userInfo = JSON.parse(atob(userSession));
          const expired = !(userInfo?.userExpiryTime > Date.now())
          if(expired){
            clearInterval(userSession)
            sessionStorage.removeItem("userDetail")
            navigate("/session-expired")
          }
        }
        }, 1000)
        sessionStorage.setItem("userDetail", btoa(JSON.stringify(userDetail)))
    }    
console.log(users)
    return (
        !users.length
        ? <Typography>Loading Please Wait...</Typography>
        :   <div style={{display: "flex"}} >
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
                            users.length && users.map((user, id) => {
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