import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut
} from "firebase/auth";
import { auth } from "./firebase";
const provider = new GoogleAuthProvider();
provider.addScope('profile');
provider.addScope('email');
export const signUpWithEmailAndPassword = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
};
export const signInWithEmail = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
};
export const signUpWithGoogle = () => {
    return signInWithPopup(auth, provider);
};

export const handleSignOut = () => {
    return signOut(auth);
}