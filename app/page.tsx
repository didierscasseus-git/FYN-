'use client';

import React, { useState, useEffect } from 'react';
import TableBlock from '../components/table-map/TableBlock';
import TableActionSheet from '../components/table-map/TableActionSheet';
import type { Table, Guest } from '../types';
import { useTranslation, Language } from '../lib/i18n';

// --- MOCK DATA ---
const initialTables: Table[] = [
  { id: 'a1', label: 'Booth A1', status: 'free', alerts: [], overlay_icons: [] },
  { id: 'a2', label: 'Booth A2', status: 'reserved', reservation_time: '7:30 PM', alerts: [], overlay_icons: [], is_vip: true, guest_id: 'guest1' },
  { id: 'a3', label: 'Table A3', status: 'seated', seated_duration: '0:45', alerts: [], overlay_icons: [], guest_id: 'guest2' },
  { id: 'b1', label: 'Table B1', status: 'free', alerts: [], overlay_icons: [] },
  { id: 'b2', label: 'Table B2', status: 'dirty', alerts: [], overlay_icons: [] },
  { id: 'b3', label: 'Bar 1', status: 'seated', seated_duration: '1:15', alerts: [], overlay_icons: [] },
];

const mockGuests: Record<string, Guest> = {
  guest1: { id: 'guest1', first_name: 'Julien', last_name: 'Tremblay', phone: '514-555-1234', tags: ['VIP'], average_spend: 180, visit_count: 4, last_visit: '2025-12-15', language: 'fr', allergies: ['shellfish'], notes: 'Prefers quiet tables' },
  guest2: { id: 'guest2', first_name: 'Olivia', last_name: 'Martin', phone: '438-555-5678', tags: [], average_spend: 95, visit_count: 2, last_visit: '2026-01-02', language: 'en' },
};
// --- END MOCK DATA ---

const useMockTableSubscription = (setTables: React.Dispatch<React.SetStateAction<Table[]>>) => {
  useEffect(() => {
    const interval = setInterval(() => {
      setTables(prevTables => prevTables.map(t =>
        t.id === 'a3'
          ? {
              ...t,
              alerts: [{ type: 'slow_pacing', message: 'Pacing alert!', severity: 'high', created_at: '', action_required: true, visible_to: ['server'] }],
              overlay_icons: ['⏱'],
              highlight_class: 'animate-pulse border-4 border-orange-500',
            }
          : t
      ));
    }, 8000);
    return () => clearInterval(interval);
  }, [setTables]);
};

export default function FloorMapPage() {
  const [tables, setTables] = useState<Table[]>(initialTables);
  const [lang, setLang] = useState<Language>('fr');
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const t = useTranslation(lang);
  const role = 'server';

  useMockTableSubscription(setTables);

  const handleTableClick = (table: Table) => {
    setSelectedTable(table);
  };

  const handleCloseSheet = () => {
    setSelectedTable(null);
  };

  const selectedGuest = selectedTable?.guest_id ? mockGuests[selectedTable.guest_id] : null;

  return (
    <>
      <main className="p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Fyn Timing</h1>
            <p className="text-gray-400">{t('venue_name')}</p>
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={() => setLang(l => l === 'fr' ? 'en' : 'fr')} className="p-2 rounded-md bg-gray-700">
              {lang.toUpperCase()}
            </button>
            <div className="flex items-center space-x-2">
              <span className="text-gray-300">{t('rush_mode')}</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
              </label>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {tables.map(table => (
            <TableBlock
              key={table.id}
              table={table}
              role={role}
              lang={lang}
              onClick={() => handleTableClick(table)}
            />
          ))}
        </div>
      </main>

      <TableActionSheet
        isOpen={!!selectedTable}
        onClose={handleCloseSheet}
        table={selectedTable}
        guest={selectedGuest}
        lang={lang}
      />
    </>
  );
}