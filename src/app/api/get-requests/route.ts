import connectDB from "@/lib/dbConnect";
import { ServiceRequestModel } from "@/models/user.model";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  await connectDB();

  const url = new URL(req.url);
  const lat = parseFloat(url.searchParams.get("lat") as string);
  const long = parseFloat(url.searchParams.get("lon") as string);
  const radiusParam = url.searchParams.get("radius");
  const radius = radiusParam ? parseFloat(radiusParam) : undefined;

  console.log(`the values of lat=${lat}, long=${long}, radius=${radius}`);

  try {
    if (!lat || !long || isNaN(lat) || isNaN(long)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid coordinates provided.",
        },
        { status: 400 }
      );
    }

    const pipeline: any[] = [
      // Add $lookup to join with the users collection
      {
        $lookup: {
          from: "users",
          localField: "client", // Assuming 'client' is the field in ServiceRequestModel that references a user
          foreignField: "_id",
          as: "requestOwner",
          pipeline: [
            {
              $project: {
                password: 0, // Exclude sensitive fields
                isVerified: 0,
                verifyCode: 0,
                verifyCodeExpiry: 0,
                role: 0,
                // You can add any other fields to exclude as needed
              },
            },
          ],
        },
      },

      // Project necessary fields for ServiceRequest and calculate distance

      {
        $project: {
          coords: 1,
          status: 1,
          title: 1,
          description: 1,
          requestOwner: { $arrayElemAt: ["$requestOwner", 0] },
          distance: radius
            ? {
                $let: {
                  vars: {
                    lat1: { $degreesToRadians: lat },
                    lon1: { $degreesToRadians: long },
                    lat2: { $degreesToRadians: "$coords.lat" },
                    lon2: { $degreesToRadians: "$coords.long" },
                  },
                  in: {
                    $multiply: [
                      6371, // Earth's radius in kilometers
                      {
                        $acos: {
                          $add: [
                            {
                              $multiply: [
                                { $sin: "$$lat1" },
                                { $sin: "$$lat2" },
                              ],
                            },
                            {
                              $multiply: [
                                { $cos: "$$lat1" },
                                { $cos: "$$lat2" },
                                { $cos: { $subtract: ["$$lon2", "$$lon1"] } },
                              ],
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              }
            : undefined,
        },
      },
    ];

    if (radius !== undefined) {
      // Apply radius match condition only when radius is defined
      pipeline.push({
        $match: {
          status: "pending",
          distance: { $lte: radius },
        },
      });
    } else {
      // No radius filter, so fetch all pending requests
      pipeline.push({
        $match: {
          status: "pending",
        },
      });
    }

    // Fetch the requests using the aggregation pipeline
    const requests = await ServiceRequestModel.aggregate(pipeline);

    console.log("req on backend is ", requests);

    if (!requests || requests.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No service requests found in the specified area.",
        },
        { status: 422 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Requests fetched successfully!",
        requests,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching service requests:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch service requests.",
      },
      { status: 500 }
    );
  }
}

// export async function GET(req: Request) {
//   await connectDB();

//   const url = new URL(req.url);
//   const lat = parseFloat(url.searchParams.get("lat") as string);
//   const long = parseFloat(url.searchParams.get("lon") as string );
//   const radius = parseFloat(url.searchParams.get("radius") as string);

//   console.log(`the values of lat=${lat}, long=${long}, radius=${radius} `)

//   try {
//     // Validate coordinates
//     if (!lat || !long || isNaN(lat) || isNaN(long)) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Invalid coordinates provided.",
//         },
//         { status: 400 }
//       );
//     }

//     // Build $geoNear stage dynamically based on the radius
//     const geoNearStage: any = {
//       $geoNear: {
//         near: {
//           type: "Point",
//           coordinates: [long, lat], // [longitude, latitude]
//         },
//         distanceField: "distance",
//         spherical: true,
//       },
//     };

//     // Apply maxDistance only if radius is not 20 (> 15 km)
//     if (radius && radius !== 20) {
//       geoNearStage.$geoNear.maxDistance = radius * 1000; // Convert km to meters
//     }

//     // Aggregate requests with geospatial filtering and user lookup
//     const requests = await ServiceRequestModel.aggregate([
//       geoNearStage,
//       {
//         $match: {
//           status: "pending", // Filter by status
//         },
//       },
//       {
//         $lookup: {
//           from: "users",
//           localField: "client",
//           foreignField: "_id",
//           as: "requestOwner",
//           pipeline: [
//             {
//               $project: {
//                 password: 0,
//                 isVerified: 0,
//                 verifyCode: 0,
//                 verifyCodeExpiry: 0,
//                 role: 0,
//               },
//             },
//           ],
//         },
//       },
//     ]);

//     if (!requests || requests.length === 0) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "No service requests found in the specified area.",
//         },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(
//       {
//         success: true,
//         message: "Requests fetched successfully!",
//         requests,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error fetching service requests:", error);
//     return NextResponse.json(
//       {
//         success: false,
//         message: "Failed to fetch service requests.",
//       },
//       { status: 500 }
//     );
//   }
// }
