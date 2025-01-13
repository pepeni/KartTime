import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GpCodeDialogComponent } from './gp-code-dialog.component';

describe('GpCodeDialogComponent', () => {
  let component: GpCodeDialogComponent;
  let fixture: ComponentFixture<GpCodeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpCodeDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GpCodeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
