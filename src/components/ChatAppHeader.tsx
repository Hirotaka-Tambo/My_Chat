import{Box,Paper,Typography,} from '@mui/material';

export const ChatAppHeader = () =>{

    return(
    <Paper elevation={3}
    sx={{borderRadius: {xs:0, sm:4},
    overflow: 'hidden',
    mb: {xs: 2, searchm: 3},

    }}
    >
    <Box sx ={{
        //background: colors.gradient,
        color: 'white',
        textAlign: 'center', 
        p:{xs:2, sm:3}
    }}
    >
        
        <Typography variant="h3" component="h1" gutterBottom
        sx={{fontSize:{xs: '1.5rem', sm:'2rem', md:'3rem'},
        mb:1,}}
        >
        💬My Chat App
        </Typography>
        <Typography variant="subtitle1" sx ={{fontsize:{xs: '0.9rem', md:'1rem'}}} >
        今の気持ちをシェアしよう!!
        </Typography>
    </Box>
    </Paper>

    )
}