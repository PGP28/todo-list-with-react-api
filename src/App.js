import React, { useState, useEffect } from 'react';
import './App.css';


const URL_API = "https://assets.breatheco.de/apis/fake/todos/user/PGP28";

const App = props => {
  const [todos, setTodos] = useState([
    {label: 'Tarea 1', done: false}
    
  ]);

  useEffect(() => {
    apiGet();
  }, [])

  useEffect(() => {
    apiPut();
  }, [todos])

  const apiGet = async url => {

    try {
      const options = {
        method: 'GET',
        headers: {"Content-Type": "application/json"} 
      }
      const resp = await fetch(URL_API, options);
      const data = await resp.json();

      if(data.msg){
        // alert(data.msg);
        let option = window.confirm("¿Desea crear una nueva lista?");
        if(option){
          apiPost();
        }
      }
      else{
        setTodos(data);
      }
    }
    catch(error) {
      console.log("Error: ", error);
    }
  }

  const apiPost = async url => {

    try {
      const options = {
        method: 'POST',
        body: JSON.stringify([]),
        headers: {'Content-type': 'application/json'}
      }
      const resp = await fetch(URL_API, options)
      const data = await resp.json();

      if(data.msg){
        alert(data.msg);
      }
      else{
        apiGet();
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  }

  const apiPut = async url => {

    try {

      const [...list] = todos.length > 0 ? todos : [{label: 'Sample task', done: false}]

      const options = {
        method: 'PUT',
        body: JSON.stringify(list),
        headers: {'Content-type': 'application/json'}
      }
      const resp = await fetch(URL_API, options)
      const data = await resp.json();

      if(data.msg){
        alert(data.msg);
      }
      else{
        alert(data.result);
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  }

  const apiDelete = (() => {

    fetch('https://assets.breatheco.de/apis/fake/todos/user/PGP28', {
      method: "DELETE",
      body: JSON.stringify(
        [todos]
      ),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(resp => {
        console.log(resp.ok); // Será true (verdad) si la respuesta es exitosa.
        console.log(resp.status); // el código de estado = 200 o código = 400 etc.
        console.log(resp.text()); // Intentará devolver el resultado exacto como cadena (string)
        return resp.json(); // (regresa una promesa) will try to parse the result as json as return a promise that you can .then for results
      })
      .then(data => {
        //Aquí es donde debe comenzar tu código después de que finalice la búsqueda
        console.log(data); //esto imprimirá en la consola el objeto exacto recibido del servidor
      })
      .catch(error => {
        //manejo de errores
        console.log(error);
      });


  })

  const addTarea = e => {
    console.log(e.keyCode);
    if (e.keyCode === 13 && e.target.value !== "") {
      const value = {label: e.target.value, done: false}
      console.log(value);
      setTodos(todos.concat(value));
      apiPut();
    }
  }

  const deleteTask = index => {
    const [...newTodos] = todos;
    newTodos.splice(index, 1);
    setTodos(newTodos);
    apiPut(...newTodos);
  }



  return (
    <>
      <div className="container">
        <div className="row">

        </div>
      </div>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Todos</h5>

          <input type="text" placeholder="Ingrese una Tarea" onKeyDown={(e) => addTarea(e)} />

          <ul>
            {
              todos.length > 0 ?
                todos.map((elem, index) => {
                  console.log(elem)

                  return <li key={index} onClick={() => deleteTask(index)}>{elem.label}
                    <i className="fas fa-trash-alt"></i>
                  </li>

                })
                : (
                  <li>Lista Vacia </li>

                )
            }
          </ul>
        </div>
        <button type="button" className="btn btn-outline-primary" onClick={apiDelete} >Delete All</button>
      </div>

    </>
  )
}

export default App;
