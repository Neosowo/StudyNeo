import { initializeApp } from 'firebase/app'
import { getDatabase, ref, onValue, runTransaction, push, serverTimestamp, set, onDisconnect } from 'firebase/database'

const firebaseConfig = {
  apiKey: "AIzaSyDr7bwFRW7TwR6lpBmuNnCRPwfSMlHkE6Y",
  authDomain: "studyneov2.firebaseapp.com",
  projectId: "studyneov2",
  storageBucket: "studyneov2.firebasestorage.app",
  messagingSenderId: "592516165200",
  appId: "1:592516165200:web:ad18b552c9628a1d6b6b55",
  measurementId: "G-H8L6TQPC3D",
  databaseURL: "https://studyneov2-default-rtdb.firebaseio.com"
}

let db = null

try {
  const app = initializeApp(firebaseConfig)
  db = getDatabase(app)
} catch (e) {
  console.warn('Firebase init error:', e.message)
}

export { db, ref, onValue, runTransaction, push, serverTimestamp, set, onDisconnect }
