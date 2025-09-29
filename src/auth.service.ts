import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  rule: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  login(data: LoginRequest): Observable<boolean> {
    return this.http.post<boolean>(`${this.API_URL}/qlsv/auth/log-in`, data);
  }

  register(data: RegisterRequest): Observable<boolean> {
    return this.http.post<boolean>(`${this.API_URL}/qlsv/auth/register`, data);
  }
}