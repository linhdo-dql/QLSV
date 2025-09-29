import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import * as XLSX from 'xlsx';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataService, LopHanhChinh } from '../student.service';

@Component({
  selector: 'app-admin-class-management',
  standalone: true,
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
      <h2 class="text-3xl font-bold text-slate-900 dark:text-white">Quản lý Lớp Hành chính</h2>
      <div class="flex flex-col md:flex-row gap-2 md:items-center">
        <input type="text" placeholder="Tìm kiếm..." [value]="classSearchText()" (input)="classSearchText.set($event.target.value)" class="border border-slate-300 dark:border-slate-600 rounded-md py-2 px-3 text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none w-64" />
        <select [value]="selectedKhoa()" (change)="selectedKhoa.set($event.target.value)" class="border border-slate-300 dark:border-slate-600 rounded-md py-2 px-3 text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-700">
          <option value="">Tất cả Khoa</option>
          @for (khoa of khoas(); track khoa.maKhoa) {
            <option [value]="khoa.maKhoa">{{ khoa.tenKhoa }}</option>
          }
        </select>
        <select [value]="selectedGiaoVien()" (change)="selectedGiaoVien.set($event.target.value)" class="border border-slate-300 dark:border-slate-600 rounded-md py-2 px-3 text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-700">
          <option value="">Tất cả GV Chủ nhiệm</option>
          @for (gv of giaoViens(); track gv.maGiaoVien) {
            <option [value]="gv.maGiaoVien">{{ gv.hoTen }}</option>
          }
        </select>
        <button (click)="exportToExcel()" class="bg-green-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-green-700 transition-colors duration-200 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          Xuất Excel
        </button>
        <button (click)="openLopHanhChinhModal(null)" class="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-200 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" /></svg>
          Thêm Lớp
        </button>
      </div>
    </div>
    <div class="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700">
      <table class="min-w-full">
        <thead class="bg-slate-50 dark:bg-slate-700/50">
          <tr>
            <th class="py-3 px-6 text-left text-sm font-semibold text-slate-600 dark:text-slate-200 uppercase tracking-wider">Mã Lớp</th>
            <th class="py-3 px-6 text-left text-sm font-semibold text-slate-600 dark:text-slate-200 uppercase tracking-wider">Tên Lớp</th>
            <th class="py-3 px-6 text-left text-sm font-semibold text-slate-600 dark:text-slate-200 uppercase tracking-wider">Khoa</th>
            <th class="py-3 px-6 text-left text-sm font-semibold text-slate-600 dark:text-slate-200 uppercase tracking-wider">GV Chủ nhiệm</th>
            <th class="py-3 px-6 text-left text-sm font-semibold text-slate-600 dark:text-slate-200 uppercase tracking-wider">Hành động</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
          @for (lhc of filteredLopHanhChinhs(); track lhc.maLop) {
            <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors duration-200">
              <td class="py-4 px-6 font-mono text-sm text-slate-900 dark:text-white">{{ lhc.maLop }}</td>
              <td class="py-4 px-6 text-slate-800 dark:text-white">{{ lhc.tenLop }}</td>
              <td class="py-4 px-6 text-slate-800 dark:text-white">{{ lhc.tenKhoa }}</td>
              <td class="py-4 px-6 text-slate-800 dark:text-white">{{ lhc.tenGiaoVien }}</td>
              <td class="py-4 px-6">
                <div class="flex items-center gap-4">
                  <button (click)="openLopHanhChinhModal(lhc)" class="text-slate-500 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd" /></svg>
                  </button>
                  <button (click)="openDeleteConfirm(lhc)" class="text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-500 transition-colors duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
                  </button>
                </div>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>

    <!-- LopHanhChinh Modal -->
    @if (isLopHanhChinhModalOpen()) {
      <div class="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
        <div class="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-md border border-slate-200 dark:border-slate-700">
          <h3 class="text-xl font-semibold mb-6 text-slate-900 dark:text-white">{{ editingLopHanhChinh() ? 'Chỉnh sửa Lớp HC' : 'Thêm Lớp HC mới' }}</h3>
          <form [formGroup]="lopHanhChinhForm" (ngSubmit)="saveLopHanhChinh()">
            <div class="space-y-4">
              <div>
                <label for="maLop" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Mã Lớp</label>
                <input id="maLop" formControlName="maLop" class="w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md py-2 px-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none">
              </div>
              <div>
                <label for="tenLop" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tên Lớp</label>
                <input id="tenLop" formControlName="tenLop" class="w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md py-2 px-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none">
              </div>
              <div>
                <label for="maKhoa" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Khoa</label>
                <select id="maKhoa" formControlName="maKhoa" class="w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md py-2 px-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none">
                  @for(khoa of khoas(); track khoa.maKhoa) {
                    <option [value]="khoa.maKhoa">{{khoa.tenKhoa}}</option>
                  }
                </select>
              </div>
              <div>
                <label for="maGiaoVien" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">GV Chủ nhiệm</label>
                <select id="maGiaoVien" formControlName="maGiaoVien" class="w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md py-2 px-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none">
                  @for(gv of giaoViens(); track gv.maGiaoVien) {
                    <option [value]="gv.maGiaoVien">{{gv.hoTen}}</option>
                  }
                </select>
              </div>
            </div>
            <div class="mt-8 flex justify-end gap-4">
              <button type="button" (click)="isLopHanhChinhModalOpen.set(false)" class="bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-white font-semibold py-2 px-4 rounded-md hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors duration-200">Hủy</button>
              <button type="submit" [disabled]="lopHanhChinhForm.invalid" class="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">Lưu</button>
            </div>
          </form>
        </div>
      </div>
    }

    <!-- Delete Confirmation Modal -->
    @if (isDeleteConfirmOpen()) {
      <div class="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
        <div class="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-md border border-slate-200 dark:border-slate-700">
          <h3 class="text-xl font-semibold text-slate-900 dark:text-white">Xác nhận Xóa</h3>
          <p class="mt-4 text-slate-600 dark:text-slate-300">
            Bạn có chắc chắn muốn xóa lớp <strong>{{ classToDelete()?.tenLop }}</strong>? 
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
export class AdminClassManagementComponent {
  private readonly dataService = inject(DataService);
  private readonly fb = inject(FormBuilder);

  // Signals
  khoas = signal<any[]>([]);
  giaoViens = signal<any[]>([]);
  lopHanhChinhs = signal<any[]>([]);
  lopHanhChinhsWithDetails = signal<any[]>([]);
  classSearchText = signal('');
  selectedKhoa = signal('');
  selectedGiaoVien = signal('');
  isLopHanhChinhModalOpen = signal(false);
  editingLopHanhChinh = signal<LopHanhChinh | null>(null);
  isDeleteConfirmOpen = signal(false);
  classToDelete = signal<LopHanhChinh | null>(null);

  // Computed
  filteredLopHanhChinhs = computed(() => {
    const keyword = this.classSearchText().toLowerCase().trim();
    const khoa = this.selectedKhoa();
    const giaoVien = this.selectedGiaoVien();
    return this.lopHanhChinhsWithDetails().filter(lhc => {
      const matchKeyword = !keyword ||
        (lhc.maLop && lhc.maLop.toLowerCase().includes(keyword)) ||
        (lhc.tenLop && lhc.tenLop.toLowerCase().includes(keyword));
      const matchKhoa = !khoa || lhc.maKhoa === khoa;
      const matchGiaoVien = !giaoVien || lhc.maGiaoVien === giaoVien;
      return matchKeyword && matchKhoa && matchGiaoVien;
    });
  });

  // Form
  lopHanhChinhForm = this.fb.group({
    maLop: ['', Validators.required],
    tenLop: ['', Validators.required],
    maKhoa: ['', Validators.required],
    maGiaoVien: ['', Validators.required],
  });

  ngOnInit() {
    this.loadKhoas();
    this.loadGiaoViens();
    this.loadLopHanhChinhs();
  }

  private loadKhoas() {
    this.dataService.getKhoas().subscribe(khoas => {
      this.khoas.set(khoas);
      this.updateLopHanhChinhsWithDetails();
    });
  }

  private loadGiaoViens() {
    this.dataService.getGiaoViens().subscribe(giaoViens => {
      this.giaoViens.set(giaoViens);
      this.updateLopHanhChinhsWithDetails();
    });
  }

  private loadLopHanhChinhs() {
    this.dataService.getLopHanhChinhs().subscribe(lopHanhChinhs => {
      this.lopHanhChinhs.set(lopHanhChinhs);
      this.updateLopHanhChinhsWithDetails();
    });
  }

  private updateLopHanhChinhsWithDetails() {
    const khoas = this.khoas();
    const giaoViens = this.giaoViens();
    const lopHanhChinhs = this.lopHanhChinhs();
    this.lopHanhChinhsWithDetails.set(
      lopHanhChinhs.map(lhc => {
        const khoa = khoas.find(k => k.maKhoa === lhc.maKhoa);
        const gv = giaoViens.find(g => g.maGiaoVien === lhc.maGiaoVien);
        return { ...lhc, tenKhoa: khoa?.tenKhoa ?? 'N/A', tenGiaoVien: gv?.hoTen ?? 'N/A' };
      })
    );
  }

  exportToExcel() {
    const data = this.filteredLopHanhChinhs().map(lhc => ({
      'Mã Lớp': lhc.maLop,
      'Tên Lớp': lhc.tenLop,
      'Khoa': lhc.tenKhoa,
      'GV Chủ nhiệm': lhc.tenGiaoVien
    }));
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'LopHanhChinh');
    XLSX.writeFile(wb, 'DanhSachLopHanhChinh.xlsx');
  }

  openLopHanhChinhModal(lopHanhChinh: (LopHanhChinh & { tenKhoa: string, tenGiaoVien: string }) | null): void {
    if (lopHanhChinh) {
      // Loại bỏ các trường không có trong form
      const { tenKhoa, tenGiaoVien, ...raw } = lopHanhChinh;
      this.editingLopHanhChinh.set(raw);
      this.lopHanhChinhForm.setValue({
        maLop: raw.maLop,
        tenLop: raw.tenLop,
        maKhoa: raw.maKhoa,
        maGiaoVien: raw.maGiaoVien
      });
      this.lopHanhChinhForm.controls.maLop.disable();
    } else {
      this.editingLopHanhChinh.set(null);
      this.lopHanhChinhForm.reset();
      this.lopHanhChinhForm.controls.maLop.enable();
    }
    this.isLopHanhChinhModalOpen.set(true);
  }

  saveLopHanhChinh(): void {
    if (this.lopHanhChinhForm.invalid) return;
    const formData = this.lopHanhChinhForm.getRawValue();
    const editing = this.editingLopHanhChinh();
    if (editing) {
      // Use id for backend operation (cast to any for id support)
      const editingAny = editing as any;
      this.dataService.updateLopHanhChinh(editingAny.id ?? editingAny.maLop, formData as LopHanhChinh).subscribe(() => {
        this.loadLopHanhChinhs();
        this.isLopHanhChinhModalOpen.set(false);
      });
    } else {
      this.dataService.addLopHanhChinh(formData as LopHanhChinh).subscribe(() => {
        this.loadLopHanhChinhs();
        this.isLopHanhChinhModalOpen.set(false);
      });
    }
  }

  openDeleteConfirm(lhc: LopHanhChinh): void {
    this.classToDelete.set(lhc);
    this.isDeleteConfirmOpen.set(true);
  }

  confirmDelete(): void {
    const lhc = this.classToDelete();
    if (lhc) {
      // Use id for backend operation (cast to any for id support)
      const lhcAny = lhc as any;
      this.dataService.deleteLopHanhChinh(lhcAny.id ?? lhcAny.maLop).subscribe(() => {
        this.loadLopHanhChinhs();
      });
    }
    this.isDeleteConfirmOpen.set(false);
    this.classToDelete.set(null);
  }
}