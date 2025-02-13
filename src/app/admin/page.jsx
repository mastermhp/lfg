"use client"
import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import AdminPanel from "../components/AdminPanel";
import { getAllFiles, getAllCategories, getAllHashtags } from "../../../actions/uploadActions";

export default function AdminPage() {
  const { user, isLoaded } = useUser();
  const [contents, setContents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [hashtags, setHashtags] = useState([]);
  
  // Fetch data when the component mounts
  useEffect(() => {
    if (!isLoaded) return;

    if (user && user.primaryEmailAddress?.emailAddress !== "noboatwork@gmail.com") {
      alert("You do not have permission to access this page.");
      window.location.href = "/"; // Redirect to home or login
    } else {
      // Fetch the data only if the user is the admin
      const fetchData = async () => {
        const { contents } = await getAllFiles();
        const { categories } = await getAllCategories();
        const { hashtags } = await getAllHashtags();

        setContents(contents);
        setCategories(categories);
        setHashtags(hashtags);
      };

      fetchData();
    }
  }, [user, isLoaded]);

  if (!isLoaded) return <p>Loading...</p>;

  console.log("User Info:", user);

  if (!user || user.primaryEmailAddress?.emailAddress !== "noboatwork@gmail.com") {
    return <p>Access Denied</p>;
  }

  return <AdminPanel initialContents={contents} initialCategories={categories} initialHashtags={hashtags} />;
}
