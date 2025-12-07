import React, { useState } from "react";
import { useSession, signOut } from "../lib/auth-client";
import AuthModal from "./AuthModal";
import Link from '@docusaurus/Link';
import styles from "./AuthButtons.module.css";

interface AuthButtonsProps {
  variant?: "header" | "footer";
}

export default function AuthButtons({ variant = "header" }: AuthButtonsProps) {
  const { data: session, isPending } = useSession();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"signin" | "signup">("signin");

  const handleSignOut = async () => {
    await signOut();
    window.location.reload();
  };

  const openSignIn = () => {
    setModalMode("signin");
    setModalOpen(true);
  };

  const openSignUp = () => {
    setModalMode("signup");
    setModalOpen(true);
  };

  const getUserInitials = (name?: string) => {
    if (!name) return "U";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  };

  if (isPending) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (session?.user) {
    return (
      <div className={`${styles.authButtons} ${styles[variant]}`}>
        <Link to="/profile" className={styles.profileButton}>
          <span className={styles.profileIcon}>
            {getUserInitials(session.user.name)}
          </span>
          {variant === "footer" && <span>Profile</span>}
        </Link>
        <button onClick={handleSignOut} className={styles.signOutButton}>
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <>
      <div className={`${styles.authButtons} ${styles[variant]}`}>
        <button onClick={openSignIn} className={styles.signInButton}>
          {variant === "header" ? "Sign In" : "Account Login"}
        </button>
        <button onClick={openSignUp} className={styles.signUpButton}>
          {variant === "header" ? "Sign Up" : "Sign Up Now"}
        </button>
      </div>

      <AuthModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        mode={modalMode}
      />
    </>
  );
}
