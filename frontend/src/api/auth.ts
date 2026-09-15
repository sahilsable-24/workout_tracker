import { apiFetch } from "./client";

interface LoginResponse {
    access_token: string;
    token_type: string;
}

interface RegisterResponse {
    id: number;
    email: string
}

export function login(email:string, password:string): Promise<LoginResponse> {
    return apiFetch<LoginResponse>("/auth/login", { method: "POST", body: JSON.stringify({email,password})})
}

export function register(email:string, password:string): Promise<RegisterResponse>{
    return apiFetch<RegisterResponse>("/auth/register", {method:"POST", body:JSON.stringify({email,password})})
}