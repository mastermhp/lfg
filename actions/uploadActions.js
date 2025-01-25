"use server";

import path from "path";
import fs from "fs/promises";
import { v4 as uuidv4 } from "uuid";
import os from "os";
import cloudinary from "cloudinary";
import { connectToDatabase } from "../lib/mongodb";
import { ObjectId } from "mongodb";
import { clerkClient } from "@clerk/nextjs"


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function getContentById(id) {
  try {
    const { db } = await connectToDatabase();
    const content = await db
      .collection("contents")
      .findOne({ _id: new ObjectId(id) });
    if (!content) {
      return { success: false, error: "Content not found" };
    }
    return {
      success: true,
      content: {
        ...content,
        _id: content._id.toString(),
        createdAt: content.createdAt ? content.createdAt.toISOString() : null,
      },
    };
  } catch (error) {
    console.error("Error fetching content:", error);
    return { success: false, error: error.message };
  }
}

// export async function uploadFiles(formData) {
//   try {
//     const { db } = await connectToDatabase();
//     const savedFiles = await saveFilesToLocal(formData);
//     const uploadedFiles = await uploadFilesToCloudinary(savedFiles);

//     const contentData = {
//       title: formData.get("title"),
//       description: formData.get("description"),
//       category: formData.get("category"),
//       hashtags: formData.get("hashtags"),
//       permissions: formData.get("permissions"),
//       thumbnail: uploadedFiles.find((file) => file.type === "image")?.url || "",
//       images: uploadedFiles
//         .filter((file) => file.type === "image")
//         .map((file) => file.url),
//       videos: uploadedFiles
//         .filter((file) => file.type === "video")
//         .map((file) => file.url),
//       documents: uploadedFiles
//         .filter((file) => file.type === "document")
//         .map((file) => file.url),
//       createdAt: new Date(),
//     };

//     await db.collection("contents").insertOne(contentData);

//     return { success: true, message: "Content uploaded successfully" };
//   } catch (error) {
//     console.error(error);
//     return {
//       success: false,
//       errMsg: error instanceof Error ? error.message : "Unknown error",
//     };
//   }
// }

// export async function uploadFiles(formData) {
//   try {
//     const { db } = await connectToDatabase();
//     const savedFiles = await saveFilesToLocal(formData);
//     const uploadedFiles = await uploadFilesToCloudinary(savedFiles);

//     const contentData = {
//       title: formData.get("title"),
//       description: formData.get("description"),
//       category: formData.get("category"),
//       hashtags: formData.get("hashtags"),
//       permissions: formData.get("permissions"),
//       thumbnail: uploadedFiles.find((file) => file.type === "image")?.url || "",
//       images: uploadedFiles
//         .filter((file) => file.type === "image")
//         .map((file) => file.url),
//       videos: uploadedFiles
//         .filter((file) => file.type === "video")
//         .map((file) => file.url),
//       documents: uploadedFiles
//         .filter((file) => file.type === "document")
//         .map((file) => file.url),
//       createdAt: new Date(),
//     };

//     await db.collection("contents").insertOne(contentData);

//     return { success: true, message: "Content uploaded successfully" };
//   } catch (error) {
//     console.error(error);
//     return {
//       success: false,
//       errMsg: error instanceof Error ? error.message : "Unknown error",
//     };
//   }
// }

// export async function getAllFiles() {
//   try {
//     const result = await cloudinary.v2.search
//       .expression("folder:libraryofg/*")
//       .sort_by("public_id", "desc")
//       .max_results(500)
//       .execute()

//     return { success: true, files: result.resources }
//   } catch (error) {
//     console.error("Error fetching files from Cloudinary:", error)
//     return { success: false, errMsg: error instanceof Error ? error.message : "Unknown error" }
//   }
// }

// export async function getAllFiles() {
//   try {
//     const { db } = await connectToDatabase();
//     const contents = await db.collection("contents").find({}).toArray();
//     return {
//       success: true,
//       contents: contents.map((doc) => ({
//         ...doc,
//         _id: doc._id.toString(),
//         createdAt: doc.createdAt ? doc.createdAt.toISOString() : null,
//       })),
//     };
//   } catch (error) {
//     console.error("Error fetching contents:", error);
//     return { success: false, error: error.message };
//   }
// }

