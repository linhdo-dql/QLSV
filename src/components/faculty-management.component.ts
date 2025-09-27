/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataService, Khoa } from '../student.service';

@Component({
  selector: 'app-faculty-management',
  standalone: true,
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-3xl font-bold text-white">Quản lý Khoa</h2>
      <button (click)="openKhoaModal(null)" class="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-200 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" /></svg>
        Thêm Khoa
      </button>
    </div>
    <div class="bg-slate-800 rounded-lg shadow-lg overflow-hidden border border-slate-700">
      <table class="min-w-full">
        <thead class="bg-slate-700/50">
          <tr>
            <th class="py-3 px-6 text-left text-sm font-semibold text-slate-200 uppercase tracking-wider">Mã Khoa</th>
            <th class="py-3 px-6 text-left text-sm font-semibold text-slate-200 uppercase tracking-wider">Tên Khoa</th>
            <th class="py-3 px-6 text-left text-sm font-semibold text-slate-200 uppercase tracking-wider">Hành động</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-700">
          @for(khoa of khoas(); track khoa.maKhoa) {
            <tr class="hover:bg-slate-700/40 transition-colors duration-200">
              <td class="py-4 px-6 font-mono text-sm text-white">{{khoa.maKhoa}}</td>
              <td class="py-4 px-6 text-white">{{khoa.tenKhoa}}</td>
              <td class="py-4 px-6">
                <div class="flex items-center gap-4">
                  <button (click)="openKhoaModal(khoa)" class="text-slate-400 hover:text-indigo-400 transition-colors duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd" /></svg>
                  </button>
                  <button (click)="openDeleteConfirm(khoa)" class="text-slate-400 hover:text-rose-500 transition-colors duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
                  </button>
                </div>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>

    <!-- Khoa Modal -->
    @if (isKhoaModalOpen()) {
      <div class="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
        <div class="bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-md border border-slate-700">
          <h3 class="text-xl font-semibold mb-6 text-white">{{ editingKhoa() ? 'Chỉnh sửa Khoa' : 'Thêm Khoa mới' }}</h3>
          <form [formGroup]="khoaForm" (ngSubmit)="saveKhoa()">
            <div class="space-y-4">
              <div>
                <label for="maKhoa" class="block text-sm font-medium text-slate-300 mb-1">Mã Khoa</label>
                <input id="maKhoa" formControlName="maKhoa" class="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none">
              </div>
              <div>
                <label for="tenKhoa" class="block text-sm font-medium text-slate-300 mb-1">Tên Khoa</label>
                <input id="tenKhoa" formControlName="tenKhoa" class="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none">
              </div>
            </div>
            <div class="mt-8 flex justify-end gap-4">
              <button type="button" (click)="isKhoaModalOpen.set(false)" class="bg-slate-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-slate-500 transition-colors duration-200">Hủy</button>
              <button type="submit" [disabled]="khoaForm.invalid" class="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">Lưu</button>
            </div>
          </form>
        </div>
      </div>
    }

    <!-- Delete Confirmation Modal -->
    @if (isDeleteConfirmOpen()) {
      <div class="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
        <div class="bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-md border border-slate-700">
          <h3 class="text-xl font-semibold text-white">Xác nhận Xóa</h3>
          <p class="mt-4 text-slate-300">
            Bạn có chắc chắn muốn xóa khoa <strong>{{ khoaToDelete()?.tenKhoa }}</strong>? 
            <br>
            Hành động này không thể hoàn tác.
          </p>
          <div class="mt-8 flex justify-end gap-4">
            <button type="button" (click)="isDeleteConfirmOpen.set(false)" class="bg-slate-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-slate-500 transition-colors duration-200">Hủy</button>
            <button type="button" (click)="confirmDelete()" class="bg-rose-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-rose-700 transition-colors duration-200">Xóa</button>
          </div>
        </div>
      </div>
    }
  `
})
export class FacultyManagementComponent {
  private readonly dataService = inject(DataService);
  private readonly fb = inject(FormBuilder);

  khoas = this.dataService.khoas;

  isKhoaModalOpen = signal(false);
  editingKhoa = signal<Khoa | null>(null);
  khoaForm = this.fb.group({
    maKhoa: ['', Validators.required],
    tenKhoa: ['', Validators.required],
  });

  // Delete confirmation state
  isDeleteConfirmOpen = signal(false);
  khoaToDelete = signal<Khoa | null>(null);

  openKhoaModal(khoa: Khoa | null): void {
    this.editingKhoa.set(khoa);
    if (khoa) {
      this.khoaForm.setValue(khoa);
      this.khoaForm.controls.maKhoa.disable();
    } else {
      this.khoaForm.reset();
      this.khoaForm.controls.maKhoa.enable();
    }
    this.isKhoaModalOpen.set(true);
  }

  saveKhoa(): void {
    if (this.khoaForm.invalid) return;
    const formData = this.khoaForm.getRawValue();
    if (this.editingKhoa()) {
      this.dataService.updateKhoa(formData as Khoa);
    } else {
      this.dataService.addKhoa(formData as Khoa);
    }
    this.isKhoaModalOpen.set(false);
  }

  openDeleteConfirm(khoa: Khoa): void {
    this.khoaToDelete.set(khoa);
    this.isDeleteConfirmOpen.set(true);
  }

  confirmDelete(): void {
    const khoa = this.khoaToDelete();
    if (khoa) {
      this.dataService.deleteKhoa(khoa.maKhoa);
    }
    this.isDeleteConfirmOpen.set(false);
    this.khoaToDelete.set(null);
  }
}