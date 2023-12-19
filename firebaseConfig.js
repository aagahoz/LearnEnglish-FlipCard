import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyD76MI9XYjnA2HX-n_u6n7OGNxVCHtvVfs",
  authDomain: "kelimeoyunu-b48fa.firebaseapp.com",
  projectId: "kelimeoyunu-b48fa",
  storageBucket: "kelimeoyunu-b48fa.appspot.com",
  messagingSenderId: "319508310654",
  appId: "1:319508310654:web:b866e13cedc7e883bb462f",
  measurementId: "G-NZ1VWNGTDH"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

export {
  auth,
  db
}



// Firestore'dan veri çekme işlemi
const checkAdminStatusById = async (userId) => {
  console.log("ben 1. kod");
  const firestore = getFirestore(db);
  console.log("ben 2. kod");
  userId = "okDQYrS8hcYDIbTFwpD3";
  try
  {
    const userDoc = doc(firestore, 'Users', userId);
    const userSnapshot = await getDocs(userDoc);
    console.log("ben 3. kod");

    if (userSnapshot.exists())
    {
      const userData = userSnapshot.data();
      console.log("ben 4. kod");

      // Kullanıcı admin mi kontrol et
      if (userData && 'isAdmin' in userData)
      {
        console.log("ben 5. kod");

        return userData.isAdmin; // true veya false dönecek
      } else
      {
        console.log("ben 6. kod");

        console.error('Error: User document does not have isAdmin field');
        return null; // Eğer isAdmin alanı belgede yoksa, null veya başka bir değer dönebilirsiniz
      }
    } else
    {
      console.log("ben 7. kod");

      console.error('Error: User document not found');
      return null; // Eğer belge bulunamazsa, null veya başka bir değer dönebilirsiniz
    }
  } catch (error)
  {
    console.log("ben 8. kod");

    console.error('Error fetching data from Firestore:', error);
    return null;
  }
};











// CRUD Islemleri


// import { getFirestore, collection, getDocs } from 'firebase/firestore';
// import { addDoc, Timestamp } from 'firebase/firestore';
// import { doc, deleteDoc } from 'firebase/firestore';
// import { updateDoc } from 'firebase/firestore';

// import db from './firebaseConfig'

// // Firestore'dan veri çekme işlemi
// const fetchDataFromFirestore = async () => {
//   const firestore = getFirestore(db);

//   try {
//     const dataCollection = collection(firestore, 'Users'); // 'your-collection-name' kısmını koleksiyon adınıza göre değiştirin
//     const querySnapshot = await getDocs(dataCollection);

//     // Her belgedeki verileri almak için döngü kullanabilirsiniz
//     querySnapshot.forEach((doc) => {
//       console.log(doc.id, ' => ', doc.data());
//       // doc.id, belgenin kimliğidir
//       // doc.data(), belgenin içindeki verileri temsil eder
//     });
//   } catch (error) {
//     console.error('Error fetching data from Firestore:', error);
//   }
// };
// // Örnek kullanım
// // fetchDataFromFirestore();


// // Firestore'a veri gönderme işlemi
// const sendDataToFirestore = async () => {
//   const firestore = getFirestore(db);

//   try {
//     const dataCollection = collection(firestore, 'Users'); // 'your-collection-name' kısmını koleksiyon adınıza göre değiştirin

//     // Gönderilecek veri
//     const newData = {
//       email: 'test@admin.com',
//       password: '123456',
//       isAdmin: true,
//     };

//     // Firestore koleksiyonuna belge ekleme
//     const docRef = await addDoc(dataCollection, newData);
//     console.log('Document written with ID: ', docRef.id);
//   } catch (error) {
//     console.error('Error sending data to Firestore:', error);
//   }
// };

// // Örnek kullanım
// // sendDataToFirestore();


// const deleteDataFromFirestore = async (documentId) => {
//   const firestore = getFirestore(db);
//   const dataDoc = doc(firestore, 'Users', documentId); // 'your-collection-name' ve documentId kısmını kendi bilgilerinize göre güncelleyin

//   try {
//     await deleteDoc(dataDoc);
//     console.log('Document deleted successfully');
//   } catch (error) {
//     console.error('Error deleting document:', error);
//   }
// };

// // Örnek kullanım
// const documentIdToDelete = 'WjPdkczNShHtt83ovv5v'; // Silinecek belgenin kimliği
// // deleteDataFromFirestore(documentIdToDelete);


// const updateDataInFirestore = async (documentId, updatedData) => {
//   const firestore = getFirestore(db);
//   const dataDoc = doc(firestore, 'Users', documentId); // 'your-collection-name' ve documentId kısmını kendi bilgilerinize göre güncelleyin

//   try {
//     await updateDoc(dataDoc, updatedData);
//     console.log('Document updated successfully');
//   } catch (error) {
//     console.error('Error updating document:', error);
//   }
// };

// // Örnek kullanım
// const documentIdToUpdate = 'hCHlfsV1NMtsrRYM2ziO'; // Güncellenecek belgenin kimliği
// const updatedData = { email: 'admin2@admin.com'};
// // updateDataInFirestore(documentIdToUpdate, updatedData);
