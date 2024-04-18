import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    public router: Router,
    private afa: AngularFireAuth,
    public firestore: AngularFirestore
  ) {}
  async register(data: any) {
    try {
      /*       data.createdAt = firebase.firestore.FieldValue.serverTimestamp(); */
      let res = await this.afa.createUserWithEmailAndPassword(
        data.email,
        data.password
      );
      console.log(res, 'response');
      let uid: any = res.user?.uid;
      localStorage.setItem('uid', uid);
      alert('Registered Sucessfully')
    } catch (err) {
      alert('Error in Logout')
      throw err;
    }
  }

  async login(data: any) {
    try {
      let res = await this.afa.signInWithEmailAndPassword(
        data.email,
        data.password
      );
      let uid: any = res.user?.uid;
      localStorage.setItem('uid', uid);
      alert('Logged In Sucessfully')
    } catch (err) {
      alert('Error in Login')
      throw err;
    }
  }

 async logOut() {
    localStorage.clear();
    this.afa.signOut();
    alert('Logged Out Sucessfully')
  }

  isAuthenticated() {
    return localStorage.getItem('uid') ? true : false;
  }

  addFavourite(favourite: any): Promise<void> {
    return this.getCurrentUserUID().pipe(
      take(1),  // Ensure that the subscription completes by taking only one value
      switchMap(uid => {
        if (!uid) {
          throw new Error('User is not authenticated');
        }
        return this.firestore.collection(`users/${uid}/favourites`).add({
          eventId: favourite.id,  // Event ID from the API
          ...favourite            // Other favourite details
        });
      }),
      map(docRef => {
        console.log("Favourite added with ID: ", docRef.id);
        favourite.firestoreId = docRef.id;  // Store Firestore ID
        return favourite;  // Return updated favourite with Firestore ID
      }),
      catchError(error => {
        console.error("Error adding favourite:", error);
        throw error;
      })
    ).toPromise();
  }
  
getFavourites(uid: string): Observable<any[]> {
  return this.firestore.collection(`users/${uid}/favourites`).snapshotChanges().pipe(
    map(actions => actions.map(a => {
      const data = a.payload.doc.data() as any;
      const id = a.payload.doc.id;
      console.log("Fetched ID:", id);  // Log each fetched ID
      return { firestoreId: id, ...data };
    }))
  );
}


  getCurrentUserUID(): Observable<string | null> {
    return this.afa.authState.pipe(
      map(user => user ? user.uid : null)
    );
  }

  deleteFavourite(favouriteId: string): Observable<void> {
    return this.getCurrentUserUID().pipe(
        switchMap(uid => {
            if (!uid) throw new Error('User not authenticated');
            console.log("UID:", uid, "Deleting Favourite ID:", favouriteId);
            return this.firestore.collection(`users/${uid}/favourites`).doc(favouriteId).delete();
        }),
        catchError(error => {
            console.error("Error during deletion in Firestore:", error);
            throw error;
        })
    );
}
}