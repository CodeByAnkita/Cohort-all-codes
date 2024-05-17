import { useEffect, useState } from "react";

function useIsOnline() {
  const [isOnline, setIsOnline] = useState(window.navigator.onLine);

  useEffect(() => {
    window.addEventListener("online", () => setIsOnline(true));
    window.addEventListener("offline", () => setIsOnline(false));
  }, []);

  return isOnline;
}

export default function UseIsOnlineCustomHook() {
  const isOnline = useIsOnline();

  return <div>{isOnline ? <div>Online</div> : <div>Offline</div>}</div>;
}

// https://projects.100xdevs.com/tracks/3Vhp7rCJUVjnvFuPxZSZ/Custom-Hooks-4