// export async function deleteFile(publicId) {
//   try {
//     // Determine the resource type based on the public_id
//     const resourceType = publicId.includes("video")
//       ? "video"
//       : publicId.includes("raw")
//       ? "raw"
//       : "image";

//     const result = await cloudinary.v2.uploader.destroy(publicId, {
//       resource_type: resourceType,
//     });
//     if (result.result === "ok") {
//       return { success: true };
//     } else {
//       return { success: false, errMsg: "Failed to delete file" };
//     }
//   } catch (error) {
//     console.error("Error deleting file from Cloudinary:", error);
//     return {
//       success: false,
//       errMsg: error instanceof Error ? error.message : "Unknown error",
//     };
//   }
// }

async function uploadFilesToCloudinary(files) {
  const uploadToCloudinary = async (file) => {
    const resourceType =
      file.type === "video"
        ? "video"
        : file.type === "document"
        ? "raw"
        : "image";

    const options = {
      resource_type: resourceType,
      public_id: `libraryofg/${file.filename}`,
      folder: "libraryofg",
    };

    try {
      const response = await cloudinary.v2.uploader.upload(
        file.filepath,
        options
      );
      return {
        public_id: response.public_id,
        url: response.secure_url,
        type: file.type,
      };
    } catch (error) {
      console.error(`Failed to upload ${file.filename} to Cloudinary:`, error);
      throw error;
    }
  };

  return Promise.all(files.map(uploadToCloudinary));
}

// async function uploadFilesToCloudinary(files) {
//   const uploadToCloudinary = async (file) => {
//     const resourceType =
//       file.type === "video"
//         ? "video"
//         : file.type === "document"
//         ? "raw"
//         : "image";

//     const options = {
//       resource_type: resourceType,
//       public_id: `libraryofg/${file.filename}`,
//       folder: "libraryofg",
//     };

//     try {
//       const response = await cloudinary.v2.uploader.upload(
//         file.filepath,
//         options
//       );
//       return {
//         public_id: response.public_id,
//         url: response.secure_url,
//         type: file.type,
//       };
//     } catch (error) {
//       console.error(`Failed to upload ${file.filename} to Cloudinary:`, error);
//       throw error;
//     }
//   };

//   return Promise.all(files.map(uploadToCloudinary));
// }

export async function getAllFiles() {
  try {
    const { db } = await connectToDatabase()
    const contents = await db.collection("contents").find({}).toArray()
    return {
      success: true,
      contents: contents.map((doc) => ({
        ...doc,
        _id: doc._id.toString(),
        createdAt: doc.createdAt ? doc.createdAt.toISOString() : null,
      })),
    }
  } catch (error) {
    console.error("Error fetching contents:", error)
    return { success: false, error: error.message }
  }
}

