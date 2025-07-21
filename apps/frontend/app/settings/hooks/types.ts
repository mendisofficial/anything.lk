export interface City {
    id: number;
    name: string;
}

export interface ProfileData {
    firstname: string;
    lastname: string;
    since: string;
}

export interface Address {
    id: number;
    lineOne: string;
    lineTwo: string;
    postalCode: string;
    city: City;
    label: string;
    isDefault: boolean;
}

export interface ProfileUpdatePayload {
    firstName: string;
    lastName: string;
}

export interface AddressPayload {
    lineOne: string;
    lineTwo: string;
    postalCode: string;
    cityId: number;
    label: string;
    isDefault: boolean;
    addressId?: number; // For updates
}

export interface PasswordUpdatePayload {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}
