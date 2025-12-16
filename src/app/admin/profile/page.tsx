"use client";

import { useState, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Textarea } from "@heroui/input";
import { Icon } from "@iconify/react";
import { useToast } from "@/hooks/useToast";
import { ToastContainer } from "@/components/ui/toast";

interface AdminProfile {
  name?: string;
  email: string;
  emails?: string[];
  phones?: string[];
  address?: string;
  mapLink?: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
  };
}

export default function AdminProfilePage() {
  const toast = useToast();
  const [profile, setProfile] = useState<AdminProfile>({
    email: "",
    emails: [""],
    phones: [""],
    address: "",
    mapLink: "",
    socialLinks: {},
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/admin/profile");
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched profile data:", data);
        // Initialize with at least one email and one phone if empty
        setProfile({
          ...data,
          emails: data.emails?.length > 0 ? data.emails : [""],
          phones: data.phones?.length > 0 ? data.phones : [""],
        });
      } else {
        console.error("Failed to fetch profile, status:", response.status);
        toast.error("Failed to load profile");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      console.log("Saving profile:", profile);
      const response = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Profile saved successfully:", result);
        toast.success("Profile updated successfully");
        // Refresh the profile to ensure we have the latest data
        await fetchProfile();
      } else {
        const error = await response.json();
        console.error("Failed to update profile:", error);
        toast.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const addEmail = () => {
    // Limit to maximum 2 emails (1 initial + 1 extra)
    if ((profile.emails || []).length < 2) {
      setProfile({
        ...profile,
        emails: [...(profile.emails || []), ""],
      });
    }
  };

  const removeEmail = (index: number) => {
    const newEmails = [...(profile.emails || [])];
    newEmails.splice(index, 1);
    setProfile({ ...profile, emails: newEmails });
  };

  const updateEmail = (index: number, value: string) => {
    const newEmails = [...(profile.emails || [])];
    newEmails[index] = value;
    setProfile({ ...profile, emails: newEmails });
  };

  const addPhone = () => {
    // Limit to maximum 2 phones (1 initial + 1 extra)
    if ((profile.phones || []).length < 2) {
      setProfile({
        ...profile,
        phones: [...(profile.phones || []), ""],
      });
    }
  };

  const removePhone = (index: number) => {
    const newPhones = [...(profile.phones || [])];
    newPhones.splice(index, 1);
    setProfile({ ...profile, phones: newPhones });
  };

  const updatePhone = (index: number, value: string) => {
    const newPhones = [...(profile.phones || [])];
    newPhones[index] = value;
    setProfile({ ...profile, phones: newPhones });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Icon icon="lucide:loader-2" className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />
      <div className="p-6 max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Admin Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your profile information and contact details
          </p>
        </div>

        <div className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader className="pb-3">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Icon icon="lucide:user" className="w-5 h-5" />
              Basic Information
            </h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <Input
              label="Name"
              placeholder="Enter your name"
              value={profile.name || ""}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            />
            <Input
              label="Primary Email"
              type="email"
              placeholder="admin@example.com"
              value={profile.email}
              isReadOnly
              description="Primary email cannot be changed"
            />
          </CardBody>
        </Card>

        {/* Contact Emails */}
        <Card>
          <CardHeader className="pb-3 flex justify-between items-center">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Icon icon="lucide:mail" className="w-5 h-5" />
              Contact Emails (For Footer)
            </h2>
            <Button
              size="sm"
              color="primary"
              startContent={<Icon icon="lucide:plus" />}
              onClick={addEmail}
              isDisabled={(profile.emails || []).length >= 2}
            >
              Add Email
            </Button>
          </CardHeader>
          <CardBody className="space-y-3">
            {profile.emails && profile.emails.length > 0 ? (
              profile.emails.map((email, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => updateEmail(index, e.target.value)}
                    className="flex-1"
                    label={index === 0 ? "Primary Contact Email" : "Secondary Contact Email"}
                  />
                  {profile.emails && profile.emails.length > 1 && (
                    <Button
                      isIconOnly
                      color="danger"
                      variant="flat"
                      onClick={() => removeEmail(index)}
                    >
                      <Icon icon="lucide:trash-2" />
                    </Button>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No contact emails added</p>
            )}
            <p className="text-xs text-gray-500">
              Maximum 2 emails allowed (1 primary + 1 secondary)
            </p>
          </CardBody>
        </Card>

        {/* Phone Numbers */}
        <Card>
          <CardHeader className="pb-3 flex justify-between items-center">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Icon icon="lucide:phone" className="w-5 h-5" />
              Contact Phone Numbers (For Footer)
            </h2>
            <Button
              size="sm"
              color="primary"
              startContent={<Icon icon="lucide:plus" />}
              onClick={addPhone}
              isDisabled={(profile.phones || []).length >= 2}
            >
              Add Phone
            </Button>
          </CardHeader>
          <CardBody className="space-y-3">
            {profile.phones && profile.phones.length > 0 ? (
              profile.phones.map((phone, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    type="tel"
                    placeholder="+1 234 567 8900"
                    value={phone}
                    onChange={(e) => updatePhone(index, e.target.value)}
                    className="flex-1"
                    label={index === 0 ? "Primary Contact Phone" : "Secondary Contact Phone"}
                  />
                  {profile.phones && profile.phones.length > 1 && (
                    <Button
                      isIconOnly
                      color="danger"
                      variant="flat"
                      onClick={() => removePhone(index)}
                    >
                      <Icon icon="lucide:trash-2" />
                    </Button>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No phone numbers added</p>
            )}
            <p className="text-xs text-gray-500">
              Maximum 2 phone numbers allowed (1 primary + 1 secondary)
            </p>
          </CardBody>
        </Card>

        {/* Address */}
        <Card>
          <CardHeader className="pb-3">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Icon icon="lucide:map-pin" className="w-5 h-5" />
              Address
            </h2>
          </CardHeader>
          <CardBody>
            <Textarea
              placeholder="Enter your address"
              value={profile.address || ""}
              onChange={(e) => setProfile({ ...profile, address: e.target.value })}
              minRows={3}
            />
          </CardBody>
        </Card>

        {/* Map Link */}
        <Card>
          <CardHeader className="pb-3">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Icon icon="lucide:map" className="w-5 h-5" />
              Google Maps Embed Link
            </h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <Textarea
              placeholder='<iframe src="https://www.google.com/maps/embed?pb=..." width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>'
              value={profile.mapLink || ""}
              onChange={(e) => setProfile({ ...profile, mapLink: e.target.value })}
              minRows={4}
              description="Paste the Google Maps embed iframe code here. This will be displayed on the contact page."
            />
            {profile.mapLink && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Preview:</p>
                <div 
                  className="w-full h-64 rounded-lg overflow-hidden border border-default-200"
                  dangerouslySetInnerHTML={{ __html: profile.mapLink }}
                />
              </div>
            )}
          </CardBody>
        </Card>

        {/* Social Media Links */}
        <Card>
          <CardHeader className="pb-3">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Icon icon="lucide:share-2" className="w-5 h-5" />
              Social Media Links
            </h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <Input
              label="Facebook"
              placeholder="https://facebook.com/yourpage"
              value={profile.socialLinks?.facebook || ""}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  socialLinks: { ...profile.socialLinks, facebook: e.target.value },
                })
              }
              startContent={<Icon icon="lucide:facebook" className="text-blue-600" />}
            />
            <Input
              label="Twitter (X)"
              placeholder="https://twitter.com/yourhandle"
              value={profile.socialLinks?.twitter || ""}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  socialLinks: { ...profile.socialLinks, twitter: e.target.value },
                })
              }
              startContent={<Icon icon="lucide:twitter" className="text-sky-500" />}
            />
            <Input
              label="Instagram"
              placeholder="https://instagram.com/yourhandle"
              value={profile.socialLinks?.instagram || ""}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  socialLinks: { ...profile.socialLinks, instagram: e.target.value },
                })
              }
              startContent={<Icon icon="lucide:instagram" className="text-pink-600" />}
            />
            <Input
              label="LinkedIn"
              placeholder="https://linkedin.com/in/yourprofile"
              value={profile.socialLinks?.linkedin || ""}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  socialLinks: { ...profile.socialLinks, linkedin: e.target.value },
                })
              }
              startContent={<Icon icon="lucide:linkedin" className="text-blue-700" />}
            />
            <Input
              label="YouTube"
              placeholder="https://youtube.com/@yourchannel"
              value={profile.socialLinks?.youtube || ""}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  socialLinks: { ...profile.socialLinks, youtube: e.target.value },
                })
              }
              startContent={<Icon icon="lucide:youtube" className="text-red-600" />}
            />
          </CardBody>
        </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              color="primary"
              size="lg"
              onClick={handleSave}
              isLoading={saving}
              startContent={!saving && <Icon icon="lucide:save" />}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
