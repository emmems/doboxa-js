import type { InvalidRequestDataResponse, ServerErrorResponse } from './types/generated/src/models';

/**
 * Base error class for all Doboxa errors
 */
export class DoboxaError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DoboxaError';
    Object.setPrototypeOf(this, DoboxaError.prototype);
  }
}

/**
 * Error thrown when API returns an error response
 */
export class DoboxaAPIError extends DoboxaError {
  public readonly statusCode: number;
  public readonly code?: number;
  public readonly errorMessage?: string;
  public readonly invalidParameters?: Array<{ parameter: string; error_cause: string }>;

  constructor(
    statusCode: number,
    message: string,
    body?: InvalidRequestDataResponse | ServerErrorResponse
  ) {
    super(message);
    this.name = 'DoboxaAPIError';
    this.statusCode = statusCode;

    if (body) {
      if ('result_code' in body) {
        this.code = body.result_code;
      }
      if ('error_message' in body) {
        this.errorMessage = body.error_message || undefined;
      }
      if ('invalid_parameters' in body && body.invalid_parameters) {
        this.invalidParameters = body.invalid_parameters.map((param) => ({
          parameter: param.parameter,
          error_cause: param.error_cause,
        }));
      }
    }

    Object.setPrototypeOf(this, DoboxaAPIError.prototype);
  }
}

/**
 * Error thrown when authentication fails
 */
export class DoboxaAuthenticationError extends DoboxaError {
  constructor(message: string = 'Authentication failed') {
    super(message);
    this.name = 'DoboxaAuthenticationError';
    Object.setPrototypeOf(this, DoboxaAuthenticationError.prototype);
  }
}

/**
 * Error thrown when request validation fails
 */
export class DoboxaValidationError extends DoboxaAPIError {
  constructor(statusCode: number, message: string, body?: InvalidRequestDataResponse) {
    super(statusCode, message, body);
    this.name = 'DoboxaValidationError';
    Object.setPrototypeOf(this, DoboxaValidationError.prototype);
  }
}

/**
 * Parse error response from API
 */
export function parseErrorResponse(
  statusCode: number,
  body: unknown
): InvalidRequestDataResponse | ServerErrorResponse | undefined {
  if (typeof body === 'object' && body !== null) {
    if ('invalid_parameters' in body || 'error_message' in body) {
      return body as InvalidRequestDataResponse;
    }
    if ('error_message' in body && 'result_code' in body) {
      return body as ServerErrorResponse;
    }
  }
  return undefined;
}

