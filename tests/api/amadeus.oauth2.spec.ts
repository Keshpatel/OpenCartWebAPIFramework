import { test , expect } from '@playwright/test'

const OAUTH_CONFIG = {
    tokenURL: 'https://test.api.amadeus.com/v1/security/oauth2/token',
    clientId: process.env.OAUTH_CLIENT_ID!,
    clientSecret: process.env.OAUTH_CLIENT_SECRET!,
    grant_type: process.env.GRANT_TYPE!
   
}

let accessToken: string;

test.beforeEach('POST -- Generate Access token test ', async({ request }) => {
    let response = await request.post(OAUTH_CONFIG.tokenURL, {
        form: {
            client_id: OAUTH_CONFIG.clientId,
            client_secret: OAUTH_CONFIG.clientSecret,
            grant_type: OAUTH_CONFIG.grant_type
        }
    });
   console.log("Status code is : ", response.status());
    expect(response.status()).toBe(200);
    let jsonResponse = await response.json();
    console.log('Json Resonse : \n', jsonResponse);
    accessToken = jsonResponse.access_token;
});

test('GET -- Get location data test',async ({ request }) => {
    let baseURL = 'https://test.api.amadeus.com';
    let endPointURL = '/v1/reference-data/locations';
    let queryParam = {
        subType: 'CITY,AIRPORT',
        keyword: 'MUC',
        countryCode: 'DE'
    };

    let locationResponse = await request.get(`${baseURL}${endPointURL}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        },
        params: queryParam
    });
    expect(locationResponse.status()).toBe(200);
    console.log(await locationResponse.json());

    let locationJson = await locationResponse.json();
    console.log(locationJson);

    let countValue = locationJson.meta.count;
    expect(countValue).toBeGreaterThan(0);
    //expect(countValue).toBe(2);

    console.log("Printing location data array .......")
    let locationA = locationJson.data[0];
    console.log(locationA);

    expect(locationA.type).toBe('location');
    expect(locationA.name).toBe('MUNICH');
    expect(locationA.id).toBe('CMUC')

    expect(locationA.address.countryName).toBe('GERMANY');



});

