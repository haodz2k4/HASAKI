
export const generateRandomString = (length: number): string => {
    const characterNumbers = '0123456789'
    let result = ""
    for(let i = 0; i < length; i++) {
        result += characterNumbers.charAt(Math.floor(Math.random() * characterNumbers.length))
    }
    return result
}