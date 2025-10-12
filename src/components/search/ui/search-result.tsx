"use client";

import Link from "next/link";
import { VerificationStatus } from "@/generated/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Props {
    data: {
        id: string;
        user: {
            name: string;
            image: string | null;
            address?: {
                city?: string;
                state?: string;
            } | null;
        };
        experience: number | null;
        specializations: string[];
        languages: string[];
        verificationStatus: VerificationStatus;
        description?: string | null;
        averageRating?: number | null;
        charges?: {
            hourlyRate: number;
        } | null;
        _count: {
            reviews: number;
        };
    }[];
}

export const SearchResults = ({ data }: Props) => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                    Found {data.length || 0} Caregiver{data.length !== 1 ? "s" : ""}
                </h2>
            </div>

            <div className="space-y-4">
                {data.map((caregiver) => {

                    const fullName = caregiver.user?.name || "Unknown";
                    const initials = fullName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2);
                    

                    const location = caregiver.user?.address?.city && caregiver.user?.address?.state
                        ? `${caregiver.user.address.city}, ${caregiver.user.address.state}`
                        : caregiver.user?.address?.city || null;
                    
                    const isVerified = caregiver.verificationStatus === "VERIFIED";
                    
                    return (
                        <Card
                            key={caregiver.id}
                            className="bg-card border-border hover:shadow-lg transition-shadow"
                        >
                            <CardContent className="p-6">
                                <div className="flex max-md:flex-col items-start space-x-4">
                                    {/* Avatar */}
                                    <Avatar className="h-16 w-16">
                                        <AvatarImage
                                            src={caregiver.user?.image || "/placeholder.svg"}
                                            alt={fullName}
                                        />
                                        <AvatarFallback>{initials}</AvatarFallback>
                                    </Avatar>

                                    <div className="flex-1">
                                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-y-6">
                                            <div className="flex-1">
                                                {/* Name and Verification Badge */}
                                                <div className="flex items-center space-x-2 mb-1">
                                                    <h3 className="text-lg font-semibold text-card-foreground">
                                                        {fullName}
                                                    </h3>
                                                    {isVerified && (
                                                        <Badge variant="secondary" className="text-xs">
                                                            Verified
                                                        </Badge>
                                                    )}
                                                </div>

                                                {/* Specializations */}
                                                {caregiver.specializations && caregiver.specializations.length > 0 && (
                                                    <p className="text-muted-foreground text-sm mb-2">
                                                        {caregiver.specializations.join(", ")}
                                                    </p>
                                                )}

                                                {/* Bio/Description */}
                                                {caregiver.description && (
                                                    <p className="text-card-foreground text-sm mb-3 line-clamp-3">
                                                        {caregiver.description}
                                                    </p>
                                                )}

                                                {/* Experience, Location, Rating */}
                                                <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3 flex-wrap">
                                                    <span>{caregiver.experience || 0} years experience</span>
                                                    {location && (
                                                        <>
                                                            <span>•</span>
                                                            <span>{location}</span>
                                                        </>
                                                    )}
                                                    {caregiver.averageRating && caregiver.averageRating > 0 && (
                                                        <>
                                                            <span>•</span>
                                                            <span className="flex items-center">
                                                                ⭐ {caregiver.averageRating.toFixed(1)} (
                                                                {caregiver._count?.reviews || 0} reviews)
                                                            </span>
                                                        </>
                                                    )}
                                                </div>

                                                {/* Languages */}
                                                <div className="flex items-center space-x-2 flex-wrap gap-2">
                                                    {caregiver.languages &&
                                                        caregiver.languages.map((lang, index) => (
                                                            <Badge key={index} variant="outline" className="text-xs">
                                                                {lang}
                                                            </Badge>
                                                        ))}
                                                </div>
                                            </div>

                                            {/* Right side: Price and Actions */}
                                            <div className="md:text-right md:ml-4 min-w-40">
                                                <div className="text-2xl font-bold text-foreground mb-1">
                                                    ${caregiver.charges?.hourlyRate || 0}
                                                </div>
                                                <div className="text-sm text-muted-foreground mb-4">per hour</div>
                                                <div className="flex flex-col gap-2">
                                                    <Link href={`/caregiver/${caregiver.id}`}>
                                                        <Button className="w-full">
                                                            View Profile
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="outline"
                                                        className="w-full border-border bg-transparent"
                                                    >
                                                        Message
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};
