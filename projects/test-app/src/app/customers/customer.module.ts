import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerTableComponent } from './customer-table.component';

@NgModule({
  imports: [CommonModule],
  declarations: [CustomerTableComponent],
  exports: [CustomerTableComponent]
})
export class CustomerModule {}
