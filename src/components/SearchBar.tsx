import {
    Paper,
    TextField,
    InputAdornment,
    IconButton,
    Icon,
} from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';
import type { Colors } from '../types';

type SearchBarProps = {
    searchText: string;
    colors: Colors;
    onSearchTextChange:(text : string) => void;
};



export const SearchBar = ({searchText, colors , onSearchTextChange}:SearchBarProps
) => {
    return(
        <Paper elevation={2} sx={{ p: 2, mb: 3, background: colors.surface ,borderRadius: 2}}>
            <TextField fullWidth placeholder='メッセージ検索...'
            value = {searchText} onChange = {(e) => onSearchTextChange(e.target.value)}
            size = "small"
            slotProps={{
                input: {
                    startAdornment:(
                        <InputAdornment position="start">
                            <SearchIcon color="action" />                    
                        </InputAdornment>
                    ),
                    endAdornment:(
                        <InputAdornment position="end">
                            <IconButton onClick={() => onSearchTextChange('')}
                                        size="small"
                                        sx = {{
                                            '&:hover':{
                                                backgroundColor:'rgba(0,0,0,0.04)',
                                            },
                                        }
                                        }>
                                <ClearIcon fontSize="small"/>
                            </IconButton> 
                        </InputAdornment>
                    )
                }
            }}/>
        
        </Paper>
    );

}