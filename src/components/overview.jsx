import { ContactsOutlined } from '@mui/icons-material'
import { Box, Button, TextField } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from './Header'
import { useSearchParams } from 'react-router-dom';

function Overview() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const leadsData = JSON.parse(localStorage.getItem("leads"));
    const users = JSON.parse(localStorage.getItem('users'))
    const leadId = parseInt(searchParams.get('idea'));
    const lead = leadsData.filter( lead => lead?.id == leadId)[0]
    const totalPositive = users?.filter( user => user.positive.includes(leadId))?.length || 0;
    const totalNotLead = users?.filter( user => user.notLead.includes(leadId))?.length || 0;
    const totalNeutral = users?.filter( user => user.neutral.includes(leadId))?.length || 0;
        
    return(
        <div style={{padding: "25px"}}>
            <div style={{display: 'flex', padding: "15px 0px"}}>
                <div style={{display: 'flex', width: "33.33%"}}>
                    <Button style={{borderRadius: "20px", backgroundColor: "black", width: "200px"}} variant='contained' onClick={() => {  }} >
                        RESET APPLICATION
                    </Button>
                </div>
                <div style={{display: 'flex', width: "33.33%", justifyContent: "center"}}>
                    <h1 style={{margin: "0"}}>Overview Page</h1>
                </div>
                <div style={{display: 'flex', width: "33.33%", justifyContent: "right"}}>
                    <Button style={{borderRadius: "20px", backgroundColor: "black" }} variant='contained' onClick={() => { navigate(-1) }} >
                        BACK
                    </Button>
                </div>
            </div>
            <div style={{display: 'flex', width: "100%"}}>
                <p>Positive replies: {totalPositive}</p>
            </div>
            <div style={{display: 'flex', width: "100%"}}>
                <p>Neutral replies: {totalNeutral}</p>
            </div>
            <div style={{display: 'flex', width: "100%"}}>
                <p>Not a lead: {totalNotLead}</p>
            </div>
            <div style={{display: 'flex', width: "100%"}}>
                <textarea
                    style={{width: "100%"}}
                    rows="15"
                    placeholder="Subject, body, status"
                    multiline
                    disabled={true}
                    value={lead?.body}
                />
            </div>
        </div>
    )
}

export default Overview