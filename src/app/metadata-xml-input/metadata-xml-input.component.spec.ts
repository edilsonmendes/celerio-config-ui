import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetadataXmlInputComponent } from './metadata-xml-input.component';

describe('MetadataXmlInputComponent', () => {
  let component: MetadataXmlInputComponent;
  let fixture: ComponentFixture<MetadataXmlInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MetadataXmlInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MetadataXmlInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
