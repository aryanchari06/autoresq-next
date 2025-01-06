"use client";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { requestSchema } from "@/schemas/requestSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { UploadButton } from "@/utils/uploadthing";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { NextResponse } from "next/server";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { ClientUploadedFileData } from "uploadthing/types";
import { z } from "zod";

interface Coordinates {
  lat: number;
  long: number;
}

const Page = () => {
  const router = useRouter();
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [isMediaUploading, setIsMediaUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<
    ClientUploadedFileData<{ uploadedBy: string | undefined }>[]
  >([]);
  const [imagesMessage, setImagesMessage] = useState("");
  const { data: session } = useSession();
  const user = session?.user;

  const requestForm = useForm({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const getUserLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userCoords = {
          lat: position.coords.latitude,
          long: position.coords.longitude,
        };
        setCoords(userCoords);
      },
      (error) => {
        console.error("Failed to get user location", error);
      },
      {
        enableHighAccuracy: true,
        timeout: 100000,
        maximumAge: 0,
      }
    );
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  useEffect(() => {
    if (coords) console.log(coords);
  }, [coords]);

  useEffect(() => {
    if (images.length > 5) {
      setImagesMessage("You can upload a maximum of 5 images/videos.");
    }
  }, [images]);

  const makeRequest = async (formdata: any) => {
    setIsSubmitting(true);

    try {
      if (!coords?.lat || !coords?.long) {
        toast({
          title: "Location error",
          description: "Could not fetch user location",
          variant: "destructive",
        });
        return;
      }

      const data = { ...formdata, media: images, client: user, coords };
      const response = await axios.post("/api/create-request", data);
      toast({
        title: "Success",
        description: response.data.message,
      });
      console.log(response.data);
      //   router.replace(`/`);
    } catch (error) {
      const axiosError = (await error) as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message;
      toast({
        title: "Failure",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteImage = (fileKey: string) => {
    setImages((prevImages) => prevImages.filter((img) => img.key !== fileKey));
  };

  if (!session?.user || session.user.role !== "client") {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-lg font-medium text-gray-600">
          User is unauthorized to make this request.
        </h1>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Submit Your Request
      </h1>
      <FormProvider {...requestForm}>
        <form
          onSubmit={requestForm.handleSubmit(makeRequest)}
          className="space-y-6 bg-white shadow-md rounded-lg p-6"
        >
          {/* Title Field */}
          <FormField
            control={requestForm.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">
                  Brief Your Problem:
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter a title for your problem"
                    {...field}
                    className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-gray-400"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description Field */}
          <FormField
            control={requestForm.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">Description:</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Describe your issue in detail"
                    {...field}
                    className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-gray-400"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <p className="text-gray-600 text-sm my-2">
              *Please choose not more than 5 images/videos
            </p>

            <UploadButton
              endpoint="imageUploader"
              onUploadBegin={() => {
                setIsMediaUploading(true);
              }}
              onClientUploadComplete={(res) => {
                setImages((prevImages) => [...prevImages, ...res]);
                console.log("Uploaded images:", res);
                setIsMediaUploading(false);
              }}
              onUploadError={(error: Error) => {
                console.log(`ERROR! ${error.message}`);
                alert("Failed to uplaod media");
              }}
              className="w-full py-3 px-4 bg-gray-900 text-white font-medium rounded-md hover:bg-gray-950 transition"
            />
          </div>

          {imagesMessage && (
            <p className="text-sm text-red-500 mt-2">{imagesMessage}</p>
          )}
          {images.length > 0 && (
            <div className="grid grid-cols-2 gap-4 mt-4">
              {images.map((image) => (
                <div
                  key={image.key}
                  className="relative bg-gray-100 border border-gray-300 rounded-md overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => deleteImage(image.key)}
                    className="absolute top-2 right-2 bg-gray-800 text-white p-1 rounded-full hover:bg-gray-900"
                  >
                    <X size={16} />
                  </button>
                  <img
                    src={image.url}
                    alt="Uploaded file"
                    className="w-full h-[150px] object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting || isMediaUploading}
            className="w-full py-3 bg-gray-800 text-white font-medium rounded-md hover:bg-gray-900 transition"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <Loader2 className="animate-spin" />
                Submitting
              </div>
            ) : (
              <>Submit</>
            )}
          </Button>
        </form>
      </FormProvider>
      {errorMessage && <p className="text-red-600">{errorMessage}</p>}
    </div>
  );
};

export default Page;
