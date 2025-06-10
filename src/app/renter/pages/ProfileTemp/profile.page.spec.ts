import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ProfilePage } from './profile.page';

describe('ProfilePage (standalone)', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilePage, HttpClientTestingModule]
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(ProfilePage);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
