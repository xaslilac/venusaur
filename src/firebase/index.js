import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/analytics";

import config from "./config";

// Initialize Firebase
export default firebase.initializeApp(config);
firebase.analytics();
