import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

export const exportUserData = async () => {
  const user = getAuth().currentUser;
  if (!user) return;

  const snap = await getDoc(doc(db, "users", user.uid));
  const userData = snap.data();

  const fileUri = FileSystem.documentDirectory + "EazyUse-Data-Export.json";

  await FileSystem.writeAsStringAsync(
    fileUri,
    JSON.stringify(userData, null, 2)
  );

  await Sharing.shareAsync(fileUri);
};