import React from 'react';
import type { Guest } from '../../types';
import { useTranslation, Language } from '../../lib/i18n';

interface GuestSnapshotProps {
  guest: Guest;
  lang?: Language;
}

const GuestSnapshot: React.FC<GuestSnapshotProps> = ({ guest, lang = 'fr' as Language }) => {
  const t = useTranslation(lang);

  return (
    <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4 mt-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-bold text-white">
          {guest.first_name} {guest.last_name} {guest.tags.includes('VIP') && '⭐️'}
        </h3>
        {guest.language && (
          <span className="text-xs font-mono bg-gray-700 px-2 py-1 rounded">{guest.language.toUpperCase()}</span>
        )}
      </div>
      <div className="text-sm text-gray-300 space-y-1">
        <p>Visits: {guest.visit_count} | Avg Spend: ${guest.average_spend}</p>
        {guest.allergies && guest.allergies.length > 0 && <p className="text-orange-400">Allergy: {guest.allergies.join(', ')}</p>}
        {guest.notes && <p>Note: "{guest.notes}"</p>}
      </div>
    </div>
  );
};

export default GuestSnapshot;