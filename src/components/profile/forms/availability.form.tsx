import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import {
    Clock,
    DollarSign,
    Calendar,
    Trash2,
    Plus,
    Edit,
    Check,
    X,
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AvailabilitySchema, ChargesSchema } from "@/modules/user/schema";



type ChargesData = z.infer<typeof ChargesSchema>;
type AvailabilityData = z.infer<typeof AvailabilitySchema>;


const DAYS_OF_WEEK = [
    { value: "MONDAY", label: "Monday" },
    { value: "TUESDAY", label: "Tuesday" },
    { value: "WEDNESDAY", label: "Wednesday" },
    { value: "THURSDAY", label: "Thursday" },
    { value: "FRIDAY", label: "Friday" },
    { value: "SATURDAY", label: "Saturday" },
    { value: "SUNDAY", label: "Sunday" },
];

const CURRENCIES = [
    { value: "INR", label: "₹ INR", symbol: "₹" },
    { value: "USD", label: "$ USD", symbol: "$" },
    { value: "EUR", label: "€ EUR", symbol: "€" },
    { value: "GBP", label: "£ GBP", symbol: "£" },
];

export const AvailabilityForm = () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();
    const { data: profile } = useSuspenseQuery(trpc.user.getProfile.queryOptions());

    const chargesMutation = useMutation(trpc.user.createUpdateCharges.mutationOptions({
        onSuccess: async() => {
            await queryClient.invalidateQueries(trpc.user.getProfile.queryOptions());
            toast.success("Charges updated successfully");
        },
        onError: (error) => {
            toast.error(`Failed to update charges: ${error.message}`);
        }
    }));

    const availabilityMutation = useMutation(trpc.user.createAvailabilitySlot.mutationOptions({
        onSuccess: async() => {
            await queryClient.invalidateQueries(trpc.user.getProfile.queryOptions());
            availabilityForm.reset();
            setShowAvailabilityForm(false);
            toast.success("Availability updated successfully");
        },
        onError: (error) => {
            toast.error(`Failed to update availability: ${error.message}`);
        }
    }));

    const deleteAvailabilityMutation = useMutation(trpc.user.deleteAvailabilitySlot.mutationOptions({
        onSuccess: async() => {
            await queryClient.invalidateQueries(trpc.user.getProfile.queryOptions());
            setSlotToDelete(null);
            setDeleteDialogOpen(false);
            toast.success("Availability slot deleted successfully");
        },
        onError: (error) => {
            toast.error(`Failed to delete availability slot: ${error.message}`);
        }
    }));


    const [showAvailabilityForm, setShowAvailabilityForm] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [slotToDelete, setSlotToDelete] = useState<string | null>(null);


    const chargesForm = useForm<ChargesData>({
        resolver: zodResolver(ChargesSchema),
        defaultValues: {
            hourlyRate: profile?.caregiver?.charges?.hourlyRate || undefined,
            visitFee: profile?.caregiver?.charges?.visitFee || undefined,
            currency: profile?.caregiver?.charges?.currency || "INR",
            isNegotiable: profile?.caregiver?.charges?.isNegotiable || false,
        },
    });

    const availabilityForm = useForm<AvailabilityData>({
        resolver: zodResolver(AvailabilitySchema),
        defaultValues: {
            dayOfWeek: "MONDAY",
            startTime: "",
            endTime: "",
            isAvailable: true,
        },
    });

    const isChargesSubmitting = chargesForm.formState.isSubmitting;
    const isAvailabilitySubmitting = availabilityForm.formState.isSubmitting;
    const selectedCurrency = chargesForm.watch("currency");

    // Charges Submit
    const onChargesSubmit = async (data: ChargesData) => {
        await chargesMutation.mutateAsync(data);
    };

    // Availability Submit
    const onAvailabilitySubmit = async (data: AvailabilityData) => {
        await availabilityMutation.mutateAsync(data);
    };


    const handleDeleteSlot = (slotId: string) => {
        setSlotToDelete(slotId);
        setDeleteDialogOpen(true);
    };

    const confirmDeleteSlot = async() => {
        if (slotToDelete) {
            await deleteAvailabilityMutation.mutateAsync({ slotId: slotToDelete });
        }
    };

    const getDayLabel = (day: string) => {
        return DAYS_OF_WEEK.find(d => d.value === day)?.label || day;
    };

    const getCurrencySymbol = (currency: string) => {
        return CURRENCIES.find(c => c.value === currency)?.symbol || currency;
    };

    const formatTime = (time: string) => {
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    };

    return (
        <div className="space-y-6">
            {/* Charges Card */}
            <Card className="bg-card border-border shadow-sm">
                <CardHeader className="space-y-1 pb-6">
                    <div className="flex items-center gap-2">
                        <DollarSign className="w-6 h-6 text-primary" />
                        <CardTitle className="text-2xl font-bold text-card-foreground">
                            Rates & Charges
                        </CardTitle>
                    </div>
                    <CardDescription className="text-muted-foreground">
                        Set your pricing for services. You can offer hourly rates, visit fees, or both.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...chargesForm}>
                        <form onSubmit={chargesForm.handleSubmit(onChargesSubmit)} className="space-y-6">
                            <div className="grid gap-4 md:grid-cols-2">
                                <FormField
                                    control={chargesForm.control}
                                    name="hourlyRate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium">
                                                Hourly Rate
                                            </FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                                        {getCurrencySymbol(selectedCurrency)}
                                                    </span>
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        placeholder="0.00"
                                                        className="h-11 rounded-lg pl-8"
                                                        {...field}
                                                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                                                        value={field.value ?? ''}
                                                        disabled={isChargesSubmitting}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormDescription className="text-xs">
                                                Your rate per hour of service
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={chargesForm.control}
                                    name="visitFee"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium">
                                                Visit Fee
                                            </FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                                        {getCurrencySymbol(selectedCurrency)}
                                                    </span>
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        placeholder="0.00"
                                                        className="h-11 rounded-lg pl-8"
                                                        {...field}
                                                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                                                        value={field.value ?? ''}
                                                        disabled={isChargesSubmitting}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormDescription className="text-xs">
                                                Fixed fee per visit/appointment
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <FormField
                                    control={chargesForm.control}
                                    name="currency"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium">
                                                Currency
                                            </FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                                disabled={isChargesSubmitting}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="h-11 rounded-lg">
                                                        <SelectValue placeholder="Select currency" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {CURRENCIES.map((currency) => (
                                                        <SelectItem key={currency.value} value={currency.value}>
                                                            {currency.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={chargesForm.control}
                                    name="isNegotiable"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col justify-end">
                                            <div className="flex items-center justify-between rounded-lg border border-border p-4 h-11">
                                                <FormLabel className="text-sm font-medium cursor-pointer">
                                                    Rates are negotiable
                                                </FormLabel>
                                                <FormControl>
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                        disabled={isChargesSubmitting}
                                                    />
                                                </FormControl>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <CardFooter className="px-0 pt-4 border-t">
                                <Button
                                    type="submit"
                                    className="rounded-lg w-full"
                                    disabled={isChargesSubmitting}
                                >
                                    {isChargesSubmitting ? "Saving..." : "Save Charges"}
                                </Button>
                            </CardFooter>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            {/* Availability Card */}
            <Card className="bg-card border-border shadow-sm">
                <CardHeader className="space-y-1 pb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Clock className="w-6 h-6 text-primary" />
                            <div>
                                <CardTitle className="text-2xl font-bold text-card-foreground">
                                    Weekly Availability
                                </CardTitle>
                                <CardDescription className="text-muted-foreground mt-1">
                                    Set your available hours for each day of the week
                                </CardDescription>
                            </div>
                        </div>
                        <Button
                            onClick={() => setShowAvailabilityForm(!showAvailabilityForm)}
                            className="rounded-lg"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Slot
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Add Availability Form */}
                    {showAvailabilityForm && (
                        <Card className="border-2 border-primary/20 bg-primary/5">
                            <CardContent className="pt-6">
                                <Form {...availabilityForm}>
                                    <form onSubmit={availabilityForm.handleSubmit(onAvailabilitySubmit)} className="space-y-4">
                                        <FormField
                                            control={availabilityForm.control}
                                            name="dayOfWeek"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm font-medium">
                                                        Day of Week <span className="text-destructive">*</span>
                                                    </FormLabel>
                                                    <Select
                                                        onValueChange={field.onChange}
                                                        value={field.value}
                                                        disabled={isAvailabilitySubmitting}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger className="h-11 rounded-lg">
                                                                <div className="flex items-center gap-2">
                                                                    <Calendar className="w-4 h-4 text-muted-foreground" />
                                                                    <SelectValue placeholder="Select day" />
                                                                </div>
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {DAYS_OF_WEEK.map((day) => (
                                                                <SelectItem
                                                                    key={day.value}
                                                                    value={day.value}
                                                                    disabled={profile?.caregiver?.availability?.some(slot => slot.dayOfWeek === day.value)}
                                                                >
                                                                    {day.label}
                                                                    {profile?.caregiver?.availability?.some(slot => slot.dayOfWeek === day.value) && (
                                                                        <Badge variant="secondary" className="ml-2 text-xs">
                                                                            Added
                                                                        </Badge>
                                                                    )}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <div className="grid gap-4 md:grid-cols-2">
                                            <FormField
                                                control={availabilityForm.control}
                                                name="startTime"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-sm font-medium">
                                                            Start Time <span className="text-destructive">*</span>
                                                        </FormLabel>
                                                        <FormControl>
                                                            <div className="relative">
                                                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                                <Input
                                                                    type="time"
                                                                    className="h-11 rounded-lg pl-10"
                                                                    {...field}
                                                                    disabled={isAvailabilitySubmitting}
                                                                />
                                                            </div>
                                                        </FormControl>
                                                        <FormDescription className="text-xs">
                                                            24-hour format (HH:mm)
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={availabilityForm.control}
                                                name="endTime"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-sm font-medium">
                                                            End Time <span className="text-destructive">*</span>
                                                        </FormLabel>
                                                        <FormControl>
                                                            <div className="relative">
                                                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                                <Input
                                                                    type="time"
                                                                    className="h-11 rounded-lg pl-10"
                                                                    {...field}
                                                                    disabled={isAvailabilitySubmitting}
                                                                />
                                                            </div>
                                                        </FormControl>
                                                        <FormDescription className="text-xs">
                                                            24-hour format (HH:mm)
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <FormField
                                            control={availabilityForm.control}
                                            name="isAvailable"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <div className="flex items-center justify-between rounded-lg border border-border p-4">
                                                        <div className="space-y-0.5">
                                                            <FormLabel className="text-sm font-medium">
                                                                Currently Available
                                                            </FormLabel>
                                                            <FormDescription className="text-xs">
                                                                Toggle this slot on/off without deleting it
                                                            </FormDescription>
                                                        </div>
                                                        <FormControl>
                                                            <Switch
                                                                checked={field.value}
                                                                onCheckedChange={field.onChange}
                                                                disabled={isAvailabilitySubmitting}
                                                            />
                                                        </FormControl>
                                                    </div>
                                                </FormItem>
                                            )}
                                        />

                                        <div className="flex justify-end gap-3 pt-4">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => {
                                                    setShowAvailabilityForm(false);
                                                    availabilityForm.reset();
                                                }}
                                                disabled={isAvailabilitySubmitting}
                                                className="rounded-lg"
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                type="submit"
                                                disabled={isAvailabilitySubmitting}
                                                className="rounded-lg"
                                            >
                                                {isAvailabilitySubmitting ? "Adding..." : "Add Availability"}
                                            </Button>
                                        </div>
                                    </form>
                                </Form>
                            </CardContent>
                        </Card>
                    )}

                    {/* Availability Slots List */}
                    {profile?.caregiver?.availability?.length === 0 ? (
                        <div className="text-center py-12">
                            <Clock className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                            <h3 className="text-lg font-semibold mb-2">No Availability Slots</h3>
                            <p className="text-sm text-muted-foreground">
                                Add your available hours to let clients know when you're free
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {DAYS_OF_WEEK.map((day) => {
                                const slot = profile?.caregiver?.availability?.find(s => s.dayOfWeek === day.value);
                                return (
                                    <div
                                        key={day.value}
                                        className={cn(
                                            "flex items-center justify-between p-4 rounded-lg border transition-colors",
                                            slot
                                                ? slot.isAvailable
                                                    ? "border-primary/30 bg-primary/5"
                                                    : "border-border bg-muted/30 opacity-60"
                                                : "border-border bg-muted/10 opacity-40"
                                        )}
                                    >
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className={cn(
                                                "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                                                slot
                                                    ? slot.isAvailable
                                                        ? "bg-primary/10 text-primary"
                                                        : "bg-muted text-muted-foreground"
                                                    : "bg-muted/50 text-muted-foreground"
                                            )}>
                                                <Calendar className="w-5 h-5" />
                                            </div>

                                            <div className="flex-1">
                                                <h4 className="font-semibold text-sm">{day.label}</h4>
                                                {slot ? (
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <p className="text-xs text-muted-foreground">
                                                            {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                                                        </p>
                                                        {!slot.isAvailable && (
                                                            <Badge variant="secondary" className="text-xs">
                                                                Disabled
                                                            </Badge>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <p className="text-xs text-muted-foreground mt-1">Not set</p>
                                                )}
                                            </div>
                                        </div>

                                        {slot && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                onClick={() => handleDeleteSlot(slot.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Availability Slot?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete this availability slot.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setSlotToDelete(null)}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDeleteSlot}
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
