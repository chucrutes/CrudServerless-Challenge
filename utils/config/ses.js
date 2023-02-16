const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");

const client = new SESClient({ region: "us-east-1" });

async function sendEmail(template, to, showName) {
    const params = {
        Destination: {
            CcAddresses: [
            ],
            ToAddresses: [
                to
            ],
        },
        Message: {
            Body: {
                Html: {
                    Charset: "UTF-8",
                    Data: template,
                }
            },
            Subject: {
                Charset: "UTF-8",
                Data: `Ticket bought for the show ${showName}`,
            },
        },
        Source: "tmelo387@gmail.com",
        ReplyToAddresses: [
        ],
    }
    try {
        const data = await client.send(new SendEmailCommand(params));
        return data;

    } catch (e) {
        console.log(e.message);
    }
}

module.exports = { sendEmail }
