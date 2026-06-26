
import { test, expect } from '../../src/fixtures/apifixtures.js';

const TOKEN = process.env.API_TOKEN;
const AUTH_HEADER = {Authorization: `Bearer ${TOKEN}`};
let userId: number;


test.describe.serial('e2e GoRest API CRUD Operations Tests ', () =>{

//GET Tes
   test('GET API = get all users test ',async ({ apiHelper }) => {
      let response = await apiHelper.get('/public/v2/users',AUTH_HEADER);
      expect(response.status).toBe(200);
      expect(response.body.length).toBeGreaterThan(0);                                             
   }); 

//POST test
   test('POST API = Create a User test',async ({ apiHelper }) => {
      let userData = {
            "name": 'Keshini API',
            "email": `apiAutomation${Date.now()}@autoTest.com`,
            "gender": "female",
            "status": "Active"
      };
     
         let response = await apiHelper.post('/public/v2/users',userData, AUTH_HEADER );
         expect(response.status).toBe(201);    
         expect(response.body.name).toBe(userData.name);
         userId = response.body.id;
         console.log('Create UserID : ',userId);

      });

   //UPDATE User 
   test('PUT API = Update User test',async ({ apiHelper }) => {
     let userDataToUpdate = {
            "name": 'Keshini API Updated',
            "status": "inactive"
        };
     
      let response = await apiHelper.put(`/public/v2/users/${userId}`,userDataToUpdate, AUTH_HEADER );
      expect(response.status).toBe(200); 
      expect(response.body.name).toBe(userDataToUpdate.name);
      expect(response.body.status).toBe(userDataToUpdate.status);   
   });

   test('DELETE API -- Delete User test',async ({ apiHelper }) => {
      console.log("Create UserID :", userId);
      console.log("Deleting User ID =", userId);

      let response = await apiHelper.delete(
         `/public/v2/users/${userId}`,
         AUTH_HEADER
      );
      console.log(response);
      expect(response.status).toBe(204); 
   });

});
