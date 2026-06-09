// 세션 만료 여부를 확인하는 메소드
export function isSessionExpired(html: string): boolean {
    return (
        html.includes('エラーコード：200002') ||
        html.includes('再度ログインしてください')
    );
}


export function imgBasename(src: string): string {
    return src
        .split('?')[0]
        .split('/')
        .pop()!
        .replace(/\.[^.]+$/, '');
}