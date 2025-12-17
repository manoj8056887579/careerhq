"use client";

import React from "react";
import Image from "next/image";
import "./profile-card.css";

interface ProfileCardProps {
  avatarUrl: string;
  name?: string;
  className?: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  avatarUrl,
  name = "Founder",
  className = "",
}) => {
  return (
    <div className={`simple-profile-card ${className}`.trim()}>
      {/* Animated Background */}
      <div className="animated-bg">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      {/* Image Container */}
      <div className="image-container">
        <Image
          src={avatarUrl}
          alt={name}
          width={1200}
          height={1200}
          className="founder-image"
          priority
        />
        {/* Name Overlay */}
        <div className="name-overlay">
          <h3 className="founder-name">{name}</h3>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
