/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { ChangeDetectionStrategy, Component, computed, inject, input, signal, viewChild, ElementRef, effect } from '@angular/core';
import { DataService, Diem, GiaoVien, Khoa, LopHanhChinh, LopTinChi, MonHoc, SinhVien } from './student.service';
import { UserRole } from './login.component';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

declare var Chart: any; // Declare Chart.js global

type View = 'dashboard' | 'khoa' | 'monHoc' | 'lopHanhChinh' | 'giaoVien' | 'lopTinChi' | 'sinhvien';

@Component({
  selector: 'app-dashboard',
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './student-list.component.html',
})
export class DashboardComponent {
  readonly userRole = input.required<UserRole>();
  private readonly dataService = inject(DataService);
  private readonly fb: FormBuilder = inject(FormBuilder);

  // Chart canvas elements
  private studentsByFacultyChartRef = viewChild<ElementRef<HTMLCanvasElement>>('studentsByFacultyChart');
  private subjectsByFacultyChartRef = viewChild<ElementRef<HTMLCanvasElement>>('subjectsByFacultyChart');
  private studentsChart: any;
  private subjectsChart: any;

  readonly isAdmin = computed(() => this.userRole() === 'admin');
  
  currentView = signal<View>('dashboard');

  // Data signals from service
  khoas = this.dataService.khoas;
  monHocs = this.dataService.monHocs;
  giaoViens = this.dataService.giaoViens;
  sinhViens = this.dataService.sinhViens;
  lopHanhChinhs = this.dataService.lopHanhChinhs;
  lopTinChis = this.dataService.lopTinChis;

  // Admin dashboard stats
  stats = computed(() => ({
    faculties: this.khoas().length,
    subjects: this.monHocs().length,
    teachers: this.giaoViens().length,
    students: this.sinhViens().length,
  }));

  // --- Chart Data ---
  private studentsPerFacultyData = computed(() => {
    const faculties = this.khoas();
    const lopHanhChinhs = this.lopHanhChinhs();
    const students = this.sinhViens();
    const labels = faculties.map(f => f.tenKhoa);
    const data = faculties.map(faculty => {
      const classesInFaculty = lopHanhChinhs
        .filter(lhc => lhc.maKhoa === faculty.maKhoa)
        .map(lhc => lhc.maLop);
      return students.filter(sv => classesInFaculty.includes(sv.maLopHanhChinh)).length;
    });
    return { labels, data };
  });

  private subjectsPerFacultyData = computed(() => {
    const faculties = this.khoas();
    const subjects = this.monHocs();
    const labels = faculties.map(f => f.tenKhoa);
    const data = faculties.map(faculty => {
      return subjects.filter(s => s.maKhoa === faculty.maKhoa).length;
    });
    return { labels, data };
  });

  constructor() {
    // Effect to initialize and update charts
    effect(() => {
      if (this.isAdmin() && this.currentView() === 'dashboard') {
        this.initCharts();
      }
    });
  }

