import React, { useState, useEffect } from 'react';
import { Table, Guest, Staff, AIInsightResponse } from '../types';
import { MOCK_GUESTS, MOCK_STAFF } from '../services/mockData';
import { analyzeTableStatus } from '../services/geminiService';
import { Sparkles, X, User, Clock, DollarSign, AlertTriangle, ShieldAlert, Activity } from 'lucide-react';

interface TableDetailsProps {
  table: Table;
  onClose: () => void;
  onUpdateTable: (updatedTable: Table) => void;
}

const TableDetails: React.FC<TableDetailsProps> = ({ table, onClose, onUpdateTable }) => {
  const [insight, setInsight] = useState<AIInsightResponse | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  // Reset insight when table changes
  useEffect(() => {
    setInsight(null);
  }, [table.id]);

  const guest = table.guest_id ? MOCK_GUESTS[table.guest_id] : undefined;
  const staff = table.server_id ? MOCK_STAFF[table.server_id] : undefined;

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      const result = await analyzeTableStatus(table, guest, staff);
      setInsight(result);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleDismissAlert = (index: number) => {
    const newAlerts = [...table.alerts];
    newAlerts.splice(index, 1);
    onUpdateTable({ ...table, alerts: newAlerts });
  };

  return (
    <div className="h-full bg-restaurant-panel border-l border-gray-700 p-6 overflow-y-auto flex flex-col animate-slide-in-right">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-white">Table {table.label}</h2>
          <span className={`text-sm uppercase tracking-wider font-semibold 
            ${table.status === 'free' ? 'text-restaurant-free' : 
              table.status === 'reserved' ? 'text-restaurant-reserved' : 
              table.status === 'seated' ? 'text-restaurant-seated' : 'text-restaurant-dirty'}`}>
            {table.status}
          </span>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <X size={24} />
        </button>
      </div>

      {/* Alerts Section */}
      {table.alerts.length > 0 && (
        <div className="mb-6 space-y-3">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Active Alerts</h3>
          {table.alerts.map((alert, idx) => (
            <div key={idx} className={`p-4 rounded-lg border-l-4 ${
              alert.severity === 'high' ? 'bg-red-900/30 border-red-500' :
              alert.severity === 'medium' ? 'bg-orange-900/30 border-orange-500' :
              'bg-blue-900/30 border-blue-500'
            }`}>
              <div className="flex justify-between items-start">
                <div className="flex gap-2">
                  <AlertTriangle size={18} className={
                    alert.severity === 'high' ? 'text-red-500' :
                    alert.severity === 'medium' ? 'text-orange-500' : 'text-blue-500'
                  } />
                  <div>
                    <p className="font-semibold text-sm text-gray-200">{alert.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{new Date(alert.created_at).toLocaleTimeString()}</p>
                  </div>
                </div>
                {alert.action_required && (
                   <button 
                     onClick={() => handleDismissAlert(idx)}
                     className="text-xs bg-white/10 hover:bg-white/20 px-2 py-1 rounded transition-colors"
                   >
                     Clear
                   </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-restaurant-dark p-4 rounded-lg">
          <div className="flex items-center gap-2 text-gray-400 mb-1">
            <Clock size={16} />
            <span className="text-xs uppercase">Duration</span>
          </div>
          <p className="font-mono text-xl">{table.seated_duration || '--:--'}</p>
        </div>
        <div className="bg-restaurant-dark p-4 rounded-lg">
          <div className="flex items-center gap-2 text-gray-400 mb-1">
            <User size={16} />
            <span className="text-xs uppercase">Staff</span>
          </div>
          <p className="font-medium">{staff?.name || 'Unassigned'}</p>
        </div>
      </div>

      {/* Guest Info */}
      {guest && (
        <div className="bg-restaurant-dark p-4 rounded-lg mb-6 border border-gray-700">
          <div className="flex justify-between items-start mb-3">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-restaurant-accent text-black rounded-full flex items-center justify-center font-bold text-lg">
                  {guest.first_name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-white">{guest.first_name} {guest.last_name}</h4>
                  <p className="text-xs text-gray-400">{guest.visit_count} visits • ${guest.average_spend} Avg</p>
                </div>
             </div>
             {table.is_vip && <span className="text-restaurant-accent text-xs font-bold border border-restaurant-accent px-2 py-1 rounded">VIP</span>}
          </div>
          <div className="text-sm text-gray-300">
            <p className="italic mb-2">"{guest.notes}"</p>
            <div className="flex flex-wrap gap-2">
              {guest.tags.map(tag => (
                <span key={tag} className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300">{tag}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* AI Manager Section */}
      <div className="mt-auto pt-6 border-t border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="flex items-center gap-2 font-bold text-lg">
            <Sparkles className="text-restaurant-accent" />
            AI Manager Insight
          </h3>
          <button 
            onClick={handleAnalyze}
            disabled={analyzing}
            className="bg-restaurant-accent text-black px-4 py-2 rounded-lg font-bold text-sm hover:bg-yellow-400 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {analyzing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent"></div>
                Analyzing...
              </>
            ) : 'Analyze Now'}
          </button>
        </div>

        {insight ? (
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-5 border border-gray-600 shadow-lg animate-fade-in">
             <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold uppercase text-gray-400">Analysis</span>
                <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded ${
                  insight.priority_score > 7 ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                }`}>
                  <Activity size={12} />
                  Priority: {insight.priority_score}/10
                </div>
             </div>
             <p className="text-gray-200 text-sm mb-4 leading-relaxed">{insight.analysis}</p>
             
             <div className="space-y-2">
               <span className="text-xs font-bold uppercase text-gray-400">Suggested Actions</span>
               {insight.suggested_actions.map((action, i) => (
                 <div key={i} className="flex items-start gap-3 bg-black/20 p-2 rounded">
                   <div className="min-w-[20px] h-5 bg-restaurant-accent/20 text-restaurant-accent rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                     {i + 1}
                   </div>
                   <p className="text-sm text-gray-300">{action}</p>
                 </div>
               ))}
             </div>
          </div>
        ) : (
          <div className="text-center p-8 text-gray-500 bg-black/20 rounded-xl border border-dashed border-gray-700">
            <Sparkles className="mx-auto mb-2 opacity-50" size={32} />
            <p className="text-sm">Run AI analysis to check pacing, spend anomalies, and service gaps.</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default TableDetails;