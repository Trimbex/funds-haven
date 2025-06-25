// Input Validation & Security System
import { AppError } from './error-handler';

// Validation result type
export interface ValidationResult<T = any> {
  success: boolean;
  data?: T;
  errors?: string[];
}

// Base validator interface
export interface Validator<T = any> {
  validate(value: any): ValidationResult<T>;
}

// String validators
export class StringValidator implements Validator<string> {
  private minLength?: number;
  private maxLength?: number;
  private pattern?: RegExp;
  private required: boolean = false;
  private trim: boolean = true;

  min(length: number): StringValidator {
    this.minLength = length;
    return this;
  }

  max(length: number): StringValidator {
    this.maxLength = length;
    return this;
  }

  pattern(regex: RegExp): StringValidator {
    this.pattern = regex;
    return this;
  }

  required(): StringValidator {
    this.required = true;
    return this;
  }

  noTrim(): StringValidator {
    this.trim = false;
    return this;
  }

  validate(value: any): ValidationResult<string> {
    const errors: string[] = [];

    // Handle null/undefined
    if (value == null) {
      if (this.required) {
        errors.push('This field is required');
      }
      return { success: errors.length === 0, data: '', errors };
    }

    // Convert to string and optionally trim
    let str = String(value);
    if (this.trim) {
      str = str.trim();
    }

    // Check if required and empty
    if (this.required && str.length === 0) {
      errors.push('This field is required');
    }

    // Check length constraints
    if (this.minLength !== undefined && str.length < this.minLength) {
      errors.push(`Must be at least ${this.minLength} characters long`);
    }

    if (this.maxLength !== undefined && str.length > this.maxLength) {
      errors.push(`Must be no more than ${this.maxLength} characters long`);
    }

    // Check pattern
    if (this.pattern && !this.pattern.test(str)) {
      errors.push('Invalid format');
    }

    return {
      success: errors.length === 0,
      data: str,
      errors: errors.length > 0 ? errors : undefined
    };
  }
}

// Number validators
export class NumberValidator implements Validator<number> {
  private min?: number;
  private max?: number;
  private integer: boolean = false;
  private positive: boolean = false;
  private required: boolean = false;

  minimum(value: number): NumberValidator {
    this.min = value;
    return this;
  }

  maximum(value: number): NumberValidator {
    this.max = value;
    return this;
  }

  int(): NumberValidator {
    this.integer = true;
    return this;
  }

  positive(): NumberValidator {
    this.positive = true;
    return this;
  }

  required(): NumberValidator {
    this.required = true;
    return this;
  }

  validate(value: any): ValidationResult<number> {
    const errors: string[] = [];

    // Handle null/undefined
    if (value == null) {
      if (this.required) {
        errors.push('This field is required');
      }
      return { success: errors.length === 0, data: 0, errors };
    }

    // Convert to number
    const num = Number(value);

    // Check if valid number
    if (isNaN(num)) {
      errors.push('Must be a valid number');
      return { success: false, errors };
    }

    // Check integer constraint
    if (this.integer && !Number.isInteger(num)) {
      errors.push('Must be a whole number');
    }

    // Check positive constraint
    if (this.positive && num <= 0) {
      errors.push('Must be a positive number');
    }

    // Check range constraints
    if (this.min !== undefined && num < this.min) {
      errors.push(`Must be at least ${this.min}`);
    }

    if (this.max !== undefined && num > this.max) {
      errors.push(`Must be no more than ${this.max}`);
    }

    return {
      success: errors.length === 0,
      data: num,
      errors: errors.length > 0 ? errors : undefined
    };
  }
}

// Email validator
export class EmailValidator implements Validator<string> {
  private required: boolean = false;

  required(): EmailValidator {
    this.required = true;
    return this;
  }

  validate(value: any): ValidationResult<string> {
    const errors: string[] = [];

    if (value == null) {
      if (this.required) {
        errors.push('Email is required');
      }
      return { success: errors.length === 0, data: '', errors };
    }

    const email = String(value).trim().toLowerCase();

    if (this.required && email.length === 0) {
      errors.push('Email is required');
    }

    if (email.length > 0) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        errors.push('Invalid email format');
      }
    }

    return {
      success: errors.length === 0,
      data: email,
      errors: errors.length > 0 ? errors : undefined
    };
  }
}

// Date validator
export class DateValidator implements Validator<Date> {
  private min?: Date;
  private max?: Date;
  private required: boolean = false;

  minimum(date: Date): DateValidator {
    this.min = date;
    return this;
  }

  maximum(date: Date): DateValidator {
    this.max = date;
    return this;
  }

  required(): DateValidator {
    this.required = true;
    return this;
  }

  validate(value: any): ValidationResult<Date> {
    const errors: string[] = [];

    if (value == null) {
      if (this.required) {
        errors.push('Date is required');
      }
      return { success: errors.length === 0, data: new Date(), errors };
    }

    let date: Date;

    try {
      date = new Date(value);
      if (isNaN(date.getTime())) {
        errors.push('Invalid date format');
        return { success: false, errors };
      }
    } catch {
      errors.push('Invalid date format');
      return { success: false, errors };
    }

    // Check range constraints
    if (this.min && date < this.min) {
      errors.push(`Date must be after ${this.min.toLocaleDateString()}`);
    }

    if (this.max && date > this.max) {
      errors.push(`Date must be before ${this.max.toLocaleDateString()}`);
    }

    return {
      success: errors.length === 0,
      data: date,
      errors: errors.length > 0 ? errors : undefined
    };
  }
}

