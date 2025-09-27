/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataService, LopTinChi } from '../student.service';

@Component({
  selector: 'app-credit-class-management',
  standalone: true,
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-3xl font-bold text-white">Quản lý Lớp Tín chỉ</h2>
      <button (click)="openLopTinChiModal(null)" class="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-200 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" /></svg>
        Thêm Lớp
      </button>
    </div>
    <div class="bg-slate-800 rounded-lg shadow-lg overflow-hidden border border-slate-700">
      <table class="min-w-full">
        <thead class="bg-slate-700/50">
          <tr>
            <th class="py-3 px-6 text-left text-sm font-semibold text-slate-200 uppercase tracking-wider">Mã Lớp</th>
            <th class="py-3 px-6 text-left text-sm font-semibold text-slate-200 uppercase tracking-wider">Môn học</th>
            <th class="py-3 px-6 text-left text-sm font-semibold text-slate-200 uppercase tracking-wider">Giảng viên</th>
            <th class="py-3 px-6 text-left text-sm font-semibold text-slate-200 uppercase tracking-wider">Học kỳ</th>
            <th class="py-3 px-6 text-left text-sm font-semibold text-slate-200 uppercase tracking-wider">Năm học</th>
            <th class="py-3 px-6 text-left text-sm font-semibold text-slate-200 uppercase tracking-wider">Hành động</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-700">
          @for (ltc of lopTinChisWithDetails(); track ltc.maLop) {
          <tr class="hover:bg-slate-700/40 transition-colors duration-200">
            <td class="py-4 px-6 font-mono text-sm text-white">{{ ltc.maLop }}</td>
            <td class="py-4 px-6 text-white">{{ ltc.tenMonHoc }}</td>
            <td class="py-4 px-6 text-white">{{ ltc.tenGiaoVien }}</td>
            <td class="py-4 px-6 text-white">{{ ltc.hocKy }}</td>
            <td class="py-4 px-6 text-white">{{ ltc.namHoc }}</td>
            <td class="py-4 px-6">
              <div class="flex items-center gap-4">
                <button (click)="openLopTinChiModal(ltc)" class="text-slate-400 hover:text-indigo-400 transition-colors duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd" /></svg>
                </button>
                <button (click)="deleteLopTinChi(ltc.maLop)" class="text-slate-400 hover:text-rose-500 transition-colors duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
                </button>
              </div>
            </td>
          </tr>
          }
        </tbody>
      </table>
    </div>
    
    <!-- LopTinChi Modal -->
    @if (isLopTinChiModalOpen()) {
    <div class="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
        <div class="bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-md border border-slate-700">
        <h3 class="text-xl font-semibold mb-6 text-white">{{ editingLopTinChi() ? 'Chỉnh sửa Lớp TC' : 'Thêm Lớp TC mới' }}</h3>
        <form [formGroup]="lopTinChiForm" (ngSubmit)="saveLopTinChi()">
            <div class="space-y-4">
            <div>
                <label for="maLop" class="block text-sm font-medium text-slate-300 mb-1">Mã Lớp</label>
                <input id="maLop" formControlName="maLop" class="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none">
            </div>
            <div>
                <label for="maMonHoc" class="block text-sm font-medium text-slate-300 mb-1">Môn học</label>
                <select id="maMonHoc" formControlName="maMonHoc" class="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none">
                    @for(mh of monHocs(); track mh.maMonHoc) {
                        <option [value]="mh.maMonHoc">{{mh.tenMonHoc}}</option>
                    }
                </select>
            </div>
            <div>
                <label for="maGiaoVien" class="block text-sm font-medium text-slate-300 mb-1">Giảng viên</label>
                <select id="maGiaoVien" formControlName="maGiaoVien" class="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none">
                    @for(gv of giaoViens(); track gv.maGiaoVien) {
                        <option [value]="gv.maGiaoVien">{{gv.hoTen}}</option>
                    }
                </select>
            </div>
            <div>
                <label for="hocKy" class="block text-sm font-medium text-slate-300 mb-1">Học kỳ</label>
                <input id="hocKy" type="number" formControlName="hocKy" class="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none">
            </div>
            <div>
                <label for="namHoc" class="block text-sm font-medium text-slate-300 mb-1">Năm học</label>
                <input id="namHoc" placeholder="VD: 2023-2024" formControlName="namHoc" class="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none">
            </div>
            </div>
            <div class="mt-8 flex justify-end gap-4">
            <button type="button" (click)="isLopTinChiModalOpen.set(false)" class="bg-slate-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-slate-500 transition-colors duration-200">Hủy</button>
            <button type="submit" [disabled]="lopTinChiForm.invalid" class="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">Lưu</button>
            </div>
        </form>
        </div>
    </div>
    }
  `
})
export class CreditClassManagementComponent {
    private readonly dataService = inject(DataService);
    private readonly fb = inject(FormBuilder);

    monHocs = this.dataService.monHocs;
    giaoViens = this.dataService.giaoViens;
    lopTinChis = this.dataService.lopTinChis;

    lopTinChisWithDetails = computed(() => {
        return this.lopTinChis().map(ltc => {
            const monHoc = this.monHocs().find(m => m.maMonHoc === ltc.maMonHoc);
            const gv = this.giaoViens().find(g => g.maGiaoVien === ltc.maGiaoVien);
            return { ...ltc, tenMonHoc: monHoc?.tenMonHoc ?? 'N/A', tenGiaoVien: gv?.hoTen ?? 'N/A' };
        });
    });

    isLopTinChiModalOpen = signal(false);
    editingLopTinChi = signal<LopTinChi | null>(null);
    lopTinChiForm = this.fb.group({
        maLop: ['', Validators.required],
        maMonHoc: ['', Validators.required],
        maGiaoVien: ['', Validators.required],
        hocKy: [1, [Validators.required, Validators.min(1)]],
        namHoc: ['', Validators.required],
    });

    openLopTinChiModal(lopTinChi: (LopTinChi & { tenMonHoc: string, tenGiaoVien: string }) | null): void {
        if (lopTinChi) {
            const { tenMonHoc, tenGiaoVien, ...formData } = lopTinChi;
            this.editingLopTinChi.set(formData);
            this.lopTinChiForm.setValue(formData);
            this.lopTinChiForm.controls.maLop.disable();
        } else {
            this.editingLopTinChi.set(null);
            this.lopTinChiForm.reset({ hocKy: 1 });
            this.lopTinChiForm.controls.maLop.enable();
        }
        this.isLopTinChiModalOpen.set(true);
    }

    saveLopTinChi(): void {
        if (this.lopTinChiForm.invalid) return;
        const formData = this.lopTinChiForm.getRawValue();
        if (this.editingLopTinChi()) {
            this.dataService.updateLopTinChi(formData as LopTinChi);
        } else {
            this.dataService.addLopTinChi(formData as LopTinChi);
        }
        this.isLopTinChiModalOpen.set(false);
    }

    deleteLopTinChi(maLop: string): void {
        if (confirm(`Bạn có chắc muốn xóa lớp tín chỉ có mã ${maLop}?`)) {
            this.dataService.deleteLopTinChi(maLop);
        }
    }
}