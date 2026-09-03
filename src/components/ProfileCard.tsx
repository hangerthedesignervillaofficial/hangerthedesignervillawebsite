"use client";
import { Button } from "@/components/ui/button";
import { useState, useEffect, ChangeEvent, useRef } from "react";
import { User } from "@supabase/supabase-js";
import { EmailChangeModal } from "@/components/EmailChangeModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { profileService } from "@/services/profile/profileService";

interface ProfileCardProps {
  user: User;
  username: string;
  setUsername: (value: string) => void;
  avatarUrl: string;
  setAvatarUrl: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  phone?: string;
  setPhone?: (value: string) => void;
  createdAt: string | null;
  isSaving: boolean;
  onSaveProfile: (username: string, email: string, phone: string, avatarUrl: string) => void;
  onSignOut: () => void;
  onUpdateEmail?: (newEmail: string) => Promise<void>;
}

export function ProfileCard({
  user,
  username,
  setUsername,
  avatarUrl,
  setAvatarUrl,
  email,
  setEmail,
  phone = "",
  setPhone = () => {},
  createdAt,
  isSaving,
  onSaveProfile,
  onSignOut,
  onUpdateEmail,
}: ProfileCardProps) {
  const [usernameInput, setUsernameInput] = useState(username);
  const [emailInput, setEmailInput] = useState(email);
  const [phoneInput, setPhoneInput] = useState(phone);
  const [avatarUrlInput, setAvatarUrlInput] = useState(avatarUrl);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update local state when props change (e.g., after successful save)
  useEffect(() => {
    setUsernameInput(username);
    setEmailInput(email);
    setPhoneInput(phone);
    setAvatarUrlInput(avatarUrl);
    // Clear preview when avatar URL changes from external source
    if (avatarUrl !== avatarUrlInput) {
      setPreviewUrl(null);
    }
  }, [username, email, phone, avatarUrl, avatarUrlInput]);

  const handleSave = async () => {
    // Update local UI state
    setUsername(usernameInput);
    setAvatarUrl(avatarUrlInput);
    setEmail(emailInput);
    setPhone(phoneInput);

    // Save profile data
    onSaveProfile(usernameInput, emailInput, phoneInput, avatarUrlInput);
  };

  const handleAvatarClick = () => {
    // Programmatically click the hidden file input
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (max 2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      toast.error(
        `File size exceeds 2MB limit (${(file.size / (1024 * 1024)).toFixed(
          2,
        )}MB)`,
      );
      return;
    }

    // Check file type
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a valid image file (JPEG, PNG, GIF, or WEBP)");
      return;
    }

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    // Start upload
    handleAvatarUpload(file);
  };

  const handleAvatarUpload = async (file: File) => {
    try {
      setUploading(true);

      // Use profile service to upload avatar and pass current avatar URL to delete previous avatars
      const publicUrl = await profileService.uploadAvatar(
        user.id,
        file,
        avatarUrl,
      );

      if (publicUrl) {
        // Update both local state and parent component state
        setAvatarUrlInput(publicUrl);
        setAvatarUrl(publicUrl); // Update parent component state immediately
        // Clear preview since we now have the uploaded URL
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
          setPreviewUrl(null);
        }
        toast.success("Avatar uploaded successfully");
      } else {
        throw new Error("Failed to upload avatar. Please try again later.");
      }
    } catch (error) {
      console.error("Error uploading avatar:", error);
      // Clear preview on error
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }

      // Provide a user-friendly error message
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to upload avatar. Please try again later.");
      }
    } finally {
      setUploading(false);
    }
  };

  // Clean up preview URL on component unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Get initials for avatar fallback
  const getInitials = () => {
    if (username) {
      return username.substring(0, 2).toUpperCase();
    }
    if (email) {
      return email.substring(0, 2).toUpperCase();
    }
    return "U";
  };

  // Determine which image to show: preview, uploaded avatar, or fallback
  const displayImageUrl = previewUrl || avatarUrlInput || undefined;

  return (
    <div className="mb-10 bg-[#FDFBF7] border border-[#D4AF37]/20 p-8 shadow-sm">
      <div className="flex flex-col md:flex-row items-center gap-8 mb-10">
        <div
          className="group relative cursor-pointer flex-shrink-0"
          onClick={handleAvatarClick}
        >
          <Avatar className="h-32 w-32 border-2 border-[#D4AF37]/30 shadow-md">
            <AvatarImage
              src={displayImageUrl}
              className="h-32 w-32 rounded-full object-cover"
            />
            <AvatarFallback className="h-32 w-32 text-3xl font-serif text-[#2C1810] bg-[#F5F0E6]">
              {getInitials()}
            </AvatarFallback>
          </Avatar>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={uploading}
            className="hidden"
          />

          {/* Overlay with upload icon/text */}
          <div className="bg-opacity-50 absolute inset-0 flex items-center justify-center rounded-full bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span className="text-xs tracking-widest text-white uppercase">
              {uploading ? "Wait..." : "Change"}
            </span>
          </div>
        </div>

        <div className="text-center md:text-left flex-1">
          <h2 className="font-serif text-3xl text-[#2C1810] mb-2" style={{ fontFamily: "var(--font-heading), Georgia, serif" }}>
            {usernameInput || "Welcome to The Villa"}
          </h2>
          <p className="font-sans text-sm tracking-wide text-[#7A6B5D] mb-4">
            {email}
          </p>
        </div>
      </div>

      <div className="space-y-6 max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative pt-4">
            <div className="flex items-center border-b border-[#D4AF37]/30 focus-within:border-[#D4AF37] transition-colors h-10 group">
              <input
                id="username"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder=" "
                className="peer flex-1 bg-transparent outline-none font-sans text-base text-[#2C1810]"
              />
              <label 
                htmlFor="username" 
                className="absolute left-0 top-0 text-[10px] text-[#7A6B5D] font-sans uppercase tracking-[0.2em] transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-6 peer-placeholder-shown:text-[#7A6B5D]/50 peer-focus:top-0 peer-focus:text-[10px] peer-focus:text-[#D4AF37] pointer-events-none"
              >
                Display Name
              </label>
            </div>
          </div>

          <div className="relative pt-4">
            <div className="flex items-center border-b border-[#D4AF37]/30 focus-within:border-[#D4AF37] transition-colors h-10 group">
              <span className="font-sans text-base text-[#7A6B5D] pr-2 border-r border-[#D4AF37]/20 mr-3 select-none">+91</span>
              <input
                id="phone"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value.replace(/\D/g, ''))}
                maxLength={10}
                placeholder=" "
                className="peer flex-1 bg-transparent outline-none font-sans text-base text-[#2C1810]"
              />
              <label 
                htmlFor="phone" 
                className="absolute left-10 top-0 text-[10px] text-[#7A6B5D] font-sans uppercase tracking-[0.2em] transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-6 peer-placeholder-shown:text-[#7A6B5D]/50 peer-focus:top-0 peer-focus:text-[10px] peer-focus:text-[#D4AF37] pointer-events-none"
              >
                Contact Number
              </label>
            </div>
          </div>
          
          <div className="relative pt-4 flex gap-4 items-end">
            <div className="flex items-center border-b border-[#D4AF37]/30 h-10 flex-1 opacity-70">
              <input
                id="email"
                value={email}
                disabled
                placeholder=" "
                className="peer flex-1 bg-transparent outline-none font-sans text-base text-[#2C1810]"
              />
              <label 
                htmlFor="email" 
                className="absolute left-0 top-0 text-[10px] text-[#7A6B5D] font-sans uppercase tracking-[0.2em] pointer-events-none"
              >
                Registered Email
              </label>
            </div>
            <button
              type="button"
              onClick={() => setIsEmailModalOpen(true)}
              className="h-10 px-4 border border-[#D4AF37]/50 text-[#7A6B5D] hover:bg-[#D4AF37]/10 hover:text-[#2C1810] text-[10px] font-bold tracking-[0.1em] uppercase transition-colors"
            >
              Update
            </button>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full sm:w-auto bg-[#2C1810] text-[#D4AF37] hover:bg-[#4A0E17] hover:text-white cursor-pointer rounded-none h-12 text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300"
        >
          {isSaving ? "SAVING..." : "SAVE CHANGES"}
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-[#D4AF37]/20 pt-6 mt-6">
        <div className="text-[#7A6B5D] text-xs tracking-wider mb-4 sm:mb-0">
          {createdAt && (
            <span className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-[#D4AF37]"></span>
              MEMBER SINCE: {new Date(createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
              }).toUpperCase()}
            </span>
          )}
        </div>
        
        <button
          onClick={onSignOut}
          className="text-[#7A6B5D] hover:text-[#4A0E17] text-xs font-bold tracking-[0.1em] uppercase transition-colors flex items-center gap-2"
        >
          Sign Out
        </button>
      </div>

      {onUpdateEmail && (
        <EmailChangeModal
          user={user}
          isOpen={isEmailModalOpen}
          onClose={() => setIsEmailModalOpen(false)}
          // onUpdateEmail={onUpdateEmail}
          setEmail={setEmail}
        />
      )}
    </div>
  );
}