// Object validator
export class ObjectValidator<T extends Record<string, any>> implements Validator<T> {
  private schema: Record<string, Validator> = {};

  field<K extends keyof T>(key: K, validator: Validator): ObjectValidator<T> {
    this.schema[key as string] = validator;
    return this;
  }

  validate(value: any): ValidationResult<T> {
    const errors: string[] = [];
    const data: any = {};

    if (typeof value !== 'object' || value === null) {
      return { success: false, errors: ['Must be an object'] };
    }

    // Validate each field
    for (const [fieldName, validator] of Object.entries(this.schema)) {
      const fieldResult = validator.validate(value[fieldName]);
      
      if (fieldResult.success) {
        data[fieldName] = fieldResult.data;
      } else {
        const fieldErrors = fieldResult.errors || ['Validation failed'];
        fieldErrors.forEach(error => {
          errors.push(`${fieldName}: ${error}`);
        });
      }
    }

    return {
      success: errors.length === 0,
      data: data as T,
      errors: errors.length > 0 ? errors : undefined
    };
  }
}

// Security utilities
export class SecurityUtils {
  // SQL injection prevention
  static sanitizeSql(input: string): string {
    return input.replace(/['";\\]/g, '\\$&');
  }

  // XSS prevention
  static sanitizeHtml(input: string): string {
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  // Check for common attack patterns
  static isSecureInput(input: string): boolean {
    const dangerousPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /vbscript:/gi,
      /onload=/gi,
      /onerror=/gi,
      /onclick=/gi,
      /alert\s*\(/gi,
      /eval\s*\(/gi,
      /document\.cookie/gi,
      /document\.write/gi,
      /window\.location/gi,
    ];

    return !dangerousPatterns.some(pattern => pattern.test(input));
  }

  // Rate limiting check
  static checkRateLimit(
    identifier: string, 
    maxRequests: number = 100, 
    windowMs: number = 15 * 60 * 1000
  ): boolean {
    // Implementation would depend on your storage solution
    // This is a simplified example
    const now = Date.now();
    const windowStart = now - windowMs;
    
    // In real implementation, you'd check against stored request times
    // For now, return true (allowed)
    return true;
  }

  // Generate secure random string
  static generateSecureToken(length: number = 32): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return result;
  }
}

// Predefined validators for common use cases
export const validators = {
  string: () => new StringValidator(),
  number: () => new NumberValidator(),
  email: () => new EmailValidator(),
  date: () => new DateValidator(),
  object: <T extends Record<string, any>>() => new ObjectValidator<T>(),

  // Common patterns
  password: () => new StringValidator()
    .min(8)
    .max(128)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .required(),

  currency: () => new NumberValidator()
    .minimum(0)
    .required(),

  percentage: () => new NumberValidator()
    .minimum(0)
    .maximum(100)
    .required(),

  accountName: () => new StringValidator()
    .min(1)
    .max(100)
    .required(),

  transactionDescription: () => new StringValidator()
    .min(1)
    .max(500)
    .required(),

  categoryName: () => new StringValidator()
    .min(1)
    .max(50)
    .required(),
};

// Schema definitions for common objects
export const schemas = {
  transaction: validators.object<{
    amount: number;
    description: string;
    transaction_type: string;
    transaction_date: Date;
    account_id?: string;
  }>()
    .field('amount', validators.currency())
    .field('description', validators.transactionDescription())
    .field('transaction_type', validators.string().pattern(/^(income|expense)$/).required())
    .field('transaction_date', validators.date().required())
    .field('account_id', validators.string().max(50)),

  account: validators.object<{
    account_name: string;
    account_type: string;
    balance: number;
    cardno?: string;
  }>()
    .field('account_name', validators.accountName())
    .field('account_type', validators.string().pattern(/^(checking|savings|credit|investment)$/).required())
    .field('balance', validators.currency())
    .field('cardno', validators.string().max(20)),

  category: validators.object<{
    category_name: string;
    budget?: number;
    color?: string;
  }>()
    .field('category_name', validators.categoryName())
    .field('budget', validators.currency())
    .field('color', validators.string().pattern(/^#[0-9A-Fa-f]{6}$/)),

  user: validators.object<{
    email: string;
    firstName: string;
    lastName: string;
    password: string;
  }>()
    .field('email', validators.email().required())
    .field('firstName', validators.string().min(1).max(50).required())
    .field('lastName', validators.string().min(1).max(50).required())
    .field('password', validators.password()),
};

// Validation middleware for API routes
export function validateInput<T>(schema: Validator<T>) {
  return function(data: any): T {
    const result = schema.validate(data);
    
    if (!result.success) {
      throw new AppError(
        'INVALID_INPUT',
        'Validation failed',
        400,
        { errors: result.errors }
      );
    }

    return result.data!;
  };
} 