/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { Injectable, signal } from '@angular/core';

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


// --- MOCK DATA ---

const MOCK_KHOA: Khoa[] = [
  { maKhoa: 'CNTT', tenKhoa: 'Công nghệ Thông tin' },
  { maKhoa: 'KT', tenKhoa: 'Kinh tế' },
  { maKhoa: 'NN', tenKhoa: 'Ngoại ngữ' },
];

const MOCK_GIAOVIEN: GiaoVien[] = [
    { maGiaoVien: 'GV001', hoTen: 'Nguyễn Văn A', maKhoa: 'CNTT' },
    { maGiaoVien: 'GV002', hoTen: 'Trần Thị B', maKhoa: 'CNTT' },
    { maGiaoVien: 'GV003', hoTen: 'Lê Văn C', maKhoa: 'KT' },
    { maGiaoVien: 'GV004', hoTen: 'Phạm Thị D', maKhoa: 'NN' },
];

const MOCK_MONHOC: MonHoc[] = [
    { maMonHoc: 'CS101', tenMonHoc: 'Nhập môn Lập trình', soTinChi: 3, maKhoa: 'CNTT' },
    { maMonHoc: 'CS102', tenMonHoc: 'Cấu trúc Dữ liệu', soTinChi: 4, maKhoa: 'CNTT' },
    { maMonHoc: 'ECO101', tenMonHoc: 'Kinh tế Vi mô', soTinChi: 3, maKhoa: 'KT' },
    { maMonHoc: 'ENG101', tenMonHoc: 'Tiếng Anh Cơ bản', soTinChi: 5, maKhoa: 'NN' },
];

const MOCK_LOPHANHCHINH: LopHanhChinh[] = [
    { maLop: 'LHC-CNTT-01', tenLop: 'K65-CNTT-A', maKhoa: 'CNTT', maGiaoVien: 'GV001' },
    { maLop: 'LHC-KT-01', tenLop: 'K65-KT-B', maKhoa: 'KT', maGiaoVien: 'GV003' },
];

const MOCK_SINHVIEN: SinhVien[] = [
    { maSinhVien: 'SV001', hoTen: 'Hoàng Văn An', gioiTinh: 'Nam', ngaySinh: '2003-05-10', email: 'an.hv@email.com', soDienThoai: '0987654321', maLopHanhChinh: 'LHC-CNTT-01', avatarUrl: 'https://picsum.photos/seed/SV001/200' },
    { maSinhVien: 'SV002', hoTen: 'Đỗ Thị Bình', gioiTinh: 'Nữ', ngaySinh: '2003-08-15', email: 'binh.dt@email.com', soDienThoai: '0912345678', maLopHanhChinh: 'LHC-CNTT-01', avatarUrl: 'https://picsum.photos/seed/SV002/200' },
    { maSinhVien: 'SV003', hoTen: 'Vũ Minh Tuấn', gioiTinh: 'Nam', ngaySinh: '2003-01-20', email: 'tuan.vm@email.com', soDienThoai: '0905112233', maLopHanhChinh: 'LHC-KT-01', avatarUrl: 'https://picsum.photos/seed/SV003/200' },
];

const MOCK_LOPTINCHI: LopTinChi[] = [
    { maLop: 'LTC-CS101-01', maMonHoc: 'CS101', maGiaoVien: 'GV001', hocKy: 1, namHoc: '2023-2024' },
    { maLop: 'LTC-CS102-01', maMonHoc: 'CS102', maGiaoVien: 'GV002', hocKy: 1, namHoc: '2023-2024' },
    { maLop: 'LTC-ECO101-01', maMonHoc: 'ECO101', maGiaoVien: 'GV003', hocKy: 1, namHoc: '2023-2024' },
    { maLop: 'LTC-CS101-02', maMonHoc: 'CS101', maGiaoVien: 'GV001', hocKy: 2, namHoc: '2023-2024' },
];

const MOCK_LOPDANGKY: LopDangKy[] = [
    { maLopDangKy: 'DK001', maLopTinChi: 'LTC-CS101-01', maLopHanhChinh: 'LHC-CNTT-01' },
    { maLopDangKy: 'DK002', maLopTinChi: 'LTC-CS102-01', maLopHanhChinh: 'LHC-CNTT-01' },
    { maLopDangKy: 'DK003', maLopTinChi: 'LTC-ECO101-01', maLopHanhChinh: 'LHC-KT-01' },
];

const MOCK_DIEM: Diem[] = [
    { maSinhVien: 'SV001', maLopTinChi: 'LTC-CS101-01', diem1: 8, diem2: 7.5, diemTong: 7.65 },
    { maSinhVien: 'SV002', maLopTinChi: 'LTC-CS101-01', diem1: 9, diem2: 8.5, diemTong: 8.65 },
    { maSinhVien: 'SV003', maLopTinChi: 'LTC-ECO101-01', diem1: 7, diem2: 8, diemTong: 7.7 },
];


