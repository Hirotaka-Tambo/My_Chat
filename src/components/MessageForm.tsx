import type{ FormEvent, ChangeEvent } from 'react';
import{Paper,Stack,TextField} from '@mui/material';
import type { Colors } from '../types';
import { ImageUploader } from './ImageUploader';

type MessageFormProps={
    text:string;
    colors:Colors;
    image: File | null;
    isPosting:boolean;
    onSubmit:(e:FormEvent<HTMLFormElement>)=>void;
    onTextChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onSelectImage: (e: ChangeEvent<HTMLInputElement>) => void;
    onSetImage:(file: File | null) => void;
}

export const MessageForm = ({text, colors, image, isPosting, onSubmit, onTextChange, onSelectImage , onSetImage}:MessageFormProps) =>{

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

            <ImageUploader
            text={text}
            image={image}
            isPosting={isPosting}
            onSelectImage={onSelectImage}
            onSetImage={onSetImage}
            />
        </Stack>
        </form>
    </Paper>
    );
}