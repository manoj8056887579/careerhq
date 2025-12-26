import { Metadata } from "next";
import CareersClient from "./careers-client";

export const metadata: Metadata = {
  title: "Careers - Join Our Team | Career HQ",
  description:
    "Explore exciting career opportunities at Career HQ. Join our team and help shape the future of career guidance and education.",
};

export default function CareersPage() {
  return <CareersClient />;
}
