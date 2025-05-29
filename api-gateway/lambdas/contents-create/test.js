const { handler } = require('./index');
async function test() {
    const event = {
        headers: {
            Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXJuYW1lIiwia2V5aWQiOiIzNTU1OTQ0MjY5Iiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzQ4NDY1NjM5LCJleHAiOjE3ODAwMDE2MzksImF1ZCI6InJlbmFwcCIsImlzcyI6ImFwaS1nYXRld2F5Iiwic3ViIjoidXNlcm5hbWUiLCJqdGkiOiIzOTMwODMwOTM5In0.BsAzCnipvdZH9uu1tcphNBXFkTQP6hOK99bon7S-xHk"
        },
        body: JSON.stringify({
            "title": "t1",
            "description": "d1",
            "statusId": "ACTIVO",
            "type": "video",
            "content": { "url": "https://www.youtube.com/watch?v=Jg2dy-G8QG0" },
            "createdAt": "2025-05-28T21:33:24.214Z"
        })
    };
    const context = {
        awsRequestId: "1"
    };
    const result = await handler(event, context);
    console.log(">>>", result);
}
test();