# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api/users.api.schema.spec.ts >> GET - Get User test 
- Location: tests/api/users.api.schema.spec.ts:49:1

# Error details

```
SyntaxError: Unexpected token '<', "<!doctype "... is not valid JSON
```

# Test source

```ts
  1  | import { APIRequestContext } from "@playwright/test";
  2  | 
  3  | export class ApiHelper {
  4  | 
  5  |     private readonly request: APIRequestContext;
  6  |     private readonly baseURL: string;
  7  | 
  8  |     constructor(request: APIRequestContext, baseURL: string) {
  9  |         this.request = request;
  10 |         this.baseURL = baseURL;
  11 |     }
  12 | 
  13 |     //GET
  14 |     async get(endpoint: string, headers: Record<string, string> = {} ) {
  15 |         let response = await this.request.get(`${this.baseURL}${endpoint}`, { headers }
  16 |         );
  17 |         console.log('API Respose : ', response)
  18 |         return {
  19 |             status : response.status(),
  20 |             body: await response.json()
  21 |         }
  22 |     }
  23 | 
  24 | 
  25 |     //POST 
  26 |     async post(endpoint: string, data: object, headers: Record<string, string> = {} ) {
  27 |         let response = await this.request.post(`${this.baseURL}${endpoint}`, 
  28 |             { 
  29 |                 headers, 
  30 |                 data: data
  31 |             }
  32 |         );
  33 |         return {
  34 |             status : response.status(),
> 35 |             body: await response.json()
     |                   ^ SyntaxError: Unexpected token '<', "<!doctype "... is not valid JSON
  36 |         }
  37 |     }
  38 | 
  39 | //PUT 
  40 |     async put(endpoint: string, data: object, headers: Record<string, string> = {} ) {
  41 |         let response = await this.request.put(`${this.baseURL}${endpoint}`, 
  42 |             { 
  43 |                 headers, 
  44 |                 data: data
  45 |             }
  46 |         );
  47 |         return {
  48 |             status : response.status(),
  49 |             body: await response.json()
  50 |         }
  51 |     }
  52 | 
  53 |     //DELETE 
  54 | // DELETE
  55 |     async delete(endpoint: string, headers: Record<string, string> = {}) {
  56 |         const response = await this.request.delete(
  57 |             `${this.baseURL}${endpoint}`,
  58 |             {
  59 |                 headers
  60 |             }
  61 |         );
  62 |         return {
  63 |             status: response.status(),
  64 |             body: await response.text()
  65 |         };
  66 |     }
  67 | }
  68 |     
  69 | 
```