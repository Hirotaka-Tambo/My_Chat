import { useEffect, useState, useCallback, type ChangeEvent, type FormEvent } from 'react';
import { Typography, Box, Container, useTheme } from '@mui/material';
import {v4 as uuidv4} from 'uuid';
import Dexie from 'dexie';
import './App.css';
import { MessageList } from './components/MessageList';
import { MessageForm } from './components/MessageForm';
import { MessageItem } from './components/MessageItem';
import { SearchBar } from './components/SearchBar';
import type { Message, Colors } from './types';
import { validateImage, validateMessage } from './utils/validation';


class ChatDatabase extends Dexie {
  messages!: Dexie.Table<Message, string>;

  constructor() {
    super('ChatApp');
    this.version(1).stores({
      messages: 'id, createdAt',
    });
  }
}

const db = new ChatDatabase();

// dbを作成

function App() {

  const [text, setText] = useState<string>('');
  // リストのため、配列として所持する
  const [messages, setMessages] = useState<Message[]>([]);
  const[isPosting, setIsPosting] = useState<boolean>(false);
  const[image, setImage] = useState<File | null>(null);
  const[isLoading, setIsLoading] = useState<boolean>(false);
  const[isEditing, setIsEditing]= useState<boolean>(false);
  const[editingId, setEditingId] = useState<string | null>(null);
  const[editingText, setEditingText] = useState<string>('');
  const[searchText, setSearchText] = useState<string>('');

  
  const handleTextChange = (e:ChangeEvent<HTMLInputElement>) =>{
    setText(e.target.value);
  }

  const onSearchTextChange = useCallback((text: string) => {
  setSearchText(text);
}, []);


  const handlePost = useCallback(async(e:FormEvent<HTMLFormElement>): Promise<void> =>{
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
        updatedAt: createdAt,
    };

    // DBに保存
    await db.messages.add(newMessage);

    
    setMessages( prev =>[newMessage, ...prev]); //投稿欄との兼ね合いによって位置関係を考える
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

  const handleSelectImage = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const errorMessage = validateImage(file);
      if (errorMessage) {
        alert(errorMessage);
        return;
      }

      e.target.value = '';
      setImage(file);
    }
  }, []);

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
    }
  },
  [messages],
);

  function readImageAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

  // 編集開始ハンドラ
  const handleStartEdit = useCallback((id: string, currentText: string) =>{
    setEditingId(id);
    setEditingText(currentText);
  },[]);

  // 編集キャンセルハンドラ
  const handleCancelEdit = useCallback(() =>{
    setEditingId(null);
    setEditingText('');
  },[]);
  // 下記はリファクタリング必須
  const handleSaveEdit = useCallback(
  async (): Promise<void> => {
    console.log(editingId , editingText)
    if (!editingId || !editingText.trim()) {
      alert('内容を入力してください');
      return;
    }

    setIsPosting(true);

    try {
      const updatedAt = new Date();

      // DB 更新
      await db.messages.update(editingId, {
        text: editingText,
        updatedAt
      });

      // state 更新
      setMessages((prev) =>
        prev.map((message) =>
          message.id === editingId
            ? { ...message, text: editingText, updatedAt }
            : message,
        )
      );

      // 初期化
      setEditingId(null);
      setEditingText('');

    } catch (e) {
      alert('編集に失敗しました・時間をおいて再度お試しください');
    }
  },
  []
);
// useMemoでの記述を推奨

const getFilteredMessages = (): Message[] =>{
  if(!searchText.trim()) return messages;

  return messages.filter((message) =>{
    message.text.toLowerCase().includes(searchText.toLowerCase())
  });
};

const filteredMessages = getFilteredMessages();

  const messageItems = messages.map((message: Message) => (
    <div key={message.id}>
      <MessageItem 
            key={message.id}
            message={message}
            colors={colors}
            isEditing={editingId === message.id}
            editingText={editingId === message.id ? editingText : message.text}
            onEditTextChange={setEditingText}
            onStartEdit={handleStartEdit}
            onCancelEdit={handleCancelEdit}
            onSaveEdit={handleSaveEdit}
            onDeleteMessage={handleDeleteMessage}
      />               
                      
      </div>
  ))


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
      colors ={colors}
      isPosting={isPosting}
      onSubmit={handlePost}
      onTextChange={handleTextChange}
      onSelectImage={handleSelectImage}
      onSetImage={setImage}
      />

      <SearchBar
      searchText={searchText}
      colors = {colors}
      onSearchTextChange={onSearchTextChange}
      />

      <MessageList>{messageItems}</MessageList>


    </Container>
    </Box>
  )
}

export default App;
