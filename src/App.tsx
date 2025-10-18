import { useState, type ChangeEvent, type FormEvent } from 'react';
import type { Message, Colors } from './types';
import { Typography, Box, Container, Card, CardContent, 
        Paper, TextField, Stack, Button, useTheme } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import './App.css'

// 大文字である理由は、これが定数であることを宣言するため
const MAX_MESSAGE_LENGTH = 500;

function App() {

  const [text, setText] = useState<string>('');
  // リストのため、配列として所持する
  const [messages, setMessages] = useState<Message[]>([]);

  const validateMessage = (text: string): string=>{
    if(!text.trim()){
      return "内容を入力してください";
    }

    if(text.length > MAX_MESSAGE_LENGTH){
      return `${MAX_MESSAGE_LENGTH}文字以内で入力してください`;
    }

    return 'OK';
  };

  const handleTextChange = (e:ChangeEvent<HTMLInputElement>) =>{
    setText(e.target.value);
  }

  const handlePost = (e: FormEvent<HTMLFormElement>) =>{
    e.preventDefault();
    const errorMessage = validateMessage(text);
    if(errorMessage){
      alert(errorMessage);
      return;
    }

    const newMessage: Message={
      id: Date.now(),
      text:text,
      date:new Date().toLocaleString(),
    };

    setMessages([...messages,newMessage]);
    setText('');

  };

  const theme = useTheme();
  const colors: Colors = {
    primary: theme.palette.primary.main,
    surface: theme.palette.background.paper,
    gradient: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  }; 

  return (
    <Box sx={{minHeight: '100vh', p:{xs: 2,sm: 3}}}>
    <Container maxWidth='md' 
    sx={{
      maxWidth:{xs:'100%', sm: '720px'},
      px: {xs:0, sm: 3}
      }}
    >
      {/* ヘッダー部分*/}
      <Paper elevation={3}
      sx={{borderRadius: {xs:0, sm:4},
      overflow: 'hidden',
      mb: {xs: 2, searchm: 3},

      }}
      >
      <Box sx ={{
        background: colors.gradient,
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
          今の気持ちをシェアしよう
        </Typography>
      </Box>
      </Paper>

      {/*入力部分*/}

      <Paper elevation={2} sx={{borderRadius:{xs: 2,sm: 3},
            p:{xs: 2, sm: 3}, mb:{xs: 2,sm: 3},
            background: colors.surface,
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(59,130,246, 0.1)',
            }}>
        <form onSubmit={handlePost}>
          <Stack spacing={{xs: 2, sm: 3}}>
            <TextField 
              fullWidth 
              placeholder="What is happening?"
              variant= "outlined"
              multiline
              rows={4}
              value={text}
              onChange={handleTextChange}
              sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    '&:hover fieldset': {
                      borderColor: colors.primary,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: colors.primary,
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: colors.primary,
                  },
                }}
            />
            <Button
            type="submit"
            variant="contained"
            endIcon = {<SendIcon/>}
            disabled= {!text.trim()}
            >
              送信
            </Button>
          </Stack>
        </form>
      </Paper>
      
      <Card sx={{minHeight: '500px'}}>
        <CardContent>
            <Typography variant="h6" gutterBottom>
              チャットエリア(準備中)
            </Typography>

          <Paper
          sx={{
            p:3, textAlign:'center', backgroundColor: 'grey.50'
          }}>
            <Typography color="text.secondary">
              メッセージがここに表示されます
            </Typography>
          </Paper>
        </CardContent>
      </Card>
    </Container>
    </Box>
  )
}

export default App;
