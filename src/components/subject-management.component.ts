/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataService, MonHoc } from '../student.service';

@Component({
  selector: 'app-subject-management',
  standalone: true,
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-3xl font-bold text-white">Quản lý Môn học</h2>
      <button (click)="openMonHocModal(null)" class="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-200 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" /></svg>
        Thêm Môn học
      </button>
    </div>
    <div class="bg-slate-800 rounded-lg shadow-lg overflow-hidden border border-slate-700">
      <table class="min-w-full">
        <thead class="bg-slate-700/50">
          <tr>
            <th class="py-3 px-6 text-left text-sm font-semibold text-slate-200 uppercase tracking-wider">Mã Môn học</th>
            <th class="py-3 px-6 text-left text-sm font-semibold text-slate-200 uppercase tracking-wider">Tên Môn học</th>
            <th class="py-3 px-6 text-left text-sm font-semibold text-slate-200 uppercase tracking-wider">Số tín chỉ</th>
            <th class="py-3 px-6 text-left text-sm font-semibold text-slate-200 uppercase tracking-wider">Khoa</th>
            <th class="py-3 px-6 text-left text-sm font-semibold text-slate-200 uppercase tracking-wider">Hành động</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-700">
          @for (mh of monHocsWithDetails(); track mh.maMonHoc) {
          <tr class="hover:bg-slate-700/40 transition-colors duration-200">
            <td class="py-4 px-6 font-mono text-sm text-white">{{ mh.maMonHoc }}</td>
            <td class="py-4 px-6 text-white">{{ mh.tenMonHoc }}</td>
            <td class="py-4 px-6 text-white">{{ mh.soTinChi }}</td>
            <td class="py-4 px-6 text-white">{{ mh.tenKhoa }}</td>
            <td class="py-4 px-6">
              <div class="flex items-center gap-4">
                <button (click)="openMonHocModal(mh)" class="text-slate-400 hover:text-indigo-400 transition-colors duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd" /></svg>
                </button>
                <button (click)="deleteMonHoc(mh.maMonHoc)" class="text-slate-400 hover:text-rose-500 transition-colors duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
                </button>
              </div>
            </td>
          </tr>
          }
        </tbody>
      </table>
    </div>

    <!-- MonHoc Modal -->
    @if (isMonHocModalOpen()) {
    <div class="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
        <div class="bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-md border border-slate-700">
        <h3 class="text-xl font-semibold mb-6 text-white">{{ editingMonHoc() ? 'Chỉnh sửa Môn học' : 'Thêm Môn học mới' }}</h3>
        <form [formGroup]="monHocForm" (ngSubmit)="saveMonHoc()">
            <div class="space-y-4">
            <div>
                <label for="maMonHoc" class="block text-sm font-medium text-slate-300 mb-1">Mã Môn học</label>
                <input id="maMonHoc" formControlName="maMonHoc" class="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none">
            </div>
            <div>
                <label for="tenMonHoc" class="block text-sm font-medium text-slate-300 mb-1">Tên Môn học</label>
                <input id="tenMonHoc" formControlName="tenMonHoc" class="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none">
            </div>
            <div>
                <label for="soTinChi" class="block text-sm font-medium text-slate-300 mb-1">Số tín chỉ</label>
                <input id="soTinChi" type="number" formControlName="soTinChi" class="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none">
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
            <button type="button" (click)="isMonHocModalOpen.set(false)" class="bg-slate-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-slate-500 transition-colors duration-200">Hủy</button>
            <button type="submit" [disabled]="monHocForm.invalid" class="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">Lưu</button>
            </div>
        </form>
        </div>
    </div>
    }
  `
})
export class SubjectManagementComponent {
    private readonly dataService = inject(DataService);
    private readonly fb = inject(FormBuilder);

    khoas = this.dataService.khoas;
    monHocs = this.dataService.monHocs;

    monHocsWithDetails = computed(() => {
        return this.monHocs().map(mh => {
            const khoa = this.khoas().find(k => k.maKhoa === mh.maKhoa);
            return { ...mh, tenKhoa: khoa?.tenKhoa ?? 'N/A' };
        });
    });

    isMonHocModalOpen = signal(false);
    editingMonHoc = signal<MonHoc | null>(null);
    monHocForm = this.fb.group({
        maMonHoc: ['', Validators.required],
        tenMonHoc: ['', Validators.required],
        soTinChi: [3, [Validators.required, Validators.min(1)]],
        maKhoa: ['', Validators.required],
    });

    openMonHocModal(monHoc: (MonHoc & { tenKhoa: string }) | null): void {
        if (monHoc) {
            const { tenKhoa, ...formData } = monHoc;
            this.editingMonHoc.set(formData);
            this.monHocForm.setValue(formData);
            this.monHocForm.controls.maMonHoc.disable();
        } else {
            this.editingMonHoc.set(null);
            this.monHocForm.reset({ soTinChi: 3 });
            this.monHocForm.controls.maMonHoc.enable();
        }
        this.isMonHocModalOpen.set(true);
    }

    saveMonHoc(): void {
        if (this.monHocForm.invalid) return;
        const formData = this.monHocForm.getRawValue();
        if (this.editingMonHoc()) {
            this.dataService.updateMonHoc(formData as MonHoc);
        } else {
            this.dataService.addMonHoc(formData as MonHoc);
        }
        this.isMonHocModalOpen.set(false);
    }

    deleteMonHoc(maMonHoc: string): void {
        if (confirm(`Bạn có chắc muốn xóa môn học có mã ${maMonHoc}?`)) {
            this.dataService.deleteMonHoc(maMonHoc);
        }
    }
}