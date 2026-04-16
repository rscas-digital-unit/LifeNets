import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayPublicationComponent } from './display-publication.component';

describe('DisplayPublicationComponent', () => {
  let component: DisplayPublicationComponent;
  let fixture: ComponentFixture<DisplayPublicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplayPublicationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayPublicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
