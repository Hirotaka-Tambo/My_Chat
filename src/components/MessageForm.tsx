import type{ FormEvent, ChangeEvent } from 'react';
import{Button,Box,Paper,Stack,TextField,Fab,Typography,} from '@mui/material';
import { Send as SendIcon, Image as ImageIcon, Delete as DeleteIcon } from '@mui/icons-material';

type MessageFormProps={
    text:string;
    image: File | null;
    isPosting:boolean;
    onSubmit:(e:FormEvent<HTMLFormElement>)=>void;
    onTextChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onSelectImage: (e: ChangeEvent<HTMLInputElement>) => void;
    onSetImage:(file: File | null) => void;
}

export const MessageForm = ({text,image, isPosting, onSubmit, onTextChange, onSelectImage , onSetImage}:MessageFormProps) =>{

    return(
    <Paper elevation={2} sx={{borderRadius:{xs: 2,sm: 3},
            p:{xs: 2, sm: 3}, mb:{xs: 2,sm: 3},
            //background: colors.surface,
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(59,130,246, 0.1)',
            }}>
        <form onSubmit={onSubmit}>
        <Stack spacing={{xs: 2, sm: 3}}>
            <TextField 
            fullWidth 
            placeholder="What is happening?"
            variant= "outlined"
            multiline
            rows={4}
            value={text}
            onChange={onTextChange}
            sx={{
                '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    '&:hover fieldset': {
                    //borderColor: colors.primary,
                    },
                    '&.Mui-focused fieldset': {
                    //borderColor: colors.primary,
                    },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                    //color: colors.primary,
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
                    onClick={() =>onSetImage(null)}
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
            onChange = {onSelectImage}/>
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
    );
}