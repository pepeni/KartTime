import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewResultGpDialogComponent } from './add-new-result-gp-dialog.component';

describe('AddNewResultGpDialogComponent', () => {
  let component: AddNewResultGpDialogComponent;
  let fixture: ComponentFixture<AddNewResultGpDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddNewResultGpDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddNewResultGpDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
