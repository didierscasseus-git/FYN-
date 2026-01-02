import React from 'react';
import type { Table, Guest } from '../../types';
import { useTranslation, Language } from '../../lib/i18n';
import Modal from '../ui/Modal';
import GuestSnapshot from '../guest/GuestSnapshot';

interface TableActionSheetProps {
  table: Table | null;
  guest: Guest | null;
  isOpen: boolean;
  onClose: () => void;
  lang?: Language;
}

interface ActionButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({ children, variant = 'primary', onClick }) => {
  const styles = {
    primary: 'bg-blue-600 hover:bg-blue-500 text-white',
    secondary: 'bg-gray-700 hover:bg-gray-600 text-gray-200',
  };
  return (
    <button 
      onClick={onClick}
      className={`w-full text-left p-4 rounded-lg text-lg font-semibold transition-colors ${styles[variant]}`}
    >
      {children}
    </button>
  );
};

const TableActionSheet: React.FC<TableActionSheetProps> = ({ table, guest, isOpen, onClose, lang = 'fr' as Language }) => {
  const t = useTranslation(lang);
  if (!table) return null;

  const getStatusLabel = () => {
    switch (table.status) {
      case 'reserved': return `${t('status_reserved')} @ ${table.reservation_time}`;
      case 'seated': return `${t('status_seated')} for ${table.seated_duration}`;
      case 'dirty': return t('status_dirty');
      default: return 'Free';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${table.label}`}>
      <div className="mb-6">
        <p className="text-gray-400">Status: <span className="text-white font-medium">{getStatusLabel()}</span></p>
      </div>

      {guest && <GuestSnapshot guest={guest} lang={lang} />}

      <div className="space-y-3 mt-6">
        {table.status === 'reserved' && <ActionButton>✅ Seat Guests</ActionButton>}
        {table.status === 'seated' && <ActionButton>📝 Start / Edit Order</ActionButton>}
        {table.status === 'seated' && <ActionButton variant="secondary">💸 Close Bill</ActionButton>}
        {table.status === 'seated' && <ActionButton variant="secondary">↔️ Split Bill</ActionButton>}
        {table.status === 'dirty' && <ActionButton>🧼 Mark as Clean</ActionButton>}
        {table.status === 'free' && <ActionButton>➕ Create Walk-In</ActionButton>}
      </div>
    </Modal>
  );
};

export default TableActionSheet;