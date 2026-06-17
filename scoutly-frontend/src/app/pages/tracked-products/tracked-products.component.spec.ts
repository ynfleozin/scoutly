import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackedProductsComponent } from './tracked-products.component';

describe('TrackedProductsComponent', () => {
  let component: TrackedProductsComponent;
  let fixture: ComponentFixture<TrackedProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrackedProductsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrackedProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
