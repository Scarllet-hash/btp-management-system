import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterProduitsComponent } from './ajouter-produits';

describe('AjouterProduitsComponent', () => {
  let component: AjouterProduitsComponent;
  let fixture: ComponentFixture<AjouterProduitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AjouterProduitsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AjouterProduitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
