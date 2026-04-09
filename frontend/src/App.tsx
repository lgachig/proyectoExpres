import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import axios from 'axios';
import './App.css';

type Alumno = {
  id: number;
  nombre: string;
};

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

function App() {
  const [nombre, setNombre] = useState('');
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [cargando, setCargando] = useState(false);

  const cargarAlumnos = async () => {
    setCargando(true);
    try {
      const { data } = await api.get<Alumno[]>('/alumnos');
      setAlumnos(data);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    void cargarAlumnos();
  }, []);

  const agregarAlumno = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const limpio = nombre.trim();
    if (!limpio) return;

    await api.post('/alumnos', { nombre: limpio });
    setNombre('');
    await cargarAlumnos();
  };

  const eliminarAlumno = async (id: number) => {
    await api.delete(`/alumnos/${id}`);
    await cargarAlumnos();
  };

  return (
    <main className="page">
      <section className="card">
        <p className="eyebrow">Sistema de gestion escolar</p>
        <h1>CRUD de Alumnos</h1>

        <form className="form" onSubmit={agregarAlumno}>
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            type="text"
            placeholder="Nombre del alumno"
          />
          <button type="submit">Agregar</button>
        </form>

        <ul className="alumnos-lista">
          {cargando && <li className="estado">Cargando alumnos...</li>}
          {!cargando && alumnos.length === 0 && (
            <li className="estado">No hay alumnos registrados.</li>
          )}
          {!cargando &&
            alumnos.map((alumno) => (
              <li key={alumno.id}>
                <span>{alumno.nombre}</span>
                <button
                  type="button"
                  className="danger"
                  onClick={() => eliminarAlumno(alumno.id)}
                >
                  Eliminar
                </button>
              </li>
            ))}
        </ul>
      </section>
    </main>
  );
}

export default App;
