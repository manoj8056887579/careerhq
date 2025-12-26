import { connectToDatabase } from "../src/lib/mongodb";
import BlogPost from "../src/models/BlogPost";

async function fixEmptySlugs() {
  try {
    await connectToDatabase();
    console.log("Connected to database");

    // Find all blog posts with empty or null slugs
    const postsWithEmptySlugs = await BlogPost.find({
      $or: [{ slug: "" }, { slug: null }, { slug: { $exists: false } }],
    });

    console.log(`Found ${postsWithEmptySlugs.length} posts with empty slugs`);

    for (const post of postsWithEmptySlugs) {
      // Generate slug from title
      const baseSlug = post.title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .substring(0, 100);

      // Add timestamp to ensure uniqueness
      post.slug = `${baseSlug}-${Date.now()}`;

      await post.save();
      console.log(`Fixed slug for post: ${post.title} -> ${post.slug}`);
    }

    console.log("All empty slugs have been fixed!");
    process.exit(0);
  } catch (error) {
    console.error("Error fixing empty slugs:", error);
    process.exit(1);
  }
}

fixEmptySlugs();
