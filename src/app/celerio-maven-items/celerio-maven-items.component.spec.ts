import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CelerioMavenItemsComponent } from './celerio-maven-items.component';

describe('CelerioMavenItemsComponent', () => {
  let component: CelerioMavenItemsComponent;
  let fixture: ComponentFixture<CelerioMavenItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CelerioMavenItemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CelerioMavenItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
