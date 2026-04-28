export type UserProfile = {
  userId: string;
  fullName: string;
  phone: string;
  country: string;
  city: string;
  favoriteArtisanId?: string | null;
  favoriteProductIds: string[];
};
