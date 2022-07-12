import { AppBar, Button, Grid, Toolbar, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
export default function Header({ first, second, resetApplication, backwardNavigator }) {
    const displayDesktop = () => {
        return <Toolbar>{femmecubatorLogo}</Toolbar>;
    };

    const femmecubatorLogo = (
        <Grid container spacing={2}>
            <Grid item xs={11}>
                <Button color="secondary" variant="contained" onClick={() => {
                   resetApplication()
                }}>{first}</Button>
            </Grid>
            <Grid item xs={1}>
                <Button color="secondary" variant="contained" onClick={() => {
                    backwardNavigator()
                    // sessionStorage.removeItem('userDetail')
                }}>{second}</Button>
            </Grid>
        </Grid>
    );

    return (
        <Box container="div">
            <AppBar>{displayDesktop()}</AppBar>
        </Box>
    );
}