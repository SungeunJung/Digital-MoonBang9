const Hello = data => {
    //let authCode = 1234567
    return `
        <!DOCTYPE html>
        <html style="margin: 0; padding: 0;">
            <head>
                <title>이메일 인증하기</title>
            </head>
            <body style="margin: 0; padding: 0; font-size:15px;">
                <br />
                <br />
                <div>안녕하세요?</div>
                <div>디지털 문방구입니다.</div>
                <div>인증번호를 입력하여 회원가입을 완료하실 수 있습니다.</div>
                <div style="background-color: skyblue; width:26%; font-size:20px;">인증번호는 <strong style="font-size:25px;">${data}</strong> 입니다.</div>
                <br />
                <br />
            </body>
        </html>
    `
}

module.exports = { Hello }