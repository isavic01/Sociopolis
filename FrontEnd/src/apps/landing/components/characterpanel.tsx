import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { auth, db } from "../../services/firebaseConfig";
import { useAuthContext } from "../../auth/components/authProvider";

export const CharacterPanel = () => {
  const { user, loading: authLoading } = useAuthContext();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAvatar = async () => {
      if (!user) return;

      const ref = doc(db, "users", user.uid);
      const snapshot = await getDoc(ref);

      if (snapshot.exists()) {
        const data = snapshot.data();
        setAvatarUrl(data.avatarUrl ?? null);
      }

      setLoading(false);
    };

    if (!authLoading) {
      fetchAvatar();
    }


  }, [user, authLoading]);

  if (authLoading || loading) {
    return <p className="p-4 text-center text-gray-600">Loading avatar…</p>;
  }

  if (!avatarUrl) {
    return <p className="p-4 text-center text-gray-600">No avatar found</p>;
  }

    const changeAvatar = async (newUrl: string) => {
        if (!user) return;
        const ref = doc(db, "users", user.uid);
        await updateDoc(ref, { avatarUrl: newUrl });
        setAvatarUrl(newUrl);
    };

  return (
    <div className="p-4 h-full overflow-y-auto relative">
        <h3 className = "pt-4"> customize </h3>
        <p> Customize soci with different skins!</p>
        <h4 className="!mb-0 !mt-8"> Soci </h4>
        <div className="bg-white flex pt-0 rounded-lg justify-center items-center w-64 h-64">
            <img src={avatarUrl} alt="User Avatar" className="w-48 h-48 mx-auto" />
        </div>
        <h4 className="!mb-0 !mt-8"> Skins </h4>
        <div className="bg-white flex pt-0 rounded-lg items-center w-64 h-12">
            <button
                onClick={() => changeAvatar('/src/assets/svg/avatars/soci_orange.svg')}
                className ="!bg-transparent !pl-2 !p-1"
                >
                    <img src="/src/assets/svg/avatars/soci_orange_selector.svg" alt="User Avatar" className="w-6 h-6 mx-auto" />
            </button>
            <button
                onClick={() => changeAvatar('/src/assets/svg/avatars/soci_lightblue.svg')}
                className ="!bg-transparent !pl-2 !p-1"
                >
                 <img src="/src/assets/svg/avatars/soci_lightblue_selector.svg" alt="User Avatar" className="w-6 h-6 mx-auto" />
            </button>
            <button
                onClick={() => changeAvatar('/src/assets/svg/avatars/soci_green.svg')}
                className ="!bg-transparent !pl-2 !p-1"
                >
                 <img src="/src/assets/svg/avatars/soci_green_selector.svg" alt="User Avatar" className="w-6 h-6 mx-auto" />
            </button>
            <button
                onClick={() => changeAvatar('/src/assets/svg/avatars/soci_pink.svg')}
                className ="!bg-transparent !pl-2 !p-1"
                >
                 <img src="/src/assets/svg/avatars/soci_pink_selector.svg" alt="User Avatar" className="w-6 h-6 mx-auto" />
            </button>
            <button
                onClick={() => changeAvatar('/src/assets/svg/avatars/soci_butter.svg')}
                className ="!bg-transparent !pl-2 !p-1"
                >
                 <img src="/src/assets/svg/avatars/soci_butter_selector.svg" alt="User Avatar" className="w-6 h-6 mx-auto" />
            </button>
            <button
                onClick={() => changeAvatar('/src/assets/svg/avatars/soci_darkblue.svg')}
                className ="!bg-transparent !pl-2 !p-1"
                >
                 <img src="/src/assets/svg/avatars/soci_darkblue_selector.svg" alt="User Avatar" className="w-6 h-6 mx-auto" />
            </button>
        </div>
    </div>
  );
};