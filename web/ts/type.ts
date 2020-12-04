import {VIEW_MODE} from './const'

export type typeGroup = {
  id?: number;
  name?: string;
  tag?: string;
  created_at?: string;
  updated_at?: string;
};

export type typeMember = {
  group_id?: number;
  user_id?: number;
  created_at?: string;
  updated_at?: string;
};

export type typeThread = {
  id?: number;
  group_id?: number;
  name?: string;
  tag?: string;
  created_at?: string;
  updated_at?: string;
};

export type typeUser = {
  id?: number;
  name?: string;
  password?: string;
  email?: string;
  image?: string;
  provider?: string;
  created_at?: string;
  updated_at?: string;
};

export type typeTag = {
  id?: number;
  timeline_id?: number;
  name?: string;
  created_at?: string;
  updated_at?: string;
};

export type typeTimeline = {
  id?: number;
  user_id?: number;
  thread_id?: number;
  message?: string;
  created_at?: string;
  updated_at?: string;
};

export type typeViewMode = typeof VIEW_MODE[keyof typeof VIEW_MODE];