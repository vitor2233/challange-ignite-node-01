export function httpValidator(res, code, message) {
    return res.writeHead(code).end(message)
}