import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, OnDestroy } from '@angular/core';
import { Profile } from '../../models/profile';
import { ProfileService } from '../../services/profile.service';
import { AuthenticationService } from '../../services/authentication.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.scss'],
  standalone: false
})
export class ProfileCardComponent implements OnInit, OnChanges, OnDestroy {

  @Input() profile!: Profile;
  @Input() isOwnProfile = true;
  @Output() onEdit = new EventEmitter<boolean>();
  photoPath = 'https://bootdey.com/img/Content/avatar/avatar7.png';
  articlesCount = 0;
  followersCount = 0;
  followingCount = 0;
  isLoggedIn = false;
  isFollowing = false;
  followButtonLoading = false;

  private destroy$ = new Subject<void>();

  constructor(
    private profileService: ProfileService,
    private authenticationService: AuthenticationService
  ) {
    // Check if user is logged in
    this.isLoggedIn = !!this.authenticationService.currentUserSubject.getValue();
    
    // Subscribe to auth changes
    this.authenticationService.currentUserSubject.pipe(
      takeUntil(this.destroy$)
    ).subscribe(user => {
      this.isLoggedIn = !!user;
      // Re-check follow status when user logs in/out
      if (this.profile?.user?._id) {
        this.checkFollowStatus(this.profile.user._id);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.profile?.photoPath)
      this.photoPath = this.profile?.photoPath;
    
    // Fetch stats from API
    if (this.profile?.user?._id) {
      this.loadStats(this.profile.user._id);
      
      // Check follow status if user is logged in and not viewing own profile
      if (this.isLoggedIn && !this.isOwnProfile) {
        this.checkFollowStatus(this.profile.user._id);
      }
    }
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadStats(userId: string): void {
    this.profileService.getProfileStats(userId).subscribe(
      stats => {
        this.articlesCount = stats.articlesCount;
        this.followersCount = stats.followersCount;
        this.followingCount = stats.followingCount;
      },
      error => {
        console.error('Error loading profile stats:', error);
      }
    );
  }

  checkFollowStatus(targetUserId: string): void {
    const currentUser = this.authenticationService.currentUserSubject.getValue();
    if (!currentUser || !currentUser._id) {
      return;
    }

    this.profileService.isFollowing(currentUser._id, targetUserId).subscribe(
      response => {
        this.isFollowing = response.isFollowing;
      },
      error => {
        console.error('Error checking follow status:', error);
      }
    );
  }

  onEditClicked() {
    this.onEdit.next(true);
  }

  toggleFollow(): void {
    if (this.followButtonLoading || !this.profile?.user?._id) {
      return;
    }

    this.followButtonLoading = true;

    if (this.isFollowing) {
      this.profileService.unfollow(this.profile.user._id).subscribe(
        () => {
          this.isFollowing = false;
          this.followersCount--;
          this.followButtonLoading = false;
        },
        error => {
          console.error('Error unfollowing user:', error);
          this.followButtonLoading = false;
        }
      );
    } else {
      this.profileService.follow(this.profile.user._id).subscribe(
        () => {
          this.isFollowing = true;
          this.followersCount++;
          this.followButtonLoading = false;
        },
        error => {
          console.error('Error following user:', error);
          this.followButtonLoading = false;
        }
      );
    }
  }

}


