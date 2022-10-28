import { Injectable } from '@angular/core';
import { User } from './user';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import {
  Auth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize, forkJoin, from, Observable } from 'rxjs';
import { DocumentReference } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private auth: Auth, private firestore: AngularFirestore, private storage: AngularFireStorage, private firebaseAuth: AngularFireAuth, private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    console.log('Get users');
    return this.firestore.collection<User>('users').valueChanges();
  }
  downloadURL: Observable<string> = new Observable<string>();
  fb: any;
  createUser(user: User) {
    const firstFile = user.firstImage;
    const secondFile = user.secondImage;

    var n = Date.now();
    const file = user.firstImage;
    const filePath = `UserImages/${n}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(`UserImages/${n}`, file);

    return task.snapshotChanges()
      .pipe(
        finalize(() => {
          this.downloadURL = fileRef.getDownloadURL();
          this.downloadURL.subscribe(url => {
            if (url)
              this.fb = url;
            user.firstImage = this.fb;
            user.secondImage = this.fb;
            return from(this.firestore.collection<User>('users').add(user));
          })
        })
      );
  }

  loginUser(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password)
      .then((result) => {
        // this.SetUserData(result.user);
        // this.isLogin = true;
        // this.roleAs = this.userData.role;
        // localStorage.setItem('STATE', 'true');
        // localStorage.setItem('ROLE', this.roleAs)
        // return of({ success: this.isLogin, role: this.roleAs });
      })
  }
}
