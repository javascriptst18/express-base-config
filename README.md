# Express server

> Creates a HTTP-server that can send and recieve information from the frontend.

## Installation

1. Clone repository
```bash
git clone https://github.com/javascriptst18/express-base-config
```
2. `cd` into folder:
```bash
cd express-base-config
```
2. Install all dependencies:
```bash
npm i
```
3. Run the start script:
```bash
npm start
```
4. Visit [`http://localhost:3000`](http://localhost:3000)


## Uppgift

Du ska skapa en todo-applikation fast som bara använda express och `GET` samt `POST`. Du behöver alltså inte blanda in frontend eller `fetch`. Alla anrop ska göras via **Postman**. Alla anrop som vi gör via Postman kan dock även göras via `fetch`. Men vi vill fokusera på att få backend-funktionalitet att fungera först. **Sparningen av data kommer alltså enbart vara i minnet och kommer att försvinna när vi startar om servern. Om du vill permanent spara data så måste du använda `writeFile` och `readFile` men det är inget som krävs för uppgiften. Alternativt använda en enklare databas så som [lowdb](https://github.com/typicode/lowdb)**

* Du ska använda dig utav detta repo: `express-base-config`

* Du ska skapa en array längst upp i `index.js` som heter `todos` och som ska från start innehålla todos likt dessa:
 
```js
let todos = [
 {
    title: 'Buy Milk',
    completed: false
 },
 {
    title: 'JavaScripting',
    completed: true
 }
];
```

## Länklista

* https://expressjs.com/
* https://devhints.io/express
* http://overapi.com/express
* https://www.getpostman.com/

## Egenskaper

### **Egenskap**: _Listning av todos_
---

**Scenario**: Lista upp 3 todos

**Givet**: att en användare besöker urlen `/todos`

**Så**: ska en lista av 3 todos som finns i arrayen `todos` visas i formatet JSON för användaren.

---
 
**Scenario**: Visa totalt antal todos

**Givet**: att en användare besöker urlen `/todos/count`

**Så**: ska användaren få tillbaka en siffra på hur många todos som finns i arrayen `todos`


### **Egenskap**: _skapande av todo_

**Scenario**: Skapa todo

**Givet**: en användare skickar en `POST`-request `/todos` där `body` är fylld med den nya todons innehåll

**Så**: ska innehållet i `body` pushas/lagras i arrayen `todos` och användaren ska få tillbaka ett meddelande om att todon har skapats


### **Egenskap**: _Ta bort todo_

**Scenario**: Radera 1 todo

**Givet**: att en användare skickar en `DELETE`-request till `/todos/{id}`

**Så**: ska todon med rätt id tas bort från arrayen `todos` och användaren ska få tillbaka ett meddelande om att todon har tagits bort.


### **Egenskap**: _Redigera todo_

**Scenario**: Redigera 1 todo

**Givet**: att en användare skickar en `PATCH`-request till `todos/{id}` och skickar med `body` fylld med det nya innehållet i todon

**Så**: ska todon med rätt ID uppdateras i arrayen `todos` och användaren ska få tillbaka ett meddelande om att todon har tagits bort.


### **Egenskap** : _Ange hur många todos som ska hämtas vid `GET`_

**Scenario**: Hämta 5 inlägg

**Givet**: att en användare lägger till `?limit=5` i sin förfrågan till `/todos`: `GET /todos?limit=5`

**Så**: ska användaren få tillbaka så många todos som användare har angivit i `limit`.


### **Egenskap**: _Sökning av todo_

**Scenarion**: Hämta ett inlägg med en specifik titel

**Givet**: att en användare lägger till `?q=Milk` i sin förfrågan till `/todos`: `GET /todos?q=Milk`

**Så**: ska användaren få tillbaka alla todos var titel innehåller `Milk`.
