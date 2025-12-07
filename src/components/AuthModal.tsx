import React, { useState } from "react";
import { signIn, signUp } from "../lib/auth-client";
import styles from "./AuthModal.module.css";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "signin" | "signup";
}

interface SignUpData {
  email: string;
  password: string;
  name: string;
  programmingLanguage?: string;
  developmentEnvironment?: string;
}

export default function AuthModal({ isOpen, onClose, mode }: AuthModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<SignUpData>({
    email: "",
    password: "",
    name: "",
    programmingLanguage: "",
    developmentEnvironment: "",
  });
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn.email({
        email: formData.email,
        password: formData.password,
      });

      if (result.error) {
        setError(result.error.message || "Sign in failed");
      } else {
        onClose();
        window.location.reload(); // Reload to update auth state
      }
    } catch (err) {
      setError("An error occurred during sign in");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password || !formData.name) {
      setError("Please fill in all fields");
      return;
    }

    setStep(2);
  };

  const handleSignUpStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signUp.email({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        // Custom fields will be updated via profile API after account creation
      });

      if (result.error) {
        setError(result.error.message || "Sign up failed");
        setLoading(false);
        return;
      }

      // Update profile with custom fields
      if (formData.programmingLanguage || formData.developmentEnvironment) {
        try {
          const { updateUserProfile } = await import("../lib/mock-auth");
          await updateUserProfile({
            programmingLanguage: formData.programmingLanguage,
            developmentEnvironment: formData.developmentEnvironment,
          });
        } catch (profileError) {
          console.error("Failed to update profile:", profileError);
          // Don't block sign up if profile update fails
        }
      }

      onClose();
      window.location.reload(); // Reload to update auth state
    } catch (err) {
      setError("An error occurred during sign up");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>

        <h2>{mode === "signin" ? "Sign In" : "Sign Up"}</h2>

        {error && <div className={styles.error}>{error}</div>}

        {mode === "signin" ? (
          <form onSubmit={handleSignIn}>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password">Password</label>
              <div className={styles.passwordInputWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className={styles.passwordInput}
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        ) : step === 1 ? (
          <form onSubmit={handleSignUpStep1}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password">Password</label>
              <div className={styles.passwordInputWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  minLength={8}
                  className={styles.passwordInput}
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className={styles.submitButton}>
              Continue
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignUpStep2}>
            <p className={styles.stepInfo}>
              Help us personalize your learning experience
            </p>

            <div className={styles.formGroup}>
              <label htmlFor="programmingLanguage">
                What is your primary programming language or technical
                background?
              </label>
              <select
                id="programmingLanguage"
                name="programmingLanguage"
                value={formData.programmingLanguage}
                onChange={handleInputChange}
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
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="developmentEnvironment">
                What is your primary development environment/hardware?
              </label>
              <select
                id="developmentEnvironment"
                name="developmentEnvironment"
                value={formData.developmentEnvironment}
                onChange={handleInputChange}
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
            </div>

            <div className={styles.buttonGroup}>
              <button
                type="button"
                className={styles.backButton}
                onClick={() => setStep(1)}
              >
                Back
              </button>
              <button
                type="submit"
                className={styles.submitButton}
                disabled={loading}
              >
                {loading ? "Creating account..." : "Complete Sign Up"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
