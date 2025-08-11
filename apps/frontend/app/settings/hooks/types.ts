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
    mobile: string;
    firstName?: string;
    lastName?: string;
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
    // New required fields by backend
    firstName: string;
    lastName: string;
    mobile: string;
}

export interface PasswordUpdatePayload {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

// Product related types
export interface Brand {
    id: number;
    name: string;
}

export interface Model {
    id: number;
    name: string;
    brand: Brand;
}

export interface Color {
    id: number;
    name: string;
}

export interface Condition {
    id: number;
    name: string;
}

export interface Storage {
    id: number;
    name: string;
}

export interface ProductFormData {
    brandId: number;
    modelId: number;
    title: string;
    description: string;
    storageId: number;
    colorId: number;
    conditionId: number;
    price: number;
    quantity: number;
    images: {
        image1?: File;
        image2?: File;
        image3?: File;
    };
}
