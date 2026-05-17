export type UserModel = {
  id: bigint;
  fullName: string;
  email: string;
  phone?: string | null;
  gender?: string | null;
  isPhoneVerified: boolean;
  isEmailVerified: boolean;
  emailVerifiedAt?: Date | null;
  status: boolean;
  orderCount: number;
  loginMedium?: string | null;
  socialId?: string | null;
  password: string;
  rememberToken?: string | null;
  profilePhotoPath?: string | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
};
