import { Theme } from '../theme/theme';

export type ProfileMenuItemProps = {
  icon: string;
  label: string;
  onPress?: () => void;
  isSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
  color?: string;
  value?: string;
  showChevron?: boolean;
};

// User types
export interface User {
  id: string;
  email: string;
  name: string;
  token?: string;
}

// Auth form types
export interface LoginFormValues {
  email: string;
  password: string;
}

export interface SignupFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface ForgotPasswordFormValues {
  email: string;
}

// API types
export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

// Bottom Sheet ref type
export interface BottomSheetRef {
  present: () => void;
  dismiss: () => void;
}

// Style helper type
export type StylesFactory<T> = (theme: Theme) => T;
