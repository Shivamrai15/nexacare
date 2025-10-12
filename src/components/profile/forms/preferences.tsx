import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Heart, Save } from "lucide-react";

import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

const careTypes = [
    { id: "elderly", label: "Elderly Care", description: "Senior companion and assistance" },
    { id: "child", label: "Child Care", description: "Babysitting and nanny services" },
    { id: "medical", label: "Medical Care", description: "Professional nursing care" },
    { id: "companion", label: "Companion Care", description: "Social companionship" },
    { id: "respite", label: "Respite Care", description: "Temporary relief care" },
    { id: "special", label: "Special Needs", description: "Specialized disability care" },
];

export const Preferences = () => {

    const trpc = useTRPC();
    const queryClient = useQueryClient();
    const { data: profile } = useSuspenseQuery(trpc.user.getProfile.queryOptions());
    
    const [selectedPreferences, setSelectedPreferences] = useState<string[]>(
        profile?.preferences || []
    );

    const [isSaving, setIsSaving] = useState(false);

    const preferencesMutation = useMutation(trpc.user.updatePreferences.mutationOptions({
        onSuccess: async() => {
            await queryClient.invalidateQueries(trpc.user.getProfile.queryOptions());
            toast.success("Preferences updated successfully");
        },
        onError: (error) => {
            toast.error(`Failed to update preferences: ${error.message}`);
        }
    }));

    const handlePreferenceToggle = (careTypeId: string, checked: boolean) => {
        setSelectedPreferences(prev => 
            checked 
                ? [...prev, careTypeId]
                : prev.filter(id => id !== careTypeId)
        );
    };


    const handleSavePreferences = async () => {
        setIsSaving(true);
        await preferencesMutation.mutateAsync(selectedPreferences);
        setIsSaving(false);
    };

    return (
        <Card className="bg-card border-border shadow-sm">
            <CardHeader className="space-y-1 pb-6">
                <div className="flex items-center gap-2">
                    <Heart className="w-6 h-6 text-primary" />
                    <CardTitle className="text-2xl font-bold text-card-foreground">
                        Care Preferences
                    </CardTitle>
                </div>
                <CardDescription className="text-muted-foreground">
                    Select your preferred types of care to get personalized caregiver recommendations
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    <Label className="text-base font-semibold text-card-foreground">
                        Preferred Care Types
                    </Label>
                    <div className="rounded-lg border border-border overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50">
                                    <TableHead className="w-12">Select</TableHead>
                                    <TableHead className="font-semibold">Care Type</TableHead>
                                    <TableHead className="font-semibold">Description</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {careTypes.map((type) => (
                                    <TableRow 
                                        key={type.id}
                                        className="hover:bg-muted/30 transition-colors"
                                    >
                                        <TableCell>
                                            <Checkbox
                                                id={`care-${type.id}`}
                                                className="border-2 data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                                                checked={selectedPreferences.includes(type.id)}
                                                onCheckedChange={(checked) => 
                                                    handlePreferenceToggle(type.id, checked as boolean)
                                                }
                                                disabled={isSaving}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <label 
                                                htmlFor={`care-${type.id}`}
                                                className="font-medium cursor-pointer"
                                            >
                                                {type.label}
                                            </label>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {type.description}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    {selectedPreferences.length > 0 && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground p-3 bg-primary/5 rounded-lg border border-primary/20">
                            <Heart className="w-4 h-4 text-primary" />
                            <span>
                                {selectedPreferences.length} care {selectedPreferences.length === 1 ? 'type' : 'types'} selected
                            </span>
                        </div>
                    )}
                </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-3 border-t pt-6">
                <Button
                    variant="outline"
                    className="rounded-lg"
                    disabled={isSaving}
                    onClick={() => setSelectedPreferences(profile?.preferences || [])}
                >
                    Reset
                </Button>
                <Button
                    className="rounded-lg min-w-[120px]"
                    disabled={isSaving}
                    onClick={handleSavePreferences}
                >
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? "Saving..." : "Save Preferences"}
                </Button>
            </CardFooter>
        </Card>
    )
}