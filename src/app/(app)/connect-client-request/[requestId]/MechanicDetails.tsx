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
};

const UserDetails: React.FC<{ user: UserSchema }> = ({
  user,
}: {
  user: UserSchema;
}) => {
  return (
    <div className="font-sans max-w-md mx-auto mt-6">
      <div className="flex items-center gap-4 border-b border-gray-300 pb-4">
        <img
          src={user?.avatar}
          alt={`${user?.fullname}'s avatar`}
          className="w-24 h-24 rounded-full"
        />
        <div>
          <h2 className="m-0 text-lg font-bold">{user.fullname}</h2>
          <p className="m-0 text-gray-500">@{user.username}</p>
        </div>
      </div>
      <div className="py-4">
        <p>
          <strong>Phone:</strong> {user.phone}
        </p>
        <p>
          <strong>Enterprise Name:</strong> {user.enterpriseName}
        </p>
        <p>
          <strong>Enterprise Address:</strong> {user.enterpriseAddress}
        </p>
      </div>
    </div>
  );
};

export default UserDetails;
