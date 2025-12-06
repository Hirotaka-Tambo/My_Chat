import { useEffect, useState, useCallback, type ChangeEvent, type FormEvent } from 'react';
import { Typography, Box, Container, Paper,  Stack, useTheme } from '@mui/material';
import {v4 as uuidv4} from 'uuid';

import Dexie from 'dexie';
import './App.css';
import { MessageItem } from './components/MessageItem';
import { MessageForm } from './components/MessageForm';
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
  const[isPosting, setIsPosting] = useState<boolean>(false);
  const[image, setImage] = useState<File | null>(null);
  const[isLoading, setIsLoading] = useState<boolean>(false);
  const[isEditing, setIsEditing]= useState<boolean>(false);

  const validateMessage = (text: string): string=>{
    if(!text.trim()){
      return "内容を入力してください";
    }

    if(text.length > MAX_MESSAGE_LENGTH){
      return `${MAX_MESSAGE_LENGTH}文字以内で入力してください`;
    }

    return '';
  };

  
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

    setIsPosting(true);

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
    setIsPosting(false);
  }

  },[text,image]);

  const theme = useTheme();
  const colors: Colors = {
    primary: theme.palette.primary.main,
    surface: theme.palette.background.paper,
    gradient: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
    background: theme.palette.background.default,
  }; 

  useEffect(() =>{
    const loadMessage = async(): Promise<void> =>{
      try{
        setIsLoading(true);
        const allMessages = await db.messages
          .orderBy('createdAt')
          .reverse()
          .toArray();
        setMessages(allMessages);
      }catch (e) {
          console.error('メッセージの読み込みに失敗しました:', e);
      }finally{
        setIsLoading(false);
      }
    };
    loadMessage();
  },[]);

  console.log(messages);

  
  const handleDeleteMessage = useCallback(
    async(id:string): Promise<void>=>{
    const targetMessage = messages.find((message) => message.id === id)
    if(!targetMessage) return;

    const previewText = targetMessage.text.length > 20
    ? targetMessage.text.substring(0, 20) + '...'
    : targetMessage.text;

    if(window.confirm(`「${previewText}」を削除しますか?`)){
      try{
        await db.messages.delete(id);
        setMessages((prev) => prev.filter((message) => message.id !== id));
      }catch(e){
        console.error('削除に失敗しました',e);
        alert('削除に失敗しました');

      }
      setMessages((prev) => prev.filter((message) => message.id !== id));
    }
  },
  [messages],
);

  const readImageAsDataURL = (file: File): Promise<string> =>{
    return new Promise((resolve, reject)=>{
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    })
  }

  if(isLoading){
    return (
      <Box sx={{
        position: 'absolute',
        top:0,
        bottom:0,
        left:0,
        right:0,
        background: colors.background,

      }}>
        <Typography variant="h6">読み込み中...</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{minHeight: '100vh', p:{xs: 2,sm: 3}}}>
    <Container maxWidth='md' 
    sx={{
      maxWidth:{xs:'100%', sm: '720px'},
      px: {xs:0, sm: 3}
      }}
    >
      
      {/*入力*/}
      <MessageForm
      text={text}
      image={image}
      isPosting={isPosting}
      onSubmit={handlePost}
      onTextChange={handleTextChange}
      onSelectImage={handleSelectImage}
      onSetImage={setImage}
      
      {/*メッセージリスト*/}
      Stack spacing={{ xs:2,sm:3}}>
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
                <MessageItem 
                  key={message.id}
                  message={message}
                  onDelete={handleDeleteMessage}
                />
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
