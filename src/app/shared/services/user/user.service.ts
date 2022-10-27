import { Injectable } from '@angular/core';
import { Patient, Specialist, User } from './user';
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
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private auth: Auth, private frestore: AngularFirestore, private firebaseAuth: AngularFireAuth) { }

  getUsers() : Observable<User[]> {
    console.log('Get users');
    return this.frestore.collection<User>('users').valueChanges();
  }

  createUser(user: User | Patient | Specialist) {

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
