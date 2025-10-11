"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

export const Header = () => {

    const trpc = useTRPC();
    const { data: profile } = useSuspenseQuery(trpc.user.getProfile.queryOptions());

    return (
        <div className="flex items-center space-x-4 mb-8">
            <div className="relative">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profile.image || "/assets/placeholder.svg"} alt="Profile" />
                <AvatarFallback className="text-lg">
                  {profile.name[0]}
                </AvatarFallback>
              </Avatar>
              <label className="absolute bottom-0 right-0 bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-full p-1 cursor-pointer">
                <input type="file" accept="image/*" className="hidden" />
                <span className="text-xs px-2">📷</span>
              </label>
            </div>
            <div>
                <h1 className="text-3xl font-bold text-foreground">
                    {profile.name}
                </h1>
                <p className="text-muted-foreground">
                    {profile.role === "CAREGIVER" ? "Caregiver Profile" : "Customer Profile"}
                </p>
                <Badge variant="secondary" className="mt-2">
                    {profile.role === "CAREGIVER" ? "Professional Caregiver" : "Verified Customer"}
                </Badge>
            </div>
        </div>
    )
}
