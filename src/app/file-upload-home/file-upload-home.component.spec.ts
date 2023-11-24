import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileUploadHomeComponent } from './file-upload-home.component';

describe('FileUploadHomeComponent', () => {
  let component: FileUploadHomeComponent;
  let fixture: ComponentFixture<FileUploadHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileUploadHomeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FileUploadHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
