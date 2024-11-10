import { auth, database } from "@/constants/firebase";
import { ref, onValue } from "firebase/database";
import { useState, useEffect } from "react";
import { UserData } from "@/constants/Interfaces"

export const fetchUserData = () => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserData>({
    pseudo: null,
    userId: null,
    image: null,
    exp: null,
    goalExp: null,
    niveau: null,
    dailyExercises: null,
    challenges: null,
  });

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const userRef = ref(database, `users/${user.uid}`);
      onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        setUserData({
          pseudo: data?.pseudo || null,
          userId: user.uid,
          image: data?.image || null,
          exp: data?.experience || 0,
          goalExp: data?.goalExp || 100,
          niveau: data?.niveau || 0,
          dailyExercises: data?.dailyExercises,
          challenges: data?.challenges,
        });
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  return { userData, loading };
};
