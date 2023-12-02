import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileUserUploadComponent } from './mobile-user-upload.component';

describe('MobileUserUploadComponent', () => {
  let component: MobileUserUploadComponent;
  let fixture: ComponentFixture<MobileUserUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MobileUserUploadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MobileUserUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
