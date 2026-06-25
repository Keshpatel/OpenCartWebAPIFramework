import {test , expect } from '../../src/fixtures/apifixtures.js'

const TOKEN = process.env.API_Token;
let AUTH_HEADER = {Authorization: `Bearer ${TOKEN}`};

//post : get
//post -put 
//post -get 
//post - delete

///Helper -generic function to create a new user 
async function createUser(apiHelper: any) {

    let userData = {
                "name": 'Keshini API',
                "email": `apiAutomation${Date.now()}@autoTest.com`,
                "gender": "female",
                "status": "Active"
          };
         
             let response = await apiHelper.post('/public/v2/users',userData, AUTH_HEADER );
             expect(response.status).toBe(201);    
             return response.body;
}

//Test - 1 POST ----> UserId ---> Get /userID -- verify 
test('Creaet a User Test', async ({ apiHelper }) => {
    //create a user :
    let userResponse = await createUser(apiHelper);

    //get created user :
    let response = await apiHelper.get(`/public/v2/users/${userResponse.id}`, AUTH_HEADER);
    expect.soft(response.status).toBe(200);
    expect.soft(response.body.name).toBe("Keshini API");
});

//Test - 2 POST : PUT (update) => Get (verify)
test('Update a User Test', async ({ apiHelper }) => {
    //create a user :
    let userResponse = await createUser(apiHelper);
    let userDataToUpdate = {
            "name": 'Kkk API Updated01',
            "status": "inactive"
        };    

    //update created user :
    let response = await apiHelper.put(`/public/v2/users/${userResponse.id}`, userDataToUpdate, AUTH_HEADER);
    expect.soft(response.status).toBe(200);
    expect.soft(response.body.name).toBe(userDataToUpdate.name);
    expect.soft(response.body.status).toBe(userDataToUpdate.status);

    //get created user :
    let getresponse = await apiHelper.get(`/public/v2/users/${userResponse.id}`, AUTH_HEADER);
    expect.soft(getresponse.status).toBe(200);
    expect.soft(getresponse.body.name).toBe(userDataToUpdate.name);
    expect.soft(getresponse.body.status).toBe(userDataToUpdate.status);
});

//TEST - 3: delete a User 
// AAA  => POST(204) : DELETE(404) : verify 
test('Delete a User Test', async ({ apiHelper }) => {
    //create a user :
    let userResponse = await createUser(apiHelper);

    //delete created user :
    let response = await apiHelper.delete(`/public/v2/users/${userResponse.id}`, AUTH_HEADER);
    expect(response.status).toBe(204);

    //get created user :
    let getResponse = await apiHelper.get(`/public/v2/users/${userResponse.id}`, AUTH_HEADER);
    expect(getResponse.status).toBe(404);
    expect(getResponse.body.message).toBe('Resource not found');    
});