import { ChangeDetectionStrategy, Component, output, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService, LoginRequest, RegisterRequest } from './auth.service';

export type UserRole = 'admin' | 'teacher';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex items-center justify-center min-h-screen p-4 bg-slate-100 dark:bg-slate-900">
      <div class="bg-white dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-900 rounded-2xl shadow-2xl p-8 w-full max-w-md border border-slate-200 dark:border-slate-700 transform transition-all duration-500 hover:scale-105">
        <h1 class="text-3xl font-bold text-slate-900 dark:text-white text-center mb-2">Cổng thông tin Đại học</h1>
        <p class="text-center text-slate-600 dark:text-slate-300 mb-8">Vui lòng đăng nhập để tiếp tục</p>
        <form *ngIf="!showRegister()" #loginForm="ngForm" (ngSubmit)="login()">
          <div class="space-y-4">
            <div>
              <label for="username" class="block text-sm font-medium text-slate-700 dark:text-slate-300">Tên đăng nhập</label>
              <input id="username" name="username" type="text" [(ngModel)]="username" required class="mt-1 block w-full px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" placeholder="Nhập tên đăng nhập">
            </div>
            <div>
              <label for="password" class="block text-sm font-medium text-slate-700 dark:text-slate-300">Mật khẩu</label>
              <input id="password" name="password" type="password" [(ngModel)]="password" required class="mt-1 block w-full px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" placeholder="Nhập mật khẩu">
            </div>

          </div>
          <button type="submit" [disabled]="isLoading()" class="mt-8 w-full bg-indigo-600 text-white py-2.5 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-100 dark:focus:ring-offset-slate-900 focus:ring-indigo-500 transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed">{{ isLoading() ? 'Đang đăng nhập...' : 'Đăng nhập' }}</button>
          <div *ngIf="error()" class="text-red-600 text-center mt-4">{{ error() }}</div>
          <div class="text-center mt-4">
            <span>Bạn chưa có tài khoản?</span>
            <button type="button" (click)="showRegister.set(true)" class="text-indigo-600 hover:underline ml-1">Đăng ký</button>
          </div>
        </form>
        <!-- Form Đăng ký -->
        <form *ngIf="showRegister()" #registerForm="ngForm" (ngSubmit)="register()">
          <div class="space-y-4">
            <div>
              <label for="reg-username" class="block text-sm font-medium text-slate-700 dark:text-slate-300">Tên đăng nhập</label>
              <input id="reg-username" name="reg-username" type="text" [(ngModel)]="regUsername" required class="mt-1 block w-full px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" placeholder="Tên đăng nhập">
            </div>
            <div>
              <label for="reg-password" class="block text-sm font-medium text-slate-700 dark:text-slate-300">Mật khẩu</label>
              <input id="reg-password" name="reg-password" type="password" [(ngModel)]="regPassword" required class="mt-1 block w-full px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" placeholder="Mật khẩu">
            </div>
            <div>
              <label for="reg-firstName" class="block text-sm font-medium text-slate-700 dark:text-slate-300">Họ</label>
              <input id="reg-firstName" name="reg-firstName" type="text" [(ngModel)]="regFirstName" required class="mt-1 block w-full px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" placeholder="Họ">
            </div>
            <div>
              <label for="reg-lastName" class="block text-sm font-medium text-slate-700 dark:text-slate-300">Tên</label>
              <input id="reg-lastName" name="reg-lastName" type="text" [(ngModel)]="regLastName" required class="mt-1 block w-full px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" placeholder="Tên">
            </div>
          </div>
          <button type="submit" [disabled]="isLoading()" class="mt-8 w-full bg-green-600 text-white py-2.5 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-100 dark:focus:ring-offset-slate-900 focus:ring-green-500 transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed">{{ isLoading() ? 'Đang đăng ký...' : 'Đăng ký' }}</button>
          <div *ngIf="error()" class="text-red-600 text-center mt-4">{{ error() }}</div>
          <div class="text-center mt-4">
            <span>Đã có tài khoản?</span>
            <button type="button" (click)="showRegister.set(false)" class="text-indigo-600 hover:underline ml-1">Đăng nhập</button>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class LoginComponent {
  loginSuccess = output<UserRole>();
  username = '';
  password = '';
  error = signal<string | null>(null);
  isLoading = signal(false);
  showRegister = signal(false); // Thêm signal này

  // Biến cho form đăng ký
  regUsername = '';
  regPassword = '';
  regFirstName = '';
  regLastName = '';



  private auth = inject(AuthService);

  login(): void {
    if (!this.username || !this.password) {
      this.error.set('Vui lòng nhập đầy đủ thông tin đăng nhập');
      return;
    }

    this.error.set(null);
    this.isLoading.set(true);

    const req: LoginRequest = {
      username: this.username,
      password: this.password,
    };

    this.auth.login(req).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        if (res === true) {
          // Lưu thông tin user vào localStorage
          localStorage.setItem('user', JSON.stringify({
            username: this.username
          }));
          this.loginSuccess.emit('admin'); // hoặc emit null tuỳ logic app
        } else {
          this.error.set('Tên đăng nhập hoặc mật khẩu không đúng.');
        }
      },
      error: () => {
        this.isLoading.set(false);
        this.error.set('Lỗi kết nối hoặc máy chủ.');
      }
    });
  }

  // Thêm method register()
  register(): void {
    if (!this.regUsername || !this.regPassword || !this.regFirstName || !this.regLastName) {
      this.error.set('Vui lòng nhập đầy đủ thông tin đăng ký');
      return;
    }

    this.error.set(null);
    this.isLoading.set(true);

    const req: RegisterRequest = {
      username: this.regUsername,
      password: this.regPassword,
      firstName: this.regFirstName,
      lastName: this.regLastName,
      rule: 2
    };

    this.auth.register(req).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        if (res === true) {
          // Lưu thông tin user vào localStorage
          localStorage.setItem('user', JSON.stringify({
            username: this.regUsername,
            firstName: this.regFirstName,
            lastName: this.regLastName
          }));
          this.loginSuccess.emit('admin'); // hoặc emit null tuỳ logic app
        } else {
          this.error.set('Đăng ký thất bại.');
        }
      },
      error: () => {
        this.isLoading.set(false);
        this.error.set('Lỗi kết nối hoặc máy chủ.');
      }
    });
  }
}