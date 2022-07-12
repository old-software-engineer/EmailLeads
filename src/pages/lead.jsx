import { Box, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import ResponseButton from '../components/lead/responseButton';

function Lead({users, updateUsers, showOverview}) {
    const navigate = useNavigate();
    const [ activeLead, setActiveLead ] = useState({})
    const [ pendingLeads, setPendingLeads ] = useState([])
    const [user, setUser] = useState({})
    const [ leads, setLeads ] = useState([])

    useEffect(() => {
        const userSession = sessionStorage.getItem("userDetail");
        if(userSession){
            const allUsers = JSON.parse(localStorage.getItem('users'))
            const presentLeads = JSON.parse(localStorage.getItem('leads'))
            const userInfo = JSON.parse(atob(userSession));
            const notExpired = (userInfo?.userExpiryTime > Date.now())

            if((allUsers?.length > 0 || leads?.length > 0) && notExpired) {
                const fetchedUser = allUsers.filter( presentUser => presentUser?.id == userInfo?.id )[0] || {}

                setUser(fetchedUser)
                setLeads(presentLeads)
                const userAllLeadIds = [...fetchedUser?.positive, ...fetchedUser?.neutral, ...fetchedUser?.notLead];
                const currentPendingLeads = presentLeads.filter( lead => !userAllLeadIds.includes(lead?.id))
        
                setPendingLeads(currentPendingLeads)
                currentPendingLeads?.length && setActiveLead(currentPendingLeads[0])
            }
            else{
                sessionStorage.removeItem("userDetail")
                navigate("/session-expired")
            }
        }
        else {
            navigate('/session-expired')
        }
    }, [])

    const updateLeads = (user) => {
        const userAllLeadIds = [...user?.positive, ...user?.neutral, ...user?.notLead];
        const currentPendingLeads = leads.filter( lead => !userAllLeadIds.includes(lead?.id))

        setPendingLeads(currentPendingLeads)
        currentPendingLeads?.length && setActiveLead(currentPendingLeads[0])
    }

    const handleResponse = (response) => {
        const userAllLeadIds = [...user?.positive, ...user?.neutral, ...user?.notLead];

        if(!userAllLeadIds.includes(activeLead?.id))
        {
            const updatedUser = response == 'positive'
                ? {...user, positive: [...new Set([...user?.positive, activeLead?.id])]}
                : response == 'neutral'
                ? {...user, neutral: [...new Set([...user?.neutral, activeLead?.id])]}
                : {...user, notLead: [...new Set([...user?.notLead, activeLead?.id])]}

            setUser(updatedUser)
            updateLeads(updatedUser)

            updateUsers && updateUsers(updatedUser)
        }
    }

    return (
        <Box style={{padding: "50px"}} component="div">
            <Box style={{textAlign: "center"}}>
                <div style={{display: "flex"}}>
                    <ResponseButton onClick={() => handleResponse('positive')} text={'Positive Reply'}/>
                    <ResponseButton onClick={() => handleResponse('neutral')} text={'Neutral Reply'}/>
                    <ResponseButton onClick={() => handleResponse('notLead')} text={'Not a lead'}/>
                    <ResponseButton onClick={() => navigate(`/overview/?lead=${activeLead?.id}`)} text={'Overview'}/>
                </div>
            </Box>
            <Typography style={{textAlign: "center"}} variant='h6'>Email</Typography>
            <TextField style={{width: "100%"}} disabled value={activeLead?.email_lead} />
            <Typography variant='h6'>Body</Typography>
            <TextField style={{width: "100%"}} disabled value={activeLead?.body} multiline />
        </Box>
    )
}

export default Lead