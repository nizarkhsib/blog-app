import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  color?: 'primary' | 'warn' | 'accent';
  icon?: string;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="confirm-dialog">
      <div class="dialog-icon" [ngClass]="data.color || 'warn'">
        <mat-icon>{{ data.icon || 'warning' }}</mat-icon>
      </div>
      <h2 mat-dialog-title>{{ data.title }}</h2>
      <mat-dialog-content>
        <p>{{ data.message }}</p>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-stroked-button [mat-dialog-close]="false">
          {{ data.cancelText || 'Cancel' }}
        </button>
        <button mat-flat-button [color]="data.color || 'warn'" [mat-dialog-close]="true">
          {{ data.confirmText || 'Confirm' }}
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .confirm-dialog {
      padding: 8px;
      text-align: center;
      min-width: 320px;
    }
    .dialog-icon {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 12px;

      mat-icon {
        font-size: 28px;
        width: 28px;
        height: 28px;
      }

      &.warn {
        background: #fce4ec;
        color: #e53935;
      }
      &.primary {
        background: #e3f2fd;
        color: #1976d2;
      }
      &.accent {
        background: #fff3e0;
        color: #ff6d00;
      }
    }
    h2 {
      margin: 0 0 8px;
      font-size: 20px;
      font-weight: 600;
      color: #1a1a2e;
    }
    p {
      color: #64748b;
      font-size: 14px;
      line-height: 1.5;
      margin: 0;
    }
    mat-dialog-actions {
      margin-top: 20px;
      gap: 8px;
    }
  `]
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) {}
}
