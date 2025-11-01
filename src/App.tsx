import { useEffect, useState, useCallback, type ChangeEvent, type FormEvent } from 'react';
import { Typography, Box, Container, Card, CardContent, CardActions,
        Paper, TextField, Chip, Divider, Stack,Fab, Button, useTheme } from '@mui/material';
import {Send as SendIcon, Delete as DeleteIcon, Image as ImageIcon } from '@mui/icons-material';
import {v4 as uuidv4} from 'uuid';

import Dexie from 'dexie';
import './App.css'
import type { Message, Colors } from './types';

// 大文字である理由は、これが定数であることを宣言するため
const MAX_MESSAGE_LENGTH = 500;

// 画像ファイルの容量の制限
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 5MB

// 画像ファイル名の長さの制限
const MAX_FILENAME_LENGTH = 100;

// dbを作成
const db = new Dexie('ChatApp');
db.version(1).stores({
  messages: 'id, createdAt',
});

function App() {

  const [text, setText] = useState<string>('');
  // リストのため、配列として所持する
  const [messages, setMessages] = useState<Message[]>([]);
  const[isPosting, setIsposting] = useState<boolean>(false);
  const[image, setImage] = useState<File | null>(null);

  const validateMessage = (text: string): string=>{
    if(!text.trim()){
      return "内容を入力してください";
    }

    if(text.length > MAX_MESSAGE_LENGTH){
      return `${MAX_MESSAGE_LENGTH}文字以内で入力してください`;
    }

    return '';
  };

  const validateImage = (file:File): string=>{
    const allowTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif'];

    // ファイルのMIMEタイプをチェック
    if(!allowTypes.includes(file.type)){
      return 'PNG, JPG, JPEG, GIF ファイルのみアプロード可能です';
    }
    // ファイルサイズの検証
    if(file.size > MAX_FILE_SIZE){
      return `ファイルサイズが大きすぎます (${MAX_FILE_SIZE}MB以下にしてください)`;
    }

    // ファイル名の長さの検証
    if(file.name.length > MAX_FILENAME_LENGTH){
      return `ファイル名が長すぎます (${MAX_FILENAME_LENGTH}文字以内にしてください)`;
    }

    return '';
  }

  const handleTextChange = (e:ChangeEvent<HTMLInputElement>) =>{
    setText(e.target.value);
    
  }

  const handlePost = useCallback(async(e:ChangeEvent<HTMLFormElement>): Promise<void> =>{
    e.preventDefault();
    const errorMessage = validateMessage(text);
    if(errorMessage){
      alert(errorMessage);
      return;
    }

    setIsposting(true);

    try{
      const createdAt = new Date();
      const dateString = createdAt.toLocaleDateString();
      const imageData = image ? await readImageAsDataURL(image) : undefined;
      const newMessage: Message={
        id: uuidv4(),
        text:text,
        date: dateString,
        image: imageData,
        imageName : image?.name,
        createdAt,
    };

    // DBに保存
    await db.messages.add(newMessage);

    
    setMessages([newMessage, ...messages]); //投稿欄との兼ね合いによって位置関係を考える
    setImage(null);
    setText('');
  }catch(e){
    // ToDO
    console.log(e);
  }finally{
    setIsposting(false);
  }

  },[text,image]);

  const theme = useTheme();
  const colors: Colors = {
    primary: theme.palette.primary.main,
    surface: theme.palette.background.paper,
    gradient: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  }; 

  const formatRelativeTime = useCallback((date: string): string =>{
    const now = new Date();
    const messageDate = new Date(date);
    const diffInMinutes = Math.floor(
      (now.getTime() - messageDate.getTime()) / (1000 * 60),
    );

    if(diffInMinutes < 1) return 'たった今';
    if(diffInMinutes < 60) return `${diffInMinutes}分前`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if( diffInHours < 24) return `${diffInHours}時間前`;

    const diffInDays = Math.floor(diffInHours / 24);
    if( diffInDays < 7) return `${diffInDays}日前`;

    return messageDate.toLocaleDateString();
  },[]);

  const handleDeleteMessage = useCallback((id:string): void=>{
    const targetMessage = messages.find((message) => message.id === id)
    if(!targetMessage) return;

    const previewText = targetMessage.text.length > 20
    ? targetMessage.text.substring(0, 20) + '...'
    : targetMessage.text;

    if(window.confirm(`「${previewText}」を削除しますか?`)){
      setMessages((prev) => prev.filter((message) => message.id !== id));
    }
  },
  [messages],
);

  const handleSelectImage = useCallback((e: ChangeEvent<HTMLInputElement>) =>{
    const file = e.target.files?.[0];
    if(file){
      const errorMessage = validateImage(file);
      if(errorMessage){
        alert(errorMessage);
        return;
      }

      setImage(file);
    }
  },[],);

  const readImageAsDataURL = (file: File): Promise<string> =>{
    return new Promise((resolve, reject)=>{
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    })
  }

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
          今の気持ちをシェアしよう!!
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
            {
              image &&(
                <Paper 
                elevation={2}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: '1px solid rgba(59, 130, 246, 0.1)',
                }}
                >
                  <Typography variant="body2" color="text.secondary" sx={{mb:1}}>
                    📸画像プレビュー
                  </Typography>
                  <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    width: '100%',
                  }}>
                    <Box component="img" alt="preview" src={URL.createObjectURL(image)}
                    sx={{
                      maxWidth: '80%',
                      maxHeight: 200,
                      objectFit: 'contain',
                      borderRadius: 2,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    }}
                    />
                  </Box>
                  <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mt: 2,
                  }}>
                    <Typography variant="caption" color="text.secondary">
                      {image.name}({Math.round(image.size / 1024)}KB)
                    </Typography>
                    <Button color="error" size="small" startIcon={<DeleteIcon />}
                    onClick={() =>setImage(null)}
                    sx={{
                      borderRadius: 2,
                      fontSize: {xs: '0.8rem', sm: '0.875rem'},
                      '&:hover' : {
                        backgroundColor: 'rgba(244,67, 54,0.08)',
                      }
                    }}>
                      削除
                    </Button>
                  </Box>
                </Paper>
              )
            }
            <Box sx={{
              display: 'flex',
              gap: 2,
              alignItems: 'center',
              flexDirection: {xs: 'column', sm: 'row'},
            }}>
            {/*画像送信部分*/}
            <Button
                  variant="outlined"
                  component = "label"
                  startIcon = {<ImageIcon />}
                  sx = {{
                    flex: 1,
                    width: {xs: '100%', sm: 'auto'},
                    height: 48,
                    borderRadius: 2,
                  }}>
              <input type ="file" hidden 
              accept="image/png, image/jpg, image/jpeg, image/gif"
              onChange = {handleSelectImage}/>
              画像を追加
            </Button>

            {/*送信ボタン */}
            <Fab
            type="submit"
            size = "large"
            color = "primary"
            disabled= {!text.trim() || isPosting}
            sx={{
              transition: 'all 0.3s ease',
              transform: text.trim() && 'scale(1.05)',
            }}
            >
              <SendIcon />
            </Fab>
            </Box>
          </Stack>
        </form>
      </Paper>
      
      {/*メッセージリスト*/}
      <Stack spacing={{ xs:2,sm:3}}>
        { messages.length === 0?(
          <Paper elevation={1} sx={{
            p:4,
            background: 'rgba(255,255,255,0.7)',
            borderRadius: 3,
          }}>
            <Typography variant="h6" sx={{mb: 1}}>メッセージがありません。</Typography>
            <Typography variant="body2">上のフォームから最初のメッセージを投稿しましょう!</Typography>
          </Paper>
        ):(
          <>
            <Typography variant="subtitle2" sx={{mb:2, textAlign:'center'}}>
              {messages.length}件のメッセージがあります
            </Typography>
            {
              messages.map((message: Message)=>(
                <Card key ={message.id} elevation={3} 
                      sx={{
                        borderRadius: {xs:2 , sm:3},
                        overflow: 'hidden',
                        background:colors.surface,
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(59, 130, 246, 0.1)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 12px 30px rgba(59, 130, 246, 0.15)',
                        }
                        }}>
                  <CardContent sx={{p:{xs:2, sm:3}}}>
                    <Box sx={{mb: 2}}>
                      <Chip label={formatRelativeTime(message.date)} variant="outlined" size="small"
                      sx={{
                        height: 24,
                        fontSize: '0.75rem',
                        color: colors.primary,
                        borderColor:colors.primary,
                        backgroundColor:'rgba(59, 130, 246, 0.05)',
                      }}/>
                    </Box>
                    {/*テキスト表示*/}
                    <Typography variant="body1"
                                sx={{
                                  lineHeight: 1.7,
                                  color: '#1f2937',
                                  fontSize: { xs: '0.95rem', sm: '1rem' },
                                  fontWeight: 400,
                                  mb: message.image ? 2 : 0,
                                  }}>
                      {message.text}
                    </Typography>
                    {/*画像表示*/}
                    {message.image && (
                      <Box sx ={{
                        display: "flex",
                        justifyContent: "center",
                      }}>
                        <Box component="img" alt={message.imageName}
                        src = {message.image}
                        sx={{
                          maxWidth: '100%',
                          maxHeight: 300,
                          objectFit: "contain",
                          borderRadius: 2,
                          boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
                          transition: 'transform 0.3s ease',
                          '&:hover': {
                            transform: 'scale(1.02)',
                          },
                        }}
                          />

                      </Box>
                    )}

                    </CardContent>

                    <Divider />

                    <CardActions sx={{
                      justifyContent: 'flex-end',
                      p: {xs:1.5, sm:2}
                    }}>
                      <Button color="error" size = "small" startIcon = {<DeleteIcon />}
                              onClick ={() => handleDeleteMessage(message.id)}
                              sx={{
                                borderRadius: 2,
                                '&:hover': {
                                  backgroundColor: 'rgba(244,67,54,0.08)',
                                }
                              }}>
                        削除
                      </Button>
                    </CardActions>
                </Card>
              ))}
          </>
        )
        }
        </Stack>

    </Container>
    </Box>
  )
}

export default App;
