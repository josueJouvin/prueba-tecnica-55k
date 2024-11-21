import { useEffect, useRef, useState } from "react";
import { User } from "./types";

function App() {
  const [users, setUser] = useState<User[]>([])
  const [color, setColor] = useState(false)
  const [sortByCountry, setSortByCountry] = useState(false)
  const originalUsers = useRef([])

  useEffect(( ) => {
    fetch(`https://randomuser.me/api/?results=100`)
    .then(response => response.json())
    .then(data => {
      setUser(data.results)
      originalUsers.current = data.results
    })
    .catch(err => {
      console.log(err)
    })
  },[])

  const toggleColor = () => {
    setColor(!color)
  }

  const handleResetUsers = () =>{
    setUser(originalUsers.current)
  }

  const toggleOrderCountry = () =>{
    setSortByCountry(!sortByCountry)
  }

  const handleDeleteUser = (userId: string) => {
    const filteredUsers = users.filter(user => user.login.uuid !== userId)
    setUser(filteredUsers)
  }

  const sortUsers = sortByCountry ? [...users].sort((a, b) => {return a.location.country.localeCompare(b.location.country)}): users

  return (
    <>
      <h1>Prueba tecnica ssr</h1>
      <div className="filters">
        <button onClick={toggleColor}>Colorear Filas</button>
        <button onClick={toggleOrderCountry}>{sortByCountry ? "No ordenar por pais" : "Ordenar por pais"}</button>
        <button onClick={handleResetUsers}>Resetear Estado</button>
      </div>

      <table className={`table ${color ? "colorRows" : ""}`}>
        <thead>
          <tr>
            <th>Foto</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Pais</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {
            sortUsers.map(user => (
              <tr key={user.login.uuid}>
                <td style={{width: "auto"}}>
                  <img src={user.picture.thumbnail}  />
                </td>
                <td>{user.name.first}</td>
                <td>{user.name.last}</td>
                <td>{user.location.country}</td>
                <td>
                  <button onClick={() => handleDeleteUser(user.login.uuid)}>Eliminar</button>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </>
  );
}

export default App;
