import { AuthInfo } from '../types/Auth';
export const MESSAGES_STORAGE_KEY = 'tournament_chat_messages';
export const MODE_STORAGE_KEY = 'tournament_app_mode';
export const ADMIN_AUTH_KEYS: AuthInfo = {
  login: 'tournament_admin_login',
  pass: 'tournament_admin_password',
};
export const JUDGE_AUTH_KEYS: AuthInfo = {
  login: 'tournament_judge_login',
  pass: 'tournament_judge_password',
};
