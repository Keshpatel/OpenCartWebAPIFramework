//schema : type of response data 
//Producer  ---->  Consumer 
//ajv ---> node  lib for the schema validation 
//npm install ajv

import { test, expect } from '../../src/fixtures/apifixtures.js';
import { Ajv } from 'ajv'

let TOKEN = process.env.API_Token;
let AUTH_HEADER = { Authorization: `Bearer ${TOKEN}`}

//setup the AJV:
let ajv = new Ajv();

//define json schema:
let userSchema =  {
  "type": "object",
  "properties": {
    "id": {
      "type": "number"
    },
    "name": {
      "type": "string"
    },
    "email": {
      "type": "string"
    },
    "gender": {
      "type": "string"
    },
    "status": {
      "type": "string"
    }
  },
  "required": [
    "id",
    "name",
    "email",
    "gender",
    "status"
  ]
};

let userArraySchema = {
  "type": "array",
  "items": userSchema
}

test('GET - Get User test ', async ({ apiHelper }) => {

  let userData = {
    name: 'schema test',
    email: `automation_${Date.now()}@newOpen.com`,
    gender: 'female',
    status: 'active'
  };

  //POST : Create User : gorest API
  let createResponse = await apiHelper.post("/public/v2/users", userData, AUTH_HEADER);
  let userId = createResponse.body.id;

  //GET : Get Created User 
  let getUserResponse = await apiHelper.get(`/public/v2/users/${userId}`, AUTH_HEADER);
  expect(getUserResponse.status).toBe(200);


  //schema validation code:
  let validate = ajv.compile(userSchema);
  let isSchemavalid = validate(getUserResponse.body);
  if(!isSchemavalid) {
    console.log('schema Error', validate.errors);
  }
  expect(isSchemavalid).toBeTruthy();
  
});

test('GET - Get All Users test ', async ({ apiHelper }) => {

   //GET : Get Created User 
  let getUsersResponse = await apiHelper.get(`/public/v2/users`, AUTH_HEADER);
  expect(getUsersResponse.status).toBe(200);


  //schema validation code:
  let validate = ajv.compile(userArraySchema);
  let isSchemavalid = validate(getUsersResponse.body);
  
  if(!isSchemavalid) {
    console.log('schema Error', validate.errors);
  }
  expect(isSchemavalid).toBeTruthy();
  
});