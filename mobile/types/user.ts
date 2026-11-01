// Location
export interface IGeoCoordinates {
  type: "point";
  coordinates: [number, number];
}

export interface IUserLocation {
  city?: string;
  country?: string;
  district?: string;
  isoCountryCode?: string;
  name?: string;
  postalCode?: string;
  region?: string;
  street?: string;
  streetNumber?: string;
  timezone?: string;
  coordinates?: IGeoCoordinates;
}

export interface LocationData {
  city: string;
  country: string;
  district: string;
  isoCountryCode: string;
  name: string;
  postalCode: string;
  region: string;
  street: string;
  streetNumber: string;
  timezone: string;
  longitude: number;
  latitude: number;
}
// Notification Preferences  & Privacy & Settings
export interface INotificationPreferences {
  push: boolean;
  email: boolean;
  sms: boolean;
}
export interface IPrivacyPreferences {
  profilePublic: boolean;
  showAttendance: boolean;
  allowMessages: boolean;
}

export interface IUserPreferences {
  language: string;
  theme: "light" | "dark";
  notifications: INotificationPreferences;
  privacy: IPrivacyPreferences;
}
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
  coverPhoto: string;
  bio: string;
  gender: "male" | "female" | "other";
  userType: "attendee" | "organizer" | "admin";
  location?: IUserLocation;
  preferences?: IUserPreferences;
  phone?: string;
  slug?: string;
  interest: string[];
  emailVerified: boolean;
  phoneVerified: boolean;
  totalEventsAttended?: number;
  averageRatings?: number;
  totalReviews?: number;
}
// Authentication
export interface AuthCredentials {
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
}
