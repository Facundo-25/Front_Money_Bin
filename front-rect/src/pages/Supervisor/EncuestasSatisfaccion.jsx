import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const EncuestaSatisfaccion = () => {
  const [datosEncuesta, setDatosEncuesta] = useState([]);
  const [cargando, setCargando] = useState(true);
  const token = localStorage.getItem('token'); // Obtener el token desde localStorage

  // Obtener datos de la API
  useEffect(() => {
    axios
      .get(process.env.REACT_APP_API_URL + '/obtener_encuestas', {
        headers: {
          Authorization: `Bearer ${token}`, // Incluir el token en el encabezado
        },
      })
      .then((response) => {
        setDatosEncuesta(response.data.data);
        setCargando(false);
      })
      .catch((error) => {
        console.error('Error al obtener los datos:', error);
        setCargando(false);
      });
  }, []);

  // Calcular promedios
  const calcularPromedio = (campo) => {
    const suma = datosEncuesta.reduce((acc, encuesta) => acc + encuesta[campo], 0);
    return datosEncuesta.length > 0 ? (suma / datosEncuesta.length).toFixed(2) : 0;
  };

  // Datos para el gráfico
  const datosGrafico = {
    labels: ['Calidad Servicios', 'Facilidad Uso', 'Rapidez Transacciones', 'Seguridad Plataforma', 'Recomendación'],
    datasets: [
      {
        label: 'Promedio de Respuestas',
        data: [
          calcularPromedio('Calidad_Servicios'),
          calcularPromedio('Facilidad_Uso'),
          calcularPromedio('Rapidez_Transacciones'),
          calcularPromedio('Seguridad_Plataforma'),
          calcularPromedio('Recomendacion'),
        ],
        backgroundColor: ['#4CAF50', '#2196F3', '#FFC107', '#FF5722', '#9C27B0'],
      },
    ],
  };

  // Opciones para el gráfico
  const opcionesGrafico = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar role="Supervisor" />
      <div style={{ flex: 1 }}>
        <Header title="Encuesta de Satisfacción" />
        <div style={{ padding: '20px' }}>
          <h2>Resultados de la Encuesta de Satisfacción</h2>
          {cargando ? (
            <p>Cargando datos...</p>
          ) : (
            <>
              {/* Tabla de resultados */}
              <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #ccc', borderRadius: '5px' }}>
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>ID Encuesta</th>
                      <th>Cliente</th>
                      <th>Calidad Servicios</th>
                      <th>Facilidad de Uso</th>
                      <th>Rapidez de Transacciones</th>
                      <th>Seguridad Plataforma</th>
                      <th>Recomendación</th>
                      <th>Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {datosEncuesta.map((data) => (
                      <tr key={data.Id_Encuesta}>
                        <td>{data.Id_Encuesta}</td>
                        <td>{data.Id_Cliente}</td>
                        <td>{data.Calidad_Servicios}</td>
                        <td>{data.Facilidad_Uso}</td>
                        <td>{data.Rapidez_Transacciones}</td>
                        <td>{data.Seguridad_Plataforma}</td>
                        <td>{data.Recomendacion}</td>
                        <td>{new Date(data.Fecha_Encuesta).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Gráfico de análisis */}
              <div style={{ marginTop: '20px', height: '400px' }}>
                <h3>Análisis Visual</h3>
                <Bar data={datosGrafico} options={opcionesGrafico} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EncuestaSatisfaccion;
