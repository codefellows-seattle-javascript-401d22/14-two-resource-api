
# Mongo Double Resource API

This is a simple, two-resource API that utilizes express and MongoDb. It's two resources are ```breweries``` and ```beers```. You can perform CRUD functions against both of them.

### Dependencies

  ```npm i``` will download the dependecny needed for this app.

  - ```bluebird```
  - ```body-parser```
  - ```cors```
  - ```debug```
  - ```express```
  - ```http-errors```
  - ```mongoose```
  - ```morgan```
  - ```eslint```
  - ```jest```
  - ```superagent```

### Resources

#### Beer

The beer resource has several properties...
```
{
  name: < Beer name >,
  style: < Style of beer >,
  breweryID: < ID of brewery, added at time of POST >,
}
```

#### Brewery

The brewery resource only has a few properties...
```
{
  name: < Name of Brewery >,
  timestamp: < Date and time that resource is added to database >,
  beers: [< Array of beer _ids >],
}
```

### Routes

#### **POST** 

*Beer*
```
localhost:3000/api/brewery/<breweryId>/beer
``` 
with a request body of ...
```
{
  name: < beername >,
  style: < beerstyle >,
}
```
*Brewery*
```
localhost:3000/api/brewery
```
with a request body of
```
{
  name: < breweryname >,
}
```

#### **GET**

*Beer*
```
localhost:3000/api/beer/<beerId>
```

*Brewery*
```
localhost:3000/api/brewery/<breweryId>
```

#### **PUT**

*Beer*
```
localhost:3000/api/beer/<beerId>
```

*Brewery*
```
localhost:3000/api/brewery/<breweryId>
```

#### **DELETE**

*Beer*
```
localhost:3000/api/beer/<beerId>
```

*Brewery*
```
localhost:3000/api/brewery/<breweryId>
```

