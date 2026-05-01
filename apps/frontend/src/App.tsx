import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import axios from 'axios';
import './App.css';

type RequiredEnvKey =
  | 'VITE_API_BASE_URL'
  | 'VITE_DOG_INITIAL_PAGE'
  | 'VITE_DOG_PAGE_SIZE';

const getRequiredEnv = (name: RequiredEnvKey): string => {
  const value = import.meta.env[name];

  if (!value || value.trim() === '') {
    throw new Error(`Falta variable de entorno obligatoria: ${name}`);
  }

  return value;
};

const getRequiredEnvNumber = (name: RequiredEnvKey): number => {
  const value = Number(getRequiredEnv(name));

  if (!Number.isFinite(value)) {
    throw new Error(`La variable ${name} debe ser numerica`);
  }

  return value;
};

type Alumno = {
  id: number;
  nombre: string;
};

type DogBreed = {
  id: string;
  type: string;
  attributes: {
    name: string;
    description: string;
    life: {
      max: number;
      min: number;
    };
    male_weight: {
      max: number;
      min: number;
    };
    female_weight: {
      max: number;
      min: number;
    };
    hypoallergenic: boolean;
  };
};

type DogBreedsResponse = {
  data: DogBreed[];
  meta: {
    pagination: {
      current: number;
      first: number;
      prev: number | null;
      next: number | null;
      last: number;
      records: number;
    };
  };
};

const api = axios.create({
  baseURL: getRequiredEnv('VITE_API_BASE_URL'),
});

function App() {
  const pageSize = getRequiredEnvNumber('VITE_DOG_PAGE_SIZE');
  const initialPage = getRequiredEnvNumber('VITE_DOG_INITIAL_PAGE');
  const [nombre, setNombre] = useState('');
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [razas, setRazas] = useState<DogBreed[]>([]);
  const [paginaActual, setPaginaActual] = useState(initialPage);
  const [paginacion, setPaginacion] = useState<
    DogBreedsResponse['meta']['pagination'] | null
  >(null);
  const [cargando, setCargando] = useState(false);
  const [cargandoRazas, setCargandoRazas] = useState(false);
  const [errorRazas, setErrorRazas] = useState('');

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

  const cargarRazas = async (page = paginaActual) => {
    setCargandoRazas(true);
    setErrorRazas('');

    try {
      const { data } = await api.get<DogBreedsResponse>('/dogs/breeds', {
        params: {
          pageNumber: page,
          pageSize,
        },
      });

      setRazas(data.data);
      setPaginacion(data.meta.pagination);
    } catch {
      setErrorRazas('No fue posible cargar las razas de perros.');
    } finally {
      setCargandoRazas(false);
    }
  };

  useEffect(() => {
    void cargarRazas();
  }, [paginaActual]);

  const irPaginaAnterior = () => {
    if (!paginacion?.prev || cargandoRazas) return;
    setPaginaActual(paginacion.prev);
  };

  const irPaginaSiguiente = () => {
    if (!paginacion?.next || cargandoRazas) return;
    setPaginaActual(paginacion.next);
  };

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

        <section className="dogs-section">
          <div className="dogs-header">
            <h2>Razas consumidas desde Dog API</h2>
            <button type="button" onClick={() => cargarRazas(paginaActual)}>
              Recargar razas
            </button>
          </div>

          {cargandoRazas && <p className="estado">Cargando razas...</p>}
          {errorRazas && <p className="estado">{errorRazas}</p>}

          {!cargandoRazas && !errorRazas && (
            <>
              <ul className="dogs-lista">
                {razas.map((raza) => (
                  <li key={raza.id}>
                    <h3>{raza.attributes.name}</h3>
                    <p>{raza.attributes.description}</p>
                    <small>
                      Vida: {raza.attributes.life.min} - {raza.attributes.life.max}{' '}
                      anios | Peso macho: {raza.attributes.male_weight.min} -{' '}
                      {raza.attributes.male_weight.max} kg | Peso hembra:{' '}
                      {raza.attributes.female_weight.min} -{' '}
                      {raza.attributes.female_weight.max} kg | Hipoalergenico:{' '}
                      {raza.attributes.hypoallergenic ? 'Si' : 'No'}
                    </small>
                  </li>
                ))}
              </ul>

              {paginacion && (
                <div className="paginacion">
                  <p className="estado">
                    Pagina {paginacion.current} de {paginacion.last} | Total registros:{' '}
                    {paginacion.records}
                  </p>
                  <div className="paginacion-controles">
                    <button
                      type="button"
                      onClick={irPaginaAnterior}
                      disabled={!paginacion.prev || cargandoRazas}
                    >
                      Anterior
                    </button>
                    <span className="pagina-actual">Actual: {paginacion.current}</span>
                    <button
                      type="button"
                      onClick={irPaginaSiguiente}
                      disabled={!paginacion.next || cargandoRazas}
                    >
                      Siguiente
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      </section>
    </main>
  );
}

export default App;
