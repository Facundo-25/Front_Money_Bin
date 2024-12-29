import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { Line, Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const GestionInventarios = () => {
  const [balance, setBalance] = useState([]);
  const [entradasSalidas, setEntradasSalidas] = useState([]);
  const [historialGanancias, setHistorialGanancias] = useState([]);
  const [filtro, setFiltro] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/getDineroBanco`, {
      headers: {
        Authorization: `Bearer ${token}`, // Incluir el token en el encabezado
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setBalance(data);
        } else {
          setBalance([]);
        }
      })
      .catch((error) => console.error('Error al cargar el balance:', error));
  }, []);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/getESBanco`)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setEntradasSalidas(data);
        } else {
          setEntradasSalidas([]);
        }
      })
      .catch((error) => console.error('Error al cargar las transacciones:', error));
  }, []);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/getHistorialGanancias`)
      .then((response) => response.json())
      .then((data) => {
        if (data.historial && Array.isArray(data.historial) && data.historial.length > 0) {
          setHistorialGanancias(data.historial);
        } else {
          setHistorialGanancias([]);
        }
      })
      .catch((error) => console.error('Error al cargar el historial de ganancias:', error));
  }, []);

  const handleFiltro = (e) => {
    setFiltro(e.target.value);
  };

  const filteredData = entradasSalidas.filter((item) =>
    item.fecha && item.fecha.includes(filtro)
  );

  const gananciasData = {
    labels: historialGanancias.map((item) => item.Tiempo),
    datasets: [
      {
        label: 'Ganancias',
        data: historialGanancias.map((item) => parseFloat(item.Ganancias)),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Pérdidas',
        data: historialGanancias.map((item) => parseFloat(item.Pérdidas)),
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  const entradasSalidasData = {
    labels: filteredData.map((item) => item.fecha),
    datasets: [
      {
        label: 'Entradas',
        data: filteredData
          .filter((item) => item.tipo === 'Depósito')
          .map((item) => item.monto),
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: 'Salidas',
        data: filteredData
          .filter((item) => item.tipo === 'Retiro')
          .map((item) => item.monto),
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 1,
      },
    ],
  };

  const monedaData = {
    labels: ['GTQ', 'USD'],
    datasets: [
      {
        label: 'Saldo',
        data: [
          balance.find((item) => item.Moneda === 'GTQ')?.Total_Dinero || 0,
          balance.find((item) => item.Moneda === 'USD')?.Total_Dinero || 0,
        ],
        backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 99, 132, 0.2)'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar role="Supervisor" />
      <div style={{ flex: 1 }}>
        <Header title="Gestión de Inventarios Bancarios" />
        <div style={{ padding: '20px' }}>
          <h2>Gestión de Inventarios Bancarios</h2>

          <div className="mb-3">
            <h4>Saldo Disponible</h4>
            {balance.length > 0 ? (
              balance.map((item, index) => (
                <p key={index}>
                  {item.Moneda}: {item.Moneda === 'GTQ' ? 'Q' : '$'}
                  {item.Total_Dinero}
                </p>
              ))
            ) : (
              <p>No hay datos de saldo disponibles.</p>
            )}
          </div>

          <div className="mb-3">
            <h4>Filtrar Entradas y Salidas por Fecha</h4>
            <input
              type="date"
              value={filtro}
              onChange={handleFiltro}
              className="form-control"
            />
          </div>

          <div className="mb-3">
            <h4>Entradas y Salidas de Dinero</h4>
            {filteredData.length > 0 ? (
              <Bar data={entradasSalidasData} />
            ) : (
              <p>No hay datos de entradas o salidas disponibles.</p>
            )}
          </div>

          <div className="mb-3">
            <h4>Historial de Ganancias y Pérdidas</h4>
            {historialGanancias.length > 0 ? (
              <Line data={gananciasData} />
            ) : (
              <p>No hay datos de historial de ganancias o pérdidas disponibles.</p>
            )}
          </div>

          <div className="mb-3">
            <h4>Comparación de Saldo entre GTQ y USD</h4>
            {balance.length > 0 ? (
              <Bar data={monedaData} />
            ) : (
              <p>No hay datos de saldo disponibles.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GestionInventarios;
