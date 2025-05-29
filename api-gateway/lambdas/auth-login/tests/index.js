const { handler } = require('../index');
async function test() {
    const event = {
        headers: {
            Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXJuYW1lIiwiaWF0IjoxNzQ0NjYyNzQzLCJleHAiOjE3NzYxOTg3NDMsImF1ZCI6ImNlbGVzdGUtdnMiLCJpc3MiOiJhcGktZ2F0ZXdheSIsInN1YiI6InVzZXJuYW1lIiwianRpIjoiNDM0MTE1NDU0MSJ9.pqC--JwRfoBp8-ythSJkr_mrJzMZbPy0IL0DumkTfJo"
        },
        body: JSON.stringify({
            username: 'username',
            password: 'password',
        })
    };
    const context = {
        awsRequestId: "1"
    };
    const result = await handler(event, context);
    console.log(">>>", result);
}
test();