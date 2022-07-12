import { useNavigate } from "react-router-dom"
import { Box, Button, Card, TextField, Typography } from '@mui/material'
import { useEffect } from "react";

const SessionTimeOut = () => {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate("/")
        sessionStorage.removeItem("userDetail")
    }

    useEffect(() => {
        const userSession = sessionStorage.getItem("userDetail");
        if(userSession){
            const userInfo = JSON.parse(atob(userSession));
            const notExpired = (userInfo?.userExpiryTime > Date.now())

            if(notExpired)
                navigate('/lead');
        }
    }, [])

    return (
        <Box style={{display: "flex", justifyContent: "center", textAlign: "center", padding: "50px"}} >
            <Card style={{width: "500px"}} >
                <Typography style={{color: "grey", margin: "15px 0px"}} variant='h5'><b>Session Expired</b></Typography>
                <Typography style={{color: "grey", marginBottom: "10px"}} variant='subtitle'>Page Will Be refreshed because session has expired</Typography>
                <br/>
                <Button style={{margin: "15px 0px"}} variant='contained' onClick={() => handleClick()}>OK</Button>
            </Card>
        </Box>
    )
}

export default SessionTimeOut;