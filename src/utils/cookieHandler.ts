/**
 * 设置 cookie
 * @param name cookie 名
 * @param value cookie 值
 * @param days 有效期（天）
 */
function setCookie(name: string, value: string, days: number = 7) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value}; ${expires}; path=/`;
}

/**
 * 获取 cookie
 * @param name cookie 名
 * @returns 返回 cookie 值
 */
function getCookie(name: string) {
    const nameEQ = `${name}=`;
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length); // 去掉空格
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

/**
 * 删除 cookie
 * @param name cookie 名
 */
function removeCookie(name: string) {
    // 设置 cookie 过期时间为过去的时间
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

/**
 * 清除所有 cookie
 */
function clearCookie() {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        const index = cookie.indexOf('=');
        const name = index > -1 ? cookie.substring(0, index) : cookie;
        removeCookie(name);
    }
}

export { setCookie, getCookie, removeCookie, clearCookie };