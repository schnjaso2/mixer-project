import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Eq3bandComponent } from './eq3band.component';

describe('Eq3bandComponent', () => {
  let component: Eq3bandComponent;
  let fixture: ComponentFixture<Eq3bandComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Eq3bandComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Eq3bandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
