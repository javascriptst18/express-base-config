function fetchAllTodos(){
  fetch('/todos')
    .then((response) => response.json())
    .then(console.log);
}

function postTodo(){
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
}

fetchAllTodos();