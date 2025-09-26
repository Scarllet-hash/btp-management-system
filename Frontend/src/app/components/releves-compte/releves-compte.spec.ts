import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelevesCompte } from './releves-compte';

describe('RelevesCompte', () => {
  let component: RelevesCompte;
  let fixture: ComponentFixture<RelevesCompte>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RelevesCompte]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RelevesCompte);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
