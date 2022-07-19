import * as admin from "firebase-admin";

import * as serviceAccount from "./key.json";
// var serviceAccount = require("path/to/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as any),
  databaseURL: "https://apx-dwf-m6-firebase-db003-default-rtdb.firebaseio.com",
});

const db = admin.firestore();

const usersCollection = db.collection("users"); //sincrónica, no es una promise
//con esto obtengo la collection reference, a esto le puedo hacer peticiones http

usersCollection.get().then((querySnapshot) => {
  //es un snapshot porque es un corte temporal
  //no se actualiza automáticamente, si hay cambios luego que se ejecutó, no los toma
  let docs = querySnapshot.docs;
  for (let doc of docs) {
    const obj = doc.data(); //copia local del objeto
    console.log("ID: ", doc.id, "Objeto (local): ", obj);
  }
});

//otra manera de obtener la data sería:
const ramiDoc = usersCollection.doc("wmJ1KoZoFPuy8e344Kgi");
ramiDoc.get().then((snap) => {
  const ramiData = snap.data();
  //console.log("data en ramiDoc = ", ramiData);
  //
  //si yo modifico después "ramiData" no estoy modificando la base de datos sino
  //una copia local de la información que se guarda en mi código. Para subirla
  //tengo que hacer update o set
});

//de actualizarla. Con update no se modifican los otros datos. Con set si
ramiDoc
  .update({
    name: "ramirooo",
    piernas: true,
  })
  .then((res) => {
    console.log("resultado del update= ", res);
  });

/*
database
  .doc("test/hola") //doc hace referencia a un documento de la database
  .set({
    prueba: true,
    nombre: "Ramiro",
  }) //esta la información a guardar que le estoy pasando
  .then((res) => {
    console.log(res); //esto devuelve un timestamp, el resultado de la escritura en la DB
  });
*/

// Todo este código genera una colección "test" y un documento "hola"
// Es lo mismo que decir key:valor en javascript
// colecciones son arrays, documentos son objetos, en conjunto es una collection

/*
Firestore, MongoDB, etc. son bases de datos orientadas a objetos, representados como documentos
"pelis" es una collection de objetos independientes entre sí, pueden tener distintas formas,
distintos campos

Por ejemplo una colección clásica en Firestore es "users"
La colección es un contenedor de documentos

Colección           Documento           valores

users               1aSDKADS23dc        {nombre: "ramiro", edad: 27, carts: "n12Poqk2mn12"}
                    n12n3asdl899        {nombre: "pepe", edad: 10, fechaNacimiento: 23/01/1994}                

shoppingCart        n12Poqk2mn12        {ownerID: "1aSDKADS23dc", products: "pan"}

Puede ser "productos", "carrito de compras", etc.
No hay limitación del tipo de datos que tenga el documento, ni el nombre. Pero es mejor
estandarizarlos porque sino se hace inescalable

Después, puedo relacionar las diferentes colecciones para darle forma a los datos de mi app

El ID del documento es mejor práctica que sea único (randomizado), no un nombre ni mail (porque
se pueden cambiar).

*/
