import { expect, test } from '@playwright/test'


let Auth_Token = { Authorization: 'Bearer e06b19d3b478ca478d76c5bb03a11644c9010b587ac309a9c0d2344b6586b0b9'};


test('GoRestAPI - Verify Create User GET call test ', async({ request }) => {
    
    let response = await request.get('https://gorest.co.in/public/v2/users',{
            headers: Auth_Token
    });
    // console.log(response);

    //JavaScript Object to JSON - Serialization 
    let jsonBody =  await response.json();
    console.log(jsonBody);
    console.log(response.status());
    console.log(response.statusText());

    expect(response.status()).toBe(200);
});

test('GoRestAPI - Verify Create User - POST call test', async({ request }) => {
        let userData = {
            "name": 'Keshini',
            "email": `pwKTest${Date.now()}@automation.com`,
            "g1ender": "female",
            "status": "Active"
        };
     
        let response = await request.post('https://gorest.co.in/public/v2/users',{
            headers: Auth_Token,
            data: userData
        });

    console.log(response);

    let jsonBody =  await response.json();
    console.log(jsonBody);
    console.log(response.status());
    console.log(response.statusText());
        
});

test('GoRestAPI - Verify Update User - PUT call test', async({ request }) => {
        let userData = {
            "name": 'KeshiniNew',
            "email": `pwKTest${Date.now()}@automation.com`,
            "gender": "female",
            "status": "Active"
        };
     
        let response = await request.put('https://gorest.co.in/public/v2/users/8512563',{
            headers: Auth_Token,
            data: userData
        });

    console.log(response);

    let jsonBody =  await response.json();
    console.log(jsonBody);
    console.log(response.status());
    console.log(response.statusText());
        
});

test('GoRestAPI - Verify Delete User - DELETE call test', async({ request }) => {
    
    
        let response = await request.delete('https://gorest.co.in/public/v2/users/8512563',{
            headers: Auth_Token,
        });


    console.log(response.status());
    console.log(response.statusText());
        
});

