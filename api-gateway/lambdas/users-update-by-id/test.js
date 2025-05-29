const index = require("./index");

async function test() {
    const r = await index.handler({
        headers: {
            Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXJuYW1lIiwia2V5aWQiOiIzNTU1OTQ0MjY5Iiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzQ2MjAwMjgwLCJleHAiOjE3Nzc3MzYyODAsImF1ZCI6InJlbmFwcCIsImlzcyI6ImFwaS1nYXRld2F5Iiwic3ViIjoidXNlcm5hbWUiLCJqdGkiOiI4MDgxNjA3MDExIn0.LBv9vIetFFi8BFRn3_mtRio8tzoSe67rjMu6gwR2FWU"
        },
        body: JSON.stringify({ "phoneNumber": "3105397699", "statusId": "PENDIENTE", "lastName": "MARTINEZ", "createdAt": "2025-04-29T15:03:55.559Z", "username": "username", "id": 3555944269, "email": "josmejia.2401@gmail.com", "firstName": "JOSEg", "healthData": { "age": 0, "height": 0 } }),
        pathParameters: {
            id: 3555944269
        }
    });
    console.log(r);
}

test();