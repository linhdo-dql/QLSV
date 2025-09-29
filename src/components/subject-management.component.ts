import { ChangeDetectionStrategy, Component, computed, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataService, MonHoc } from '../student.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-subject-management',
  standalone: true,
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
      <h2 class="text-3xl font-bold text-slate-900 dark:text-white">Quản lý Môn học</h2>
      <div class="flex flex-col md:flex-row gap-2 md:items-center">
        <!-- Bộ lọc -->
        <div class="flex flex-col md:flex-row gap-2">
          <select [value]="selectedKhoa()" (change)="selectedKhoa.set($event.target.value)" class="border border-slate-300 dark:border-slate-600 rounded-md py-2 px-3 text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none">
            <option value="all">Tất cả khoa</option>
            @for (khoa of khoas(); track khoa.maKhoa) {
              <option [value]="khoa.maKhoa">{{ khoa.tenKhoa }}</option>
            }
          </select>
          <select [value]="selectedCredits()" (change)="selectedCredits.set($event.target.value)" class="border border-slate-300 dark:border-slate-600 rounded-md py-2 px-3 text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none">
            <option value="all">Tất cả tín chỉ</option>
            <option value="1">1 tín chỉ</option>
            <option value="2">2 tín chỉ</option>
            <option value="3">3 tín chỉ</option>
            <option value="4">4 tín chỉ</option>
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
          <button (click)="openMonHocModal(null)" class="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-200 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
            </svg>
            Thêm Môn học
          </button>
        </div>
      </div>
    </div>


    <div class="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700">
      <table class="min-w-full">
        <thead class="bg-slate-50 dark:bg-slate-700/50">
          <tr>
            <th class="py-3 px-6 text-left text-sm font-semibold text-slate-600 dark:text-slate-200 uppercase tracking-wider">Mã Môn học</th>
            <th class="py-3 px-6 text-left text-sm font-semibold text-slate-600 dark:text-slate-200 uppercase tracking-wider">Tên Môn học</th>
            <th class="py-3 px-6 text-left text-sm font-semibold text-slate-600 dark:text-slate-200 uppercase tracking-wider">Số tín chỉ</th>
            <th class="py-3 px-6 text-left text-sm font-semibold text-slate-600 dark:text-slate-200 uppercase tracking-wider">Khoa</th>
            <th class="py-3 px-6 text-left text-sm font-semibold text-slate-600 dark:text-slate-200 uppercase tracking-wider">Hành động</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
          @for (mh of filteredMonHocs(); track mh.maMonHoc) {
            <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors duration-200">
              <td class="py-4 px-6 font-mono text-sm text-slate-900 dark:text-white">{{ mh.maMonHoc }}</td>
              <td class="py-4 px-6 text-slate-800 dark:text-white">{{ mh.tenMonHoc }}</td>
              <td class="py-4 px-6 text-slate-800 dark:text-white">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  {{ mh.soTinChi }} tín chỉ
                </span>
              </td>
              <td class="py-4 px-6 text-slate-800 dark:text-white">{{ mh.tenKhoa }}</td>
              <td class="py-4 px-6">
                <div class="flex items-center gap-4">
                  <button (click)="openMonHocModal(mh)" class="text-slate-500 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                      <path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd" />
                    </svg>
                  </button>
                  <button (click)="openDeleteConfirm(mh)" class="text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-500 transition-colors duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          } @empty {
            <tr>
              <td colspan="5" class="py-8 px-6 text-center text-slate-500 dark:text-slate-400">
                Không tìm thấy môn học nào
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>

    <!-- MonHoc Modal -->
    @if (isMonHocModalOpen()) {
      <div class="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
        <div class="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-md border border-slate-200 dark:border-slate-700">
          <h3 class="text-xl font-semibold mb-6 text-slate-900 dark:text-white">{{ editingMonHoc() ? 'Chỉnh sửa Môn học' : 'Thêm Môn học mới' }}</h3>
          <form [formGroup]="monHocForm" (ngSubmit)="saveMonHoc()">
            <div class="space-y-4">
              <div>
                <label for="maMonHoc" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Mã Môn học</label>
                <input id="maMonHoc" formControlName="maMonHoc" class="w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md py-2 px-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none">
              </div>
              <div>
                <label for="tenMonHoc" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tên Môn học</label>
                <input id="tenMonHoc" formControlName="tenMonHoc" class="w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md py-2 px-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none">
              </div>
              <div>
                <label for="soTinChi" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Số tín chỉ</label>
                <input id="soTinChi" type="number" formControlName="soTinChi" class="w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md py-2 px-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none">
              </div>
              <div>
                <label for="maKhoa" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Khoa</label>
                <select id="maKhoa" formControlName="maKhoa" class="w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md py-2 px-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none">
                  @for(khoa of khoas(); track khoa.maKhoa) {
                    <option [value]="khoa.maKhoa">{{ khoa.tenKhoa }}</option>
                  }
                </select>
              </div>
            </div>
            <div class="mt-8 flex justify-end gap-4">
              <button type="button" (click)="isMonHocModalOpen.set(false)" class="bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-white font-semibold py-2 px-4 rounded-md hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors duration-200">Hủy</button>
              <button type="submit" [disabled]="monHocForm.invalid" class="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">Lưu</button>
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
            Bạn có chắc chắn muốn xóa môn học <strong>{{ subjectToDelete()?.tenMonHoc }}</strong>? 
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
export class SubjectManagementComponent implements OnInit {
  private readonly dataService = inject(DataService);
  private readonly fb = inject(FormBuilder);

  // Signals for data
  khoas = signal<any[]>([]);
  monHocs = signal<any[]>([]);
  monHocsWithDetails = signal<any[]>([]);

  // Signals for filtering and search
  searchText = signal('');
  selectedKhoa = signal('all');
  selectedCredits = signal('all');

  // Computed filtered data
  filteredMonHocs = computed(() => {
    const search = this.searchText().toLowerCase().trim();
    const khoa = this.selectedKhoa();
    const credits = this.selectedCredits();
    
    return this.monHocsWithDetails().filter(mh => {
      const matchesSearch = !search || 
        mh.maMonHoc.toLowerCase().includes(search) ||
        mh.tenMonHoc.toLowerCase().includes(search) ||
        mh.tenKhoa.toLowerCase().includes(search);
      
      const matchesKhoa = khoa === 'all' || mh.maKhoa === khoa;
      const matchesCredits = credits === 'all' || mh.soTinChi.toString() === credits;
      
      return matchesSearch && matchesKhoa && matchesCredits;
    });
  });

  // Computed statistics
  totalSubjects = computed(() => this.filteredMonHocs().length);
  
  khoaSubjects = computed(() => {
    const khoa = this.selectedKhoa();
    if (khoa === 'all') return this.filteredMonHocs().length;
    return this.filteredMonHocs().filter(mh => mh.maKhoa === khoa).length;
  });
  
  creditsSubjects = computed(() => {
    const credits = this.selectedCredits();
    if (credits === 'all') return this.filteredMonHocs().length;
    return this.filteredMonHocs().filter(mh => mh.soTinChi.toString() === credits).length;
  });
  
  totalCredits = computed(() => {
    return this.filteredMonHocs().reduce((sum, mh) => sum + mh.soTinChi, 0);
  });

  currentKhoaLabel = computed(() => {
    const khoa = this.selectedKhoa();
    if (khoa === 'all') return 'hiện tại';
    const khoaObj = this.khoas().find(k => k.maKhoa === khoa);
    return khoaObj ? khoaObj.tenKhoa : 'hiện tại';
  });

  currentCreditsLabel = computed(() => {
    const credits = this.selectedCredits();
    return credits === 'all' ? 'Tất cả' : credits;
  });

  ngOnInit() {
    this.loadKhoas();
    this.loadMonHocs();
  }

  private loadKhoas() {
    this.dataService.getKhoas().subscribe(khoas => {
      this.khoas.set(khoas);
      this.updateMonHocsWithDetails();
    });
  }

  private loadMonHocs() {
    this.dataService.getMonHocs().subscribe(monHocs => {
      this.monHocs.set(monHocs);
      this.updateMonHocsWithDetails();
    });
  }

  private updateMonHocsWithDetails() {
    const khoas = this.khoas();
    const monHocs = this.monHocs();
    this.monHocsWithDetails.set(
      monHocs.map(mh => {
        const khoa = khoas.find(k => k.maKhoa === mh.maKhoa);
        return { ...mh, tenKhoa: khoa?.tenKhoa ?? 'N/A' };
      })
    );
  }

  // Modal and form state
  isMonHocModalOpen = signal(false);
  editingMonHoc = signal<MonHoc | null>(null);
  monHocForm = this.fb.group({
    maMonHoc: ['', Validators.required],
    tenMonHoc: ['', Validators.required],
    soTinChi: [3, [Validators.required, Validators.min(1)]],
    maKhoa: ['', Validators.required],
  });

  // Delete confirmation state
  isDeleteConfirmOpen = signal(false);
  subjectToDelete = signal<MonHoc | null>(null);

  // Export to Excel
  exportToExcel() {
    const data = this.filteredMonHocs().map(mh => ({
      'Mã Môn Học': mh.maMonHoc,
      'Tên Môn Học': mh.tenMonHoc,
      'Số Tín Chỉ': mh.soTinChi,
      'Khoa': mh.tenKhoa
    }));
    
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'MonHoc');
    XLSX.writeFile(wb, 'DanhSachMonHoc.xlsx');
  }

  openMonHocModal(monHoc: (MonHoc & { tenKhoa: string }) | null): void {
    if (monHoc) {
      const { tenKhoa, ...raw } = monHoc;
      this.editingMonHoc.set(raw);
      this.monHocForm.setValue({
        maMonHoc: raw.maMonHoc,
        tenMonHoc: raw.tenMonHoc,
        soTinChi: raw.soTinChi,
        maKhoa: raw.maKhoa
      });
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
    const editing = this.editingMonHoc();
    if (editing) {
      const editingAny = editing as any;
      this.dataService.updateMonHoc(editingAny.id ?? editingAny.maMonHoc, formData as MonHoc).subscribe(() => {
        this.loadMonHocs();
        this.isMonHocModalOpen.set(false);
      });
    } else {
      this.dataService.addMonHoc(formData as MonHoc).subscribe(() => {
        this.loadMonHocs();
        this.isMonHocModalOpen.set(false);
      });
    }
  }

  openDeleteConfirm(subject: MonHoc): void {
    this.subjectToDelete.set(subject);
    this.isDeleteConfirmOpen.set(true);
  }

  confirmDelete(): void {
    const subject = this.subjectToDelete();
    if (subject) {
      const subjectAny = subject as any;
      this.dataService.deleteMonHoc(subjectAny.id ?? subjectAny.maMonHoc).subscribe(() => {
        this.loadMonHocs();
      });
    }
    this.isDeleteConfirmOpen.set(false);
    this.subjectToDelete.set(null);
  }
}