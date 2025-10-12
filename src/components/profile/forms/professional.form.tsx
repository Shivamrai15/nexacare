import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import {
    Briefcase,
    Award,
    Phone,
    Upload,
    Plus,
    Trash2,
    Calendar,
    Building2,
    Languages,
    X,
    Loader2,
} from "lucide-react";

import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CaregiverProfileSchema, CertificateSchema, EmergencyContactSchema } from "@/modules/user/schema";
import { CldUploadWidget } from "next-cloudinary";



type CaregiverProfileData = z.infer<typeof CaregiverProfileSchema>;
type CertificateData = z.infer<typeof CertificateSchema>;
type EmergencyContactData = z.infer<typeof EmergencyContactSchema>;


export const ProfessionalForm = () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();
    const { data: profile } = useSuspenseQuery(trpc.user.getProfile.queryOptions());

    const updateProfileMutation = useMutation(trpc.user.updateProfessionalInfo.mutationOptions({
        onSuccess: async() => {
            await queryClient.invalidateQueries(trpc.user.getProfile.queryOptions());
            toast.success("Profile updated successfully!");
        },
        onError: () => {
            toast.error("Failed to update profile.");
        },
    }));

    const createCertificateMutation = useMutation(trpc.user.createCertificate.mutationOptions({
        onSuccess: async() => {
            await queryClient.invalidateQueries(trpc.user.getProfile.queryOptions());
            certificateForm.reset();
            setShowCertificateForm(false);
            toast.success("Certificate created successfully!");
        },
        onError: () => {
            toast.error("Failed to create certificate.");
        },
    }));

    const createEmergencyContactMutation = useMutation(trpc.user.createUpdateEmergencyContact.mutationOptions({
        onSuccess: async() => {
            await queryClient.invalidateQueries(trpc.user.getProfile.queryOptions());
            emergencyForm.reset();
            setShowEmergencyForm(false);
            toast.success("Emergency contact created/updated successfully!");
        },
        onError: () => {
            toast.error("Failed to create/update emergency contact.");
        },
    }));

    const deleteCertificateMutation = useMutation(trpc.user.deleteCertificate.mutationOptions({
        onSuccess: async() => {
            await queryClient.invalidateQueries(trpc.user.getProfile.queryOptions());
            setDeleteDialogOpen(false);
            setCertificateToDelete(null);
            toast.success("Certificate deleted successfully!");
        },
        onError: () => {
            toast.error("Failed to delete certificate.");
        }
    }));

    const [showCertificateForm, setShowCertificateForm] = useState(false);
    const [showEmergencyForm, setShowEmergencyForm] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [certificateToDelete, setCertificateToDelete] = useState<string | null>(null);
    const [selectedCertFile, setSelectedCertFile] = useState<File | null>(null);
    const [languageInput, setLanguageInput] = useState("");
    const [specializationInput, setSpecializationInput] = useState("");


    const profileForm = useForm<CaregiverProfileData>({
        resolver: zodResolver(CaregiverProfileSchema),
        defaultValues: {
            description: profile.caregiver?.description || "",
            experience: profile.caregiver?.experience || 0,
            languages: profile.caregiver?.languages || [],
            specializations: profile.caregiver?.specializations || [],
        },
    });

    const certificateForm = useForm<CertificateData>({
        resolver: zodResolver(CertificateSchema),
        defaultValues: {
            title: "",
            issuingBody: "",
            issueDate: "",
            expiryDate: "",
            certificateUrl: "",
        },
    });

    const emergencyForm = useForm<EmergencyContactData>({
        resolver: zodResolver(EmergencyContactSchema),
        defaultValues: {
            name: profile?.caregiver?.emergencyContact?.name || "",
            relationship: profile?.caregiver?.emergencyContact?.relationship || "",
            contactNumber: profile?.caregiver?.emergencyContact?.contactNumber || "",
            email: profile?.caregiver?.emergencyContact?.email || "",
        },
    });

    const isProfileSubmitting = profileForm.formState.isSubmitting;
    const isCertSubmitting = certificateForm.formState.isSubmitting;
    const isEmergencySubmitting = emergencyForm.formState.isSubmitting;


    const onProfileSubmit = async (data: CaregiverProfileData) => {
        await updateProfileMutation.mutateAsync(data);
    };

    const onCertificateSubmit = async (data: CertificateData) => {
        await createCertificateMutation.mutateAsync(data);
    };

    const onEmergencySubmit = async (data: EmergencyContactData) => {
        await createEmergencyContactMutation.mutateAsync(data);
    };


    const handleDeleteCertificate = (certId: string) => {
        setCertificateToDelete(certId);
        setDeleteDialogOpen(true);
    };

    const confirmDeleteCertificate = async() => {
        if (certificateToDelete) {
            deleteCertificateMutation.mutate({
                certificateId : certificateToDelete
            });
        }
    };

    const addLanguage = () => {
        if (languageInput.trim()) {
            const currentLanguages = profileForm.getValues("languages");
            if (!currentLanguages.includes(languageInput.trim())) {
                profileForm.setValue("languages", [...currentLanguages, languageInput.trim()]);
                setLanguageInput("");
            } else {
                toast.error("Language already added");
            }
        }
    };

    const removeLanguage = (lang: string) => {
        const currentLanguages = profileForm.getValues("languages");
        profileForm.setValue("languages", currentLanguages.filter(l => l !== lang));
    };

    const addSpecialization = () => {
        if (specializationInput.trim()) {
            const currentSpecs = profileForm.getValues("specializations");
            if (!currentSpecs.includes(specializationInput.trim())) {
                profileForm.setValue("specializations", [...currentSpecs, specializationInput.trim()]);
                setSpecializationInput("");
            } else {
                toast.error("Specialization already added");
            }
        }
    };

    const removeSpecialization = (spec: string) => {
        const currentSpecs = profileForm.getValues("specializations");
        profileForm.setValue("specializations", currentSpecs.filter(s => s !== spec));
    };

    return (
        <div className="space-y-6">
            <Card className="bg-card border-border shadow-sm">
                <CardHeader className="space-y-1 pb-6">
                    <div className="flex items-center gap-2">
                        <Briefcase className="w-6 h-6 text-primary" />
                        <CardTitle className="text-2xl font-bold text-card-foreground">
                            Professional Profile
                        </CardTitle>
                    </div>
                    <CardDescription className="text-muted-foreground">
                        Showcase your expertise, experience, and qualifications
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...profileForm}>
                        <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                            <FormField
                                control={profileForm.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium">
                                            Professional Bio
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Tell families about your background, experience, and approach to caregiving..."
                                                className="min-h-[120px] resize-none rounded-lg"
                                                {...field}
                                                disabled={isProfileSubmitting}
                                            />
                                        </FormControl>
                                        <FormDescription className="text-xs flex justify-between">
                                            <span>Describe your professional background and care philosophy</span>
                                            <span className="text-muted-foreground">
                                                {field.value?.length || 0}/1000
                                            </span>
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid gap-4">
                                <FormField
                                    control={profileForm.control}
                                    name="experience"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium">
                                                Years of Experience
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="e.g., 5"
                                                    className="h-11 rounded-lg"
                                                    {...field}
                                                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                                                    disabled={isProfileSubmitting}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={profileForm.control}
                                name="languages"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium flex items-center gap-2">
                                            <Languages className="w-4 h-4" />
                                            Languages <span className="text-destructive">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <div className="space-y-3">
                                                <div className="flex gap-2">
                                                    <Input
                                                        placeholder="Enter a language"
                                                        value={languageInput}
                                                        onChange={(e) => setLanguageInput(e.target.value)}
                                                        onKeyPress={(e) => {
                                                            if (e.key === 'Enter') {
                                                                e.preventDefault();
                                                                addLanguage();
                                                            }
                                                        }}
                                                        className="h-11 rounded-lg"
                                                        disabled={isProfileSubmitting}
                                                    />
                                                    <Button
                                                        type="button"
                                                        onClick={addLanguage}
                                                        disabled={isProfileSubmitting}
                                                        className="rounded-lg"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {field.value.map((lang, index) => (
                                                        <Badge
                                                            key={index}
                                                            variant="secondary"
                                                            className="px-3 py-1 text-sm"
                                                        >
                                                            {lang}
                                                            <button
                                                                type="button"
                                                                onClick={() => removeLanguage(lang)}
                                                                className="ml-2 hover:text-destructive"
                                                                disabled={isProfileSubmitting}
                                                            >
                                                                <X className="w-3 h-3" />
                                                            </button>
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        </FormControl>
                                        <FormDescription className="text-xs">
                                            Add languages you speak fluently
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={profileForm.control}
                                name="specializations"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium">
                                            Specializations <span className="text-destructive">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <div className="space-y-3">
                                                <div className="flex gap-2">
                                                    <Input
                                                        placeholder="Enter a specialization (e.g., Dementia Care)"
                                                        value={specializationInput}
                                                        onChange={(e) => setSpecializationInput(e.target.value)}
                                                        onKeyPress={(e) => {
                                                            if (e.key === 'Enter') {
                                                                e.preventDefault();
                                                                addSpecialization();
                                                            }
                                                        }}
                                                        className="h-11 rounded-lg"
                                                        disabled={isProfileSubmitting}
                                                    />
                                                    <Button
                                                        type="button"
                                                        onClick={addSpecialization}
                                                        disabled={isProfileSubmitting}
                                                        className="rounded-lg"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {field.value.map((spec, index) => (
                                                        <Badge
                                                            key={index}
                                                            variant="secondary"
                                                            className="px-3 py-1 text-sm"
                                                        >
                                                            {spec}
                                                            <button
                                                                type="button"
                                                                onClick={() => removeSpecialization(spec)}
                                                                className="ml-2 hover:text-destructive"
                                                                disabled={isProfileSubmitting}
                                                            >
                                                                <X className="w-3 h-3" />
                                                            </button>
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        </FormControl>
                                        <FormDescription className="text-xs">
                                            Add your areas of expertise in caregiving
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <CardFooter className="flex gap-3 px-0 pt-4 border-t">
                                <Button
                                    type="submit"
                                    className="rounded-lg w-full"
                                    disabled={isProfileSubmitting}
                                >
                                    {isProfileSubmitting ? "Saving..." : "Save Profile"}
                                </Button>
                            </CardFooter>
                        </form>
                    </Form>
                </CardContent>
            </Card>
            <Card className="bg-card border-border shadow-sm">
                <CardHeader className="space-y-1 pb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Award className="w-6 h-6 text-primary" />
                            <div>
                                <CardTitle className="text-2xl font-bold text-card-foreground">
                                    Certificates & Licenses
                                </CardTitle>
                                <CardDescription className="text-muted-foreground mt-1">
                                    Add your professional certifications and licenses
                                </CardDescription>
                            </div>
                        </div>
                        <Button
                            onClick={() => setShowCertificateForm(!showCertificateForm)}
                            className="rounded-lg"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Certificate
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {showCertificateForm && (
                        <Card className="border-2 border-primary/20 bg-primary/5">
                            <CardContent className="pt-6">
                                <Form {...certificateForm}>
                                    <form onSubmit={certificateForm.handleSubmit(onCertificateSubmit)} className="space-y-4">
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <FormField
                                                control={certificateForm.control}
                                                name="title"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-sm font-medium">
                                                            Certificate Title <span className="text-destructive">*</span>
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="e.g., Registered Nurse License"
                                                                className="h-11 rounded-lg"
                                                                {...field}
                                                                disabled={isCertSubmitting}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={certificateForm.control}
                                                name="issuingBody"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-sm font-medium">
                                                            Issuing Organization <span className="text-destructive">*</span>
                                                        </FormLabel>
                                                        <FormControl>
                                                            <div className="relative">
                                                                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                                <Input
                                                                    placeholder="e.g., State Board of Nursing"
                                                                    className="h-11 rounded-lg pl-10"
                                                                    {...field}
                                                                    disabled={isCertSubmitting}
                                                                />
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className="grid gap-4 md:grid-cols-2">
                                            <FormField
                                                control={certificateForm.control}
                                                name="issueDate"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-sm font-medium">
                                                            Issue Date <span className="text-destructive">*</span>
                                                        </FormLabel>
                                                        <FormControl>
                                                            <div className="relative">
                                                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                                <Input
                                                                    type="date"
                                                                    className="h-11 rounded-lg pl-10"
                                                                    {...field}
                                                                    disabled={isCertSubmitting}
                                                                />
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={certificateForm.control}
                                                name="expiryDate"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-sm font-medium">
                                                            Expiry Date
                                                        </FormLabel>
                                                        <FormControl>
                                                            <div className="relative">
                                                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                                <Input
                                                                    type="date"
                                                                    className="h-11 rounded-lg pl-10"
                                                                    {...field}
                                                                    disabled={isCertSubmitting}
                                                                />
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <FormField
                                            control={certificateForm.control}
                                            name="certificateUrl"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm font-medium">
                                                        Upload Certificate <span className="text-destructive">*</span>
                                                    </FormLabel>
                                                    <FormControl>
                                                        <div className="space-y-3">
                                                            <CldUploadWidget
                                                                uploadPreset="zkvwchnu"
                                                                options={{
                                                                    maxFiles: 1,
                                                                    resourceType: "auto",
                                                                    maxFileSize : 10485760,
                                                                }}
                                                                onSuccess={(result: any) => {
                                                                    const url = result.info.secure_url;
                                                                    field.onChange(url);
                                                                    toast.success("File uploaded successfully!");
                                                                }}
                                                                onError={() => {
                                                                    toast.error("Failed to upload file");
                                                                }}
                                                            >
                                                                {({ open }) => (
                                                                    <Button
                                                                        type="button"
                                                                        variant="outline"
                                                                        onClick={() => open()}
                                                                        className="w-full h-32 border-dashed border-2 hover:border-primary/50 transition-colors"
                                                                        disabled={isCertSubmitting}
                                                                    >
                                                                        <div className="flex flex-col items-center gap-2">
                                                                            <Upload className="h-8 w-8 text-muted-foreground" />
                                                                            <span className="text-sm font-medium">
                                                                                {field.value ? "Change File" : "Click to upload or drag and drop"}
                                                                            </span>
                                                                            <span className="text-xs text-muted-foreground">
                                                                                PNG, JPG, PDF, DOCX up to 10MB
                                                                            </span>
                                                                        </div>
                                                                    </Button>
                                                                )}
                                                            </CldUploadWidget>
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <div className="flex justify-end gap-3 pt-4">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => {
                                                    setShowCertificateForm(false);
                                                    certificateForm.reset();
                                                    setSelectedCertFile(null);
                                                }}
                                                disabled={isCertSubmitting}
                                                className="rounded-lg"
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                type="submit"
                                                disabled={isCertSubmitting}
                                                className="rounded-lg"
                                            >
                                                { isCertSubmitting ? (
                                                    "Adding..."
                                                ) : (
                                                    "Add Certificate"
                                                )}
                                            </Button>
                                        </div>
                                    </form>
                                </Form>
                            </CardContent>
                        </Card>
                    )}

                    {/* Certificates List */}
                    {profile.caregiver?.certificates.length === 0 ? (
                        <div className="text-center py-12">
                            <Award className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                            <h3 className="text-lg font-semibold mb-2">No Certificates Added</h3>
                            <p className="text-sm text-muted-foreground">
                                Add your professional certifications to build trust
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {profile.caregiver?.certificates.map((cert) => (
                                <div
                                    key={cert.id}
                                    className="flex items-start gap-4 p-4 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors"
                                >
                                    <div className={cn(
                                        "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                                        cert.verified ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                                    )}>
                                        <Award className="w-5 h-5" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-3 mb-2">
                                            <div>
                                                <h4 className="font-semibold text-sm flex items-center gap-2">
                                                    {cert.title}
                                                    {cert.verified ? (
                                                        <Badge className="bg-green-100 text-green-700 border-green-200">
                                                            Verified
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                                            Pending
                                                        </Badge>
                                                    )}
                                                </h4>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    Issued by {cert.issuingBody}
                                                </p>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                onClick={() => handleDeleteCertificate(cert.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>

                                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                Issued: {new Date(cert.issueDate).toLocaleDateString()}
                                            </div>
                                            {cert.expiryDate && (
                                                <>
                                                    <span>•</span>
                                                    <div>
                                                        Expires: {new Date(cert.expiryDate).toLocaleDateString()}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Emergency Contact Card */}
            <Card className="bg-card border-border shadow-sm">
                <CardHeader className="space-y-1 pb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Phone className="w-6 h-6 text-primary" />
                            <div>
                                <CardTitle className="text-2xl font-bold text-card-foreground">
                                    Emergency Contact
                                </CardTitle>
                                <CardDescription className="text-muted-foreground mt-1">
                                    Provide an emergency contact person
                                </CardDescription>
                            </div>
                        </div>
                        {!profile?.caregiver?.emergencyContact && (
                            <Button
                                onClick={() => setShowEmergencyForm(true)}
                                className="rounded-lg"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Contact
                            </Button>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    {showEmergencyForm || profile?.caregiver?.emergencyContact ? (
                        <Form {...emergencyForm}>
                            <form onSubmit={emergencyForm.handleSubmit(onEmergencySubmit)} className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <FormField
                                        control={emergencyForm.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-medium">
                                                    Full Name <span className="text-destructive">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Enter contact name"
                                                        className="h-11 rounded-lg"
                                                        {...field}
                                                        disabled={isEmergencySubmitting}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={emergencyForm.control}
                                        name="relationship"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-medium">
                                                    Relationship <span className="text-destructive">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="e.g., Spouse, Parent, Sibling"
                                                        className="h-11 rounded-lg"
                                                        {...field}
                                                        disabled={isEmergencySubmitting}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <FormField
                                        control={emergencyForm.control}
                                        name="contactNumber"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-medium">
                                                    Contact Number <span className="text-destructive">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                        <Input
                                                            type="tel"
                                                            placeholder="+1234567890"
                                                            className="h-11 rounded-lg pl-10"
                                                            {...field}
                                                            disabled={isEmergencySubmitting}
                                                        />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={emergencyForm.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-medium">
                                                    Email Address
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="email"
                                                        placeholder="contact@example.com"
                                                        className="h-11 rounded-lg"
                                                        {...field}
                                                        disabled={isEmergencySubmitting}
                                                    />
                                                </FormControl>
                                                <FormDescription className="text-xs">
                                                    Optional
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <CardFooter className="px-0 pt-4 border-t">
                                    <Button
                                        type="submit"
                                        className="rounded-lg w-full"
                                        disabled={isEmergencySubmitting}
                                    >
                                        {isEmergencySubmitting ? "Saving..." : "Save Contact"}
                                    </Button>
                                </CardFooter>
                            </form>
                        </Form>
                    ) : (
                        <div className="text-center py-12">
                            <Phone className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                            <h3 className="text-lg font-semibold mb-2">No Emergency Contact</h3>
                            <p className="text-sm text-muted-foreground">
                                Add an emergency contact for safety purposes
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Certificate?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete this certificate
                            from your profile.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setCertificateToDelete(null)}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDeleteCertificate}
                            className="bg-destructive hover:bg-destructive/90"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
