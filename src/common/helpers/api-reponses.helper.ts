export const success = (data: any = [], message = '', http_code = 200) => {

    return {
        data,
        message,
        type: 'success',
        httpCode: http_code
    }
}
