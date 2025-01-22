// "use client";

// import { useToast } from "@/hooks/use-toast";
// import { ApiResponse } from "@/types/ApiResponse";
// import { UploadButton } from "@/utils/uploadthing";
// import axios, { AxiosError } from "axios";
// import { useSession } from "next-auth/react";
// import { useParams } from "next/navigation";
// import { useEffect } from "react";

// export default function Home() {
//   const username = useParams();

//   const { toast } = useToast();
//   const { data: session } = useSession();
//   const user = session?.user;

//   useEffect(() => console.log(username), [username]);
//   const updateUserAvatar = async (data: any) => {
//     console.log(user);
//     console.log("Uploaded Image: ", data[0]);
//     try {
//       const updatedUser = await axios.post("/api/update-avatar", {
//         userId: user?._id,
//         imgUrl: data[0].url,
//       });
//       console.log(updatedUser);
//       toast({
//         title: "Success",
//         description: updatedUser.data.message,
//       });
//     } catch (error) {
//       const axiosError = (await error) as AxiosError<ApiResponse>;
//       const errorMessage = axiosError.response?.data.message;
//       toast({
//         title: "Failed to verify user",
//         description: errorMessage,
//         variant: "destructive",
//       });
//     }
//   };
//   return (
//     <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
//       <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
//         <h1 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
//           Upload Your Avatar
//         </h1>
//         <UploadButton
//           endpoint="imageUploader"
//           onClientUploadComplete={(res) => {
//             // Do something with the response
//             // console.log("Files: ", res);
//             updateUserAvatar(res);
//             alert("Upload Completed");
//           }}
//           onUploadError={(error: Error) => {
//             // Do something with the error.
//             alert(`ERROR! ${error.message}`);
//           }}
//           className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-md shadow-sm transition duration-200 ease-in-out"
//         />
//       </div>
//     </main>
//   );
// }
