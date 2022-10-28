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
  user,
} from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { BehaviorSubject, finalize, forkJoin, from, Observable, of } from 'rxjs';
import { DocumentReference, query, where } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { splitNsName } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userData: any;
  isLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private auth: Auth, private firestore: AngularFirestore, private storage: AngularFireStorage, private firebaseAuth: AngularFireAuth, private http: HttpClient, private toastr: ToastrService) {
    this.firebaseAuth.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        this.isLoggedIn.next(true);
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        this.isLoggedIn.next(false);
        localStorage.removeItem('user');
      }
    });
  }

  getUsers(): Observable<User[]> {
    console.log('Get users');
    return this.firestore.collection<User>('users').valueChanges()
  }
  createUser(user: User) {
    /* User disabled by default */
    user.enabled = false;

    var n = Date.now();
    const file = user.firstImage;
    const filePath = `UserImages/${n}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(`UserImages/${n}`, file);

    return task.snapshotChanges()
      .pipe(
        finalize(() => {
          fileRef.getDownloadURL()
            .subscribe(url => {
              if (url)
                user.firstImage = url;
              user.secondImage = url;

              this.firebaseAuth.createUserWithEmailAndPassword(user.email, user.password)
                .then(credential => {
                  credential.user?.updateProfile({ displayName: user.name, photoURL: user.firstImage })
                })
              return from(this.firestore.collection<User>('users').add(user));
            })
        })
      );
  }

  isLogin = false;
  roleAs: string = '';
  loginUser(email: string, password: string) {
    return from(signInWithEmailAndPassword(this.auth, email, password))
      .subscribe((result) => {
        this.userData = result.user;

        var ref = this.firestore.collection<User>('users').ref;
        ref.where("email", "==", this.userData.email).get().then(snapshot => {
          if (snapshot.empty) {
            this.toastr.error('User not found');
          } else {
            snapshot.forEach(doc => {
              this.roleAs = doc.get('role');
              let name = doc.get('name');
              localStorage.setItem('role', this.roleAs);
              this.toastr.success('Welcome ' + name);
            });
          }
        });

        return of({ success: this.isLogin, role: this.roleAs });
      })
  }

  logout() {
    this.firebaseAuth.signOut();
  }

  enableUser(email: string) {
    let record$ = from(this.firestore.collection('users').ref.where('email', '==', email).get());
    record$.subscribe(result => {
      result.forEach(user => {
        let userRef = this.firestore.collection('users').doc(user.id);
        return userRef.update({ enabled: true });
      });
    });
  }

  disableUser(email: string) {
    let record$ = from(this.firestore.collection('users').ref.where('email', '==', email).get());
    record$.subscribe(result => {
      result.forEach(user => {
        let userRef = this.firestore.collection('users').doc(user.id);
        return userRef.update({ enabled: false });
      });
    });
  }
}
