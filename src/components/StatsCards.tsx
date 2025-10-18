import React, { useState, useEffect } from 'react';
import { useContratoStore } from '../store/contratoStore';

interface StatsCardsProps {
  contratos: any[];
}

const StatsCards: React.FC<StatsCardsProps> = ({ contratos }) => {
  const [stats, setStats] = useState({
    activos: 0,
    proximosVencer: 0,
    totalServicios: 0,
  });

  useEffect(() => {
    const activos = contratos.filter(c => c.estado === 'Activo').length;
    
    const hoy = new Date();
    const proximosVencer = contratos.filter(contrato => {
      const fechaFin = new Date(contrato.fechaFin);
      const diasRestantes = Math.ceil((fechaFin.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
      return diasRestantes <= 30 && diasRestantes > 0;
    }).length;

    const totalServicios = contratos.reduce((total, contrato) => {
      return total + contrato.servicios_ids.length;
    }, 0);

    setStats({
      activos,
      proximosVencer,
      totalServicios,
    });
  }, [contratos]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold text-blue-800">Contratos Activos</h3>
        <p className="text-2xl font-bold text-blue-600">{stats.activos}</p>
      </div>
      <div className="bg-green-50 p-4 rounded-lg">
        <h3 className="font-semibold text-green-800">Total Servicios</h3>
        <p className="text-2xl font-bold text-green-600">{stats.totalServicios}</p>
      </div>
      <div className="bg-yellow-50 p-4 rounded-lg">
        <h3 className="font-semibold text-yellow-800">Próximos a Vencer</h3>
        <p className="text-2xl font-bold text-yellow-600">{stats.proximosVencer}</p>
      </div>
    </div>
  );
};

export default StatsCards;