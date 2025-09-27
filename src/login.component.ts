/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

export type UserRole = 'admin' | 'teacher';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  // FIX: Corrected typo from `Change.OnPush` to `ChangeDetectionStrategy.OnPush`.
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex items-center justify-center min-h-screen p-4 bg-slate-100 dark:bg-slate-900">
      <div class="bg-white dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-900 rounded-2xl shadow-2xl p-8 w-full max-w-md border border-slate-200 dark:border-slate-700 transform transition-all duration-500 hover:scale-105">
        <h1 class="text-3xl font-bold text-slate-900 dark:text-white text-center mb-2">Cổng thông tin Đại học</h1>
        <p class="text-center text-slate-600 dark:text-slate-300 mb-8">Vui lòng đăng nhập để tiếp tục</p>
        <form #loginForm="ngForm" (ngSubmit)="login()">
          <div class="space-y-4">
            <div>
              <label for="username" class="block text-sm font-medium text-slate-700 dark:text-slate-300">Tên đăng nhập</label>
              <input 
                id="username" 
                name="username" 
                type="text" 
                class="mt-1 block w-full px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Nhập tên đăng nhập bất kỳ"
              >
            </div>
            <div>
              <label for="password" class="block text-sm font-medium text-slate-700 dark:text-slate-300">Mật khẩu</label>
              <input 
                id="password" 
                name="password" 
                type="password" 
                class="mt-1 block w-full px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Nhập mật khẩu bất kỳ"
              >
            </div>
             <div>
              <label for="role" class="block text-sm font-medium text-slate-700 dark:text-slate-300">Đăng nhập với tư cách</label>
              <select 
                id="role" 
                name="role"
                [(ngModel)]="selectedRole"
                class="mt-1 block w-full px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option class="bg-white dark:bg-slate-700 text-black dark:text-white" value="admin">Quản trị viên</option>
                <option class="bg-white dark:bg-slate-700 text-black dark:text-white" value="teacher">Giáo viên</option>
              </select>
            </div>
          </div>
          <button type="submit" class="mt-8 w-full bg-indigo-600 text-white py-2.5 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-100 dark:focus:ring-offset-slate-900 focus:ring-indigo-500 transition-all duration-300 font-semibold">
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  `,
})
export class LoginComponent {
  loginSuccess = output<UserRole>();
  selectedRole: UserRole = 'admin';

  login(): void {
    // In a real app, you'd validate credentials. Here we just simulate success.
    this.loginSuccess.emit(this.selectedRole);
  }
}