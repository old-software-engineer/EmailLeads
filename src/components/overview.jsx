import { Box } from '@mui/system'
import axios from 'axios'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import Header from './Header'

function Overview() {
    const navigate = useNavigate();

    const saveLeads = async () => {
        const leads = await axios.get("https://zopto-challange.s3.amazonaws.com/leads.json")
        localStorage.setItem("leads", JSON.stringify(leads.data))
        sessionStorage.removeItem("userDetail")
        navigate("/")
    }

    const backwardNavigator = () => {
        navigate("/lead")
    }

    return(
        <Box>
            <Header first="RESET APPLICATION" second="BACK" resetApplication={saveLeads} backwardNavigator={backwardNavigator} />
            Helo
        </Box>
    )
}

export default Overview