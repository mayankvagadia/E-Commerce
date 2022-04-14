## Search Filter

- User can search a peerless filters.
- There are List of filters like state,LATA,Location,Rate Center,NPA,NXX.
- User must provide at least one filter to search a filter.

ex :- 
1)when user provide a state then state releated filters data are applied to other filters.(values is filed in lata,location,rate center,npa,nxx)

2)If user provide a lata then late releated filters are applied(values is filed in location,state,state,rate center,npa,nxx)

- We can provide location and rate center multiple.
- We use a `getNewNumberSearchFilters` api for search filter

````JS
"location":["CASAGRANDE","CASTLEROCK","FLAGSTAFF"],
"rateCenter":["CASAGRANDE","CASTLEROCK","FLAGSTAFF"],
````

````JS
"state":"AZ",
"lata":"666",
"location":["CASAGRANDE","CASTLEROCK","FLAGSTAFF"],
"rateCenter":[],
"npa": "714",
"nxx":"447",
````

## Search Number

- User can search peerless number.
- After apply number filter peerless provide filtered numbers.
- User have to select at lease one filter (state,lata,location,rate center,npa,nxx)
- User can set quantity (how many numbers user can buy)
- Consecutive (Set of numbers)(ex:- 1001 - 1005 set of 5 numbers)(user have to enter number which are quantity can divisible)
    ex :- "eg: If Quantity = 10, then value of Consequtive can be 1,2,5 or 10"
- Category (by default value is 1(standard))

- We use a `searchNumbers` api for search number

````JS
"state":"AZ",
"lata":"666",
"location":["CASAGRANDE","CASTLEROCK","FLAGSTAFF"],
"rateCenter":[],
"npa": "714",
"nxx":"447",
"quantity": "1",
"consecutive": "1",
"category": "1"
````

## Order Status

- Check the Status of peerless network number (status : - Pending,closed,etc...)
- We use a `getOrderStatus` api for check order status

````JS
"OrderId" : "<order_id>" // Without OrderType (ex : NN)
````

## Place Order

- User can buy/order a peerless number.
- User can buy/order many number at a time.
- User have to pass array of numbers for order.
- If user want to set address in number then need to select/checked e911 field.
- We use a `placeOrder` api for order a number

````JS
"number":[{
    "tn": "<peerless number>",
    "mou": "3000",
    "cnamDelivery":false,
    "cnamStorage":false,
    "sms":false,
    "e911":true, // if false then no need to set address
    "address": {
        "number": "",
        "name": "Test User",
        "streetNumber": "222",
        "direction": "S",
        "streetName": "River",
        "city": "Chicago",
        "state": "IL",
        "zip": "sds",
        "suite": ""
    }
}]
````

## Verify Number

- This Api is just check the given peerless number is purchased by that user or not.
- Using Api user can modify that numbers only.

````JS
"number":"<peerless number>" // (ex : - "number":"12345678")
````