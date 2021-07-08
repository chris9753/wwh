import { decode, encode } from 'base-64';
import './timerConfig';
global.addEventListener = (x) => x;
if (!global.btoa) {
  global.btoa = encode;
}

if (!global.atob) {
  global.atob = decode;
}

import * as firebase from 'firebase';
import '@firebase/auth';
import '@firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA2pyM4AL0V_hpttw93jlgcSUY1W1g4JZQ",
  authDomain: "wwhlisting.firebaseapp.com",
  projectId: "wwhlisting",
  storageBucket: "wwhlisting.appspot.com",
  messagingSenderId: "589001729748",
  appId: "1:589001729748:web:475c013779bc9c199abd41"
};

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);

export { firebase };
