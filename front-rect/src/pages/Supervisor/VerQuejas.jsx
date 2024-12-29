import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, ArcElement, Tooltip, Legend } from 'chart.js';

const GestionQuejas = () => {
  const [areaData, setAreaData] = useState({ labels: [], datasets: [] });
  const [estadoData, setEstadoData] = useState({ labels: [], datasets: [] });
  const [quejas, setQuejas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [formEdit, setFormEdit] = useState({
    id: null,
    Estado: '',
    Resolucion: '',
    Fecha_Hora_Resolucion: '',
  });
  const token = localStorage.getItem('token'); // Obtener el token desde localStorage

 // Obtener quejas desde la API
useEffect(() => {
  const fetchQuejas = async () => {
    try {

      const response = await axios.get(`${process.env.REACT_APP_API_URL}/obtener_quejas`, {
        headers: {
          Authorization: `Bearer ${token}`, // Agregar el token al encabezado
        },
      });

      setQuejas(response.data.quejas);
      setCargando(false);
      procesarDatos(response.data.quejas);
    } catch (error) {
      console.error('Error al obtener las quejas:', error);
      setCargando(false);
    }
  };

  fetchQuejas();
}, []);

  // Manejar cambios en el formulario de edición
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setFormEdit({
      ...formEdit,
      [name]: value,
    });
  };

  // Cargar datos de una queja seleccionada en el formulario de edición
  const cargarQuejaEnFormulario = (queja) => {
    setFormEdit({
      id: queja.Id_Queja,
      Estado: queja.Estado,
      Resolucion: queja.Resolucion,
      Fecha_Hora_Resolucion: queja.Fecha_Hora_Resolucion
        ? new Date(queja.Fecha_Hora_Resolucion).toISOString().slice(0, 16) // Formato para input de tipo datetime-local
        : '',
    });
  };

  // Actualizar queja en la API
  const actualizarQueja = async () => {
    if (!formEdit.id) return;

    const currentDateTime = new Date().toISOString(); // Obtener la hora actual en formato ISO

    const payload = {
      Estado: formEdit.Estado,
      Resolucion: formEdit.Resolucion,
      Fecha_Hora_Resolucion: formEdit.Estado === 'Resuelto' ? currentDateTime : null, // Solo actualizar si el estado es "Resuelto"
    };

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/editar_queja/${formEdit.id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Agregar el token al encabezado
          },
        }
      );

      if (response.status === 200) {
        alert(response.data.mensaje || 'Queja actualizada exitosamente.');
        setQuejas((prev) =>
          prev.map((queja) =>
            queja.Id_Queja === formEdit.id
              ? { ...queja, ...payload, Nueva_Fecha_Hora_Resolucion: currentDateTime }
              : queja
          )
        );
        // Reprocesar los datos para los gráficos
        procesarDatos([...quejas, { ...payload, Id_Queja: formEdit.id }]);
        setFormEdit({ id: null, Estado: '', Resolucion: '', Fecha_Hora_Resolucion: '' });
      } else {
        alert('Error inesperado al actualizar la queja.');
      }
    } catch (error) {
      console.error('Error al actualizar la queja:', error);
      alert('Error al actualizar la queja.');
    }
  };


  // Procesar datos para gráficos
  const procesarDatos = (quejas) => {
    const areaCounts = quejas.reduce((acc, queja) => {
      acc[queja.Tipo_Queja] = (acc[queja.Tipo_Queja] || 0) + 1;
      return acc;
    }, {});

    const estadoCounts = quejas.reduce((acc, queja) => {
      acc[queja.Estado] = (acc[queja.Estado] || 0) + 1;
      return acc;
    }, {});

    setAreaData({
      labels: Object.keys(areaCounts),
      datasets: [
        {
          label: 'Cantidad de Quejas',
          data: Object.values(areaCounts),
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
      ],
    });

    setEstadoData({
      labels: Object.keys(estadoCounts),
      datasets: [
        {
          data: Object.values(estadoCounts),
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(255, 206, 86, 0.6)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(255, 206, 86, 1)',
          ],
          borderWidth: 1,
        },
      ],
    });
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar role="Supervisor" />
      <div style={{ flex: 1 }}>
        <Header title="Gestión de Quejas" />
        <div style={{ padding: '20px' }}>
          <h2>Lista de Quejas</h2>
          {cargando ? (
            <p>Cargando datos...</p>
          ) : (
            <>
              {/* Contenedor de la tabla con scroll */}
              <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Cliente</th>
                      <th>Tipo</th>
                      <th>Descripción</th>
                      <th>Estado</th>
                      <th>Resolución</th>
                      <th>Fecha Original</th>
                      <th>Nueva Fecha</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quejas.map((queja) => (
                      <tr key={queja.Id_Queja}>
                        <td>{queja.Id_Queja}</td>
                        <td>{queja.Id_Cliente}</td>
                        <td>{queja.Tipo_Queja}</td>
                        <td>{queja.Descripcion_Queja}</td>
                        <td>{queja.Estado}</td>
                        <td>{queja.Resolucion || 'Sin resolución'}</td>
                        <td>
                          {queja.Fecha_Hora_Resolucion
                            ? new Date(queja.Fecha_Hora_Resolucion).toLocaleString()
                            : 'null'}
                        </td>
                        <td>
                          {queja.Nueva_Fecha_Hora_Resolucion
                            ? new Date(queja.Nueva_Fecha_Hora_Resolucion).toLocaleString()
                            : 'null'}
                        </td>
                        <td>
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => cargarQuejaEnFormulario(queja)}
                          >
                            Editar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>


              {/* Formulario de edición */}
              {formEdit.id && (
                <div style={{ marginTop: '20px' }}>
                  <h3>Editar Queja</h3>
                  <div className="mb-3">
                    <label className="form-label">Estado</label>
                    <select
                      className="form-select"
                      name="Estado"
                      value={formEdit.Estado}
                      onChange={handleEditChange}
                      required
                    >
                      <option value="">Seleccione el estado</option>
                      <option value="No revisado">No revisado</option>
                      <option value="En proceso">En proceso</option>
                      <option value="Resuelto">Resuelto</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Resolución</label>
                    <textarea
                      className="form-control"
                      name="Resolucion"
                      rows="3"
                      value={formEdit.Resolucion}
                      onChange={handleEditChange}
                      required
                    ></textarea>
                  </div>
                  <button
                    className="btn btn-success"
                    onClick={actualizarQueja}
                    disabled={!formEdit.Estado || !formEdit.Resolucion}
                  >
                    Actualizar
                  </button>
                </div>
              )}
            </>
          )}

          {/* Contenedor de las gráficas con tamaño controlado */}
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '300px', maxHeight: '500px', overflow: 'hidden' }}>
              <h3>Áreas con más problemas</h3>
              <div style={{ height: '100%' }}>
                <Bar
                  data={areaData}
                  options={{
                    responsive: true,
                    plugins: { legend: { display: false } },
                  }}
                />
              </div>
            </div>

            <div style={{ flex: 1, minWidth: '300px', maxHeight: '500px', overflow: 'hidden' }}>
              <h3>Estados de las quejas</h3>
              <div style={{ height: '100%' }}>
                <Pie
                  data={estadoData}
                  options={{
                    responsive: true,
                    plugins: { legend: { position: 'right' } },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


  );
};

export default GestionQuejas;