  private initCharts(): void {
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: 'rgba(255, 255, 255, 0.1)' },
                ticks: { 
                  color: '#cbd5e1',
                  font: { family: 'sans-serif' },
                  precision: 0 // Ensures integer ticks
                }
            },
            x: {
                grid: { display: false },
                ticks: { color: '#cbd5e1', font: { family: 'sans-serif' } }
            }
        },
        plugins: {
            legend: { display: false }
        }
    };
    
    // Students Chart
    const studentsChartRef = this.studentsByFacultyChartRef();
    if (studentsChartRef) {
      const studentsData = this.studentsPerFacultyData();
      if (this.studentsChart) this.studentsChart.destroy();
      this.studentsChart = new Chart(studentsChartRef.nativeElement, {
        type: 'line',
        data: {
          labels: studentsData.labels,
          datasets: [{
            label: '# of Students',
            data: studentsData.data,
            backgroundColor: 'rgba(99, 102, 241, 0.2)',
            borderColor: 'rgba(99, 102, 241, 1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4
          }]
        },
        options: chartOptions,
      });
    }

    // Subjects Chart
    const subjectsChartRef = this.subjectsByFacultyChartRef();
    if (subjectsChartRef) {
        const subjectsData = this.subjectsPerFacultyData();
        if (this.subjectsChart) this.subjectsChart.destroy();
        this.subjectsChart = new Chart(subjectsChartRef.nativeElement, {
            type: 'line',
            data: {
                labels: subjectsData.labels,
                datasets: [{
                    label: '# of Subjects',
                    data: subjectsData.data,
                    backgroundColor: 'rgba(56, 189, 248, 0.2)',
                    borderColor: 'rgba(56, 189, 248, 1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: chartOptions
        });
    }
  }


  // Teacher specific data
  teacherClasses = computed(() => {
    if (this.userRole() === 'teacher') {
      // Assuming teacher with maGiaoVien 'GV001' is logged in
      const teacherId = 'GV001'; 
      return this.lopTinChis()
        .filter(lop => lop.maGiaoVien === teacherId)
        .map(lop => ({
            ...lop,
            monHoc: this.monHocs().find(m => m.maMonHoc === lop.maMonHoc)
        }));
    }
    return [];
  });
  
  // Teacher grade management
  selectedLopTinChi = signal<(LopTinChi & { monHoc?: MonHoc }) | null>(null);

  studentsInSelectedClass = computed(() => {
    const selectedLop = this.selectedLopTinChi();
    if (!selectedLop) return [];
    
    const enrollments = this.dataService.lopDangKys()
      .filter(dk => dk.maLopTinChi === selectedLop.maLop);
    
    const studentIds = new Set(
        enrollments.map(dk => this.lopHanhChinhs().find(lhc => lhc.maLop === dk.maLopHanhChinh))
        .flatMap(lhc => this.sinhViens().filter(sv => sv.maLopHanhChinh === lhc?.maLop))
        .map(sv => sv.maSinhVien)
    );

    return this.sinhViens().filter(sv => studentIds.has(sv.maSinhVien));
  });
  
  gradesForm = this.fb.group({
    grades: this.fb.array([])
  });

  get gradesArray(): FormArray {
    return this.gradesForm.get('grades') as FormArray;
  }

  // --- Computed properties for detailed views ---
  studentsWithDetails = computed(() => {
    return this.sinhViens().map(sv => {
      const lopHC = this.lopHanhChinhs().find(l => l.maLop === sv.maLopHanhChinh);
      return { ...sv, tenLopHanhChinh: lopHC?.tenLop ?? 'N/A' };
    });
  });

  monHocsWithDetails = computed(() => {
    return this.monHocs().map(mh => {
        const khoa = this.khoas().find(k => k.maKhoa === mh.maKhoa);
        return { ...mh, tenKhoa: khoa?.tenKhoa ?? 'N/A' };
    });
  });

  giaoViensWithDetails = computed(() => {
    return this.giaoViens().map(gv => {
        const khoa = this.khoas().find(k => k.maKhoa === gv.maKhoa);
        return { ...gv, tenKhoa: khoa?.tenKhoa ?? 'N/A' };
    });
  });

  lopHanhChinhsWithDetails = computed(() => {
    return this.lopHanhChinhs().map(lhc => {
        const khoa = this.khoas().find(k => k.maKhoa === lhc.maKhoa);
        const gv = this.giaoViens().find(g => g.maGiaoVien === lhc.maGiaoVien);
        return { ...lhc, tenKhoa: khoa?.tenKhoa ?? 'N/A', tenGiaoVien: gv?.hoTen ?? 'N/A' };
    });
  });
  
  lopTinChisWithDetails = computed(() => {
    return this.lopTinChis().map(ltc => {
        const monHoc = this.monHocs().find(m => m.maMonHoc === ltc.maMonHoc);
        const gv = this.giaoViens().find(g => g.maGiaoVien === ltc.maGiaoVien);
        return { ...ltc, tenMonHoc: monHoc?.tenMonHoc ?? 'N/A', tenGiaoVien: gv?.hoTen ?? 'N/A' };
    });
  });


  // --- State and Forms for Modals ---

  // Khoa management
  isKhoaModalOpen = signal(false);
  editingKhoa = signal<Khoa | null>(null);
  khoaForm = this.fb.group({
    maKhoa: ['', Validators.required],
    tenKhoa: ['', Validators.required],
  });

  // MonHoc management
  isMonHocModalOpen = signal(false);
  editingMonHoc = signal<MonHoc | null>(null);
  monHocForm = this.fb.group({
    maMonHoc: ['', Validators.required],
    tenMonHoc: ['', Validators.required],
    soTinChi: [3, [Validators.required, Validators.min(1)]],
    maKhoa: ['', Validators.required],
  });

  // GiaoVien management
  isGiaoVienModalOpen = signal(false);
  editingGiaoVien = signal<GiaoVien | null>(null);
  giaoVienForm = this.fb.group({
      maGiaoVien: ['', Validators.required],
      hoTen: ['', Validators.required],
      maKhoa: ['', Validators.required],
  });

  // LopHanhChinh management
  isLopHanhChinhModalOpen = signal(false);
  editingLopHanhChinh = signal<LopHanhChinh | null>(null);
  lopHanhChinhForm = this.fb.group({
      maLop: ['', Validators.required],
      tenLop: ['', Validators.required],
      maKhoa: ['', Validators.required],
      maGiaoVien: ['', Validators.required],
  });

  // LopTinChi management
  isLopTinChiModalOpen = signal(false);
  editingLopTinChi = signal<LopTinChi | null>(null);
  lopTinChiForm = this.fb.group({
      maLop: ['', Validators.required],
      maMonHoc: ['', Validators.required],
      maGiaoVien: ['', Validators.required],
      hocKy: [1, [Validators.required, Validators.min(1)]],
      namHoc: ['', Validators.required],
  });

  // Student management
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

  changeView(view: View): void {
    this.currentView.set(view);
    if(this.isAdmin()) {
      this.selectedLopTinChi.set(null);
    }
  }
  
  // --- Teacher Methods ---
  selectClass(lop: LopTinChi & { monHoc?: MonHoc }): void {
    this.selectedLopTinChi.set(lop);
    this.buildGradesForm(lop);
  }

  backToClasses(): void {
    this.selectedLopTinChi.set(null);
  }

  private buildGradesForm(lop: LopTinChi): void {
    this.gradesArray.clear();
    this.studentsInSelectedClass().forEach(student => {
      const diem = this.dataService.diems().find(d => d.maSinhVien === student.maSinhVien && d.maLopTinChi === lop.maLop);
      this.gradesArray.push(this.fb.group({
        maSinhVien: [student.maSinhVien],
        maLopTinChi: [lop.maLop],
        diem1: [diem?.diem1 ?? null],
        diem2: [diem?.diem2 ?? null],
        diemTong: [{value: diem?.diemTong ?? null, disabled: true}]
      }));
    });
  }

  saveGrades(): void {
    const gradesToSave: Diem[] = this.gradesArray.value.map((g: any) => ({
      ...g,
      diemTong: (Number(g.diem1) || 0) * 0.3 + (Number(g.diem2) || 0) * 0.7
    }));
    
    this.dataService.updateDiem(gradesToSave);
    
    // Refresh form with new totals
    this.buildGradesForm(this.selectedLopTinChi()!);
    alert('Grades saved successfully!');
  }


  // --- CRUD Methods ---

  // Khoa methods
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

  deleteKhoa(maKhoa: string): void {
    if (confirm(`Bạn có chắc muốn xóa khoa có mã ${maKhoa}?`)) {
      this.dataService.deleteKhoa(maKhoa);
    }
  }
  
  // MonHoc methods
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

  // GiaoVien methods
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

  // LopHanhChinh methods
  openLopHanhChinhModal(lopHanhChinh: (LopHanhChinh & { tenKhoa: string, tenGiaoVien: string }) | null): void {
    if (lopHanhChinh) {
      const { tenKhoa, tenGiaoVien, ...formData } = lopHanhChinh;
      this.editingLopHanhChinh.set(formData);
      this.lopHanhChinhForm.setValue(formData);
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
    if (this.editingLopHanhChinh()) {
        this.dataService.updateLopHanhChinh(formData as LopHanhChinh);
    } else {
        this.dataService.addLopHanhChinh(formData as LopHanhChinh);
    }
    this.isLopHanhChinhModalOpen.set(false);
  }

  deleteLopHanhChinh(maLop: string): void {
    if (confirm(`Bạn có chắc muốn xóa lớp hành chính có mã ${maLop}?`)) {
        this.dataService.deleteLopHanhChinh(maLop);
    }
  }

  // LopTinChi methods
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

  // Student methods
  openStudentModal(student: (SinhVien & { tenLopHanhChinh: string }) | null): void {
    if (student) {
        const { tenLopHanhChinh, ...formData } = student;
        this.editingStudent.set(formData);
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
    const formData = this.studentForm.getRawValue();
    if (this.editingStudent()) {
        this.dataService.updateStudent(formData as SinhVien);
    } else {
        this.dataService.addStudent(formData as Omit<SinhVien, 'maSinhVien'>);
    }
    this.isStudentModalOpen.set(false);
  }

  deleteStudent(maSinhVien: string): void {
    if (confirm(`Bạn có chắc muốn xóa sinh viên có mã ${maSinhVien}?`)) {
      this.dataService.deleteStudent(maSinhVien);
    }
  }
}