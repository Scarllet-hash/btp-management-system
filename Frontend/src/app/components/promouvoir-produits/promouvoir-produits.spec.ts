import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromouvoirProduitsComponent } from './promouvoir-produits';

describe('PromouvoirProduits', () => {
  let component: PromouvoirProduitsComponent;
  let fixture: ComponentFixture<PromouvoirProduitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromouvoirProduitsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PromouvoirProduitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
