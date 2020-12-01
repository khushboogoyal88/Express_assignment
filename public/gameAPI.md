# Game data storage

##Goyal_Khushboo_games.json

the number is unique.
```json
[
    {
        "number": 2,
        "name": "Star Adventure",
        "year": 2000,
        "quantity": 13,
        "genre": "strategy"
    },
    {
        "number": 4,
        "name": "Amnesia 2030",
        "year": 2015,
        "quantity": 100,
        "genre": "FPS"
    },
    {
        "number": 5,
        "name": "U.F.O",
        "year": 2011,
        "quantity": 25,
        "genre": "adventure"
    },
    {
        "number": 7,
        "name": "The Rise and Fall of an Empire 22",
        "year": 1990,
        "quantity": 150,
        "genre": "brain-twister"
    },
    {
        "number": 1,
        "name": "Future 2525",
        "year": 2005,
        "quantity": 10,
        "genre": "brain-teaser"
    },
    {
        "number": 6,
        "name": "Ladybirds",
        "year": 2018,
        "quantity": 1,
        "genre": "platformer"
    },
    {
        "number": 3,
        "name": "Jigsaw puzzle",
        "year": 2012,
        "quantity": 7,
        "genre": "board game"
    }
]
````

## storageConfig.json

```json {
    "storageFile": "Goyal.Khushboo_games.json",
    "errorCodes": "errorCodes.js"
}
```
The implementation is wrapped in a createDataStorage function. Function return Datastorage object.


### public API (methods of Datastorage class)

-   getAll()
    -   returns an array of all games / []
-   get(id)
    -   returns an game object / NOT_FOUND
-   insert(newGame)
    -   returns INSERT_OK / NOT_INSERTED / ALREADY_IN_USE
-   update(updatedGame)
    -   returns UPDATE_OK / NOT_UPDATED
-   remove(number)
    -   returns REMOVE_OK / NOT_FOUND / NOT_REMOVED
-   getter for error codes
    -   returns an array of error codes  

### private API (can be used only inside wrapper function)
-   readStorage()
    -   returns an array of games / []
-   writeStorage(data)
    -   returns WRITE_OK / WRITE_ERROR
-   getFromStorage(number)
    -   returns an game object / null
-   addToStorage(newGame)
    -   returns true/false
-   updateStorage(updatedGame)
    -   returns true/false
-   removeFromStorage(number)
    -   returns true / false

### Error codes and messages
```js
const CODES={
    PROGRAM_ERROR:0,
    NOT_FOUND:1,
    INSERT_OK:2
    ...
}
```

The format of an error message is:
```js
const MESSAGES={
    PROGRAM_ERROR: ()=> {(
        message:'Sorry! Error in the program',
        code: CODES.PROGRAM_ERROR,
        type:'error'
    }),
    NOT_FOUND: number =>({
        message: `No game found with number ${number}`,
        code:CODES.NOT_FOUND,
        type:'error'
    }),
    INSERT_OK: number => ({
        message: `Game ${number} was inserted`,
        code:CODES.INSERT_OK,
        type:'info'
    })
}
```
error types are `error` or `info`