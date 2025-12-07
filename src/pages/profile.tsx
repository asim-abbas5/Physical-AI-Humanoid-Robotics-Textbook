import React, { useState, useEffect } from "react";
import Layout from "@theme/Layout";
import { useSession, signOut } from "../lib/auth-client";
import { useHistory } from "@docusaurus/router";
import styles from "./profile.module.css";

export default function Profile() {
  const { data: session, isPending } = useSession();
  const history = useHistory();
  const [editing, setEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    programmingLanguage: "",
    developmentEnvironment: "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!isPending && !session) {
      history.push("/");
    }
  }, [session, isPending, history]);

  useEffect(() => {
    if (session?.user) {
      setProfileData({
        programmingLanguage: (session.user as any).programmingLanguage || "",
        developmentEnvironment: (session.user as any).developmentEnvironment || "",
      });
    }
  }, [session]);

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");

    try {
      const { updateUserProfile } = await import("../lib/mock-auth");
      const result = await updateUserProfile(profileData);

      if (result.error) {
        setMessage(result.error.message);
      } else {
        setMessage("Profile updated successfully!");
        setEditing(false);
        setTimeout(() => setMessage(""), 3000);
        // Reload to update session
        window.location.reload();
      }
    } catch (error) {
      setMessage("An error occurred while updating profile");
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    history.push("/");
  };

  if (isPending) {
    return (
      <Layout title="Profile" description="User Profile">
        <div className={styles.container}>
          <div className={styles.loading}>Loading...</div>
        </div>
      </Layout>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <Layout title="Profile" description="User Profile">
      <div className={styles.container}>
        <div className={styles.profileCard}>
          <div className={styles.header}>
            <div className={styles.profileIcon}>
              {session.user.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div>
              <h1>{session.user.name}</h1>
              <p className={styles.email}>{session.user.email}</p>
            </div>
          </div>

          {message && (
            <div className={styles.message}>
              {message}
            </div>
          )}

          <div className={styles.section}>
            <h2>Personalization Settings</h2>
            <p className={styles.sectionDescription}>
              These settings help us customize your learning experience
            </p>

            <div className={styles.formGroup}>
              <label htmlFor="programmingLanguage">
                Primary Programming Language / Technical Background
              </label>
              {editing ? (
                <select
                  id="programmingLanguage"
                  name="programmingLanguage"
                  value={profileData.programmingLanguage}
                  onChange={handleInputChange}
                  className={styles.input}
                >
                  <option value="">Select...</option>
                  <option value="Python">Python</option>
                  <option value="JavaScript">JavaScript</option>
                  <option value="C++">C++</option>
                  <option value="Java">Java</option>
                  <option value="Rust">Rust</option>
                  <option value="Go">Go</option>
                  <option value="Graphic Design">Graphic Design</option>
                  <option value="Project Management">Project Management</option>
                  <option value="Other">Other</option>
                </select>
              ) : (
                <div className={styles.value}>
                  {profileData.programmingLanguage || "Not set"}
                </div>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="developmentEnvironment">
                Primary Development Environment / Hardware
              </label>
              {editing ? (
                <select
                  id="developmentEnvironment"
                  name="developmentEnvironment"
                  value={profileData.developmentEnvironment}
                  onChange={handleInputChange}
                  className={styles.input}
                >
                  <option value="">Select...</option>
                  <option value="VS Code on Windows">VS Code on Windows</option>
                  <option value="VS Code on Mac">VS Code on Mac</option>
                  <option value="VS Code on Linux">VS Code on Linux</option>
                  <option value="Mac with Xcode">Mac with Xcode</option>
                  <option value="Linux Terminal">Linux Terminal</option>
                  <option value="JetBrains IDEs">JetBrains IDEs</option>
                  <option value="Vim/Neovim">Vim/Neovim</option>
                  <option value="Other">Other</option>
                </select>
              ) : (
                <div className={styles.value}>
                  {profileData.developmentEnvironment || "Not set"}
                </div>
              )}
            </div>

            <div className={styles.buttonGroup}>
              {editing ? (
                <>
                  <button
                    onClick={() => setEditing(false)}
                    className={styles.cancelButton}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className={styles.saveButton}
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className={styles.editButton}
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          <div className={styles.section}>
            <h2>Account Actions</h2>
            <button onClick={handleSignOut} className={styles.signOutButton}>
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
