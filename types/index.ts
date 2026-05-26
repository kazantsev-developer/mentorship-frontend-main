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

export interface RoadmapMaterial {
  id: string;
  block_id: string;
  title: string;
  description?: string;
  type: "theory" | "questions" | "practice" | "homework";
  content_type: "url" | "youtube" | "github" | "article" | "text" | "file";
  url?: string;
  content?: string;
  is_required: boolean;
  is_active: boolean;
  sort_order: number;
  viewed: boolean;
}

export interface RoadmapBlock {
  id: string;
  title: string;
  description?: string;
  sort_order: number;
  is_active: boolean;
  materials: RoadmapMaterial[];
  progress?: {
    status:
      | "not_started"
      | "in_progress"
      | "waiting_buddy_confirmation"
      | "approved";
    percent: number;
  };
}

export interface BonusTransaction {
  id: string;
  user_id: string;
  type:
    | "achievement_reward"
    | "discount_conversion"
    | "one_on_one_spend"
    | "manual_adjustment"
    | "refund";
  amount: number;
  reason: string;
  created_at: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  reward_bonus: number;
  image_url: string;
  condition_type: string;
  is_active: boolean;
  unlocked: boolean;
  progress_current?: number;
  progress_target?: number;
}
