"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Search } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { SearchFormSchema } from "@/modules/search/schema";


type SearchFormValues = z.infer<typeof SearchFormSchema>;

interface SearchFormProps {
  onSearch: (values: SearchFormValues) => void;
}

export function SearchForm({ onSearch }: SearchFormProps) {
    const form = useForm<SearchFormValues>({
        resolver: zodResolver(SearchFormSchema),
        defaultValues: {
            searchQuery: "",
            serviceType: "all-services",
            sortBy: "rating",
            priceRange: [10, 50],
        },
    });


    const handleReset = () => {
        form.reset();
    };

    return (
        <Card className="bg-card border-border sticky top-4">
            <CardHeader>
                <CardTitle className="text-card-foreground flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    Search Filters
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSearch)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="searchQuery"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-card-foreground">Search</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Name or specialty..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                        )}
                        />

                        {/* Service Type */}
                        <FormField
                            control={form.control}
                            name="serviceType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-card-foreground">Service Type</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue className="w-full" placeholder="All services" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="all-services">All Services</SelectItem>
                                            <SelectItem value="elderly-care">Elderly Care</SelectItem>
                                            <SelectItem value="child-care">Child Care</SelectItem>
                                            <SelectItem value="medical-care">Medical Care</SelectItem>
                                            <SelectItem value="companion-care">Companion Care</SelectItem>
                                            <SelectItem value="special-needs-care">Special Needs Care</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Sort By */}
                        <FormField
                            control={form.control}
                            name="sortBy"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-card-foreground">Sort By</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="rating">Highest Rated</SelectItem>
                                            <SelectItem value="price-low">Price: Low to High</SelectItem>
                                            <SelectItem value="price-high">Price: High to Low</SelectItem>
                                            <SelectItem value="experience">Most Experienced</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="priceRange"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-card-foreground">
                                        Price Range: ${field.value[0]} - ${field.value[1]}/hour
                                    </FormLabel>
                                    <FormControl>
                                        <Slider
                                            value={field.value}
                                            onValueChange={field.onChange}
                                            max={50}
                                            min={10}
                                            step={5}
                                            className="w-full"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                        )}
                        />

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                            <Button
                                type="submit"
                                className="flex-1"
                            >
                                Search
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleReset}
                                className="flex-1"
                            >
                                Reset
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
