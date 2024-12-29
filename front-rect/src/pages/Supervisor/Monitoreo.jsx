import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';

const Monitoreo = () => {
  // Estado para almacenar los datos de monitoreo
  const [monitoreoData, setMonitoreoData] = useState({
    retiros: [],
    solicitudesPrestamos: [],
    actividadesTarjetas: [],
    actividadesAdministrativas: [],
    todasActividades: [],
  });

  // Estado para manejar el loading
  const [loading, setLoading] = useState(true);

  // Función para hacer la llamada a la API
  const fetchMonitoreoData = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/monitoreo`);
      const data = await response.json();
      setMonitoreoData(data); // Guardar los datos en el estado
    } catch (error) {
      console.error("Error al obtener datos de monitoreo:", error);
    } finally {
      setLoading(false); // Terminar el loading
    }
  };

  // UseEffect para hacer la llamada a la API cuando se monta el componente
  useEffect(() => {
    fetchMonitoreoData(); // Inicialmente obtener los datos

    // Establecer un intervalo para actualizar los datos cada 5 segundos
    const intervalId = setInterval(fetchMonitoreoData, 5000);

    // Limpiar el intervalo cuando el componente se desmonte
    console.log(monitoreoData)
    return () => clearInterval(intervalId);
  }, []);

  // Función para renderizar la tabla
  const renderTable = (data, title) => {
    if (data.length === 0) {
      return <p>No hay datos disponibles</p>;
    }

    return (
      <div style={{ marginBottom: '20px' }}>
        <h3>{title}</h3>
        <table style={{ width: '100%', border: '1px solid #ccc', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {Object.keys(data[0]).map((key) => (
                <th key={key} style={{ padding: '8px', textAlign: 'left', border: '1px solid #ccc' }}>
                  {key.replace('_', ' ').toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                {Object.values(item).map((value, idx) => (
                  <td key={idx} style={{ padding: '8px', border: '1px solid #ccc' }}>
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Renderizado del componente
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar role="Supervisor" />
      <div style={{ flex: 1 }}>
        <Header title="Monitoreo" />
        <div style={{ padding: '20px' }}>
          <h2>Monitoreo en Tiempo Real</h2>

          {loading ? (
            <p>Cargando datos...</p>
          ) : (
            <div>
              {renderTable(monitoreoData.retiros, 'Retiros de Dinero')}
              {renderTable(monitoreoData.solicitudesPrestamos, 'Solicitudes de Préstamos')}
              {renderTable(monitoreoData.actividadesTarjetas, 'Actividades de Tarjetas')}
              {renderTable(monitoreoData.actividadesAdministrativas, 'Actividades Administrativas')}
              {renderTable(monitoreoData.todasActividades, 'Todas las Actividades')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Monitoreo;
