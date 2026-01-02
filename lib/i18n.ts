// A simple i18n setup for demonstration purposes.
// In a real app, use a library like 'next-intl' or 'react-i18next'.

export const translations = {
  en: {
    'venue_name': 'Maison Taverne',
    'rush_mode': 'Rush Mode',
    'filter_free': 'Free',
    'filter_reserved': 'Reserved',
    'filter_all': 'All',
    'add_booking': 'Add Booking',
    'dinner_mode': 'Dinner',
    'lounge_mode': 'Lounge',
    'status_reserved': 'Reserved',
    'status_seated': 'Seated',
    'status_dirty': 'Dirty',
    'vip_guest': 'VIP Guest',
  },
  fr: {
    'venue_name': 'Maison Taverne',
    'rush_mode': 'Mode Rush',
    'filter_free': 'Libre',
    'filter_reserved': 'Réservé',
    'filter_all': 'Tout',
    'add_booking': 'Ajouter Réservation',
    'dinner_mode': 'Dîner',
    'lounge_mode': 'Lounge',
    'status_reserved': 'Réservé',
    'status_seated': 'Assis',
    'status_dirty': 'Sale',
    'vip_guest': 'Client VIP',
  },
};

// Quebec Law Compliance: Default to French.
export type Language = 'fr' | 'en';
export const defaultLang: Language = 'fr';

export function useTranslation(lang: Language = defaultLang) {
  return function t(key: keyof typeof translations.en) {
    return translations[lang][key] || key;
  };
}