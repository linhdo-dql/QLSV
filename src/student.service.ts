/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// --- INTERFACES BASED ON DB SCHEMA ---

export interface Khoa { // Faculty
  maKhoa: string;
  tenKhoa: string;
}

export interface GiaoVien { // Teacher
  maGiaoVien: string;
  hoTen: string;
  maKhoa: string;
  // maTaiKhoan: string; // Link to account
}

export interface LopHanhChinh { // Administrative Class
  maLop: string;
  tenLop: string;
  maKhoa: string;
  maGiaoVien: string; // Homeroom teacher
}

export interface SinhVien { // Student
  maSinhVien: string;
  hoTen: string;
  gioiTinh: 'Nam' | 'Nữ' | 'Khác';
  ngaySinh: string; // YYYY-MM-DD
  email: string;
  soDienThoai: string;
  maLopHanhChinh: string;
  avatarUrl: string;
}

export interface MonHoc { // Subject
  maMonHoc: string;
  tenMonHoc: string;
  soTinChi: number;
  maKhoa: string;
}

export interface LopTinChi { // Credit Class
  maLop: string;
  maMonHoc: string;
  maGiaoVien: string; // Teaching teacher
  hocKy: number;
  namHoc: string; // e.g., "2023-2024"
}

export interface LopDangKy { // Enrollment
    maLopDangKy: string;
    maLopTinChi: string;
    maLopHanhChinh: string;
}

export interface Diem { // Grade
    maSinhVien: string;
    maLopTinChi: string;
    diem1: number | null; // Midterm
    diem2: number | null; // Final
    diemTong: number | null; // Total
}




@Injectable({
  providedIn: 'root',
})
export class DataService {
  private readonly API_URL = 'http://localhost:8080/qlsv/api';

  constructor(private http: HttpClient) {}

  // --- KHOA ---
  getKhoas(): Observable<Khoa[]> {
    return this.http.get<Khoa[]>(`${this.API_URL}/khoa`);
  }

  getKhoaById(id: string): Observable<Khoa> {
    return this.http.get<Khoa>(`${this.API_URL}/khoa/${id}`);
  }

  addKhoa(khoa: Khoa): Observable<Khoa> {
    return this.http.post<Khoa>(`${this.API_URL}/khoa`, khoa);
  }

  updateKhoa(id: string, khoa: Khoa): Observable<Khoa> {
    return this.http.put<Khoa>(`${this.API_URL}/khoa/${id}`, khoa);
  }

