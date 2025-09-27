/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataService, GiaoVien } from '../student.service';

@Component({
  selector: 'app-teacher-management',
  standalone: true,
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-3xl font-bold text-white">Quản lý Giáo viên</h2>
      <button (click)="openGiaoVienModal(null)" class="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-200 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" /></svg>
        Thêm Giáo viên
      </button>
    </div>
    <div class="bg-slate-800 rounded-lg shadow-lg overflow-hidden border border-slate-700">
      <table class="min-w-full">
        <thead class="bg-slate-700/50">
          <tr>
            <th class="py-3 px-6 text-left text-sm font-semibold text-slate-200 uppercase tracking-wider">Mã Giáo viên</th>
            <th class="py-3 px-6 text-left text-sm font-semibold text-slate-200 uppercase tracking-wider">Họ và Tên</th>
            <th class="py-3 px-6 text-left text-sm font-semibold text-slate-200 uppercase tracking-wider">Khoa</th>
            <th class="py-3 px-6 text-left text-sm font-semibold text-slate-200 uppercase tracking-wider">Hành động</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-700">
          @for (gv of giaoViensWithDetails(); track gv.maGiaoVien) {
          <tr class="hover:bg-slate-700/40 transition-colors duration-200">
            <td class="py-4 px-6 font-mono text-sm text-white">{{ gv.maGiaoVien }}</td>
            <td class="py-4 px-6 text-white">{{ gv.hoTen }}</td>
            <td class="py-4 px-6 text-white">{{ gv.tenKhoa }}</td>
            <td class="py-4 px-6">
              <div class="flex items-center gap-4">
                <button (click)="openGiaoVienModal(gv)" class="text-slate-400 hover:text-indigo-400 transition-colors duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd" /></svg>
                </button>
                <button (click)="deleteGiaoVien(gv.maGiaoVien)" class="text-slate-400 hover:text-rose-500 transition-colors duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
                </button>
              </div>
            </td>
          </tr>
          }
        </tbody>
      </table>
    </div>

    <!-- GiaoVien Modal -->
    @if (isGiaoVienModalOpen()) {
    <div class="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
        <div class="bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-md border border-slate-700">
        <h3 class="text-xl font-semibold mb-6 text-white">{{ editingGiaoVien() ? 'Chỉnh sửa Giáo viên' : 'Thêm Giáo viên mới' }}</h3>
        <form [formGroup]="giaoVienForm" (ngSubmit)="saveGiaoVien()">
            <div class="space-y-4">
            <div>
                <label for="maGiaoVien" class="block text-sm font-medium text-slate-300 mb-1">Mã Giáo viên</label>
                <input id="maGiaoVien" formControlName="maGiaoVien" class="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none">
            </div>
            <div>
                <label for="hoTen" class="block text-sm font-medium text-slate-300 mb-1">Họ và Tên</label>
                <input id="hoTen" formControlName="hoTen" class="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none">
            </div>
            <div>
                <label for="maKhoa" class="block text-sm font-medium text-slate-300 mb-1">Khoa</label>
                <select id="maKhoa" formControlName="maKhoa" class="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none">
                    @for(khoa of khoas(); track khoa.maKhoa) {
                        <option [value]="khoa.maKhoa">{{khoa.tenKhoa}}</option>
                    }
                </select>
            </div>
            </div>
            <div class="mt-8 flex justify-end gap-4">
            <button type="button" (click)="isGiaoVienModalOpen.set(false)" class="bg-slate-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-slate-500 transition-colors duration-200">Hủy</button>
            <button type="submit" [disabled]="giaoVienForm.invalid" class="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">Lưu</button>
            </div>
        </form>
        </div>
    </div>
    }
  `
})
export class TeacherManagementComponent {
    private readonly dataService = inject(DataService);
    private readonly fb = inject(FormBuilder);

    khoas = this.dataService.khoas;
    giaoViens = this.dataService.giaoViens;

    giaoViensWithDetails = computed(() => {
        return this.giaoViens().map(gv => {
            const khoa = this.khoas().find(k => k.maKhoa === gv.maKhoa);
            return { ...gv, tenKhoa: khoa?.tenKhoa ?? 'N/A' };
        });
    });

    isGiaoVienModalOpen = signal(false);
    editingGiaoVien = signal<GiaoVien | null>(null);
    giaoVienForm = this.fb.group({
        maGiaoVien: ['', Validators.required],
        hoTen: ['', Validators.required],
        maKhoa: ['', Validators.required],
    });
    
    openGiaoVienModal(giaoVien: (GiaoVien & { tenKhoa: string }) | null): void {
        if (giaoVien) {
            const { tenKhoa, ...formData } = giaoVien;
            this.editingGiaoVien.set(formData);
            this.giaoVienForm.setValue(formData);
            this.giaoVienForm.controls.maGiaoVien.disable();
        } else {
            this.editingGiaoVien.set(null);
            this.giaoVienForm.reset();
            this.giaoVienForm.controls.maGiaoVien.enable();
        }
        this.isGiaoVienModalOpen.set(true);
    }

    saveGiaoVien(): void {
        if (this.giaoVienForm.invalid) return;
        const formData = this.giaoVienForm.getRawValue();
        if (this.editingGiaoVien()) {
            this.dataService.updateGiaoVien(formData as GiaoVien);
        } else {
            this.dataService.addGiaoVien(formData as GiaoVien);
        }
        this.isGiaoVienModalOpen.set(false);
    }

    deleteGiaoVien(maGiaoVien: string): void {
        if (confirm(`Bạn có chắc muốn xóa giáo viên có mã ${maGiaoVien}?`)) {
            this.dataService.deleteGiaoVien(maGiaoVien);
        }
    }
}