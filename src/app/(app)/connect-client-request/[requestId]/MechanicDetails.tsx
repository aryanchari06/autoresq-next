import { Star, CheckCircle, Mail, Phone } from "lucide-react";
import React from "react";

type UserSchema = {
  _id: string;
  username: string;
  fullname: string;
  email: string;
  phone: string;
  isVerified: boolean;
  role: string;
  enterpriseName: string;
  enterpriseAddress: string;
  avatar: string;
  ratings: number[];
};

const UserDetails: React.FC<{ user: UserSchema }> = ({ user }) => {
  const averageRating =
    user.ratings.length > 0
      ? Math.round(
          (user.ratings.reduce((acc, rating) => acc + rating, 0) /
            user.ratings.length) *
            10
        ) / 10
      : "No ratings";

  return (
    <div className="font-sans max-w-sm sm:max-w-md mx-auto mt-8 bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-center gap-4 border-b border-gray-300 p-4">
        <img
          src={user.avatar || "https://via.placeholder.com/96"}
          alt={`${user.fullname}'s avatar`}
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border border-gray-300"
        />
        <div className="flex-1 text-center sm:text-left">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 flex flex-col sm:flex-row items-center gap-2">
            {user.fullname}
            {user.isVerified && (
              <CheckCircle className="text-blue-500 w-5 h-5" />
            )}
          </h2>
          <p className="text-gray-500 text-sm">@{user.username}</p>
        </div>
      </div>

      {/* Details Section */}
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2 text-gray-700">
          <Phone className="w-5 h-5 text-gray-500" />
          <span>{user.phone || "N/A"}</span>
        </div>

        <div className="flex items-center gap-2 text-gray-700">
          <Mail className="w-5 h-5 text-gray-500" />
          <span>{user.email || "N/A"}</span>
        </div>

        <div className="text-gray-700">
          <strong>Enterprise Name:</strong> {user.enterpriseName || "N/A"}
        </div>

        <div className="text-gray-700">
          <strong>Enterprise Address:</strong> {user.enterpriseAddress || "N/A"}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-gray-700">
          <strong>Rating:</strong>
          {typeof averageRating === "number" ? (
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, index) => (
                <Star
                  key={index}
                  className={`w-4 h-4 sm:w-5 sm:h-5 ${
                    index < Math.round(averageRating)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
              <span className="text-sm text-gray-600">({averageRating})</span>
            </div>
          ) : (
            <span className="text-gray-600">{averageRating}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
