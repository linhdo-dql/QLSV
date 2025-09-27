/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { ChangeDetectionStrategy, Component, computed, inject, signal, viewChild, ElementRef, effect } from '@angular/core';
import { DataService } from '../student.service';
import { ThemeService } from '../theme.service';

declare var Chart: any; // Declare Chart.js global

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 class="text-3xl font-bold mb-6 text-slate-900 dark:text-white">Bảng điều khiển Quản trị</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Stat Cards -->
      <div class="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 transform transition-transform hover:-translate-y-1 hover:border-indigo-500/50">
        <div class="flex items-center justify-between">
          <div>
              <h3 class="text-lg font-semibold text-indigo-500 dark:text-indigo-300">Tổng số Khoa</h3>
              <p class="text-4xl font-bold text-slate-900 dark:text-white mt-1">{{ stats().faculties }}</p>
          </div>
          <div class="bg-indigo-500/10 dark:bg-indigo-500/20 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-500 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
          </div>
        </div>
      </div>
      <div class="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 transform transition-transform hover:-translate-y-1 hover:border-sky-500/50">
          <div class="flex items-center justify-between">
          <div>
              <h3 class="text-lg font-semibold text-sky-500 dark:text-sky-300">Tổng số Môn học</h3>
              <p class="text-4xl font-bold text-slate-900 dark:text-white mt-1">{{ stats().subjects }}</p>
          </div>
          <div class="bg-sky-500/10 dark:bg-sky-500/20 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-sky-500 dark:text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v11.494m-9-5.747h18" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h8a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.882 4h8.236a1 1 0 01.95.684l1.757 5.271a1 1 0 01-.95 1.316H6.125a1 1 0 01-.95-1.316L6.932 4.684A1 1 0 017.882 4z" /></svg>
          </div>
        </div>
      </div>
      <div class="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 transform transition-transform hover:-translate-y-1 hover:border-emerald-500/50">
        <div class="flex items-center justify-between">
          <div>
              <h3 class="text-lg font-semibold text-emerald-500 dark:text-emerald-300">Tổng số Giáo viên</h3>
              <p class="text-4xl font-bold text-slate-900 dark:text-white mt-1">{{ stats().teachers }}</p>
          </div>
          <div class="bg-emerald-500/10 dark:bg-emerald-500/20 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-emerald-500 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          </div>
        </div>
      </div>
        <div class="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 transform transition-transform hover:-translate-y-1 hover:border-rose-500/50">
        <div class="flex items-center justify-between">
          <div>
              <h3 class="text-lg font-semibold text-rose-500 dark:text-rose-300">Tổng số Sinh viên</h3>
              <p class="text-4xl font-bold text-slate-900 dark:text-white mt-1">{{ stats().students }}</p>
          </div>
            <div class="bg-rose-500/10 dark:bg-rose-500/20 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-rose-500 dark:text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
          </div>
        </div>
      </div>
    </div>
    <!-- Charts Section -->
    <div class="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
        <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-4">Sinh viên theo Khoa</h3>
        <div class="relative h-80">
          <canvas #studentsByFacultyChart></canvas>
        </div>
      </div>
      <div class="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
        <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-4">Môn học theo Khoa</h3>
          <div class="relative h-80">
          <canvas #subjectsByFacultyChart></canvas>
        </div>
      </div>
    </div>
  `
})
export class AdminDashboardComponent {
  private readonly dataService = inject(DataService);
  private readonly themeService = inject(ThemeService);

  // Chart canvas elements
  private studentsByFacultyChartRef = viewChild<ElementRef<HTMLCanvasElement>>('studentsByFacultyChart');
  private subjectsByFacultyChartRef = viewChild<ElementRef<HTMLCanvasElement>>('subjectsByFacultyChart');
  private studentsChart: any;
  private subjectsChart: any;

  // Data signals from service
  khoas = this.dataService.khoas;
  monHocs = this.dataService.monHocs;
  giaoViens = this.dataService.giaoViens;
  sinhViens = this.dataService.sinhViens;
  lopHanhChinhs = this.dataService.lopHanhChinhs;

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
      // Trigger redraw when theme changes
      this.themeService.theme();
      this.initCharts();
    });
  }

  private initCharts(): void {
    const isDark = this.themeService.theme() === 'dark';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    const tickColor = isDark ? '#cbd5e1' : '#475569';

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: gridColor },
                ticks: { 
                  color: tickColor,
                  font: { family: 'sans-serif' },
                  precision: 0 // Ensures integer ticks
                }
            },
            x: {
                grid: { display: false },
                ticks: { color: tickColor, font: { family: 'sans-serif' } }
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
}