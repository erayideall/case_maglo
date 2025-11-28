export interface ValidationRule {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: string) => boolean;
    message: string;
}

export interface ValidationSchema {
    [key: string]: ValidationRule[];
}

export interface ValidationErrors {
    [key: string]: string;
}

// E-posta validasyonu
export const validateEmail = (email: string): string | null => {
    if (!email) {
        return 'Please enter an email address';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return 'Please enter a valid email address';
    }

    return null;
};

// Şifre validasyonu
export const validatePassword = (password: string): string | null => {
    if (!password) {
        return 'Password is required';
    }

    if (password.length < 6) {
        return 'Şifre en az 6 karakter olmalıdır';
    }

    if (password.length > 50) {
        return 'Şifre en fazla 50 karakter olabilir';
    }

    return null;
};

// Ad Soyad validasyonu
export const validateFullName = (name: string): string | null => {
    if (!name) {
        return 'Ad Soyad gereklidir';
    }

    if (name.trim().length < 2) {
        return 'Ad Soyad en az 2 karakter olmalıdır';
    }

    if (name.trim().length > 50) {
        return 'Ad Soyad en fazla 50 karakter olabilir';
    }

    // En az bir boşluk içermeli (ad ve soyad için)
    if (!name.trim().includes(' ')) {
        return 'Lütfen ad ve soyadınızı giriniz';
    }

    return null;
};

// Şifre tekrarı validasyonu
export const validatePasswordConfirm = (password: string, confirmPassword: string): string | null => {
    if (!confirmPassword) {
        return 'Şifre tekrarı gereklidir';
    }

    if (password !== confirmPassword) {
        return 'Şifreler eşleşmiyor';
    }

    return null;
};

// Genel validasyon fonksiyonu
export const validateField = (
    value: string,
    rules: ValidationRule[]
): string | null => {
    for (const rule of rules) {
        if (rule.required && !value) {
            return rule.message;
        }

        if (rule.minLength && value.length < rule.minLength) {
            return rule.message;
        }

        if (rule.maxLength && value.length > rule.maxLength) {
            return rule.message;
        }

        if (rule.pattern && !rule.pattern.test(value)) {
            return rule.message;
        }

        if (rule.custom && !rule.custom(value)) {
            return rule.message;
        }
    }

    return null;
};

// Tüm form validasyonu
export const validateForm = (
    values: { [key: string]: string },
    schema: ValidationSchema
): ValidationErrors => {
    const errors: ValidationErrors = {};

    Object.keys(schema).forEach((fieldName) => {
        const error = validateField(values[fieldName] || '', schema[fieldName]);
        if (error) {
            errors[fieldName] = error;
        }
    });

    return errors;
};
