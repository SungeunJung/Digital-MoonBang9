const Hello = data => {
    //let authCode = 1234567
    return `
        <!DOCTYPE html>
        <html style="margin: 0; padding: 0;">
            <head>
                <title>이메일 인증하기</title>
            </head>
            <body style="margin: 0; padding: 0;">
                <br />
                <br />
                <div>인증번호는 ${data} 입니다.</div>
                <br />
                <br />
            </body>
        </html>
    `
}

module.exports = { Hello }