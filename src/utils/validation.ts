// 画像ファイルの容量の制限
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 5MB

// 画像ファイル名の長さの制限
const MAX_FILENAME_LENGTH = 100;

// 大文字である理由は、これが定数であることを宣言するため
const MAX_MESSAGE_LENGTH = 500;


export const validateImage = (file: File): string => {
    const allowTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif'];
    // ファイルのMIMEタイプをチェック
    if (!allowTypes.includes(file.type)) {
        return 'PNG, JPG, GIF ファイルのみアップロード可能です';
    }

    // 最大ファイルサイズをチェック
    if (file.size > MAX_FILE_SIZE) {
        return `ファイルサイズが大きすぎます（${MAX_FILE_SIZE} MB 以下にしてください）`;
    }

    // 最大ファイル名チェック
    if (file.name.length > MAX_FILENAME_LENGTH) {
        return `ファイル名が長過ぎます（${MAX_FILENAME_LENGTH} 文字以内にしてください）`;
    }

    return '';
};

export const validateMessage = (text: string): string=>{
    if(!text.trim()){
        return "内容を入力してください";
    }

    if(text.length > MAX_MESSAGE_LENGTH){
        return `${MAX_MESSAGE_LENGTH}文字以内で入力してください`;
    }

    return '';
};