  deleteKhoa(id: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/khoa/${id}`);
  }
  

  // --- MON HOC ---
  getMonHocs(): Observable<MonHoc[]> {
    return this.http.get<MonHoc[]>(`${this.API_URL}/monhoc`);
  }
  getMonHocById(id: string): Observable<MonHoc> {
    return this.http.get<MonHoc>(`${this.API_URL}/monhoc/${id}`);
  }
  addMonHoc(monHoc: MonHoc): Observable<MonHoc> {
    return this.http.post<MonHoc>(`${this.API_URL}/monhoc`, monHoc);
  }
  updateMonHoc(id: string, monHoc: MonHoc): Observable<MonHoc> {
    return this.http.put<MonHoc>(`${this.API_URL}/monhoc/${id}`, monHoc);
  }
  deleteMonHoc(id: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/monhoc/${id}`);
  }


  // --- GIAO VIEN ---
  getGiaoViens(): Observable<GiaoVien[]> {
    return this.http.get<GiaoVien[]>(`${this.API_URL}/giaovien`);
  }
  getGiaoVienById(id: string): Observable<GiaoVien> {
    return this.http.get<GiaoVien>(`${this.API_URL}/giaovien/${id}`);
  }
  addGiaoVien(giaoVien: GiaoVien): Observable<GiaoVien> {
    return this.http.post<GiaoVien>(`${this.API_URL}/giaovien`, giaoVien);
  }
  updateGiaoVien(id: string, giaoVien: GiaoVien): Observable<GiaoVien> {
    return this.http.put<GiaoVien>(`${this.API_URL}/giaovien/${id}`, giaoVien);
  }
  deleteGiaoVien(id: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/giaovien/${id}`);
  }


  // --- LOP HANH CHINH ---
  getLopHanhChinhs(): Observable<LopHanhChinh[]> {
    return this.http.get<LopHanhChinh[]>(`${this.API_URL}/lophanhchinh`);
  }
  getLopHanhChinhById(id: string): Observable<LopHanhChinh> {
    return this.http.get<LopHanhChinh>(`${this.API_URL}/lophanhchinh/${id}`);
  }
  addLopHanhChinh(lop: LopHanhChinh): Observable<LopHanhChinh> {
    return this.http.post<LopHanhChinh>(`${this.API_URL}/lophanhchinh`, lop);
  }
  updateLopHanhChinh(id: string, lop: LopHanhChinh): Observable<LopHanhChinh> {
    return this.http.put<LopHanhChinh>(`${this.API_URL}/lophanhchinh/${id}`, lop);
  }
  deleteLopHanhChinh(id: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/lophanhchinh/${id}`);
  }


  // --- LOP TIN CHI ---
  getLopTinChis(): Observable<LopTinChi[]> {
    return this.http.get<LopTinChi[]>(`${this.API_URL}/loptinchi`);
  }
  getLopTinChiById(id: string): Observable<LopTinChi> {
    return this.http.get<LopTinChi>(`${this.API_URL}/loptinchi/${id}`);
  }
  addLopTinChi(lop: LopTinChi): Observable<LopTinChi> {
    return this.http.post<LopTinChi>(`${this.API_URL}/loptinchi`, lop);
  }
  updateLopTinChi(id: string, lop: LopTinChi): Observable<LopTinChi> {
    return this.http.put<LopTinChi>(`${this.API_URL}/loptinchi/${id}`, lop);
  }
  deleteLopTinChi(id: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/loptinchi/${id}`);
  }


  // --- SINH VIEN ---
  getSinhViens(): Observable<SinhVien[]> {
    return this.http.get<SinhVien[]>(`${this.API_URL}/sinhvien`);
  }
  getSinhVienById(id: string): Observable<SinhVien> {
    return this.http.get<SinhVien>(`${this.API_URL}/sinhvien/${id}`);
  }
  addSinhVien(sinhVien: SinhVien): Observable<SinhVien> {
    return this.http.post<SinhVien>(`${this.API_URL}/sinhvien`, sinhVien);
  }
  updateSinhVien(id: string, sinhVien: SinhVien): Observable<SinhVien> {
    return this.http.put<SinhVien>(`${this.API_URL}/sinhvien/${id}`, sinhVien);
  }
  deleteSinhVien(id: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/sinhvien/${id}`);
  }

  // --- LOP DANG KY ---
  getLopDangKys(): Observable<LopDangKy[]> {
    return this.http.get<LopDangKy[]>(`${this.API_URL}/lopdangky`);
  }
  getLopDangKyById(id: string): Observable<LopDangKy> {
    return this.http.get<LopDangKy>(`${this.API_URL}/lopdangky/${id}`);
  }
  addLopDangKy(lop: LopDangKy): Observable<LopDangKy> {
    return this.http.post<LopDangKy>(`${this.API_URL}/lopdangky`, lop);
  }
  updateLopDangKy(id: string, lop: LopDangKy): Observable<LopDangKy> {
    return this.http.put<LopDangKy>(`${this.API_URL}/lopdangky/${id}`, lop);
  }
  deleteLopDangKy(id: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/lopdangky/${id}`);
  }

  // --- DIEM ---
  getDiems(): Observable<Diem[]> {
    return this.http.get<Diem[]>(`${this.API_URL}/diem`);
  }
  getDiemById(id: string): Observable<Diem> {
    return this.http.get<Diem>(`${this.API_URL}/diem/${id}`);
  }
  addDiem(diem: Diem): Observable<Diem> {
    return this.http.post<Diem>(`${this.API_URL}/diem`, diem);
  }
  updateDiem(id: string, diem: Diem): Observable<Diem> {
    return this.http.put<Diem>(`${this.API_URL}/diem/${id}`, diem);
  }
  deleteDiem(id: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/diem/${id}`);
  }
  /**
   * Get all grades for a student by maSinhVien
   * @param maSinhVien Student code
   */
  getDiemBySinhVien(maSinhVien: string): Observable<Diem[]> {
    return this.http.get<Diem[]>(`${this.API_URL}/diem/sinhvien/${maSinhVien}`);
  }
}
