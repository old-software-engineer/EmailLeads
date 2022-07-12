import { Button} from '@mui/material'

const ResponseButton = ({ text, onClick }) => {
    return (
        <div style={{display: "flex", width: "25%", justifyContent: "center"}}>
            <Button
                variant='contained'
                onClick={() => onClick()}
                style={{
                    margin: "10px",
                    borderRadius: "20px",
                    backgroundColor: "black",
                    width: "200px"
                }}
            >
                {text}
            </Button>
        </div>
    );
}

export default ResponseButton;