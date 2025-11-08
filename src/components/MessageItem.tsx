import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CancelIcon from '@mui/icons-material/Cancel';

import type { Message } from '../types';
import { useState } from 'react';

type MessageItemprops = {
    message: Message;
    onDelete: (id:number) => void;
    onEdit: (id:number, newText: string) => void;
};

export const MessageItem = ({ message, onDelete, onEdit}: MessageItemprops) =>{
    const [isEditing,setIsEditing] = useState(false);
    const[editText, setEditText] = useState(message.text);

    const handleEdit = () =>{
        setIsEditing(true);
        setEditText(message.text);
    };

    const handleSave = () =>{
        if(editText .trim() && message.id){
            onEdit(message.id, editText.trim());
            setIsEditing(false);
        }
    }

    const handleCancel = () =>{
        setEditText(message.text);
        setIsEditing(false);
    }

    return (
        <Box sx = {{"position"}}>
            {/* 編集・削除ボタン*/}
            {!isEditing &&(
                <Box className = "action-buttons">
                sx={{
                    position : 'abso'
                }}
                </Box>
            )}
        </Box>
    )
}
