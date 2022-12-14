import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AltaHistoriaComponent } from './alta-historia.component';

describe('AltaHistoriaComponent', () => {
  let component: AltaHistoriaComponent;
  let fixture: ComponentFixture<AltaHistoriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AltaHistoriaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AltaHistoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
