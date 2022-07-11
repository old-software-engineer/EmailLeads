import { Box, Button, Card, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Overview from './overview';

function Lead() {
    const [loading, setLoading] = useState(true)
    const [time, setTime] = useState(0);
    const [leadNumber, setleadNumber] = useState(0);
    const [leads, setLeads] = useState([]);
    const [pendingLeads, setPendingleads] = useState([]);
    const [user, setUser] = useState();
    const [showOverView,  setShowOverView] = useState(false);
    const [getRatings,  setRatings] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        getDetail()


        const timer = setInterval(() => {
            setTime(prev => {
                if (prev === 120) {
                    clearInterval(timer)
                    setUser((user) => {
                        return { ...user, userLogin: false }
                    })
                }
                return prev + 1
            })
        }, 1000)

        return () => {
            clearInterval(timer)
        }
    }, [])

    const getDetail = async () => {
        const userDetail = await JSON.parse(atob(sessionStorage.getItem('userDetail')));
        console.log(localStorage.getItem("ratings"));
        const leads = await JSON.parse(localStorage.getItem("leads"))
        const filterLeads = leads.filter((lead) => {
            return lead.status === 'pending'
        })
        setPendingleads(filterLeads)
        userDetail && setUser(userDetail)
        leads && setLeads([...leads]);
        setLoading(false)
    }

    const handleClick = async (status, leadId) => {
        const userDetail = JSON.parse(atob(sessionStorage.getItem("userDetail")));
        // const ratingDetail = JSON.parse(localStorage.getItem("ratings"));
        const users = JSON.parse(localStorage.getItem("users"));

        const getRatings = [{
            user_id: userDetail.user,
            leads_id: leadId,
            rating_type: status
        }];

        const updatedUsers = users.map(presentUser => {
            let updatedUser = {...presentUser};
            if(presentUser?.id == user?.user) {
                updatedUser = status == 'Positive Reply'
                ? {...presentUser, positive: [...presentUser?.positive, leadId]}
                : status == 'Neutral Reply'
                    ? {...presentUser, neutral: [...presentUser?.neutral, leadId]}
                    : {...presentUser, notLead: [...presentUser?.notLead, leadId]}
            }
            return updatedUser; 
        })
        localStorage.setItem("users", JSON.stringify(updatedUsers));

        // setRatings([...ratingDetail]);
        console.log(getRatings);
        // localStorage.setItem("ratings", JSON.stringify([...getRatings]));

        if(pendingLeads.length === leadNumber) {
            setShowOverView(true)
        }

        const newState = leads.map((lead, id) => {
            if (leads[leadNumber]?.email_lead === lead.email_lead) {
                return { ...lead, status: status, user: user.user };
            }
            return lead
        })
        setLeads(newState)
        setleadNumber(prev => prev + 1)
        localStorage.setItem("leads", JSON.stringify([ ...leads]))
    }

    const SessionTimeOut = () => {
        return (
        <Box style={{display: "flex", justifyContent: "center", textAlign: "center", padding: "50px"}} >
            <Card style={{width: "500px"}} >
                <Typography style={{color: "grey", margin: "15px 0px"}} variant='h5'><b>Session Expired</b></Typography>
                <Typography style={{color: "grey", marginBottom: "10px"}} variant='subtitle'>Page Will Be refreshed because session has expired</Typography>
                <br/>
                <Button style={{margin: "15px 0px"}} variant='contained' onClick={() => {
                    navigate("/")
                    sessionStorage.removeItem("userDetail")
                }}>OK</Button>
            </Card>
        </Box>
        )
    }

    if (loading) {
        return <Typography>Loading...</Typography>
    }

    if(showOverView) {
        return <Overview />
    }

    if (!user?.userLogin) {
        return <SessionTimeOut />
    }

    return (
        <Box style={{padding: "50px"}} component="div">
            <Box style={{textAlign: "center"}}>
                <div style={{display: "flex"}}>
                    <div style={{display: "flex", width: "25%", justifyContent: "center"}}>
                        <Button variant='contained' onClick={() => { handleClick('Positive Reply', pendingLeads[leadNumber]?.id) }} style={{ margin: "10px", borderRadius: "20px", backgroundColor: "black", width: "200px" }}>
                            Positive Reply
                        </Button>
                    </div>
                    <div style={{display: "flex", width: "25%", justifyContent: "center"}}>
                        <Button style={{margin: "10px", borderRadius: "20px", backgroundColor: "black", width: "200px"}} variant='contained' onClick={() => { handleClick('Neutral Reply', pendingLeads[leadNumber]?.id) }} >
                            Neutral Reply
                        </Button>
                    </div>
                    <div style={{display: "flex", width: "25%", justifyContent: "center"}}>
                        <Button variant='contained' onClick={() => { handleClick('Not a lead', pendingLeads[leadNumber]?.id) }} style={{ margin: "10px", borderRadius: "20px", backgroundColor: "black", width: "200px" }}>
                            Not a lead
                        </Button>
                    </div>
                    <div style={{display: "flex", width: "25%", justifyContent: "center"}}>
                        <Button variant='contained' onClick={() => { navigate(`/overview/?idea=${leadNumber}`) }} style={{ margin: "10px", borderRadius: "20px", backgroundColor: "black", width: "200px" }}>
                            Overview
                        </Button>
                    </div>
                </div>
            </Box>
            <Typography style={{textAlign: "center"}} variant='h6'>Email</Typography>
            <TextField style={{width: "100%"}} disabled value={pendingLeads[leadNumber]?.email_lead} />
            <Typography variant='h6'>Body</Typography>
            <TextField style={{width: "100%"}} disabled value={pendingLeads[leadNumber]?.body} multiline />
        </Box>
    )
}

export default Lead