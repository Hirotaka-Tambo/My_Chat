import { useCallback } from 'react';
import {Box,Button,Card,
    CardActions,
    CardContent,
    Chip,
    Divider,
    Typography,
    IconButton,
    TextField,
} from '@mui/material';
import {
    Delete as DeleteIcon,
    Check as CheckIcon,
    Cancel as CancelIcon,
} from '@mui/icons-material';
import type { Message, Colors } from '../types';

type MessageItemProps = {
    message: Message;
    colors: Colors;
    isEditing: boolean;
    onDeleteMessage: (id: string) => void;
    onEditMessage: (id: string, newText: string) => void;
};

export const MessageItem = ({
    message,
    colors,
    isEditing,
    onDeleteMessage,
    onEditMessage,
}: MessageItemProps) => {
    const formatRelativeTime = useCallback((date: string): string => {
    const now = new Date();
    const messageDate = new Date(date);
    const diffInMinutes = Math.floor(
      (now.getTime() - messageDate.getTime()) / (1000 * 60),
    );

    if (diffInMinutes < 1) return 'たった今';
    if (diffInMinutes < 60) return `${diffInMinutes} 分前`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} 時間前`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} 日前`;

    return messageDate.toLocaleDateString();
}, []);

return (
    <Card
    key={message.id}
    elevation={3}
    sx={{
        borderRadius: { xs: 2, sm: 3 },
        overflow: 'hidden',
        background: colors.surface,
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(59, 130, 246, 0.1)',
        transition: 'all 0.3s ease',
        '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 30px rgba(59, 130, 246, 0.15)',
        },
    }}
    >
    <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        {isEditing && (
        <Box>
            <IconButton size="small" color="primary">
            <CheckIcon />
            </IconButton>
            <IconButton size="small">
            <CancelIcon />
            </IconButton>
        </Box>
        )}

        {isEditing ? (
        <TextField
            fullWidth
            variant="outlined"
            multiline
            autoFocus
            rows={4}
            onChange={(e) => onEditMessage(message.id, e.target.value)}
        />
        ) : (
        <Typography
            variant="body1"
            component="p"
            sx={{
            lineHeight: 1.7,
            color: '#1f2937',
            fontSize: { xs: '0.95rem', sm: '1rem' },
            fontWeight: 400,
            mb: message.image ? 2 : 0,
            }}
        >
            {message.text}
        </Typography>
        )}
        <Box sx={{ mb: 2 }}>
        <Chip
            label={formatRelativeTime(message.date)}
            variant="outlined"
            size="small"
            sx={{
            height: 24,
            fontSize: '0.75rem',
            color: colors.primary,
            borderColor: colors.primary,
            backgroundColor: 'rgba(59, 130, 246, 0.05)',
            }}
        />
        </Box>

        {message.image && (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
            }}
        >
            <Box
            component="img"
            alt={message.imageName}
            src={message.image}
            sx={{
                maxWidth: '100%',
                maxHeight: 300,
                objectFit: 'contain',
                borderRadius: 2,
                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                transform: 'scale(1.02)',
                },
            }}
            />
        </Box>
        )}
    </CardContent>

    <Divider />

    <CardActions
        sx={{
        justifyContent: 'flex-end',
        p: { xs: 1.5, sm: 2 },
        }}
    >
        <Button
        color="error"
        size="small"
        startIcon={<DeleteIcon />}
        onClick={() => onDeleteMessage(message.id)}
        sx={{
            borderRadius: 2,
            '&:hover': {
            backgroundColor: 'rgba(244, 67, 54, 0.08)',
            },
        }}
        >
        削除
        </Button>
    </CardActions>
    </Card>
);
};