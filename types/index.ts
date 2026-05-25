export interface User {
  id: string;
  login: string;
  display_name: string;
  avatar_url?: string;
  about?: string;
  telegram_username?: string;
  learning_started_at?: string;
  is_profile_private: boolean;
  roles: ("student" | "buddy" | "admin")[];
}

export interface RoadmapBlock {
  id: string;
  title: string;
  description?: string;
  sort_order: number;
  is_active: boolean;
  materials?: Material[];
  progress?: BlockProgress;
}

export interface Material {
  id: string;
  block_id: string;
  title: string;
  description?: string;
  type: "theory" | "questions" | "practice" | "homework";
  content_type: string;
  url?: string;
  content?: string;
  preview_title?: string;
  preview_description?: string;
  preview_image?: string;
  source?: string;
  is_required: boolean;
  is_active: boolean;
  sort_order: number;
  viewed?: boolean;
}

export interface BlockProgress {
  status:
    | "not_started"
    | "in_progress"
    | "waiting_buddy_confirmation"
    | "approved";
  percent: number;
  required_viewed: number;
  required_total: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  reward_bonus: number;
  image_url: string;
  is_active: boolean;
  sort_order: number;
  received?: boolean;
  received_at?: string;
}

export interface BonusTransaction {
  id: string;
  type: string;
  amount: number;
  reason: string;
  created_at: string;
}

export interface Interview {
  id: string;
  type: "mock" | "real";
  student_id: string;
  buddy_id?: string;
  url?: string;
  company?: string;
  position?: string;
  grade?: string;
  stack?: string;
  date: string;
  status: string;
  result?: string;
  feedback?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  student_id: string;
  buddy_id?: string;
  type: string;
  start_datetime: string;
  end_datetime?: string;
  description?: string;
  reminder_enabled?: boolean;
}

export interface FinalCheck {
  id: string;
  type: "final_technical" | "final_roast";
  status: string;
  scheduled_at?: string;
  completed_at?: string;
}

export interface OneOnOneRequest {
  id: string;
  student_id: string;
  status: "pending" | "approved" | "rejected" | "completed" | "cancelled";
  processed_by?: string;
  processed_at?: string;
  created_at: string;
  updated_at: string;
}
