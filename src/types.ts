export type Message={
    id: string;
    text: string;
    date: string;
    image?: string; // Base64 型のURLが格納される 
    imageName?: string;
    createdAt?: Date;
    updatedAt?: Date;
};

export type Colors={
    primary: string;
    surface:string;
    gradient: string;
    background: string;
}