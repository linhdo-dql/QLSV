import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { DataService, Diem, LopTinChi, MonHoc } from '../student.service';

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (selectedLopTinChi(); as selectedLop) {
      <div>
          <div class="flex justify-between items-center mb-6">
            <div>
              <h2 class="text-3xl font-bold text-slate-900 dark:text-white">Quản lý Điểm</h2>
              <p class="text-slate-500 dark:text-slate-400 mt-1">Lớp: {{selectedLop.monHoc?.tenMonHoc}} ({{selectedLop.maLop}})</p>
            </div>
            <button (click)="backToClasses()" class="bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-white font-semibold py-2 px-4 rounded-md hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors duration-200">
                &larr; Quay lại Danh sách Lớp
            </button>
        </div>
        <form [formGroup]="gradesForm" (ngSubmit)="saveGrades()">
          <div class="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700">
              <table class="min-w-full">
                    <thead class="bg-slate-50 dark:bg-slate-700/50">
                      <tr>
                        <th class="py-3 px-6 text-left text-sm font-semibold text-slate-600 dark:text-slate-200 uppercase tracking-wider">Mã Sinh viên</th>
                        <th class="py-3 px-6 text-left text-sm font-semibold text-slate-600 dark:text-slate-200 uppercase tracking-wider">Tên Sinh viên</th>
                        <th class="py-3 px-6 text-left text-sm font-semibold text-slate-600 dark:text-slate-200 uppercase tracking-wider w-32">Điểm Giữa kỳ</th>
                        <th class="py-3 px-6 text-left text-sm font-semibold text-slate-600 dark:text-slate-200 uppercase tracking-wider w-32">Điểm Cuối kỳ</th>
                        <th class="py-3 px-6 text-left text-sm font-semibold text-slate-600 dark:text-slate-200 uppercase tracking-wider w-32">Điểm Tổng kết</th>
                      </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-200 dark:divide-slate-700" formArrayName="grades">
                    @for (student of studentsInSelectedClass(); track student.maSinhVien; let i = $index) {
                      <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/40" [formGroupName]="i">
                        <td class="py-4 px-6 font-mono text-sm text-slate-800 dark:text-white">{{student.maSinhVien}}</td>
                        <td class="py-4 px-6 text-slate-800 dark:text-white">{{student.hoTen}}</td>
                        <td class="py-4 px-6">
                          <input type="number" formControlName="diem1" class="w-24 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md py-1 px-2 text-slate-900 dark:text-white focus:ring-1 focus:ring-indigo-500 focus:outline-none">
                        </td>
                        <td class="py-4 px-6">
                            <input type="number" formControlName="diem2" class="w-24 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md py-1 px-2 text-slate-900 dark:text-white focus:ring-1 focus:ring-indigo-500 focus:outline-none">
                        </td>
                        <td class="py-4 px-6">
                            <input type="number" formControlName="diemTong" class="w-24 bg-slate-200 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md py-1 px-2 text-slate-900 dark:text-white focus:ring-1 focus:ring-indigo-500 focus:outline-none" readonly>
                        </td>
                      </tr>
                    }
                  </tbody>
              </table>
          </div>
            <div class="mt-6 flex justify-end">
              <button type="submit" class="bg-indigo-600 text-white font-semibold py-2 px-5 rounded-md hover:bg-indigo-700 transition-colors duration-200">
                  Lưu Điểm
              </button>
          </div>
        </form>
      </div>
    } @else {
      <h2 class="text-3xl font-bold mb-6 text-slate-900 dark:text-white">Các lớp được phân công</h2>
      <div class="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700">
          <table class="min-w-full">
              <thead class="bg-slate-50 dark:bg-slate-700/50">
                  <tr>
                      <th class="py-3 px-6 text-left text-sm font-semibold text-slate-600 dark:text-slate-200 uppercase tracking-wider">Mã Lớp</th>
                      <th class="py-3 px-6 text-left text-sm font-semibold text-slate-600 dark:text-slate-200 uppercase tracking-wider">Môn học</th>
                      <th class="py-3 px-6 text-left text-sm font-semibold text-slate-600 dark:text-slate-200 uppercase tracking-wider">Học kỳ</th>
                      <th class="py-3 px-6 text-left text-sm font-semibold text-slate-600 dark:text-slate-200 uppercase tracking-wider">Năm học</th>
                  </tr>
              </thead>
              <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
                  @for(lop of teacherClasses(); track lop.maLop) {
                      <tr (click)="selectClass(lop)" class="hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors duration-200 cursor-pointer">
                          <td class="py-4 px-6 text-slate-800 dark:text-white">{{lop.maLop}}</td>
                          <td class="py-4 px-6 text-slate-800 dark:text-white">{{lop.monHoc?.tenMonHoc}}</td>
                          <td class="py-4 px-6 text-slate-800 dark:text-white">{{lop.hocKy}}</td>
                          <td class="py-4 px-6 text-slate-800 dark:text-white">{{lop.namHoc}}</td>
                      </tr>
                  }
              </tbody>
          </table>
      </div>
    }
  `
})
export class TeacherDashboardComponent {
    private readonly dataService = inject(DataService);
    private readonly fb = inject(FormBuilder);

    // Teacher specific data
  teacherClasses = signal<any[]>([]);
  ngOnInit() {
    this.loadTeacherClasses();
  }
  private loadTeacherClasses() {
    const teacherId = 'GV001';
    this.dataService.getLopTinChis().subscribe(lopTinChis => {
      this.dataService.getMonHocs().subscribe(monHocs => {
        const filtered = lopTinChis
          .filter(lop => lop.maGiaoVien === teacherId)
          .map(lop => ({
            ...lop,
            monHoc: monHocs.find(m => m.maMonHoc === lop.maMonHoc)
          }));
        this.teacherClasses.set(filtered);
      });
    });
  }
    
    // Teacher grade management
    selectedLopTinChi = signal<(LopTinChi & { monHoc?: MonHoc }) | null>(null);

  studentsInSelectedClass = signal<any[]>([]);
  private loadStudentsInSelectedClass() {
    const selectedLop = this.selectedLopTinChi();
    if (!selectedLop) {
      this.studentsInSelectedClass.set([]);
      return;
    }
    this.dataService.getLopDangKys().subscribe(lopDangKys => {
      const enrollments = lopDangKys.filter(dk => dk.maLopTinChi === selectedLop.maLop);
      this.dataService.getLopHanhChinhs().subscribe(lopHanhChinhs => {
        this.dataService.getSinhViens().subscribe(sinhViens => {
          const studentIds = new Set(
            enrollments.map(dk => lopHanhChinhs.find(lhc => lhc.maLop === dk.maLopHanhChinh))
            .flatMap(lhc => sinhViens.filter(sv => sv.maLopHanhChinh === lhc?.maLop))
            .map(sv => sv.maSinhVien)
          );
          this.studentsInSelectedClass.set(
            sinhViens.filter(sv => studentIds.has(sv.maSinhVien))
          );
        });
      });
    });
  }
    
    gradesForm = this.fb.group({
        grades: this.fb.array([])
    });

    get gradesArray(): FormArray {
        return this.gradesForm.get('grades') as FormArray;
    }
  
  selectClass(lop: LopTinChi & { monHoc?: MonHoc }): void {
    this.selectedLopTinChi.set(lop);
    this.loadStudentsInSelectedClass();
    this.buildGradesForm(lop);
  }

  backToClasses(): void {
    this.selectedLopTinChi.set(null);
    this.studentsInSelectedClass.set([]);
  }

  private buildGradesForm(lop: LopTinChi): void {
    this.gradesArray.clear();
    this.dataService.getDiems().subscribe(diems => {
      this.studentsInSelectedClass().forEach(student => {
        const diem = diems.find(d => d.maSinhVien === student.maSinhVien && d.maLopTinChi === lop.maLop);
        this.gradesArray.push(this.fb.group({
          maSinhVien: [student.maSinhVien],
          maLopTinChi: [lop.maLop],
          diem1: [diem?.diem1 ?? null],
          diem2: [diem?.diem2 ?? null],
          diemTong: [{value: diem?.diemTong ?? null, disabled: true}]
        }));
      });
    });
  }

  saveGrades(): void {
    const gradesToSave: Diem[] = this.gradesArray.value.map((g: any) => ({
      ...g,
      diemTong: (Number(g.diem1) || 0) * 0.3 + (Number(g.diem2) || 0) * 0.7
    }));
    let count = 0;
    gradesToSave.forEach(grade => {
      this.dataService.updateDiem(grade.maSinhVien + '-' + grade.maLopTinChi, grade).subscribe(() => {
        count++;
        if (count === gradesToSave.length) {
          this.buildGradesForm(this.selectedLopTinChi()!);
          alert('Đã lưu điểm thành công!');
        }
      });
    });
  }
}