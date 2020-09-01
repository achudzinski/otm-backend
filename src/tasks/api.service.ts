import {Injectable} from "@nestjs/common";

export interface ValidationErrorResponse {
    message: string,
}

@Injectable()
export class ApiService {
    createValidationErrorResponse(message: string): ValidationErrorResponse {
        return {
            message: message,
        };
    }
}