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

### Nodemon

Om du vill slippa starta om servern hela tiden

1. Installera nodemon globalt
```bash
npm install -g nodemon
```
2. Kör igång dev-kommandot som kör nodemon (finns i `package.json`)
```
npm run dev
```

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

## Gränssnitt

Du/ni ska skapa ett enklare gränssnitt där användaren kan interagera med APIet. Användaren ska via gränssnittet kunna utnyttja alla URLer i APIet och metoder kopplade till dessa URL. Själva APIet behöver inte ändras något (koden i `index.js`) utan ni ska enbart anropa ert API från frontend. Denna uppgift är väldigt lik CRUD-uppgiften vi gjorde tidigare så använd gärna den uppgiften som hjälp.

> Om du inte hann klart med alla funktioner i APIet så kan du skapa ett gränssnitt för de funktioner som du hann klart med. Alternativt så finns det ett lösningsförslag under branchen `solution`. Alternativt kan du fortsätta med att implementera funktionerna i APIet.

## Instruktioner

I mappen `public` måste du ha en `index.html` samt en JavaScript-fil i samma mapp. Filerna i `public` fungerar på samma sätt som vi tidigare jobbat. Länka in en JavaScript-fil i `index.html` så laddas den in när du besöker `index.html`. Raderna nedan som finns i `./index.js` gör så att filen `index.html` levereras till användaren när vi besöker `http://localhost:3000`:

```js
app.get('/', function(request, response){
  response.sendFile('index.html');
})
```

För att kalla på dessa funktioner i APIet måste vi använda `fetch` (eller AJAX generellt) för att få ta del av informationen. Detta är som vi tidigare har gjort:

```js
fetch('/todos')
    .then((response) => response.json())
    .then((todos) => {
        console.log(todos);
    });
```

För att göra en `POST`-request samt alla andra metoder som inte är en `GET` måste vi ange metoden i ett extra objekt som vi skickar med varje förfrågan. I vårt fall så har vi ställt in att informationen som POSTas ska skickas och ta emot som JSON-data. Det betyder att vi måste ställa in detta i `fetch`-anropet. För att ange att en förfrågan ska tolkas som en viss typ av data måste vi ändra i `headers`. När vi får data från APIet så är det i form av JSON som vi måste konvertera till vanlig JavaScript (med `response.json()`/`JSON.parse()`). Det betyder att vi måste även skicka informationen som JSON. Detta gör vi med funktionen `JSON.stringify`:

```js
const newTodo = { 
    title: 'Posty boy',
    completed: false
};

fetch('/todos', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newTodo)
  });
```

