import { Injectable } from '@angular/core';
import { ITimeAvailability, User } from './user';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import {
  Auth,
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  user,
  UserCredential,
} from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { BehaviorSubject, finalize, forkJoin, from, map, Observable, of, take, switchMap } from 'rxjs';
import { DocumentReference, query, where } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { splitNsName } from '@angular/compiler';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { Historia } from '../../interfaces/historia';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  userData: any;
  isLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject(false);
  roleAs: BehaviorSubject<string> = new BehaviorSubject('');
  userEmail: BehaviorSubject<string> = new BehaviorSubject('');
  currentUser: BehaviorSubject<any> = new BehaviorSubject('');
  verified: BehaviorSubject<boolean> = new BehaviorSubject(true);

  private itemsCollection!: AngularFirestoreCollection<Historia>;

  constructor(private auth: Auth, private firestore: AngularFirestore, private storage: AngularFireStorage, private firebaseAuth: AngularFireAuth, private http: HttpClient, private toastr: ToastrService, private router: Router) {
    this.setItemsCollection();
    this.firebaseAuth.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        this.isLoggedIn.next(true);
        this.verified.next(user.emailVerified)
        this.userEmail.next(user.email ?? '');
        this.roleAs.next(localStorage.getItem('role') ?? '')
        localStorage.setItem('user', JSON.stringify(user));
        this.currentUser.next(user);
      } else {
        this.isLoggedIn.next(false);
        localStorage.removeItem('user');
      }
    });
  }

  private setItemsCollection(){
    this.itemsCollection = this.firestore.collection("historial");
  }

  savePoll(results: any, email: any)
  {
    console.log(results)
    this.itemsCollection.doc(email).set(results).then(results1 => {console.log(results1)});
  }

  getHistorial(){
    this.itemsCollection = this.firestore.collection<Historia>('historial');
    return this.itemsCollection.valueChanges();
  }

  getUsers(): Observable<User[]> {
    console.log('Get users');
    return this.firestore.collection<User>('users').valueChanges()
  }

  actionCodeSettings = {
    // URL you want to redirect back to. The domain (www.example.com) for this
    // URL must be in the authorized domains list in the Firebase Console.
    url: environment.production ? 'https://vallejo-entrega.web.app/activate/' : 'http://localhost/activate/',
    // This must be true.
    handleCodeInApp: true,
    iOS: {
      bundleId: 'com.example.ios'
    },
    android: {
      packageName: 'com.example.android',
      installApp: true,
      minimumVersion: '12'
    },
    dynamicLinkDomain: 'example.page.link'
  };

  createUser(user: User, logInUser: boolean) {
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
                  let emailVerificationPromise = credential.user?.sendEmailVerification();
                  if (logInUser) {
                    credential.user?.updateProfile({ displayName: user.name, photoURL: user.firstImage })
                    emailVerificationPromise?.then(() => this.router.navigateByUrl('/email-sent'));
                  }
                  return from(this.firestore.collection<User>('users').add(user));
                })
            })
        })
      );
  }

  doLogin<T>(source$: Observable<UserCredential>): Observable<User> {
    source$.forEach

    return of(this.userData);
  }

  loginUser(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password)
      .then((result) => {
        this.userData = result.user;

        /* Set a field indicating whether the user is verified or not */
        this.verified.next(result.user.emailVerified);

        var ref = this.firestore.collection<User>('users').ref;
        ref.where("email", "==", this.userData.email).get().then(snapshot => {
          if (snapshot.empty) {
            this.toastr.error('User not found');
          } else {
            snapshot.forEach(doc => {
              this.roleAs.next(doc.get('role'));
              let name = doc.get('name');
              localStorage.setItem('role', doc.get('role'));
              this.toastr.success('Welcome ' + name);
            });
          }
        });
      },
        (error) => {
          this.toastr.error('Invalid credentials, please try again.');
        })
  }

  async getUser(email: string) {
    let queryEmail = email;
    if (typeof (email).toString().includes('Observable'))
      queryEmail = await email;

    console.log(queryEmail);

    console.log('Getting user');

    let result = this.firestore.collection('users').ref.where('email', '==', email).get().then((querySnapshot) => {
      let data: any = querySnapshot.docs[0].data();

      /* I'm storing a JSON so I don't need to create a new collection to store the referenced object */
      if (data.role == 'specialist')
        data.timeAvailability = JSON.parse(data.timeAvailability);

      let user = data as User;
      return user;
    }).catch((error) => {
      console.log('Error getting user');
    });

    return result;
  }

  logout() {
    this.firebaseAuth.signOut();
    this.roleAs.next('');
    this.verified.next(false);
    this.isLoggedIn.next(false);
    this.userData = undefined;
    this.currentUser.next(undefined)
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

  updateOrAddUserAvailability(slots: ITimeAvailability[]) {
    let record$ = from(this.firestore.collection('users').ref.where('email', '==', this.userEmail.getValue()).get());
    record$.subscribe(result => {
      result.forEach(user => {
        let userRef = this.firestore.collection('users').doc(user.id);
        return userRef.update({ timeAvailability: JSON.stringify(slots) });
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
