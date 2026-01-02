import React, { useState } from 'react';
import { Table } from './types';
import { INITIAL_TABLES } from './services/mockData';
import TableNode from './components/TableNode';
import TableDetails from './components/TableDetails';
import { Utensils, Bell, Settings, LayoutGrid, Search } from 'lucide-react';

const App: React.FC = () => {
  const [tables, setTables] = useState<Table[]>(INITIAL_TABLES);
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'alert' | 'vip'>('all');

  const selectedTable = tables.find(t => t.id === selectedTableId);

  const handleTableClick = (table: Table) => {
    setSelectedTableId(table.id === selectedTableId ? null : table.id);
  };

  const updateTable = (updatedTable: Table) => {
    setTables(tables.map(t => t.id === updatedTable.id ? updatedTable : t));
  };

  const filteredTables = tables.filter(t => {
    if (filter === 'alert') return t.alerts.length > 0;
    if (filter === 'vip') return t.is_vip;
    return true;
  });

  const getStats = () => {
    return {
      seated: tables.filter(t => t.status === 'seated').length,
      alerts: tables.reduce((acc, t) => acc + t.alerts.length, 0),
      vip: tables.filter(t => t.is_vip && t.status === 'seated').length,
    };
  };

  const stats = getStats();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-restaurant-dark text-gray-100 font-sans">
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full relative transition-all duration-300 ease-in-out">
        
        {/* Top Navigation Bar */}
        <header className="h-16 border-b border-gray-800 flex items-center justify-between px-8 bg-restaurant-panel z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-restaurant-accent rounded-lg flex items-center justify-center text-black shadow-[0_0_15px_rgba(234,179,8,0.3)]">
              <Utensils size={20} strokeWidth={2.5} />
            </div>
            <h1 className="text-xl font-bold tracking-tight">DineCommand <span className="text-restaurant-accent font-light">AI</span></h1>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center bg-black/30 rounded-full px-4 py-2 border border-gray-700 gap-4">
               <div className="flex items-center gap-2 text-sm text-gray-400">
                 <span className="w-2 h-2 rounded-full bg-restaurant-seated"></span>
                 <span>Seated: <b className="text-white">{stats.seated}</b></span>
               </div>
               <div className="w-px h-4 bg-gray-700"></div>
               <div className="flex items-center gap-2 text-sm text-gray-400">
                 <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                 <span>Alerts: <b className="text-white">{stats.alerts}</b></span>
               </div>
               <div className="w-px h-4 bg-gray-700"></div>
               <div className="flex items-center gap-2 text-sm text-gray-400">
                 <span className="w-2 h-2 rounded-full bg-restaurant-accent"></span>
                 <span>VIP: <b className="text-white">{stats.vip}</b></span>
               </div>
            </div>

            <button className="p-2 hover:bg-gray-700 rounded-full transition-colors relative">
              <Bell size={20} />
              {stats.alerts > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>}
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 border-2 border-white/20"></div>
          </div>
        </header>

        {/* Filter / Toolbar */}
        <div className="h-14 border-b border-gray-800 flex items-center px-8 gap-4 bg-restaurant-dark/95 backdrop-blur z-10">
          <button 
            onClick={() => setFilter('all')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${filter === 'all' ? 'bg-white text-black' : 'hover:bg-gray-800 text-gray-400'}`}
          >
            All Tables
          </button>
          <button 
             onClick={() => setFilter('alert')}
             className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${filter === 'alert' ? 'bg-red-500 text-white' : 'hover:bg-gray-800 text-gray-400'}`}
          >
            <Bell size={14} /> Attention Needed
          </button>
          <button 
             onClick={() => setFilter('vip')}
             className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${filter === 'vip' ? 'bg-restaurant-accent text-black' : 'hover:bg-gray-800 text-gray-400'}`}
          >
            <Settings size={14} /> VIP Guests
          </button>
          
          <div className="ml-auto flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-lg border border-gray-700 text-gray-400 w-64">
             <Search size={16} />
             <input type="text" placeholder="Search guests or tables..." className="bg-transparent border-none outline-none text-sm w-full placeholder-gray-600" />
          </div>
        </div>

        {/* Floor Plan Grid */}
        <div className="flex-1 overflow-auto p-8 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-800/20 via-restaurant-dark to-restaurant-dark">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 max-w-7xl mx-auto pb-20">
            {filteredTables.map(table => (
              <div key={table.id} className="flex justify-center">
                <TableNode 
                  table={table} 
                  isSelected={selectedTableId === table.id} 
                  onClick={handleTableClick} 
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Sidebar - Details Panel */}
      <div 
        className={`
          fixed inset-y-0 right-0 w-96 bg-restaurant-panel shadow-2xl transform transition-transform duration-300 ease-in-out z-30
          ${selectedTableId ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {selectedTable && (
          <TableDetails 
            table={selectedTable} 
            onClose={() => setSelectedTableId(null)} 
            onUpdateTable={updateTable}
          />
        )}
      </div>

      {/* Overlay for mobile/tablet when sidebar is open */}
      {selectedTableId && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setSelectedTableId(null)}
        />
      )}
    </div>
  );
};

export default App;
