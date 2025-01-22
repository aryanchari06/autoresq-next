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
import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Loader2, Edit } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const ServiceProps = z.object({
  fullname: z.string().min(3, "Name too short"),
  phone: z
    .string()
    .min(10, { message: "Contact number must be at least 10 digits long" }),
  enterpriseName: z.string().max(30, "Enterprise name too long").optional(),
  enterpriseAddress: z
    .string()
    .max(300, "Enterprise address too long")
    .optional(),
});

const ClientProps = z.object({
  fullname: z.string().min(3, "Name too short"),
  phone: z
    .string()
    .min(10, { message: "Contact number must be at least 10 digits long" }),
});

export type ProfileFormProps = {
  role: "client" | "service";
  fullname: string;
  phone: string;
  enterpriseName?: string;
  enterpriseAddress?: string;
};

const ProfileForm: React.FC<{ user: ProfileFormProps }> = ({
  user,
}: {
  user: ProfileFormProps;
}) => {
  const [isUserSame, setIsUserSame] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditable, setIsEditable] = useState(false); // State to control editability of fields

  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user.fullname === user.fullname) setIsUserSame(true);
  }, [session, user]);

  const schema = user.role === "service" ? ServiceProps : ClientProps;
  const defaultValues =
    user.role === "service"
      ? {
          fullname: user.fullname,
          phone: user.phone,
          enterpriseName: user.enterpriseName || "",
          enterpriseAddress: user.enterpriseAddress || "",
        }
      : {
          fullname: user.fullname,
          phone: user.phone,
        };

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const onFormSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      console.log("Form submitted successfully:", data);
      const response = await axios.post(
        `/api/update-user?username=${session?.user.username}`,
        data
      );
      if (response.data.success)
        toast({
          title: "success",
          description: "User details updated successfully!",
        });
      else {
        toast({
          title: "Failure",
          description: "Could not update user details!",
          variant: "destructive",
        });
        throw new Error("Failed to update user details")
      }
    } catch (error) {
      console.error("Form submission failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-6">
          {/* Fullname Field */}
          <FormField
            control={form.control}
            name="fullname"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-semibold">
                  Fullname
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your full name"
                    {...field}
                    className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-purple-600"
                    disabled={!isEditable} // Disable the field until Edit is clicked
                  />
                </FormControl>
                <FormMessage className="text-sm text-red-500" />
              </FormItem>
            )}
          />

          {/* Phone Field */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-semibold">Phone</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your phone number"
                    {...field}
                    className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-purple-600"
                    disabled={!isEditable} // Disable the field until Edit is clicked
                  />
                </FormControl>
                <FormMessage className="text-sm text-red-500" />
              </FormItem>
            )}
          />

          {/* Conditional Fields for "service" Role */}
          {user.role === "service" && (
            <>
              <FormField
                control={form.control}
                name="enterpriseName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold">
                      Enterprise Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your enterprise name"
                        {...field}
                        className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-purple-600"
                        disabled={!isEditable} // Disable the field until Edit is clicked
                      />
                    </FormControl>
                    <FormMessage className="text-sm text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="enterpriseAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold">
                      Enterprise Address
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your enterprise address"
                        {...field}
                        className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-purple-600"
                        disabled={!isEditable} // Disable the field until Edit is clicked
                      />
                    </FormControl>
                    <FormMessage className="text-sm text-red-500" />
                  </FormItem>
                )}
              />
            </>
          )}

          {/* Edit Button for Editable Fields */}
          {isUserSame && !isEditable && (
            <Button
              type="button"
              onClick={() => setIsEditable(true)} // Enable editing
              className="flex items-center gap-2 text-sm text-white"
            >
              <Edit size={16} /> Edit
            </Button>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting || !isUserSame || !isEditable}
            className="w-full py-3 bg-gray-800 text-white rounded-md hover:bg-gray-900 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin mr-2" />
                Submitting...
              </>
            ) : (
              <>Submit</>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ProfileForm;
