import {Box} from `@mui/material`;


type HighlightTextProps = {
    text: string;
    searchText: string;

}

export const HighlightText = ({text, searchText}: HighlightTextProps) => {
    if(!searchText){
        return <>{text}</>;
    }

    const regex = RegExp(`(${searchText})`,'gi')
    const parts = text.split(regex);
    

    return ();
}