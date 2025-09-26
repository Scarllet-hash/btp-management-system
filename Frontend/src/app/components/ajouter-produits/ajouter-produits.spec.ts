import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterProduits } from './ajouter-produits';

describe('AjouterProduits', () => {
  let component: AjouterProduits;
  let fixture: ComponentFixture<AjouterProduits>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjouterProduits]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AjouterProduits);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
