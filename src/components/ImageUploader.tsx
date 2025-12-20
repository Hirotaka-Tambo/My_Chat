import type{ ChangeEvent } from 'react';
import {Box, Button ,Fab, Paper, Typography} from "@mui/material";
import { Send as SendIcon, Image as ImageIcon, Delete as DeleteIcon } from '@mui/icons-material';


type ImageUploaderProps={
    text: string;
    image: File | null;
    isPosting: boolean;
    onSelectImage: (e: ChangeEvent<HTMLInputElement>) => void;
    onSetImage:(file: File | null) => void;
}


export const ImageUploader = ({
    text,
    image,
    isPosting,
    onSelectImage,
    onSetImage
}:
    ImageUploaderProps) =>{
    return(
        <>
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
        </>
    );
}