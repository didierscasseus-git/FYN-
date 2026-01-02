import React from 'react';
import type { Table } from '../../types';
import { useTranslation, Language } from '../../lib/i18n';
import clsx from 'clsx';

interface TableBlockProps {
  table: Table;
  role: 'server' | 'host' | 'manager';
  lang?: Language;
  onClick: () => void;
}

const TableBlock: React.FC<TableBlockProps> = ({ table, role, lang = 'fr' as Language, onClick }) => {
  const t = useTranslation(lang);

  const statusStyles = {
    free: 'bg-green-800/50 border-green-500/60 hover:bg-green-700/60',
    reserved: 'bg-yellow-800/50 border-yellow-500/60 hover:bg-yellow-700/60',
    seated: 'bg-red-800/50 border-red-500/60 hover:bg-red-700/60',
    dirty: 'bg-gray-700/50 border-gray-500/60 hover:bg-gray-600/60 animate-pulse',
  };

  return (
    <button
      onClick={onClick}
      className={clsx(
        'relative w-40 h-28 border-2 rounded-lg flex flex-col items-center justify-center p-2 transition-all duration-300 shadow-lg',
        statusStyles[table.status],
        table.highlight_class
      )}
    >
      {/* VIP Indicator */}
      {table.is_vip && (
        <div className="absolute top-2 left-2 text-yellow-400" title={t('vip_guest')}>
          ⭐️
        </div>
      )}

      {/* Alert Icons */}
      <div className="absolute top-2 right-2 flex space-x-1">
        {table.overlay_icons.map((icon, idx) => (
          <span key={idx} className="text-lg">
            {icon}
          </span>
        ))}
      </div>

      <div className="text-xl font-bold text-white">{table.label}</div>

      {table.status === 'reserved' && (
        <div className="text-sm text-yellow-300">{table.reservation_time}</div>
      )}
      {table.status === 'seated' && (
        <div className="text-sm text-red-300">{table.seated_duration}</div>
      )}
    </button>
  );
};

export default TableBlock;