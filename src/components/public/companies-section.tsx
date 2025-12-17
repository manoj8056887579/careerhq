"use client";

import Image from "next/image";
import { Building2 } from "lucide-react";
import LogoLoop from "@/components/ui/logo-loop";
import type { Company } from "@/models/Company";

interface CompaniesSectionProps {
  companies: Company[];
}

export default function CompaniesSection({ companies }: CompaniesSectionProps) {
  if (companies.length === 0) {
    return null;
  }

  const getImageUrl = (logoId: string) => {
    return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/w_300,h_200,c_fit/${logoId}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="space-y-6 sm:space-y-8">
        <div className="text-center space-y-3 sm:space-y-4">
          <div className="inline-block">
            <div className="glass px-4 py-1.5 sm:px-6 sm:py-2 rounded-full">
              <div className="flex items-center gap-2">
                <Building2 size={14} className="text-blue-600 sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm font-medium gradient-text">
                  Our Partners
                </span>
              </div>
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold gradient-text">
            Top Companies Hiring
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
            Connect with leading companies offering excellent placement opportunities
          </p>
        </div>

        <div className="glass-strong rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10">
          <LogoLoop speed={30} pauseOnHover={true}>
            {companies.map((company) => (
              <div
                key={company.id}
                className="group relative flex items-center justify-center transition-all duration-300 hover:-translate-y-2 min-w-[140px] sm:min-w-[160px] md:min-w-[180px]"
              >
                <div className="relative w-full h-20 sm:h-24 md:h-28 flex items-center justify-center">
                  <Image
                    src={getImageUrl(company.logo)}
                    alt={company.name}
                    fill
                    className="object-contain transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
              </div>
            ))}
          </LogoLoop>
        </div>
      </div>
    </div>
  );
}
