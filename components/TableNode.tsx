import React from 'react';
import { Table } from '../types';
import { AlertCircle, Clock, User, CheckCircle2, Utensils, Trash2 } from 'lucide-react';

interface TableNodeProps {
  table: Table;
  isSelected: boolean;
  onClick: (table: Table) => void;
}

const TableNode: React.FC<TableNodeProps> = ({ table, isSelected, onClick }) => {
  const getStatusColor = (status: Table['status']) => {
    switch (status) {
      case 'free': return 'bg-restaurant-free/20 border-restaurant-free text-restaurant-free';
      case 'reserved': return 'bg-restaurant-reserved/20 border-restaurant-reserved text-restaurant-reserved';
      case 'seated': return 'bg-restaurant-seated/20 border-restaurant-seated text-restaurant-seated';
      case 'dirty': return 'bg-restaurant-dirty/20 border-restaurant-dirty text-restaurant-dirty';
      default: return 'bg-gray-700 border-gray-600 text-gray-400';
    }
  };

  const hasHighSeverityAlert = table.alerts.some(a => a.severity === 'high');

  return (
    <div 
      onClick={() => onClick(table)}
      className={`
        relative w-32 h-32 rounded-xl border-2 flex flex-col items-center justify-center cursor-pointer transition-all duration-300
        ${getStatusColor(table.status)}
        ${isSelected ? 'ring-4 ring-white shadow-lg scale-105 z-10' : 'hover:scale-105 hover:bg-opacity-30'}
        ${hasHighSeverityAlert ? 'animate-pulse-fast ring-2 ring-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]' : ''}
        ${table.highlight_class || ''}
      `}
    >
      {/* VIP Badge */}
      {table.is_vip && (
        <div className="absolute -top-2 -right-2 bg-restaurant-accent text-black text-xs font-bold px-2 py-0.5 rounded-full shadow-md z-10 flex items-center gap-1">
          <span>VIP</span>
        </div>
      )}

      {/* Alert Indicator */}
      {table.alerts.length > 0 && (
        <div className="absolute -top-2 -left-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center shadow-md z-10">
          <AlertCircle size={14} />
        </div>
      )}

      {/* Main Table Label */}
      <h3 className="text-2xl font-bold">{table.label}</h3>

      {/* Status Icon */}
      <div className="mt-2">
        {table.status === 'free' && <CheckCircle2 size={20} />}
        {table.status === 'reserved' && <Clock size={20} />}
        {table.status === 'seated' && <Utensils size={20} />}
        {table.status === 'dirty' && <Trash2 size={20} />}
      </div>

      {/* Duration / Time */}
      {(table.seated_duration || table.reservation_time) && (
        <span className="text-xs mt-1 font-mono opacity-80">
          {table.status === 'reserved' ? table.reservation_time : table.seated_duration}
        </span>
      )}

      {/* Overlay Icons (e.g., Turtle for slow pacing) */}
      <div className="absolute bottom-1 right-1 flex gap-1">
        {table.overlay_icons.map((icon, i) => (
          <span key={i} className="text-sm bg-black/50 rounded-full w-5 h-5 flex items-center justify-center backdrop-blur-sm" title="Alert Icon">
            {icon}
          </span>
        ))}
      </div>
    </div>
  );
};

export default TableNode;
