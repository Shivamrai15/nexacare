import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import {
    FileText,
    Image as ImageIcon,
    FileType,
    Upload,
    Trash2,
    Calendar,
    X,
    FileUp,
    Download,
    Eye,
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { MedicalRecordSchema } from "@/modules/user/schema";
import { CldUploadWidget } from "next-cloudinary";



type MedicalRecordFormData = z.infer<typeof MedicalRecordSchema>;


export const MedicalForm = () => {

    const trpc = useTRPC();
    const queryClient = useQueryClient();
    const { data: profile } = useSuspenseQuery(trpc.user.getProfile.queryOptions());

    const createDocumentMutation = useMutation(trpc.user.createMedicalRecord.mutationOptions({
        onSuccess: async() => {
            await queryClient.invalidateQueries(trpc.user.getProfile.queryOptions());
            form.reset();
            toast.success("Medical record uploaded successfully");
        },
        onError: (error) => {
            toast.error(error.message || "Failed to upload medical record");
        }
    }));

    const deleteDocumentMutation = useMutation(trpc.user.deleteMedicalRecord.mutationOptions({
        onSuccess: async() => {
            await queryClient.invalidateQueries(trpc.user.getProfile.queryOptions());
            setDeleteDialogOpen(false);
            setRecordToDelete(null);
            toast.success("Medical record deleted successfully");
        },
        onError: (error) => {
            toast.error(error.message || "Failed to delete medical record");
        }
    }));

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [recordToDelete, setRecordToDelete] = useState<string | null>(null);

    const form = useForm<MedicalRecordFormData>({
        resolver: zodResolver(MedicalRecordSchema),
        defaultValues: {
            title: "",
            description: "",
            type: undefined,
            recordDate: new Date().toISOString().split("T")[0],
            textData: "",
        },
    });

    const isSubmitting = form.formState.isSubmitting;
    const selectedType = form.watch("type");

    const onSubmit = async (data: MedicalRecordFormData) => {
        await createDocumentMutation.mutateAsync(data);
    };


    const handleDeleteClick = (recordId: string) => {
        setRecordToDelete(recordId);
        setDeleteDialogOpen(true);
    };


    const getTypeIcon = (type: string) => {
        switch (type) {
            case "IMAGE":
                return <ImageIcon className="w-4 h-4" />;
            case "PDF":
                return <FileType className="w-4 h-4" />;
            case "TEXT":
                return <FileText className="w-4 h-4" />;
            default:
                return <FileText className="w-4 h-4" />;
        }
    };

    const getTypeBadgeColor = (type: string) => {
        switch (type) {
            case "IMAGE":
                return "bg-blue-100 text-blue-700 border-blue-200";
            case "PDF":
                return "bg-red-100 text-red-700 border-red-200";
            case "TEXT":
                return "bg-green-100 text-green-700 border-green-200";
            default:
                return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    return (
        <div className="space-y-6">
            {/* Upload New Document Card */}
            <Card className="bg-card border-border shadow-sm">
                <CardHeader className="space-y-1 pb-6">
                    <div className="flex items-center gap-2">
                        <FileUp className="w-6 h-6 text-primary" />
                        <CardTitle className="text-2xl font-bold text-card-foreground">
                            Upload Medical Document
                        </CardTitle>
                    </div>
                    <CardDescription className="text-muted-foreground">
                        Add new medical records, reports, or important health documents
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid gap-4 md:grid-cols-2">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium">
                                                Document Title <span className="text-destructive">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    placeholder="e.g., Blood Test Results"
                                                    className="h-11 rounded-lg"
                                                    {...field}
                                                    disabled={isSubmitting}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="type"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium">
                                                Document Type <span className="text-destructive">*</span>
                                            </FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                                disabled={isSubmitting}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="h-11 rounded-lg">
                                                        <SelectValue placeholder="Select document type" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="IMAGE">
                                                        <div className="flex items-center gap-2">
                                                            <ImageIcon className="w-4 h-4" />
                                                            Image (JPG, PNG)
                                                        </div>
                                                    </SelectItem>
                                                    <SelectItem value="PDF">
                                                        <div className="flex items-center gap-2">
                                                            <FileType className="w-4 h-4" />
                                                            PDF Document
                                                        </div>
                                                    </SelectItem>
                                                    <SelectItem value="TEXT">
                                                        <div className="flex items-center gap-2">
                                                            <FileText className="w-4 h-4" />
                                                            Text Note
                                                        </div>
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="recordDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium">
                                            Record Date <span className="text-destructive">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                <Input
                                                    type="date"
                                                    className="h-11 rounded-lg pl-10"
                                                    {...field}
                                                    disabled={isSubmitting}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormDescription className="text-xs">
                                            When was this document/record created?
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium">
                                            Description
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Brief description of this medical record..."
                                                className="min-h-[80px] resize-none rounded-lg"
                                                {...field}
                                                disabled={isSubmitting}
                                            />
                                        </FormControl>
                                        <FormDescription className="text-xs flex justify-between">
                                            <span>Optional - Add context about this document</span>
                                            <span className="text-muted-foreground">
                                                {field.value?.length || 0}/500
                                            </span>
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {selectedType === "TEXT" ? (
                                <FormField
                                    control={form.control}
                                    name="textData"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium">
                                                Text Content <span className="text-destructive">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Enter your medical notes or information here..."
                                                    className="min-h-[150px] resize-y rounded-lg font-mono text-sm"
                                                    {...field}
                                                    disabled={isSubmitting}
                                                />
                                            </FormControl>
                                            <FormDescription className="text-xs flex justify-between">
                                                <span>Enter detailed medical information</span>
                                                <span className="text-muted-foreground">
                                                    {field.value?.length || 0}/5000
                                                </span>
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            ) : selectedType ? (
                                <FormField
                                    control={form.control}
                                    name="fileUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium">
                                                Upload File <span className="text-destructive">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <div className="space-y-3">
                                                    <div className="space-y-4">
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
                                                                    disabled={isSubmitting}
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
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            ) : null}

                            <CardFooter className="gap-3 px-0 pt-4 border-t">
                                <Button
                                    type="submit"
                                    className="rounded-lg w-full"
                                    disabled={isSubmitting}
                                >
                                    <Upload className="w-4 h-4 mr-2" />
                                    {isSubmitting ? "Uploading..." : "Upload Document"}
                                </Button>
                            </CardFooter>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            <Card className="bg-card border-border shadow-sm">
                <CardHeader className="space-y-1 pb-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <CardTitle className="text-2xl font-bold text-card-foreground">
                                Medical Records
                            </CardTitle>
                            <CardDescription className="text-muted-foreground">
                                Your uploaded medical documents and records
                            </CardDescription>
                        </div>
                        <Badge variant="secondary" className="text-sm">
                            {profile.customer?.medicalRecords.length} {profile.customer?.medicalRecords.length === 1 ? "Record" : "Records"}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    {profile.customer?.medicalRecords.length === 0 ? (
                        <div className="text-center py-12">
                            <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                            <h3 className="text-lg font-semibold mb-2">No Medical Records</h3>
                            <p className="text-sm text-muted-foreground">
                                Upload your first medical document to get started
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {profile.customer?.medicalRecords.map((record) => (
                                <div
                                    key={record.id}
                                    className="flex items-start gap-4 p-4 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors"
                                >
                                    <div className={cn(
                                        "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                                        getTypeBadgeColor(record.type)
                                    )}>
                                        {getTypeIcon(record.type)}
                                    </div>
                                    
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-3 mb-1">
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-sm truncate">
                                                    {record.title}
                                                </h4>
                                                {record.description && (
                                                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                                        {record.description}
                                                    </p>
                                                )}
                                                {record.type === "TEXT" && record.textData && (
                                                    <p className="text-xs text-muted-foreground mt-2 p-2 bg-background rounded border line-clamp-3">
                                                        {record.textData}
                                                    </p>
                                                )}
                                            </div>
                                            
                                            <div className="flex items-center gap-1 shrink-0">
                                                {record.fileUrl && (
                                                    <>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8"
                                                            onClick={() => window.open(record.fileUrl??"", '_blank')}
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8"
                                                            onClick={() => {
                                                                // Download logic here
                                                                toast.success("Download started");
                                                            }}
                                                        >
                                                            <Download className="w-4 h-4" />
                                                        </Button>
                                                    </>
                                                )}
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                    onClick={() => handleDeleteClick(record.id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                Record Date: {record.recordDate.toLocaleDateString()}
                                            </div>
                                            <span>•</span>
                                            <div>
                                                Uploaded: {record.uploadDate.toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Medical Record?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the medical record
                            from your account.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-destructive hover:bg-destructive/90"
                            onClick={async () => {
                                if (recordToDelete) {
                                    await deleteDocumentMutation.mutateAsync({ recordId: recordToDelete });
                                }
                            }}
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}