@Injectable({
  providedIn: 'root',
})
export class DataService {
  // Signals for each data entity
  private readonly khoasSignal = signal<Khoa[]>(MOCK_KHOA);
  private readonly giaoViensSignal = signal<GiaoVien[]>(MOCK_GIAOVIEN);
  private readonly monHocsSignal = signal<MonHoc[]>(MOCK_MONHOC);
  private readonly lopHanhChinhsSignal = signal<LopHanhChinh[]>(MOCK_LOPHANHCHINH);
  private readonly sinhViensSignal = signal<SinhVien[]>(MOCK_SINHVIEN);
  private readonly lopTinChisSignal = signal<LopTinChi[]>(MOCK_LOPTINCHI);
  private readonly lopDangKysSignal = signal<LopDangKy[]>(MOCK_LOPDANGKY);
  private readonly diemsSignal = signal<Diem[]>(MOCK_DIEM);

  // Public readonly signals
  readonly khoas = this.khoasSignal.asReadonly();
  readonly giaoViens = this.giaoViensSignal.asReadonly();
  readonly monHocs = this.monHocsSignal.asReadonly();
  readonly lopHanhChinhs = this.lopHanhChinhsSignal.asReadonly();
  readonly sinhViens = this.sinhViensSignal.asReadonly();
  readonly lopTinChis = this.lopTinChisSignal.asReadonly();
  readonly lopDangKys = this.lopDangKysSignal.asReadonly();
  readonly diems = this.diemsSignal.asReadonly();


  // --- CRUD Methods ---
  
  // Khoa
  addKhoa(khoa: Khoa) {
    this.khoasSignal.update(khoas => [...khoas, khoa]);
  }

  updateKhoa(updatedKhoa: Khoa) {
    this.khoasSignal.update(khoas =>
      khoas.map(k => (k.maKhoa === updatedKhoa.maKhoa ? updatedKhoa : k))
    );
  }

  deleteKhoa(maKhoa: string) {
    this.khoasSignal.update(khoas => khoas.filter(k => k.maKhoa !== maKhoa));
  }
  
  // MonHoc
  addMonHoc(monHoc: MonHoc) {
    this.monHocsSignal.update(monHocs => [...monHocs, monHoc]);
  }

  updateMonHoc(updatedMonHoc: MonHoc) {
    this.monHocsSignal.update(monHocs =>
      monHocs.map(m => (m.maMonHoc === updatedMonHoc.maMonHoc ? updatedMonHoc : m))
    );
  }

  deleteMonHoc(maMonHoc: string) {
    this.monHocsSignal.update(monHocs => monHocs.filter(m => m.maMonHoc !== maMonHoc));
  }

  // GiaoVien
  addGiaoVien(giaoVien: GiaoVien) {
    this.giaoViensSignal.update(giaoViens => [...giaoViens, giaoVien]);
  }

  updateGiaoVien(updatedGiaoVien: GiaoVien) {
    this.giaoViensSignal.update(giaoViens =>
      giaoViens.map(g => (g.maGiaoVien === updatedGiaoVien.maGiaoVien ? updatedGiaoVien : g))
    );
  }

  deleteGiaoVien(maGiaoVien: string) {
    this.giaoViensSignal.update(giaoViens => giaoViens.filter(g => g.maGiaoVien !== maGiaoVien));
  }

  // LopHanhChinh
  addLopHanhChinh(lopHanhChinh: LopHanhChinh) {
    this.lopHanhChinhsSignal.update(lops => [...lops, lopHanhChinh]);
  }

  updateLopHanhChinh(updatedLop: LopHanhChinh) {
    this.lopHanhChinhsSignal.update(lops =>
      lops.map(l => (l.maLop === updatedLop.maLop ? updatedLop : l))
    );
  }

  deleteLopHanhChinh(maLop: string) {
    this.lopHanhChinhsSignal.update(lops => lops.filter(l => l.maLop !== maLop));
  }

  // LopTinChi
  addLopTinChi(lopTinChi: LopTinChi) {
    this.lopTinChisSignal.update(lops => [...lops, lopTinChi]);
  }

  updateLopTinChi(updatedLop: LopTinChi) {
    this.lopTinChisSignal.update(lops =>
      lops.map(l => (l.maLop === updatedLop.maLop ? updatedLop : l))
    );
  }

  deleteLopTinChi(maLop: string) {
    this.lopTinChisSignal.update(lops => lops.filter(l => l.maLop !== maLop));
  }

  // SinhVien
   addStudent(student: Omit<SinhVien, 'maSinhVien' | 'avatarUrl'>) {
    const newId = `SV${(this.sinhViens().length + 1).toString().padStart(3, '0')}`;
    const avatarUrl = `https://picsum.photos/seed/${newId}/200`;
    this.sinhViensSignal.update(students => [
      ...students,
      { ...student, maSinhVien: newId, avatarUrl }
    ]);
  }

  updateStudent(updatedStudent: SinhVien) {
    this.sinhViensSignal.update(students =>
      students.map(s =>
        s.maSinhVien === updatedStudent.maSinhVien ? updatedStudent : s
      )
    );
  }

  deleteStudent(maSinhVien: string) {
    this.sinhViensSignal.update(students => students.filter(s => s.maSinhVien !== maSinhVien));
  }

  // Diem
  updateDiem(grades: Diem[]) {
    this.diemsSignal.update(currentDiems => {
      const updatedDiems = [...currentDiems];
      grades.forEach(grade => {
        const index = updatedDiems.findIndex(d => 
          d.maSinhVien === grade.maSinhVien && d.maLopTinChi === grade.maLopTinChi
        );
        if (index > -1) {
          updatedDiems[index] = grade; // Update existing grade
        } else {
          updatedDiems.push(grade); // Add new grade
        }
      });
      return updatedDiems;
    });
  }
}
