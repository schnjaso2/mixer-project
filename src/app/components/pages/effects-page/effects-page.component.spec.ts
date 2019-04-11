import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EffectsPageComponent } from './effects-page.component';

describe('EffectsPageComponent', () => {
  let component: EffectsPageComponent;
  let fixture: ComponentFixture<EffectsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EffectsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EffectsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
