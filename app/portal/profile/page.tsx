"use client";

import { useState, useRef, useEffect } from "react";
import { PortalLayout } from "@/components/portal-layout";
import { useAuth } from "@/lib/auth-context";
import { Upload, CheckCircle, Loader2 } from "lucide-react";
import Image from "next/image";

export default function ProfilePage() {
  const { user, profile, refreshProfile } = useAuth();

  const [form, setForm] = useState({
    fullName: "",
    agencyName: "",
    phone: "",
    licenceNumber: "",
    address: "",
    suburb: "",
    state: "NSW",
    postcode: "",
    website: "",
    bio: "",
  });

  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string | null>(null);
  const [agencyLogoUrl, setAgencyLogoUrl] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const photoRef = useRef<HTMLInputElement>(null);
  const logoRef = useRef<HTMLInputElement>(null);

  // Populate form from real profile
  useEffect(() => {
    if (profile) {
      setForm({
        fullName: profile.full_name ?? "",
        agencyName: profile.agency_name ?? "",
        phone: profile.phone ?? "",
        licenceNumber: profile.licence_number ?? "",
        address: profile.address ?? "",
        suburb: profile.suburb ?? "",
        state: profile.state ?? "NSW",
        postcode: profile.postcode ?? "",
        website: profile.website ?? "",
        bio: profile.bio ?? "",
      });
      setProfilePhotoUrl(profile.profile_photo_url ?? null);
      setAgencyLogoUrl(profile.agency_logo_url ?? null);
    }
  }, [profile]);

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    setSaved(false);
  }

  async function uploadImage(file: File, type: "photo" | "logo") {
    if (!user) return;
    type === "photo" ? setUploadingPhoto(true) : setUploadingLogo(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("bucket", "profile-assets");
      formData.append("path", `${user.id}/${type}-${Date.now()}.${file.name.split(".").pop()}`);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) {
        if (type === "photo") setProfilePhotoUrl(data.url);
        else setAgencyLogoUrl(data.url);
      }
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      type === "photo" ? setUploadingPhoto(false) : setUploadingLogo(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: user.id,
          fullName: form.fullName,
          agencyName: form.agencyName,
          phone: form.phone,
          licenceNumber: form.licenceNumber,
          address: form.address,
          suburb: form.suburb,
          state: form.state,
          postcode: form.postcode,
          website: form.website,
          bio: form.bio,
          profilePhotoUrl,
          agencyLogoUrl,
        }),
      });
      if (res.ok) {
        await refreshProfile();
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        const d = await res.json();
        setError(d.error ?? "Save failed.");
      }
    } catch {
      setError("Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  const inputClass = "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder-muted-foreground outline-none transition-colors focus:border-foreground";
  const labelClass = "block text-xs uppercase tracking-widest text-muted-foreground mb-2";

  return (
    <PortalLayout>
      <div className="px-6 py-8 md:px-10 md:py-10 max-w-3xl mx-auto">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Settings</p>
          <h1 className="text-2xl font-medium text-foreground">Profile</h1>
          <p className="mt-1 text-sm text-muted-foreground">Your details appear on your Fang listings and agent profile page.</p>
        </div>

        <form onSubmit={handleSave} className="space-y-8">
          {/* Photo upload */}
          <div className="rounded-xl border border-border bg-background p-6">
            <h2 className="text-sm font-medium text-foreground mb-1">Profile Photo & Agency Logo</h2>
            <p className="text-xs text-muted-foreground mb-5">These will be used on your fang.com.au agent profile page. Our team will be notified when you upload.</p>
            <div className="flex flex-wrap gap-8">
              {/* Profile Photo */}
              <div className="flex flex-col items-center gap-3">
                <div className="relative h-24 w-24 rounded-xl border-2 border-dashed border-border bg-zinc-50 overflow-hidden flex items-center justify-center">
                  {profilePhotoUrl ? (
                    <Image src={profilePhotoUrl} alt="Profile photo" fill className="object-cover" />
                  ) : (
                    <Upload size={20} className="text-muted-foreground" />
                  )}
                  {uploadingPhoto && (
                    <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                      <Loader2 size={16} className="animate-spin text-foreground" />
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <p className="text-xs font-medium text-foreground">Profile Photo</p>
                  <p className="text-xs text-muted-foreground mt-0.5 max-w-[120px]">Appears on your listings. Square, min 400×400px.</p>
                </div>
                <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadImage(f, "photo"); }} />
                <button type="button" onClick={() => photoRef.current?.click()} className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-zinc-50">
                  Upload
                </button>
              </div>

              {/* Agency Logo */}
              <div className="flex flex-col items-center gap-3">
                <div className="relative h-24 w-24 rounded-xl border-2 border-dashed border-border bg-zinc-50 overflow-hidden flex items-center justify-center">
                  {agencyLogoUrl ? (
                    <Image src={agencyLogoUrl} alt="Agency logo" fill className="object-contain p-2" />
                  ) : (
                    <Upload size={20} className="text-muted-foreground" />
                  )}
                  {uploadingLogo && (
                    <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                      <Loader2 size={16} className="animate-spin text-foreground" />
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <p className="text-xs font-medium text-foreground">Agency Logo</p>
                  <p className="text-xs text-muted-foreground mt-0.5 max-w-[120px]">Used on your agency profile page. PNG preferred.</p>
                </div>
                <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadImage(f, "logo"); }} />
                <button type="button" onClick={() => logoRef.current?.click()} className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-zinc-50">
                  Upload
                </button>
              </div>
            </div>
          </div>

          {/* Personal details */}
          <div className="rounded-xl border border-border bg-background p-6">
            <h2 className="text-sm font-medium text-foreground mb-5">Personal Details</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className={labelClass}>Full Name</label>
                <input type="text" value={form.fullName} onChange={(e) => update("fullName", e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Phone Number</label>
                <input type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Real Estate Licence Number</label>
                <input type="text" value={form.licenceNumber} onChange={(e) => update("licenceNumber", e.target.value)} className={inputClass} />
              </div>
            </div>
            <div className="mt-4">
              <label className={labelClass}>Bio</label>
              <textarea
                rows={3}
                value={form.bio}
                onChange={(e) => update("bio", e.target.value)}
                placeholder="A short description about you and your specialisation..."
                className={`${inputClass} resize-none`}
              />
            </div>
          </div>

          {/* Agency details */}
          <div className="rounded-xl border border-border bg-background p-6">
            <h2 className="text-sm font-medium text-foreground mb-5">Agency Details</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className={labelClass}>Agency / Company Name</label>
                <input type="text" value={form.agencyName} onChange={(e) => update("agencyName", e.target.value)} className={inputClass} />
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>Street Address</label>
                <input type="text" value={form.address} onChange={(e) => update("address", e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Suburb</label>
                <input type="text" value={form.suburb} onChange={(e) => update("suburb", e.target.value)} className={inputClass} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>State</label>
                  <select value={form.state} onChange={(e) => update("state", e.target.value)} className={inputClass}>
                    {["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"].map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Postcode</label>
                  <input type="text" value={form.postcode} onChange={(e) => update("postcode", e.target.value)} className={inputClass} />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>Website</label>
                <input type="url" value={form.website} onChange={(e) => update("website", e.target.value)} placeholder="https://" className={inputClass} />
              </div>
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-80 disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>
            {saved && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle size={16} />
                Saved successfully
              </div>
            )}
          </div>
        </form>
      </div>
    </PortalLayout>
  );
}
