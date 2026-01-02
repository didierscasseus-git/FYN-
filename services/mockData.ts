import { Table, Guest, Staff } from '../types';

export const MOCK_GUESTS: Record<string, Guest> = {
  'g1': { 
    id: 'g1', 
    first_name: 'Jonathan', 
    last_name: 'Gold', 
    notes: 'Food critic, prefers quiet corner.', 
    average_spend: 430, 
    visit_count: 12, 
    tags: ['Critic', 'Regular'],
    allergies: [],
    language: 'en'
  },
  'g2': { 
    id: 'g2', 
    first_name: 'Sarah', 
    last_name: 'Connor', 
    notes: 'Allergic to nuts.', 
    average_spend: 300, 
    visit_count: 4, 
    tags: [],
    allergies: ['Nuts'],
    language: 'en'
  },
  'g3': { 
    id: 'g3', 
    first_name: 'Tony', 
    last_name: 'Stark', 
    notes: 'Loves the expensive wine list.', 
    average_spend: 2000, 
    visit_count: 25, 
    tags: ['VIP', 'High Roller'],
    allergies: [],
    language: 'en'
  },
};

export const MOCK_STAFF: Record<string, Staff> = {
  's1': { id: 's1', name: 'Marco P.', role: 'server' },
  's2': { id: 's2', name: 'Julia C.', role: 'server' },
  's3': { id: 's3', name: 'Gordon R.', role: 'manager' },
};

export const INITIAL_TABLES: Table[] = [
  {
    id: 't1',
    label: '101',
    status: 'seated',
    guest_id: 'g1',
    server_id: 's1',
    alerts: [],
    overlay_icons: [],
    seated_duration: '45m',
    is_vip: true,
  },
  {
    id: 't2',
    label: '102',
    status: 'seated',
    guest_id: 'g3',
    server_id: 's2',
    alerts: [
      {
        type: 'vip_seated',
        severity: 'high',
        message: 'VIP Guest Tony Stark seated. Notify Manager.',
        created_at: new Date().toISOString(),
        action_required: true,
        visible_to: ['manager', 'host'],
      },
      {
        type: 'high_spend',
        severity: 'medium',
        message: 'Table spend exceeded $1k.',
        created_at: new Date().toISOString(),
        action_required: false,
        visible_to: ['manager'],
      }
    ],
    overlay_icons: ['👑', '💰'],
    seated_duration: '1h 20m',
    is_vip: true,
    highlight_class: 'ring-4 ring-yellow-500',
  },
  {
    id: 't3',
    label: '103',
    status: 'dirty',
    server_id: 's1',
    alerts: [],
    overlay_icons: [],
  },
  {
    id: 't4',
    label: '104',
    status: 'free',
    alerts: [],
    overlay_icons: [],
  },
  {
    id: 't5',
    label: '201',
    status: 'seated',
    server_id: 's2',
    alerts: [
      {
        type: 'slow_pacing',
        severity: 'medium',
        message: 'No courses ordered in last 45 mins.',
        created_at: new Date().toISOString(),
        action_required: true,
        visible_to: ['server', 'manager'],
      }
    ],
    overlay_icons: ['🐢'],
    seated_duration: '2h 05m',
    highlight_class: 'ring-2 ring-red-500',
  },
  {
    id: 't6',
    label: '202',
    status: 'reserved',
    reservation_time: '19:30',
    alerts: [],
    overlay_icons: [],
  },
  // Add more generic tables to fill grid
  ...Array.from({ length: 9 }).map((_, i) => ({
    id: `t${10 + i}`,
    label: `30${i + 1}`,
    status: Math.random() > 0.7 ? 'free' : (Math.random() > 0.5 ? 'seated' : 'dirty'),
    server_id: Math.random() > 0.5 ? 's1' : 's2',
    alerts: [] as any[],
    overlay_icons: [] as string[],
    seated_duration: '15m'
  } as Table))
];