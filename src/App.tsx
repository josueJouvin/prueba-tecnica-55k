import { useEffect, useMemo, useRef, useState } from "react";
import { SortBy, User } from "./types";

function App() {
  const [users, setUser] = useState<User[]>([]);
  const [color, setColor] = useState(false);
  const [sorting, setSorting] = useState<SortBy>(SortBy.NONE);
  const [search, setSearch] = useState<string | null>(null);
  const originalUsers = useRef([]);

  useEffect(() => {
    fetch(`https://randomuser.me/api/?results=100`)
      .then((response) => response.json())
      .then((data) => {
        setUser(data.results);
        originalUsers.current = data.results;
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const toggleColor = () => {
    setColor(!color);
  };

  const handleResetUsers = () => {
    setUser(originalUsers.current);
  };

  const toggleOrderCountry = () => {
    const newSortingValue =
      sorting === SortBy.NONE ? SortBy.COUNTRY : SortBy.NONE;
    setSorting(newSortingValue);
  };

  const handleDeleteUser = (userId: string) => {
    const filteredUsers = users.filter((user) => user.login.uuid !== userId);
    setUser(filteredUsers);
  };

  const handleChangeSort = (sort: SortBy) => {
    setSorting(sort);
  };

  const searchUsers = useMemo(() => {
    return search
      ? users.filter((user) =>
          user.location.country.toLowerCase().includes(search.toLowerCase())
        )
      : users;
  }, [users, search]);

  const sortUsers = useMemo(() => {
    if (sorting === SortBy.NONE) return searchUsers;

    if (sorting === SortBy.COUNTRY) {
      return searchUsers.sort((a, b) =>
        a.location.country.localeCompare(b.location.country)
      );
    }

    if (sorting === SortBy.NAME) {
      return searchUsers.sort((a, b) =>
        a.name.first.localeCompare(b.name.first)
      );
    }

    if (sorting === SortBy.LAST) {
      return searchUsers.sort((a, b) => a.name.last.localeCompare(b.name.last));
    }
  }, [searchUsers, sorting]);

  return (
    <>
      <h1>Prueba tecnica ssr</h1>
      <div className="filters">
        <button onClick={toggleColor}>Colorear Filas</button>
        <button onClick={toggleOrderCountry}>
          {sorting === SortBy.COUNTRY
            ? "No ordenar por pais"
            : "Ordenar por pais"}
        </button>
        <button onClick={handleResetUsers}>Resetear Estado</button>
        <input
          type="text"
          placeholder="Buscar por País"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <table className={`table ${color ? "colorRows" : ""}`}>
        <thead>
          <tr>
            <th>Foto</th>
            <th
              className="pointer"
              onClick={() => handleChangeSort(SortBy.NAME)}
            >
              Nombre
            </th>
            <th
              className="pointer"
              onClick={() => handleChangeSort(SortBy.LAST)}
            >
              Apellido
            </th>
            <th
              className="pointer"
              onClick={() => handleChangeSort(SortBy.COUNTRY)}
            >
              Pais
            </th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {sortUsers.map((user) => (
            <tr key={user.login.uuid}>
              <td style={{ width: "auto" }}>
                <img src={user.picture.thumbnail} />
              </td>
              <td>{user.name.first}</td>
              <td>{user.name.last}</td>
              <td>{user.location.country}</td>
              <td>
                <button onClick={() => handleDeleteUser(user.login.uuid)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default App;
