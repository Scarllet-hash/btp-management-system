import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GererProduits } from './gerer-produits';

describe('GererProduits', () => {
  let component: GererProduits;
  let fixture: ComponentFixture<GererProduits>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GererProduits]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GererProduits);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
