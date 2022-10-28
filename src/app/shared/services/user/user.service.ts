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
import { forkJoin, from, Observable } from 'rxjs';
import { DocumentReference } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private auth: Auth, private firestore: AngularFirestore, private storage: AngularFireStorage, private firebaseAuth: AngularFireAuth) { }

  getUsers(): Observable<User[]> {
    console.log('Get users');
    return this.firestore.collection<User>('users').valueChanges();
  }

  createUser(user: User) {
    const firstFile = user.firstImage;
    const reader = new FileReader();
    // TODO : FIX IMAGE UPLOAD.
    reader.onload = () => {
        console.log(reader.result);
    };
    
    const secondFile = user.secondImage;

    return from(this.firestore.collection<User>('users').add(user));
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
