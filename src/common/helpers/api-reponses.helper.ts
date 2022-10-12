export const success = (data: any = [], message: string = '', http_code: number = 200) => {

    return {
        data,
        message,
        type: 'success',
        httpCode: http_code
    }
}
