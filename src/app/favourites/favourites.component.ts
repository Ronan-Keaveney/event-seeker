import { Component, OnInit, Pipe } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { ApiService } from '../service/api.service';


declare var bootstrap: any;

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.component.html',
  styleUrls: ['./favourites.component.scss']
})

export class FavouritesComponent implements OnInit {
  favourites: any[] = [];
  showDetail: any;

  constructor(private authService: AuthService, private router: Router, private apiService: ApiService) {
    
  }

  ngOnInit(): void {
    this.loadFavourites();

  }

  loadFavourites() {
    this.authService.getCurrentUserUID().subscribe(uid => {
      if (uid) {
        this.authService.getFavourites(uid).subscribe(favs => {
          this.favourites = favs;
        }, error => {
          console.error("Failed to fetch favourites:", error);
        });
      } else {
        console.log("User not authenticated");
      }
    }, error => {
      console.error("Error fetching user ID:", error);
    });
  }
  
  deleteFavourite(favouriteId: string) {
    console.log("ID before deletion:", this.favourites);
    if (confirm('Are you sure you want to delete this favourite?')) {
      this.authService.deleteFavourite(favouriteId).subscribe(() => {
        this.favourites = this.favourites.filter(fav => fav.id !== favouriteId);
        console.log("Deleted and updated locally");
      }, error => {
        console.error('Error removing favourite:', error);
      });
    }
  }
  
  showFavouriteDetails(favourite: any) {
    this.showDetail = {...favourite};
    let modalElement = new bootstrap.Modal(document.getElementById('detailsModal'));
    modalElement.show();
  }
}