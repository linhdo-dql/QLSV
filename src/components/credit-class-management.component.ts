import { ChangeDetectionStrategy, Component, computed, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataService, LopTinChi } from '../student.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-credit-class-management',
  standalone: true,
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
      <h2 class="text-3xl font-bold text-slate-900 dark:text-white">Quản lý Lớp Tín chỉ</h2>
      <div class="flex flex-col md:flex-row gap-2 md:items-center">
        <!-- Bộ lọc -->
        <div class="flex flex-col md:flex-row gap-2">
          <select [value]="selectedFilter()" (change)="selectedFilter.set($event.target.value)" class="border border-slate-300 dark:border-slate-600 rounded-md py-2 px-3 text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none">
            <option value="all">Tất cả học kỳ</option>
            <option value="1">Học kỳ 1</option>
            <option value="2">Học kỳ 2</option>
            <option value="3">Học kỳ 3</option>
          </select>
          <select [value]="selectedYear()" (change)="selectedYear.set($event.target.value)" class="border border-slate-300 dark:border-slate-600 rounded-md py-2 px-3 text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none">
            <option value="all">Tất cả năm học</option>
            <option value="2023-2024">2023-2024</option>
            <option value="2022-2023">2022-2023</option>
            <option value="2024-2025">2024-2025</option>
          </select>
        </div>
        
        <!-- Tìm kiếm -->
        <input type="text" placeholder="Tìm kiếm..." [value]="searchText()" (input)="searchText.set($event.target.value)" class="border border-slate-300 dark:border-slate-600 rounded-md py-2 px-3 text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none w-64" />
        
        <!-- Nút hành động -->
        <div class="flex gap-2">
          <button (click)="exportToExcel()" class="bg-green-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-green-700 transition-colors duration-200 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Xuất Excel
          </button>
          <button (click)="openLopTinChiModal(null)" class="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-200 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
            </svg>
            Thêm Lớp
          </button>
        </div>
      </div>
    </div>

   
    <div class="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700">
      <table class="min-w-full">
        <thead class="bg-slate-50 dark:bg-slate-700/50">
          <tr>
            <th class="py-3 px-6 text-left text-sm font-semibold text-slate-600 dark:text-slate-200 uppercase tracking-wider">Mã Lớp</th>
            <th class="py-3 px-6 text-left text-sm font-semibold text-slate-600 dark:text-slate-200 uppercase tracking-wider">Môn học</th>
            <th class="py-3 px-6 text-left text-sm font-semibold text-slate-600 dark:text-slate-200 uppercase tracking-wider">Giảng viên</th>
            <th class="py-3 px-6 text-left text-sm font-semibold text-slate-600 dark:text-slate-200 uppercase tracking-wider">Học kỳ</th>
            <th class="py-3 px-6 text-left text-sm font-semibold text-slate-600 dark:text-slate-200 uppercase tracking-wider">Năm học</th>
            <th class="py-3 px-6 text-left text-sm font-semibold text-slate-600 dark:text-slate-200 uppercase tracking-wider">Hành động</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
          @for (ltc of filteredLopTinChis(); track ltc.maLop) {
            <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors duration-200">
              <td class="py-4 px-6 font-mono text-sm text-slate-900 dark:text-white">{{ ltc.maLop }}</td>
              <td class="py-4 px-6 text-slate-800 dark:text-white">{{ ltc.tenMonHoc }}</td>
              <td class="py-4 px-6 text-slate-800 dark:text-white">{{ ltc.tenGiaoVien }}</td>
              <td class="py-4 px-6 text-slate-800 dark:text-white">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  Học kỳ {{ ltc.hocKy }}
                </span>
              </td>
              <td class="py-4 px-6 text-slate-800 dark:text-white">{{ ltc.namHoc }}</td>
              <td class="py-4 px-6">
                <div class="flex items-center gap-4">
                  <button (click)="openLopTinChiModal(ltc)" class="text-slate-500 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                      <path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd" />
                    </svg>
                  </button>
                  <button (click)="openDeleteConfirm(ltc)" class="text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-500 transition-colors duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          } @empty {
            <tr>
              <td colspan="6" class="py-8 px-6 text-center text-slate-500 dark:text-slate-400">
                Không tìm thấy lớp tín chỉ nào
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
    
    <!-- LopTinChi Modal -->
    @if (isLopTinChiModalOpen()) {
      <div class="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
        <div class="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-md border border-slate-200 dark:border-slate-700">
          <h3 class="text-xl font-semibold mb-6 text-slate-900 dark:text-white">{{ editingLopTinChi() ? 'Chỉnh sửa Lớp TC' : 'Thêm Lớp TC mới' }}</h3>
          <form [formGroup]="lopTinChiForm" (ngSubmit)="saveLopTinChi()">
            <div class="space-y-4">
              <div>
                <label for="maLop" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Mã Lớp</label>
                <input id="maLop" formControlName="maLop" class="w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md py-2 px-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none">
              </div>
              <div>
                <label for="maMonHoc" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Môn học</label>
                <select id="maMonHoc" formControlName="maMonHoc" class="w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md py-2 px-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none">
                  @for(mh of monHocs(); track mh.maMonHoc) {
                    <option [value]="mh.maMonHoc">{{ mh.tenMonHoc }}</option>
                  }
                </select>
              </div>
              <div>
                <label for="maGiaoVien" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Giảng viên</label>
                <select id="maGiaoVien" formControlName="maGiaoVien" class="w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md py-2 px-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none">
                  @for(gv of giaoViens(); track gv.maGiaoVien) {
                    <option [value]="gv.maGiaoVien">{{ gv.hoTen }}</option>
                  }
                </select>
              </div>
              <div>
                <label for="hocKy" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Học kỳ</label>
                <input id="hocKy" type="number" formControlName="hocKy" class="w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md py-2 px-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none">
              </div>
              <div>
                <label for="namHoc" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Năm học</label>
                <input id="namHoc" placeholder="VD: 2023-2024" formControlName="namHoc" class="w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md py-2 px-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none">
              </div>
            </div>
            <div class="mt-8 flex justify-end gap-4">
              <button type="button" (click)="isLopTinChiModalOpen.set(false)" class="bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-white font-semibold py-2 px-4 rounded-md hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors duration-200">Hủy</button>
              <button type="submit" [disabled]="lopTinChiForm.invalid" class="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">Lưu</button>
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
            Bạn có chắc chắn muốn xóa lớp <strong>{{ classToDelete()?.maLop }} ({{ classToDelete()?.tenMonHoc }})</strong>? 
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
export class CreditClassManagementComponent implements OnInit {
  private readonly dataService = inject(DataService);
  private readonly fb = inject(FormBuilder);

  // Signals for data
  monHocs = signal<any[]>([]);
  giaoViens = signal<any[]>([]);
  lopTinChis = signal<any[]>([]);
  lopTinChisWithDetails = signal<any[]>([]);

  // Signals for filtering and search
  searchText = signal('');
  selectedFilter = signal('all');
  selectedYear = signal('all');

  // Computed filtered data
  filteredLopTinChis = computed(() => {
    const search = this.searchText().toLowerCase().trim();
    const filter = this.selectedFilter();
    const year = this.selectedYear();
    
    return this.lopTinChisWithDetails().filter(ltc => {
      const matchesSearch = !search || 
        ltc.maLop.toLowerCase().includes(search) ||
        ltc.tenMonHoc.toLowerCase().includes(search) ||
        ltc.tenGiaoVien.toLowerCase().includes(search) ||
        ltc.namHoc.toLowerCase().includes(search);
      
      const matchesFilter = filter === 'all' || ltc.hocKy.toString() === filter;
      const matchesYear = year === 'all' || ltc.namHoc === year;
      
      return matchesSearch && matchesFilter && matchesYear;
    });
  });

  // Computed statistics
  totalClasses = computed(() => this.filteredLopTinChis().length);
  
  semesterClasses = computed(() => {
    const filter = this.selectedFilter();
    if (filter === 'all') return this.filteredLopTinChis().length;
    return this.filteredLopTinChis().filter(ltc => ltc.hocKy.toString() === filter).length;
  });
  
  yearClasses = computed(() => {
    const year = this.selectedYear();
    if (year === 'all') return this.filteredLopTinChis().length;
    return this.filteredLopTinChis().filter(ltc => ltc.namHoc === year).length;
  });
  
  uniqueSubjects = computed(() => {
    const unique = new Set(this.filteredLopTinChis().map(ltc => ltc.maMonHoc));
    return unique.size;
  });

  currentSemesterLabel = computed(() => {
    const filter = this.selectedFilter();
    return filter === 'all' ? 'hiện tại' : filter;
  });

  currentYearLabel = computed(() => {
    const year = this.selectedYear();
    return year === 'all' ? 'học' : year;
  });

  ngOnInit() {
    this.loadMonHocs();
    this.loadGiaoViens();
    this.loadLopTinChis();
  }

  private loadMonHocs() {
    this.dataService.getMonHocs().subscribe(monHocs => {
      this.monHocs.set(monHocs);
      this.updateLopTinChisWithDetails();
    });
  }

  private loadGiaoViens() {
    this.dataService.getGiaoViens().subscribe(giaoViens => {
      this.giaoViens.set(giaoViens);
      this.updateLopTinChisWithDetails();
    });
  }

  private loadLopTinChis() {
    this.dataService.getLopTinChis().subscribe(lopTinChis => {
      this.lopTinChis.set(lopTinChis);
      this.updateLopTinChisWithDetails();
    });
  }

  private updateLopTinChisWithDetails() {
    const monHocs = this.monHocs();
    const giaoViens = this.giaoViens();
    const lopTinChis = this.lopTinChis();
    
    this.lopTinChisWithDetails.set(
      lopTinChis.map(ltc => {
        const monHoc = monHocs.find(m => m.maMonHoc === ltc.maMonHoc);
        const gv = giaoViens.find(g => g.maGiaoVien === ltc.maGiaoVien);
        return { 
          ...ltc, 
          tenMonHoc: monHoc?.tenMonHoc ?? 'N/A', 
          tenGiaoVien: gv?.hoTen ?? 'N/A' 
        };
      })
    );
  }

  // Modal and form state
  isLopTinChiModalOpen = signal(false);
  editingLopTinChi = signal<LopTinChi | null>(null);
  lopTinChiForm = this.fb.group({
    maLop: ['', Validators.required],
    maMonHoc: ['', Validators.required],
    maGiaoVien: ['', Validators.required],
    hocKy: [1, [Validators.required, Validators.min(1)]],
    namHoc: ['', Validators.required],
  });

  // Delete confirmation state
  isDeleteConfirmOpen = signal(false);
  classToDelete = signal<(LopTinChi & { tenMonHoc: string }) | null>(null);

  // Export to Excel
  exportToExcel() {
    const data = this.filteredLopTinChis().map(ltc => ({
      'Mã Lớp': ltc.maLop,
      'Môn Học': ltc.tenMonHoc,
      'Giảng Viên': ltc.tenGiaoVien,
      'Học Kỳ': ltc.hocKy,
      'Năm Học': ltc.namHoc
    }));
    
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'LopTinChi');
    XLSX.writeFile(wb, 'DanhSachLopTinChi.xlsx');
  }

  openLopTinChiModal(lopTinChi: (LopTinChi & { tenMonHoc: string, tenGiaoVien: string }) | null): void {
    if (lopTinChi) {
      const { tenMonHoc, tenGiaoVien, id, ...formData } = lopTinChi as any;
      this.editingLopTinChi.set(id !== undefined ? { ...formData, id } : formData);
      this.lopTinChiForm.setValue({
        maLop: formData.maLop,
        maMonHoc: formData.maMonHoc,
        maGiaoVien: formData.maGiaoVien,
        hocKy: formData.hocKy,
        namHoc: formData.namHoc
      });
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
    const editing = this.editingLopTinChi();
    if (editing) {
      const editingAny = editing as any;
      this.dataService.updateLopTinChi(editingAny.id ?? editingAny.maLop, formData as LopTinChi).subscribe(() => {
        this.loadLopTinChis();
        this.isLopTinChiModalOpen.set(false);
      });
    } else {
      this.dataService.addLopTinChi(formData as LopTinChi).subscribe(() => {
        this.loadLopTinChis();
        this.isLopTinChiModalOpen.set(false);
      });
    }
  }

  openDeleteConfirm(ltc: LopTinChi & { tenMonHoc: string }): void {
    this.classToDelete.set(ltc);
    this.isDeleteConfirmOpen.set(true);
  }

  confirmDelete(): void {
    const ltc = this.classToDelete();
    if (ltc) {
      const ltcAny = ltc as any;
      this.dataService.deleteLopTinChi(ltcAny.id ?? ltcAny.maLop).subscribe(() => {
        this.loadLopTinChis();
      });
    }
    this.isDeleteConfirmOpen.set(false);
    this.classToDelete.set(null);
  }
}