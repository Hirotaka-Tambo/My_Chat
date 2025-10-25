export type Message={
    id: string;
    text: string;
    date: string;
    image?: string; // Base64 型のURLが格納される 
};

export type Colors={
    primary: string;
    surface:string;
    gradient: string;
}