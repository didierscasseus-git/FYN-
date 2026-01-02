// User specified interfaces
export interface Alert {
  type: 'slow_pacing' | 'vip_seated' | 'low_rating' | 'high_spend';
  severity: 'low' | 'medium' | 'high';
  message: string;
  created_at: string;
  action_required: boolean;
  visible_to: Array<'server' | 'host' | 'manager'>;
}

export interface Table {
  id: string;
  label: string;
  status: 'free' | 'reserved' | 'seated' | 'dirty';
  guest_id?: string;
  server_id?: string;
  order_id?: string;
  alerts: Alert[];
  overlay_icons: string[];
  highlight_class?: string;
  reservation_time?: string;
  seated_duration?: string;
  is_vip?: boolean;
}

// App specific types
export interface Guest {
  id: string;
  first_name: string;
  last_name: string;
  phone?: string;
  tags: string[];
  average_spend: number;
  visit_count: number;
  last_visit?: string;
  language?: string;
  allergies?: string[];
  notes?: string;
  // Deprecated/Legacy fields kept optional if needed, but removing to enforce new structure
  // name, total_spend_ytd, preferences removed
}

export interface Staff {
  id: string;
  name: string;
  role: 'server' | 'host' | 'manager';
}

export interface AIInsightResponse {
  analysis: string;
  suggested_actions: string[];
  priority_score: number;
}