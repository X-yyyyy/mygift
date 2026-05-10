import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  type User,
} from 'firebase/auth'
import { auth, db } from '@/firebase/init'
import { doc, setDoc, getDoc } from 'firebase/firestore'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const loading = ref(true)

  const isAuthenticated = () => !!user.value

  function init() {
    onAuthStateChanged(auth, (u) => {
      user.value = u
      loading.value = false
    })
  }

  async function login(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password)
  }

  async function register(email: string, password: string, name: string) {
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    const uid = cred.user.uid
    await setDoc(doc(db, 'users', uid), {
      profile: { name, email, photoURL: '' },
      settings: { themeColor: '#409EFF', darkMode: false, weekStartsOn: 1 },
    })
    return cred
  }

  async function loginWithGoogle() {
    const provider = new GoogleAuthProvider()
    const cred = await signInWithPopup(auth, provider)
    const uid = cred.user.uid
    const snap = await getDoc(doc(db, 'users', uid))
    if (!snap.exists()) {
      await setDoc(doc(db, 'users', uid), {
        profile: { name: cred.user.displayName || '', email: cred.user.email, photoURL: cred.user.photoURL || '' },
        settings: { themeColor: '#409EFF', darkMode: false, weekStartsOn: 1 },
      })
    }
    return cred
  }

  async function resetPassword(email: string) {
    return sendPasswordResetEmail(auth, email)
  }

  async function logout() {
    return signOut(auth)
  }

  return { user, loading, isAuthenticated, init, login, register, loginWithGoogle, resetPassword, logout }
})
