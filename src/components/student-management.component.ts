/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataService, SinhVien } from '../student.service';

@Component({
  selector: 'app-student-management',
  standalone: true,
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-3xl font-bold text-slate-900 dark:text-white">Quản lý Sinh viên</h2>
      <button (click)="openStudentModal(null)" class="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-200 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" /></svg>
        Thêm Sinh viên
      </button>
    </div>
    <div class="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700">
      <table class="min-w-full">
        <thead class="bg-slate-50 dark:bg-slate-700/50">
          <tr>
            <th class="py-3 px-6 text-left text-sm font-semibold text-slate-600 dark:text-slate-200 uppercase tracking-wider">Họ và Tên</th>
            <th class="py-3 px-6 text-left text-sm font-semibold text-slate-600 dark:text-slate-200 uppercase tracking-wider">Mã Sinh viên</th>
            <th class="py-3 px-6 text-left text-sm font-semibold text-slate-600 dark:text-slate-200 uppercase tracking-wider">Email</th>
            <th class="py-3 px-6 text-left text-sm font-semibold text-slate-600 dark:text-slate-200 uppercase tracking-wider">Lớp</th>
            <th class="py-3 px-6 text-left text-sm font-semibold text-slate-600 dark:text-slate-200 uppercase tracking-wider">Hành động</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
          @for (sv of studentsWithDetails(); track sv.maSinhVien) {
          <tr (click)="openStudentDetailsModal(sv)" class="hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors duration-200 cursor-pointer">
            <td class="py-3 px-6 text-slate-800 dark:text-white">
              <div class="flex items-center gap-4">
                <img [src]="sv.avatarUrl" alt="Student Avatar" class="h-10 w-10 rounded-full object-cover">
                <span>{{ sv.hoTen }}</span>
              </div>
            </td>
            <td class="py-4 px-6 font-mono text-sm text-slate-700 dark:text-slate-300">{{ sv.maSinhVien }}</td>
            <td class="py-4 px-6 text-slate-800 dark:text-slate-100">{{ sv.email }}</td>
            <td class="py-4 px-6 text-slate-800 dark:text-slate-100">{{ sv.tenLopHanhChinh }}</td>
            <td class="py-4 px-6">
                <div class="flex items-center gap-4">
                    <button (click)="$event.stopPropagation(); openStudentModal(sv)" class="text-slate-500 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors duration-200">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd" /></svg>
                    </button>
                    <button (click)="$event.stopPropagation(); openDeleteConfirm(sv)" class="text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-500 transition-colors duration-200">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
                    </button>
                </div>
            </td>
          </tr>
          }
        </tbody>
      </table>
    </div>

    <!-- Student Edit Modal -->
    @if (isStudentModalOpen()) {
    <div class="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
        <div class="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-2xl border border-slate-200 dark:border-slate-700">
        <h3 class="text-xl font-semibold mb-6 text-slate-900 dark:text-white">{{ editingStudent() ? 'Chỉnh sửa Sinh viên' : 'Thêm Sinh viên mới' }}</h3>
        <form [formGroup]="studentForm" (ngSubmit)="saveStudent()">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <input type="hidden" formControlName="maSinhVien">
            <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Họ và Tên</label>
                <input formControlName="hoTen" class="w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md py-2 px-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none">
            </div>
            <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Giới tính</label>
                <select formControlName="gioiTinh" class="w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md py-2 px-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none">
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
                </select>
            </div>
            <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Ngày sinh</label>
                <input type="date" formControlName="ngaySinh" class="w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md py-2 px-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none">
            </div>
            <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                <input type="email" formControlName="email" class="w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md py-2 px-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none">
            </div>
            <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Số điện thoại</label>
                <input formControlName="soDienThoai" class="w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md py-2 px-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none">
            </div>
            <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Lớp Hành chính</label>
                <select formControlName="maLopHanhChinh" class="w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md py-2 px-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none">
                    @for(lop of lopHanhChinhs(); track lop.maLop) {
                        <option [value]="lop.maLop">{{lop.tenLop}}</option>
                    }
                </select>
            </div>
            </div>
            <div class="mt-8 flex justify-end gap-4">
            <button type="button" (click)="isStudentModalOpen.set(false)" class="bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-white font-semibold py-2 px-4 rounded-md hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors duration-200">Hủy</button>
            <button type="submit" [disabled]="studentForm.invalid" class="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">Lưu</button>
            </div>
        </form>
        </div>
    </div>
    }

    <!-- Student Details and Transcript Modal -->
    @if (isStudentDetailsModalOpen() && selectedStudentForDetails(); as student) {
      <div class="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50" (click)="isStudentDetailsModalOpen.set(false)">
        <div class="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-3xl border border-slate-200 dark:border-slate-700 overflow-hidden" (click)="$event.stopPropagation()">
            @if (!isViewingTranscript()) {
              <!-- Student Details View -->
              <div class="p-8">
                <div class="flex flex-col md:flex-row items-center gap-8">
                  <img [src]="student.avatarUrl" alt="Student Avatar" class="h-32 w-32 rounded-full object-cover border-4 border-slate-200 dark:border-slate-600">
                  <div class="text-center md:text-left">
                    <h3 class="text-3xl font-bold text-slate-900 dark:text-white">{{ student.hoTen }}</h3>
                    <p class="text-indigo-600 dark:text-indigo-400 font-mono">{{ student.maSinhVien }}</p>
                    <p class="text-slate-600 dark:text-slate-300 mt-2">{{ student.tenLopHanhChinh }}</p>
                  </div>
                </div>
                <div class="mt-8 border-t border-slate-200 dark:border-slate-700 pt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div class="flex items-center gap-3"><span class="font-semibold text-slate-500 dark:text-slate-400 w-24">Email:</span> <span class="text-slate-800 dark:text-slate-100">{{ student.email }}</span></div>
                    <div class="flex items-center gap-3"><span class="font-semibold text-slate-500 dark:text-slate-400 w-24">SĐT:</span> <span class="text-slate-800 dark:text-slate-100">{{ student.soDienThoai }}</span></div>
                    <div class="flex items-center gap-3"><span class="font-semibold text-slate-500 dark:text-slate-400 w-24">Ngày sinh:</span> <span class="text-slate-800 dark:text-slate-100">{{ student.ngaySinh }}</span></div>
                    <div class="flex items-center gap-3"><span class="font-semibold text-slate-500 dark:text-slate-400 w-24">Giới tính:</span> <span class="text-slate-800 dark:text-slate-100">{{ student.gioiTinh }}</span></div>
                </div>
                <div class="mt-8 flex justify-end gap-4">
                  <button (click)="isViewingTranscript.set(true)" class="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-200">Xem Bảng điểm</button>
                  <button (click)="isStudentDetailsModalOpen.set(false)" class="bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-white font-semibold py-2 px-4 rounded-md hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors duration-200">Đóng</button>
                </div>
              </div>
            } @else {
              <!-- Transcript View -->
              <div class="p-8">
                <h3 class="text-2xl font-bold text-slate-900 dark:text-white mb-4">Bảng điểm của {{ student.hoTen }}</h3>
                <div class="max-h-96 overflow-y-auto border border-slate-200 dark:border-slate-700 rounded-lg">
                  <table class="min-w-full">
                    <thead class="bg-slate-50 dark:bg-slate-700/50 sticky top-0">
                      <tr>
                        <th class="py-3 px-6 text-left text-sm font-semibold text-slate-600 dark:text-slate-200 uppercase">Mã Lớp TC</th>
                        <th class="py-3 px-6 text-left text-sm font-semibold text-slate-600 dark:text-slate-200 uppercase">Tên Môn học</th>
                        <th class="py-3 px-6 text-left text-sm font-semibold text-slate-600 dark:text-slate-200 uppercase">Giữa kỳ</th>
                        <th class="py-3 px-6 text-left text-sm font-semibold text-slate-600 dark:text-slate-200 uppercase">Cuối kỳ</th>
                        <th class="py-3 px-6 text-left text-sm font-semibold text-slate-600 dark:text-slate-200 uppercase">Tổng kết</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
                      @for(grade of studentTranscript(); track grade.maLopTinChi) {
                        <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/40">
                          <td class="py-3 px-6 font-mono text-slate-700 dark:text-slate-300">{{grade.maLopTinChi}}</td>
                          <td class="py-3 px-6 text-slate-800 dark:text-white">{{grade.tenMonHoc}}</td>
                          <td class="py-3 px-6 text-slate-800 dark:text-white">{{grade.diem1 ?? 'N/A'}}</td>
                          <td class="py-3 px-6 text-slate-800 dark:text-white">{{grade.diem2 ?? 'N/A'}}</td>
                          <td class="py-3 px-6 text-slate-800 dark:text-white font-semibold">{{grade.diemTong ?? 'N/A'}}</td>
                        </tr>
                      } @empty {
                        <tr>
                          <td colspan="5" class="text-center py-8 text-slate-500 dark:text-slate-400">Không có điểm nào được ghi cho sinh viên này.</td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
                <div class="mt-8 flex justify-end gap-4">
                  <button (click)="isViewingTranscript.set(false)" class="bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-white font-semibold py-2 px-4 rounded-md hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors duration-200">Quay lại Chi tiết</button>
                </div>
              </div>
            }
        </div>
      </div>
    }

    <!-- Delete Confirmation Modal -->
    @if (isDeleteConfirmOpen()) {
      <div class="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
        <div class="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-md border border-slate-200 dark:border-slate-700">
          <h3 class="text-xl font-semibold text-slate-900 dark:text-white">Xác nhận Xóa</h3>
          <p class="mt-4 text-slate-600 dark:text-slate-300">
            Bạn có chắc chắn muốn xóa sinh viên <strong>{{ studentToDelete()?.hoTen }}</strong>? 
            <br>
            Hành động này không thể hoàn tác.
          </p>
          <div class="mt-8 flex justify-end gap-4">
            <button type="button" (click)="isDeleteConfirmOpen.set(false)" class="bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-white font-semibold py-2 px-4 rounded-md hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors duration-200">Hủy</button>
            <button type="button" (click)="confirmDelete()" class="bg-rose-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-rose-700 transition-colors duration-200">Xóa</button>
          </div>
        </div>
      </div>
    }
  `
})
export class StudentManagementComponent {
    private readonly dataService = inject(DataService);
    private readonly fb = inject(FormBuilder);

    sinhViens = this.dataService.sinhViens;
    lopHanhChinhs = this.dataService.lopHanhChinhs;

    // Student Details & Transcript Modal State
    isStudentDetailsModalOpen = signal(false);
    selectedStudentForDetails = signal<(SinhVien & { tenLopHanhChinh: string }) | null>(null);
    isViewingTranscript = signal(false);

    studentTranscript = computed(() => {
        const selected = this.selectedStudentForDetails();
        if (!selected) return [];

        const studentGrades = this.dataService.diems().filter(d => d.maSinhVien === selected.maSinhVien);
        
        return studentGrades.map(grade => {
        const lopTinChi = this.dataService.lopTinChis().find(ltc => ltc.maLop === grade.maLopTinChi);
        const monHoc = this.dataService.monHocs().find(mh => mh.maMonHoc === lopTinChi?.maMonHoc);

        return {
            maLopTinChi: grade.maLopTinChi,
            tenMonHoc: monHoc?.tenMonHoc ?? 'Unknown Subject',
            diem1: grade.diem1,
            diem2: grade.diem2,
            diemTong: grade.diemTong,
        };
        });
    });

    openStudentDetailsModal(student: SinhVien & { tenLopHanhChinh: string }): void {
        this.selectedStudentForDetails.set(student);
        this.isViewingTranscript.set(false);
        this.isStudentDetailsModalOpen.set(true);
    }


    studentsWithDetails = computed(() => {
        return this.sinhViens().map(sv => {
            const lopHC = this.lopHanhChinhs().find(l => l.maLop === sv.maLopHanhChinh);
            return { ...sv, tenLopHanhChinh: lopHC?.tenLop ?? 'N/A' };
        });
    });

    isStudentModalOpen = signal(false);
    editingStudent = signal<SinhVien | null>(null);
    studentForm = this.fb.group({
        maSinhVien: [''],
        hoTen: ['', Validators.required],
        gioiTinh: ['Nam' as SinhVien['gioiTinh'], Validators.required],
        ngaySinh: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        soDienThoai: ['', Validators.required],
        maLopHanhChinh: ['', Validators.required],
    });

     // Delete confirmation state
    isDeleteConfirmOpen = signal(false);
    studentToDelete = signal<SinhVien | null>(null);

    openStudentModal(student: (SinhVien & { tenLopHanhChinh: string }) | null): void {
        if (student) {
            const { tenLopHanhChinh, avatarUrl, ...formData } = student;
            this.editingStudent.set(student);
            this.studentForm.setValue(formData);
            this.studentForm.controls.maSinhVien.disable();
        } else {
            this.editingStudent.set(null);
            this.studentForm.reset({maSinhVien: '', hoTen: '', gioiTinh: 'Nam', ngaySinh: '', email: '', soDienThoai: '', maLopHanhChinh: ''});
            this.studentForm.controls.maSinhVien.enable();
        }
        this.isStudentModalOpen.set(true);
    }
    
    saveStudent(): void {
        if (this.studentForm.invalid) return;
        
        if (this.editingStudent()) {
            const formValue = this.studentForm.getRawValue();
            const updatedStudent: SinhVien = {
                ...formValue,
                avatarUrl: this.editingStudent()!.avatarUrl, // Preserve avatar
            };
            this.dataService.updateStudent(updatedStudent);
        } else {
            const formValue = this.studentForm.getRawValue();
            const { maSinhVien, ...studentData } = formValue;
            this.dataService.addStudent(studentData as Omit<SinhVien, 'maSinhVien' | 'avatarUrl'>);
        }
        this.isStudentModalOpen.set(false);
    }

    openDeleteConfirm(student: SinhVien): void {
      this.studentToDelete.set(student);
      this.isDeleteConfirmOpen.set(true);
    }

    confirmDelete(): void {
      const student = this.studentToDelete();
      if (student) {
        this.dataService.deleteStudent(student.maSinhVien);
      }
      this.isDeleteConfirmOpen.set(false);
      this.studentToDelete.set(null);
    }
}