export async function uploadFiles(formData) {
  try {
    const { db } = await connectToDatabase()
    const savedFiles = await saveFilesToLocal(formData)
    const uploadedFiles = await uploadFilesToCloudinary(savedFiles)

    const contentData = {
      title: formData.get("title"),
      description: formData.get("description"),
      category: formData.get("category"),
      hashtags: formData.get("hashtags"),
      permissions: formData.get("permissions"),
      thumbnail: uploadedFiles.find((file) => file.type === "image")?.url || "",
      images: uploadedFiles.filter((file) => file.type === "image").map((file) => file.url),
      videos: uploadedFiles.filter((file) => file.type === "video").map((file) => file.url),
      documents: uploadedFiles.filter((file) => file.type === "document").map((file) => file.url),
      createdAt: new Date(),
    }

    const result = await db.collection("contents").insertOne(contentData)

    return {
      success: true,
      message: "Content uploaded successfully",
      content: { ...contentData, _id: result.insertedId.toString() },
    }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}



// export async function uploadFiles(formData) {
//   try {
//     const { db } = await connectToDatabase()
//     const savedFiles = await saveFilesToLocal(formData)
//     const uploadedFiles = await uploadFilesToCloudinary(savedFiles)

//     const contentData = {
//       title: formData.get("title"),
//       description: formData.get("description"),
//       category: formData.get("category"),
//       hashtags: formData.get("hashtags"),
//       permissions: formData.get("permissions"),
//       thumbnail: uploadedFiles.find((file) => file.type === "image")?.url || "",
//       images: uploadedFiles.filter((file) => file.type === "image").map((file) => file.url),
//       videos: uploadedFiles.filter((file) => file.type === "video").map((file) => file.url),
//       documents: uploadedFiles.filter((file) => file.type === "document").map((file) => file.url),
//       createdAt: new Date(),
//     }

//     await db.collection("contents").insertOne(contentData)

//     return { success: true, message: "Content uploaded successfully" }
//   } catch (error) {
//     console.error(error)
//     return {
//       success: false,
//       errMsg: error instanceof Error ? error.message : "Unknown error",
//     }
//   }
// }

// export async function updateContent(id, formData) {
//   try {
//     const { db } = await connectToDatabase()
//     const savedFiles = await saveFilesToLocal(formData)
//     const uploadedFiles = await uploadFilesToCloudinary(savedFiles)

//     const contentData = {
//       title: formData.get("title"),
//       description: formData.get("description"),
//       category: formData.get("category"),
//       hashtags: formData.get("hashtags"),
//       permissions: formData.get("permissions"),
//     }

//     if (uploadedFiles.length > 0) {
//       contentData.thumbnail = uploadedFiles.find((file) => file.type === "image")?.url || contentData.thumbnail
//       contentData.images = [
//         ...contentData.images,
//         ...uploadedFiles.filter((file) => file.type === "image").map((file) => file.url),
//       ]
//       contentData.videos = [
//         ...contentData.videos,
//         ...uploadedFiles.filter((file) => file.type === "video").map((file) => file.url),
//       ]
//       contentData.documents = [
//         ...contentData.documents,
//         ...uploadedFiles.filter((file) => file.type === "document").map((file) => file.url),
//       ]
//     }

//     const result = await db.collection("contents").updateOne({ _id: new ObjectId(id) }, { $set: contentData })

//     if (result.matchedCount === 0) {
//       return { success: false, error: "Content not found" }
//     }

//     return { success: true, message: "Content updated successfully" }
//   } catch (error) {
//     console.error("Error updating content:", error)
//     return { success: false, error: error.message }
//   }
// }


export async function updateContent(id, formData) {
  try {
    const { db } = await connectToDatabase()
    const savedFiles = await saveFilesToLocal(formData)
    const uploadedFiles = await uploadFilesToCloudinary(savedFiles)

    const contentData = {
      title: formData.get("title"),
      description: formData.get("description"),
      category: formData.get("category"),
      hashtags: formData.get("hashtags"),
      permissions: formData.get("permissions"),
    }

    if (uploadedFiles.length > 0) {
      contentData.thumbnail = uploadedFiles.find((file) => file.type === "image")?.url || contentData.thumbnail
      contentData.images = uploadedFiles.filter((file) => file.type === "image").map((file) => file.url)
      contentData.videos = uploadedFiles.filter((file) => file.type === "video").map((file) => file.url)
      contentData.documents = uploadedFiles.filter((file) => file.type === "document").map((file) => file.url)
    }

    const existingContent = await db.collection("contents").findOne({ _id: new ObjectId(id) })

    if (existingContent) {
      contentData.images = [...(existingContent.images || []), ...(contentData.images || [])]
      contentData.videos = [...(existingContent.videos || []), ...(contentData.videos || [])]
      contentData.documents = [...(existingContent.documents || []), ...(contentData.documents || [])]
    }

    const result = await db.collection("contents").updateOne({ _id: new ObjectId(id) }, { $set: contentData })

    if (result.matchedCount === 0) {
      return { success: false, error: "Content not found" }
    }

    return { success: true, message: "Content updated successfully" }
  } catch (error) {
    console.error("Error updating content:", error)
    return { success: false, error: error.message }
  }
}

export async function deleteContent(id) {
  try {
    const { db } = await connectToDatabase()
    const content = await db.collection("contents").findOne({ _id: new ObjectId(id) })

    if (!content) {
      return { success: false, error: "Content not found" }
    }

    // Delete files from Cloudinary
    const allFiles = [
      content.thumbnail,
      ...(content.images || []),
      ...(content.videos || []),
      ...(content.documents || []),
    ].filter(Boolean)

    for (const file of allFiles) {
      await deleteFile(file)
    }

    // Delete content from database
    await db.collection("contents").deleteOne({ _id: new ObjectId(id) })

    return { success: true, message: "Content deleted successfully" }
  } catch (error) {
    console.error("Error deleting content:", error)
    return { success: false, error: error.message }
  }
}


async function deleteFile(publicId) {
  try {
    const resourceType = publicId.includes("video") ? "video" : publicId.includes("raw") ? "raw" : "image"

    const result = await cloudinary.v2.uploader.destroy(publicId, {
      resource_type: resourceType,
    })
    if (result.result === "ok") {
      return { success: true }
    } else {
      return { success: false, errMsg: "Failed to delete file" }
    }
  } catch (error) {
    console.error("Error deleting file from Cloudinary:", error)
    return {
      success: false,
      errMsg: error instanceof Error ? error.message : "Unknown error",
    }
  }
}


async function saveFilesToLocal(formData) {
  const processFiles = async (files, type) => {
    return Promise.all(
      files.map(async (file) => {
        const buffer = Buffer.from(await file.arrayBuffer());
        const name = uuidv4();
        const ext = file.type.split("/")[1] || "unknown";
        const tempdir = os.tmpdir();
        const uploadDir = path.join(tempdir, `${name}.${ext}`);

        await fs.writeFile(uploadDir, buffer);
        console.log({ filepath: uploadDir, filename: file.name, type });

        return { filepath: uploadDir, filename: file.name, type };
      })
    );
  };

  const images = formData.getAll("images");
  const videos = formData.getAll("videos");
  const documents = formData.getAll("documents");

  const imageFiles = await processFiles(images, "image");
  const videoFiles = await processFiles(videos, "video");
  const documentFiles = await processFiles(documents, "document");

  return [...imageFiles, ...videoFiles, ...documentFiles];
}



export async function getAllCategories() {
  try {
    const { db } = await connectToDatabase()
    const categories = await db.collection("contents").distinct("category")
    return { success: true, categories }
  } catch (error) {
    console.error("Error fetching categories:", error)
    return { success: false, error: error.message }
  }
}

export async function getAllHashtags() {
  try {
    const { db } = await connectToDatabase()
    const contents = await db.collection("contents").find({}, { hashtags: 1 }).toArray()
    const allHashtags = contents.flatMap((content) =>
      content.hashtags ? content.hashtags.split(",").map((tag) => tag.trim()) : [],
    )
    const uniqueHashtags = [...new Set(allHashtags)]
    return { success: true, hashtags: uniqueHashtags }
  } catch (error) {
    console.error("Error fetching hashtags:", error)
    return { success: false, error: error.message }
  }
}



export async function syncUsersFromClerk() {
  try {
    const { db } = await connectToDatabase()
    const clerkUsers = await clerkClient.users.getUserList({
      limit: 100, // Adjust this value based on your needs
    })

    const bulkOps = clerkUsers.map((user) => ({
      updateOne: {
        filter: { clerkId: user.id },
        update: {
          $set: {
            clerkId: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.emailAddresses[0]?.emailAddress,
            imageUrl: user.imageUrl,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          },
        },
        upsert: true,
      },
    }))

    const result = await db.collection("users").bulkWrite(bulkOps)

    return {
      success: true,
      message: `Synced ${result.upsertedCount} new users and updated ${result.modifiedCount} existing users.`,
    }
  } catch (error) {
    console.error("Error syncing users from Clerk:", error)
    return { success: false, error: error.message }
  }
}